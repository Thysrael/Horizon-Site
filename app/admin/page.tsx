import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isAdmin } from "@/app/lib/admin";
import { getPendingSources, getAllSources, getSourceStats } from "@/app/lib/data";
import AdminDashboard from "./AdminDashboard";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/api/auth/signin?callbackUrl=/admin");
  }

  const adminCheck = await isAdmin();

  if (!adminCheck) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const [pendingSources, allSources, stats] = await Promise.all([
    getPendingSources(),
    getAllSources(),
    getSourceStats(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <AdminDashboard
          initialPendingSources={pendingSources}
          initialAllSources={allSources}
          initialStats={stats}
        />
      </main>
      <Footer />
    </div>
  );
}
