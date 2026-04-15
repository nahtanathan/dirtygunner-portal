// FILE: src/components/admin/kick-rewards-manager.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Coins,
  Loader2,
  PauseCircle,
  Plus,
  RefreshCw,
  Trash2,
  XCircle,
  Zap,
} from "lucide-react";

type Reward = {
  kick_reward_id: string;
  title: string;
  description?: string | null;
  cost: number;
  background_color?: string | null;
  is_enabled?: boolean;
  is_paused?: boolean;
  is_user_input_required?: boolean;
  should_redemptions_skip_request_queue?: boolean;
};

type RewardFormState = {
  title: string;
  description: string;
  cost: number;
  background_color: string;
  is_enabled: boolean;
  is_paused: boolean;
  is_user_input_required: boolean;
  should_redemptions_skip_request_queue: boolean;
};

const emptyForm: RewardFormState = {
  title: "",
  description: "",
  cost: 100,
  background_color: "#00e701",
  is_enabled: true,
  is_paused: false,
  is_user_input_required: false,
  should_redemptions_skip_request_queue: false,
};

const inputClassName =
  "h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition-all duration-200 placeholder:text-white/28 focus:border-white/20 focus:bg-white/[0.05]";

const checkboxCardClassName =
  "flex min-w-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3";

export function KickRewardsManager() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyRewardId, setBusyRewardId] = useState<string | null>(null);
  const [form, setForm] = useState<RewardFormState>(emptyForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadRewards() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/kick/rewards", { cache: "no-store" });
      const data = await res.json();
      setRewards(data.rewards ?? []);
    } catch (loadError) {
      console.error(loadError);
      setError("Failed to load Kick rewards.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadRewards();
  }, []);

  const enabledCount = useMemo(
    () => rewards.filter((reward) => reward.is_enabled).length,
    [rewards],
  );

  async function createReward() {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/admin/kick/rewards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          description: form.description || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error ?? "Failed to create reward");
      }

      setForm(emptyForm);
      setMessage("Reward created.");
      await loadRewards();
    } catch (createError) {
      console.error(createError);
      setError(
        createError instanceof Error
          ? createError.message
          : "Failed to create reward",
      );
    } finally {
      setSaving(false);
    }
  }

  async function updateReward(
    rewardId: string,
    payload: Partial<RewardFormState>,
  ) {
    const res = await fetch(`/api/admin/kick/rewards/${rewardId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error ?? "Failed to update reward");
    }

    return data.reward;
  }

  async function deleteReward(rewardId: string) {
    const res = await fetch(`/api/admin/kick/rewards/${rewardId}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error ?? "Failed to delete reward");
    }

    return data;
  }

  async function handleToggleEnabled(reward: Reward) {
    setBusyRewardId(reward.kick_reward_id);
    setMessage("");
    setError("");

    try {
      await updateReward(reward.kick_reward_id, {
        is_enabled: !reward.is_enabled,
      });

      setMessage(
        reward.is_enabled ? "Reward disabled." : "Reward enabled.",
      );
      await loadRewards();
    } catch (toggleError) {
      console.error(toggleError);
      setError(
        toggleError instanceof Error
          ? toggleError.message
          : "Failed to update reward",
      );
    } finally {
      setBusyRewardId(null);
    }
  }

  async function handleDelete(reward: Reward) {
    const confirmed = window.confirm(`Delete reward "${reward.title}"?`);

    if (!confirmed) return;

    setBusyRewardId(reward.kick_reward_id);
    setMessage("");
    setError("");

    try {
      await deleteReward(reward.kick_reward_id);
      setMessage("Reward deleted.");
      await loadRewards();
    } catch (deleteError) {
      console.error(deleteError);
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete reward",
      );
    } finally {
      setBusyRewardId(null);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,18,34,0.96),rgba(7,12,24,0.98))] p-5 shadow-[0_18px_70px_rgba(0,0,0,0.26)] sm:p-6">
        <div className="mb-6 flex min-w-0 flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="text-xs font-semibold uppercase tracking-[0.26em] text-white/42">
              Create
            </div>
            <h2 className="mt-2 truncate text-xl font-bold text-white sm:text-2xl">
              New Kick Reward
            </h2>
            <p className="truncate-3 mt-2 max-w-2xl text-sm leading-6 text-white/62">
              Build a new channel reward with clear costs, toggles, and color
              settings that stay tidy across breakpoints.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center">
            <MiniTopStat label="Rewards" value={String(rewards.length)} />
            <MiniTopStat label="Enabled" value={String(enabledCount)} />
          </div>
        </div>

        {message ? (
          <div className="mb-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
            <span className="truncate-2">{message}</span>
          </div>
        ) : null}

        {error ? (
          <div className="mb-4 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            <span className="truncate-2">{error}</span>
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Reward Title">
            <input
              className={inputClassName}
              placeholder="Reward title"
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </Field>

          <Field label="Cost">
            <input
              type="number"
              className={inputClassName}
              placeholder="Cost"
              value={form.cost}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  cost: Number(e.target.value) || 0,
                }))
              }
            />
          </Field>

          <Field label="Description">
            <input
              className={inputClassName}
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
            />
          </Field>

          <Field label="Background Color">
            <div className="flex min-w-0 items-center gap-3">
              <input
                type="color"
                value={form.background_color}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    background_color: e.target.value,
                  }))
                }
                className="h-12 w-14 shrink-0 cursor-pointer rounded-2xl border border-white/10 bg-transparent p-1"
              />
              <input
                className={inputClassName}
                placeholder="#00e701"
                value={form.background_color}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    background_color: e.target.value,
                  }))
                }
              />
            </div>
          </Field>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <CheckboxCard
            label="Enabled"
            checked={form.is_enabled}
            onChange={(checked) =>
              setForm((prev) => ({ ...prev, is_enabled: checked }))
            }
          />
          <CheckboxCard
            label="Paused"
            checked={form.is_paused}
            onChange={(checked) =>
              setForm((prev) => ({ ...prev, is_paused: checked }))
            }
          />
          <CheckboxCard
            label="User Input Required"
            checked={form.is_user_input_required}
            onChange={(checked) =>
              setForm((prev) => ({
                ...prev,
                is_user_input_required: checked,
              }))
            }
          />
          <CheckboxCard
            label="Skip Queue"
            checked={form.should_redemptions_skip_request_queue}
            onChange={(checked) =>
              setForm((prev) => ({
                ...prev,
                should_redemptions_skip_request_queue: checked,
              }))
            }
          />
        </div>

        <div className="mt-6 flex min-w-0 flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => void createReward()}
            disabled={saving}
            className="inline-flex h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-2xl text-sm font-extrabold uppercase tracking-[0.08em] text-white disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              background:
                "linear-gradient(180deg, rgba(59,130,246,0.96), rgba(37,99,235,0.96))",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.18), 0 12px 28px rgba(37,99,235,0.22)",
            }}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin shrink-0" />
            ) : (
              <Plus className="h-4 w-4 shrink-0" />
            )}
            <span className="truncate whitespace-nowrap">
              {saving ? "Saving..." : "Create Reward"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setForm(emptyForm)}
            disabled={saving}
            className="inline-flex h-12 min-w-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="truncate whitespace-nowrap">Reset</span>
          </button>
        </div>
      </section>

      <section className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,18,34,0.96),rgba(7,12,24,0.98))] p-5 shadow-[0_18px_70px_rgba(0,0,0,0.26)] sm:p-6">
        <div className="mb-5 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <div className="text-xs font-semibold uppercase tracking-[0.26em] text-white/42">
              Inventory
            </div>
            <h2 className="mt-2 truncate text-xl font-bold text-white sm:text-2xl">
              Existing Rewards
            </h2>
          </div>

          <button
            type="button"
            onClick={() => void loadRewards()}
            className="inline-flex h-11 min-w-0 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/[0.05]"
          >
            <RefreshCw className="h-4 w-4 shrink-0" />
            <span className="truncate whitespace-nowrap">Refresh</span>
          </button>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-6 text-sm text-zinc-400">
            Loading rewards...
          </div>
        ) : rewards.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-6 text-sm text-zinc-400">
            No rewards found.
          </div>
        ) : (
          <div className="space-y-3">
            {rewards.map((reward) => {
              const isBusy = busyRewardId === reward.kick_reward_id;

              return (
                <article
                  key={reward.kick_reward_id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <span
                          className="inline-flex h-6 w-6 shrink-0 rounded-full border border-white/10"
                          style={{
                            background:
                              reward.background_color || form.background_color,
                          }}
                        />
                        <h3 className="truncate text-lg font-semibold text-white">
                          {reward.title}
                        </h3>

                        <span className="inline-flex max-w-full rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">
                          <span className="truncate whitespace-nowrap">
                            {reward.is_enabled ? "Enabled" : "Disabled"}
                          </span>
                        </span>

                        {reward.is_paused ? (
                          <span className="inline-flex max-w-full rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-100">
                            <span className="truncate whitespace-nowrap">Paused</span>
                          </span>
                        ) : null}
                      </div>

                      <p className="truncate-3 mt-2 text-sm leading-6 text-zinc-400">
                        {reward.description || "No description"}
                      </p>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <RewardStat
                          icon={<Coins className="h-4 w-4" />}
                          label="Cost"
                          value={String(reward.cost)}
                        />
                        <RewardStat
                          icon={<Zap className="h-4 w-4" />}
                          label="Kick ID"
                          value={reward.kick_reward_id}
                        />
                        <RewardStat
                          icon={<CheckCircle2 className="h-4 w-4" />}
                          label="User Input"
                          value={reward.is_user_input_required ? "Yes" : "No"}
                        />
                        <RewardStat
                          icon={<PauseCircle className="h-4 w-4" />}
                          label="Skip Queue"
                          value={
                            reward.should_redemptions_skip_request_queue
                              ? "Yes"
                              : "No"
                          }
                        />
                      </div>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2 xl:w-[210px] xl:grid-cols-1">
                      <button
                        type="button"
                        onClick={() => void handleToggleEnabled(reward)}
                        disabled={isBusy}
                        className="inline-flex h-11 min-w-0 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isBusy ? (
                          <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                        ) : reward.is_enabled ? (
                          <XCircle className="h-4 w-4 shrink-0" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4 shrink-0" />
                        )}
                        <span className="truncate whitespace-nowrap">
                          {reward.is_enabled ? "Disable" : "Enable"}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => void handleDelete(reward)}
                        disabled={isBusy}
                        className="inline-flex h-11 min-w-0 items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 text-sm font-semibold text-red-300 transition-all duration-200 hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isBusy ? (
                          <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                        ) : (
                          <Trash2 className="h-4 w-4 shrink-0" />
                        )}
                        <span className="truncate whitespace-nowrap">Delete</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block min-w-0">
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/42">
        {label}
      </div>
      {children}
    </label>
  );
}

function CheckboxCard({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className={checkboxCardClassName}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 shrink-0 rounded border-white/20 bg-transparent"
      />
      <span className="min-w-0 truncate text-sm font-medium text-white/82">
        {label}
      </span>
    </label>
  );
}

function MiniTopStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <div className="truncate text-lg font-bold text-white">{value}</div>
      <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/42">
        {label}
      </div>
    </div>
  );
}

function RewardStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-white/10 bg-black/20 p-3">
      <div className="flex min-w-0 items-center gap-2 text-white/45">
        <span className="shrink-0">{icon}</span>
        <span className="truncate text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">
          {label}
        </span>
      </div>
      <div className="mt-1 truncate text-sm font-semibold text-white">{value}</div>
    </div>
  );
}