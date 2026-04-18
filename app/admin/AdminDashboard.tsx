'use client';

import { useState, useCallback } from "react";
import type { Source } from "@/app/types";
import { Status, SourceType, Category } from "@prisma/client";

interface AdminDashboardProps {
  initialPendingSources: Source[];
  initialAllSources: Source[];
  initialStats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

const statusColors: Record<Status, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

const statusLabels: Record<Status, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export default function AdminDashboard({
  initialPendingSources,
  initialAllSources,
  initialStats,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"pending" | "all" | "stats">("pending");
  const [pendingSources, setPendingSources] = useState<Source[]>(initialPendingSources);
  const [allSources, setAllSources] = useState<Source[]>(initialAllSources);
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState<Set<string>>(new Set());
  const [filterStatus, setFilterStatus] = useState<Status | "">("");
  const [filterType, setFilterType] = useState<SourceType | "">("");
  const [filterCategory, setFilterCategory] = useState<Category | "">("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingSource, setEditingSource] = useState<Source | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const showError = useCallback((message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  }, []);

  const showSuccess = useCallback((message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  }, []);

  const setLoadingState = useCallback((id: string, isLoading: boolean) => {
    setLoading((prev) => {
      const next = new Set(prev);
      if (isLoading) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }, []);

  const updateStatsAfterStatusChange = useCallback((oldStatus: Status, newStatus: Status) => {
    setStats((prev) => ({
      total: prev.total,
      pending: prev.pending + (oldStatus === "PENDING" ? -1 : 0) + (newStatus === "PENDING" ? 1 : 0),
      approved: prev.approved + (oldStatus === "APPROVED" ? -1 : 0) + (newStatus === "APPROVED" ? 1 : 0),
      rejected: prev.rejected + (oldStatus === "REJECTED" ? -1 : 0) + (newStatus === "REJECTED" ? 1 : 0),
    }));
  }, []);

  const handleApprove = useCallback(async (source: Source) => {
    setLoadingState(source.id, true);
    try {
      const response = await fetch("/api/admin/sources", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: source.id, status: "APPROVED" }),
      });

      if (response.ok) {
        setPendingSources((prev) => prev.filter((s) => s.id !== source.id));
        setAllSources((prev) =>
          prev.map((s) => (s.id === source.id ? { ...s, status: Status.APPROVED } : s))
        );
        updateStatsAfterStatusChange(source.status, Status.APPROVED);
        showSuccess(`"${source.name}" approved`);
      } else {
        const data = await response.json();
        showError(data.error || "Failed to approve source");
      }
    } catch {
      showError("Network error while approving source");
    }
    setLoadingState(source.id, false);
  }, [setLoadingState, updateStatsAfterStatusChange, showError, showSuccess]);

  const handleReject = useCallback(async (source: Source) => {
    setLoadingState(source.id, true);
    try {
      const response = await fetch("/api/admin/sources", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: source.id, status: "REJECTED" }),
      });

      if (response.ok) {
        setPendingSources((prev) => prev.filter((s) => s.id !== source.id));
        setAllSources((prev) =>
          prev.map((s) => (s.id === source.id ? { ...s, status: Status.REJECTED } : s))
        );
        updateStatsAfterStatusChange(source.status, Status.REJECTED);
        showSuccess(`"${source.name}" rejected`);
      } else {
        const data = await response.json();
        showError(data.error || "Failed to reject source");
      }
    } catch {
      showError("Network error while rejecting source");
    }
    setLoadingState(source.id, false);
  }, [setLoadingState, updateStatsAfterStatusChange, showError, showSuccess]);

  const handleDelete = useCallback(async (source: Source) => {
    if (!confirm(`Are you sure you want to delete "${source.name}"?`)) return;

    setLoadingState(source.id, true);
    try {
      const response = await fetch(`/api/admin/sources?id=${source.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPendingSources((prev) => prev.filter((s) => s.id !== source.id));
        setAllSources((prev) => prev.filter((s) => s.id !== source.id));
        setStats((prev) => ({
          total: prev.total - 1,
          pending: prev.pending + (source.status === "PENDING" ? -1 : 0),
          approved: prev.approved + (source.status === "APPROVED" ? -1 : 0),
          rejected: prev.rejected + (source.status === "REJECTED" ? -1 : 0),
        }));
        showSuccess(`"${source.name}" deleted`);
      } else {
        const data = await response.json();
        showError(data.error || "Failed to delete source");
      }
    } catch {
      showError("Network error while deleting source");
    }
    setLoadingState(source.id, false);
  }, [setLoadingState, showError, showSuccess]);

  const handleEdit = useCallback((source: Source) => {
    setEditingSource(source);
    setError(null);
  }, []);

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSaveEdit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingSource) return;

    const formData = new FormData(e.currentTarget);
    const name = (formData.get("name") as string).trim();
    const url = (formData.get("url") as string).trim();
    const description = (formData.get("description") as string).trim();
    const iconUrl = (formData.get("iconUrl") as string).trim();
    const type = formData.get("type") as SourceType;
    const category = formData.get("category") as Category;
    const status = formData.get("status") as Status;
    const tags = (formData.get("tags") as string)
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (!name) {
      showError("Name is required");
      return;
    }

    if (!url || !validateUrl(url)) {
      showError("Please enter a valid URL");
      return;
    }

    if (iconUrl && !validateUrl(iconUrl)) {
      showError("Please enter a valid icon URL or leave it empty");
      return;
    }

    const updates = {
      id: editingSource.id,
      name,
      url,
      description: description || null,
      type,
      category,
      status,
      tags,
      iconUrl: iconUrl || null,
    };

    try {
      const response = await fetch("/api/admin/sources", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const { source: updatedSource } = await response.json();
        const oldStatus = editingSource.status;
        const newStatus = updatedSource.status;

        setAllSources((prev) =>
          prev.map((s) => (s.id === updatedSource.id ? updatedSource : s))
        );

        if (oldStatus === "PENDING" && newStatus !== "PENDING") {
          setPendingSources((prev) => prev.filter((s) => s.id !== updatedSource.id));
        } else if (oldStatus !== "PENDING" && newStatus === "PENDING") {
          setPendingSources((prev) => [updatedSource, ...prev]);
        } else if (oldStatus === "PENDING" && newStatus === "PENDING") {
          setPendingSources((prev) =>
            prev.map((s) => (s.id === updatedSource.id ? updatedSource : s))
          );
        }

        if (oldStatus !== newStatus) {
          updateStatsAfterStatusChange(oldStatus, newStatus);
        }

        setEditingSource(null);
        showSuccess(`"${updatedSource.name}" updated`);
      } else {
        const data = await response.json();
        showError(data.error || "Failed to update source");
      }
    } catch {
      showError("Network error while updating source");
    }
  }, [editingSource, showError, showSuccess, updateStatsAfterStatusChange]);

  const filteredSources = allSources.filter((source) => {
    if (filterStatus && source.status !== filterStatus) return false;
    if (filterType && source.type !== filterType) return false;
    if (filterCategory && source.category !== filterCategory) return false;
    if (searchQuery && !source.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const isLoading = (id: string) => loading.has(id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage sources and submissions</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {successMessage}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("pending")}
              className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
                activeTab === "pending"
                  ? "text-orange-600 border-b-2 border-orange-500 bg-orange-50/50"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Pending Review
              {stats.pending > 0 && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  {stats.pending}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
                activeTab === "all"
                  ? "text-orange-600 border-b-2 border-orange-500 bg-orange-50/50"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              All Sources
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
                activeTab === "stats"
                  ? "text-orange-600 border-b-2 border-orange-500 bg-orange-50/50"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Statistics
            </button>
          </div>

          <div className="p-6">
            {activeTab === "pending" && (
              <div className="space-y-4">
                {pendingSources.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">✅</div>
                    <h3 className="text-lg font-medium text-gray-900">No pending sources</h3>
                    <p className="text-gray-500">All submissions have been reviewed</p>
                  </div>
                ) : (
                  pendingSources.map((source) => (
                    <div
                      key={source.id}
                      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{source.name}</h3>
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                              {source.type}
                            </span>
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                              {source.category}
                            </span>
                          </div>
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-orange-600 hover:text-orange-700 hover:underline mb-2 block"
                          >
                            {source.url}
                          </a>
                          {source.description && (
                            <p className="text-sm text-gray-600 mb-3">{source.description}</p>
                          )}
                          {source.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {source.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          {source.submitter?.name && (
                            <p className="text-xs text-gray-500">
                              Submitted by: {source.submitter.name}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => handleApprove(source)}
                            disabled={isLoading(source.id)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                          >
                            {isLoading(source.id) ? "..." : "Approve"}
                          </button>
                          <button
                            onClick={() => handleReject(source)}
                            disabled={isLoading(source.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                          >
                            {isLoading(source.id) ? "..." : "Reject"}
                          </button>
                          <button
                            onClick={() => handleEdit(source)}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "all" && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3 mb-6">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as Status | "")}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as SourceType | "")}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">All Types</option>
                    {Object.values(SourceType).map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value as Category | "")}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">All Categories</option>
                    {Object.values(Category).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 flex-1 min-w-[200px]"
                  />
                </div>

                <div className="space-y-3">
                  {filteredSources.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">No sources found</div>
                  ) : (
                    filteredSources.map((source) => (
                      <div
                        key={source.id}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-base font-medium text-gray-900 truncate">
                                {source.name}
                              </h4>
                              <span
                                className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[source.status]}`}
                              >
                                {statusLabels[source.status]}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 truncate">{source.url}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-400">{source.type}</span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-400">{source.category}</span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-400">
                                {source.voteCount} votes
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <button
                              onClick={() => handleEdit(source)}
                              className="px-3 py-1.5 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(source)}
                              disabled={isLoading(source.id)}
                              className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            >
                              {isLoading(source.id) ? "..." : "Delete"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === "stats" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                  <div className="text-3xl font-bold mb-1">{stats.total}</div>
                  <div className="text-blue-100">Total Sources</div>
                </div>
                <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl p-6 text-white">
                  <div className="text-3xl font-bold mb-1">{stats.pending}</div>
                  <div className="text-orange-100">Pending Review</div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                  <div className="text-3xl font-bold mb-1">{stats.approved}</div>
                  <div className="text-green-100">Approved</div>
                </div>
                <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white">
                  <div className="text-3xl font-bold mb-1">{stats.rejected}</div>
                  <div className="text-red-100">Rejected</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {editingSource && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Edit Source</h2>
            </div>
            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingSource.name}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input
                  type="url"
                  name="url"
                  defaultValue={editingSource.url}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  defaultValue={editingSource.description || ""}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    name="type"
                    defaultValue={editingSource.type}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    {Object.values(SourceType).map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    defaultValue={editingSource.category}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    {Object.values(Category).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  defaultValue={editingSource.status}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  {Object.values(Status).map((status) => (
                    <option key={status} value={status}>
                      {statusLabels[status]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  defaultValue={editingSource.tags.join(", ")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon URL (optional)
                </label>
                <input
                  type="url"
                  name="iconUrl"
                  defaultValue={editingSource.iconUrl || ""}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setEditingSource(null)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
