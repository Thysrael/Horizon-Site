"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category, SourceType } from "../types";
import { CATEGORIES } from "../lib/constants";
import { TagInput } from "../components/TagInput";
import {
  TYPE_FIELD_CONFIG,
  getVisibleFields,
  sourceSubmissionSchema,
  sourceConfigSchemas,
} from "../lib/sourceConfig";
import { buildSourceUrl } from "../lib/urlBuilder";
import { DynamicField } from "../components/DynamicField";

const SUBMITTABLE_SOURCE_TYPES: {
  value: SourceType;
  label: string;
  description: string;
}[] = [
  {
    value: "RSS",
    label: "RSS Feed",
    description: "Standard RSS/Atom feed URL",
  },
  {
    value: "REDDIT",
    label: "Reddit",
    description: "Reddit subreddit feed",
  },
  {
    value: "TELEGRAM",
    label: "Telegram",
    description: "Telegram channel",
  },
  {
    value: "GITHUB",
    label: "GitHub",
    description: "GitHub user activity or repository releases",
  },
];

interface SubmitFormProps {
  userId: string;
}

export function SubmitForm({ userId }: SubmitFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(sourceSubmissionSchema),
    defaultValues: {
      name: "",
      description: "",
      type: undefined as unknown as "RSS" | "REDDIT" | "TELEGRAM" | "GITHUB",
      category: undefined as unknown as Category,
      tags: [],
      iconUrl: "",
      config: {},
    },
  });

  const selectedType = watch("type");
  const configValues = watch("config");

  const visibleFields = useMemo(() => {
    if (!selectedType) return [];
    return getVisibleFields(
      selectedType as keyof typeof TYPE_FIELD_CONFIG,
      configValues || {}
    );
  }, [selectedType, configValues]);

  useEffect(() => {
    if (selectedType && configValues) {
      try {
        const validationSchema =
          sourceConfigSchemas[selectedType as keyof typeof sourceConfigSchemas];
        if (validationSchema) {
          const validated = validationSchema.safeParse(configValues);
          if (validated.success) {
            const url = buildSourceUrl(
              selectedType,
              validated.data
            );
            setPreviewUrl(url);
          } else {
            setPreviewUrl("");
          }
        }
      } catch {
        setPreviewUrl("");
      }
    } else {
      setPreviewUrl("");
    }
  }, [selectedType, configValues]);

  useEffect(() => {
    if (selectedType) {
      setValue("config", {});
      setPreviewUrl("");
    }
  }, [selectedType, setValue]);

  useEffect(() => {
    if (selectedType === "GITHUB" && configValues) {
      const subtype = configValues.subtype;
      if (subtype === "user_events" && (configValues.owner || configValues.repo)) {
        setValue("config", { subtype: "user_events" }, { shouldValidate: false });
      } else if (subtype === "repo_releases" && configValues.username) {
        setValue("config", { subtype: "repo_releases" }, { shouldValidate: false });
      }
    }
  }, [selectedType, configValues?.subtype, setValue]);

  const onSubmit = async (formData: any) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const validationSchema =
        sourceConfigSchemas[formData.type as keyof typeof sourceConfigSchemas];
      const configValidation = validationSchema.safeParse(formData.config);

      if (!configValidation.success) {
        throw new Error("Invalid configuration for selected type");
      }

      const constructedUrl = buildSourceUrl(
        formData.type,
        configValidation.data
      );

      const response = await fetch("/api/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          url: constructedUrl,
          submitterId: userId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit source");
      }

      setSuccess(true);
      reset();

      if (data.droppedTags && data.droppedTags.length > 0) {
        console.warn("Dropped tags:", data.droppedTags);
      }

      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-semibold text-green-900">
          Source Submitted Successfully!
        </h3>
        <p className="text-green-700">
          Your submission is pending review. Redirecting to home...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Source Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            {...register("name")}
            placeholder="e.g., Hacker News"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700"
          >
            Source Type <span className="text-red-500">*</span>
          </label>
          <select
            id="type"
            {...register("type")}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all appearance-none cursor-pointer"
          >
            <option value="">Select a type...</option>
            {SUBMITTABLE_SOURCE_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label} - {type.description}
              </option>
            ))}
          </select>
          {errors.type && (
            <p className="text-sm text-red-600">{errors.type.message}</p>
          )}
        </div>
      </div>

      {selectedType && (
        <div className="rounded-xl border border-orange-100 bg-orange-50/50 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">
            {SUBMITTABLE_SOURCE_TYPES.find((t) => t.value === selectedType)
              ?.label}{" "}
            Configuration
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            {TYPE_FIELD_CONFIG[selectedType as keyof typeof TYPE_FIELD_CONFIG]
              ?.filter((field) => visibleFields.includes(field.name))
              .map((field) => (
                <DynamicField
                  key={field.name}
                  field={field}
                  control={control as any}
                  error={errors.config?.[field.name] as any}
                  onChange={
                    field.name === "subtype" && selectedType === "GITHUB"
                      ? (value) => {
                          if (value === "user_events") {
                            setValue("config", { subtype: "user_events" }, { shouldValidate: false });
                          } else if (value === "repo_releases") {
                            setValue("config", { subtype: "repo_releases" }, { shouldValidate: false });
                          }
                        }
                      : undefined
                  }
                />
              ))}
          </div>

          {previewUrl && (
            <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Generated URL:</p>
              <p className="text-sm font-mono text-orange-600 break-all">
                {previewUrl}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            {...register("category")}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all appearance-none cursor-pointer"
          >
            <option value="">Select a category...</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Tags
          </label>
          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <TagInput
                value={field.value}
                onChange={field.onChange}
                placeholder="Add relevant tags..."
                hideZeroCount={true}
              />
            )}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          {...register("description")}
          rows={3}
          placeholder="Briefly describe what this source covers..."
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all resize-none"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="iconUrl"
          className="block text-sm font-medium text-gray-700"
        >
          Icon URL (optional)
        </label>
        <input
          type="url"
          id="iconUrl"
          {...register("iconUrl")}
          placeholder="https://example.com/favicon.ico"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
        />
      </div>

      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="rounded-xl px-6 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-8 py-3 text-sm font-medium text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Submitting...
            </span>
          ) : (
            "Submit Source"
          )}
        </button>
      </div>
    </form>
  );
}
