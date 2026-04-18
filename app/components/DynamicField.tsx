"use client";

import { Control, Controller, FieldValues } from "react-hook-form";
import { TypeFieldDefinition } from "../lib/sourceConfig";

interface DynamicFieldProps {
  field: TypeFieldDefinition;
  control: Control<FieldValues>;
  error?: { message?: string };
  disabled?: boolean;
  onChange?: (value: string) => void;
}

export function DynamicField({
  field,
  control,
  error,
  disabled = false,
  onChange,
}: DynamicFieldProps) {
  const baseInputClasses =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all";

  return (
    <div className="space-y-2">
      <label
        htmlFor={field.name}
        className="block text-sm font-medium text-gray-700"
      >
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {field.description && (
        <p className="text-xs text-gray-500">{field.description}</p>
      )}

      <Controller
        name={`config.${field.name}`}
        control={control}
        render={({ field: controllerField }) => {
          if (field.type === "select") {
            return (
              <select
                id={field.name}
                disabled={disabled}
                value={controllerField.value || ""}
                onChange={(e) => {
                  controllerField.onChange(e);
                  onChange?.(e.target.value);
                }}
                className={`${baseInputClasses} appearance-none cursor-pointer`}
              >
                <option value="">Select {field.label}...</option>
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            );
          }

          return (
            <input
              type="text"
              id={field.name}
              placeholder={field.placeholder}
              disabled={disabled}
              value={controllerField.value || ""}
              onChange={controllerField.onChange}
              className={baseInputClasses}
            />
          );
        }}
      />

      {error && <p className="text-sm text-red-600 mt-1">{error.message}</p>}
    </div>
  );
}
