// FILE: src/components/admin/AdminResourceManager.tsx

"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import {
  DefaultValues,
  FieldValues,
  Path,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodType } from "zod";
import { PremiumPanel } from "@/components/ui/PremiumPanel";
import { Toast } from "@/components/admin/Toast";
import { useToast } from "@/components/admin/useToast";

type FieldConfig<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  type?: "text" | "number" | "textarea" | "datetime-local" | "select" | "url";
  options?: string[];
};

export function AdminResourceManager<
  T extends FieldValues & { id: string; title?: string }
>({
  title,
  description,
  items,
  schema,
  emptyValue,
  resetToken,
  fields,
  onSave,
  onDelete,
  renderMeta,
}: {
  title: string;
  description: string;
  items: T[];
  schema: ZodType<T>;
  emptyValue: DefaultValues<T>;
  resetToken?: number;
  fields: FieldConfig<T>[];
  onSave: (value: T) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  renderMeta?: (item: T) => ReactNode;
}) {
  const [editingId, setEditingId] = useState<string>(
    typeof emptyValue.id === "string" ? emptyValue.id : "",
  );
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { message, showToast } = useToast();

  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: emptyValue,
  });

  useEffect(() => {
    setEditingId(typeof emptyValue.id === "string" ? emptyValue.id : "");
    form.reset(emptyValue);
  }, [emptyValue, resetToken, form]);

  const isEditingExisting = useMemo(
    () => items.some((item) => item.id === editingId),
    [items, editingId],
  );

  const submit = form.handleSubmit(
    async (values) => {
      try {
        setIsSaving(true);
        await onSave(values);
        showToast(isEditingExisting ? `${title} updated` : `${title} created`);
      } catch (error) {
        console.error(`Failed to save ${title}:`, error);
        showToast(`Failed to save ${title}`);
      } finally {
        setIsSaving(false);
      }
    },
    (errors) => {
      console.error(`Validation errors for ${title}:`, errors);
      showToast(`Please fix the highlighted ${title.toLowerCase()} fields`);
    },
  );

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <PremiumPanel>
        <div className="mb-5">
          <div className="font-display text-xs uppercase tracking-[0.32em] text-electric/70">
            Manage {title}
          </div>
          <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide text-white">
            {description}
          </h2>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-white/10 bg-black/20 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-lg font-semibold text-white">
                    {item.title ?? item.id}
                  </div>
                  <div className="mt-1 text-sm text-silver/60">
                    {renderMeta?.(item)}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(item.id);
                      form.reset(item);
                    }}
                    className="rounded-xl border border-white/10 px-3 py-2 text-sm text-white hover:bg-white/[0.05]"
                    disabled={isSaving || deletingId === item.id}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        setDeletingId(item.id);
                        await onDelete(item.id);
                        showToast(`${title} removed`);
                      } catch (error) {
                        console.error(`Failed to delete ${title}:`, error);
                        showToast(`Failed to delete ${title}`);
                      } finally {
                        setDeletingId(null);
                      }
                    }}
                    className="rounded-xl border border-danger/20 bg-danger/10 px-3 py-2 text-sm text-red-200"
                    disabled={isSaving || deletingId === item.id}
                  >
                    {deletingId === item.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </PremiumPanel>

      <PremiumPanel>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="font-display text-xs uppercase tracking-[0.32em] text-electric/70">
              Editor
            </div>
            <h3 className="mt-2 font-display text-2xl font-bold uppercase tracking-wide text-white">
              {isEditingExisting ? "Edit Item" : "Create Item"}
            </h3>
          </div>

          <button
            type="button"
            className="rounded-xl border border-white/10 px-3 py-2 text-sm text-silver/80"
            onClick={() => {
              setEditingId(typeof emptyValue.id === "string" ? emptyValue.id : "");
              form.reset(emptyValue);
            }}
            disabled={isSaving}
          >
            Reset
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="mb-2 block text-xs uppercase tracking-[0.24em] text-silver/45">
                {field.label}
              </label>

              {field.type === "textarea" ? (
                <textarea
                  {...form.register(field.name)}
                  rows={4}
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-electric/40"
                />
              ) : field.type === "select" ? (
                <select
                  {...form.register(field.name)}
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-electric/40"
                >
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  {...form.register(
                    field.name,
                    field.type === "number" ? { valueAsNumber: true } : undefined,
                  )}
                  type={field.type ?? "text"}
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-electric/40"
                />
              )}

              {form.formState.errors[field.name] ? (
                <p className="mt-2 text-xs text-red-300">
                  {String(
                    form.formState.errors[field.name]?.message ?? "Invalid field",
                  )}
                </p>
              ) : null}
            </div>
          ))}

          <button
            type="submit"
            disabled={isSaving}
            className="w-full rounded-2xl bg-[linear-gradient(135deg,rgba(78,164,255,0.95),rgba(139,92,246,0.9))] px-4 py-3 font-semibold uppercase tracking-[0.2em] text-white shadow-glow disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </form>
      </PremiumPanel>

      {message ? <Toast message={message} /> : null}
    </div>
  );
}