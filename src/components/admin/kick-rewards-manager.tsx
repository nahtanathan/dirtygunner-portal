'use client';

import { useEffect, useState } from 'react';

type Reward = {
  id?: string;
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
  title: '',
  description: '',
  cost: 100,
  background_color: '#00e701',
  is_enabled: true,
  is_paused: false,
  is_user_input_required: false,
  should_redemptions_skip_request_queue: false,
};

export function KickRewardsManager() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<RewardFormState>(emptyForm);

  async function loadRewards() {
    setLoading(true);

    try {
      const res = await fetch('/api/kick/rewards', { cache: 'no-store' });
      const data = await res.json();
      setRewards(data.rewards ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadRewards();
  }, []);

  async function createReward() {
    setSaving(true);

    try {
      const res = await fetch('/api/admin/kick/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          description: form.description || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error ?? 'Failed to create reward');
      }

      setForm(emptyForm);
      await loadRewards();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Failed to create reward');
    } finally {
      setSaving(false);
    }
  }

  async function updateReward(rewardId: string, payload: Partial<RewardFormState>) {
    const res = await fetch(`/api/admin/kick/rewards/${rewardId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error ?? 'Failed to update reward');
    }

    return data.reward;
  }

  async function deleteReward(rewardId: string) {
    const res = await fetch(`/api/admin/kick/rewards/${rewardId}`, {
      method: 'DELETE',
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error ?? 'Failed to delete reward');
    }

    return data;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
        <h2 className="mb-4 text-lg font-semibold text-white">Create Kick Reward</h2>

        <div className="grid gap-3 md:grid-cols-2">
          <input
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none"
            placeholder="Reward title"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          />

          <input
            type="number"
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none"
            placeholder="Cost"
            value={form.cost}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, cost: Number(e.target.value) || 0 }))
            }
          />

          <input
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none md:col-span-2"
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
          />

          <input
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none"
            placeholder="#00e701"
            value={form.background_color}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, background_color: e.target.value }))
            }
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-zinc-300">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.is_enabled}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, is_enabled: e.target.checked }))
              }
            />
            Enabled
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.is_paused}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, is_paused: e.target.checked }))
              }
            />
            Paused
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.is_user_input_required}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  is_user_input_required: e.target.checked,
                }))
              }
            />
            User input required
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.should_redemptions_skip_request_queue}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  should_redemptions_skip_request_queue: e.target.checked,
                }))
              }
            />
            Skip queue
          </label>
        </div>

        <button
          type="button"
          onClick={() => void createReward()}
          disabled={saving}
          className="mt-4 rounded-xl bg-green-500 px-4 py-2 font-semibold text-black disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Create reward'}
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Existing Rewards</h2>
          <button
            type="button"
            onClick={() => void loadRewards()}
            className="rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-300"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="text-sm text-zinc-400">Loading rewards...</div>
        ) : rewards.length === 0 ? (
          <div className="text-sm text-zinc-400">No rewards found.</div>
        ) : (
          <div className="space-y-3">
            {rewards.map((reward) => (
              <div
                key={reward.kick_reward_id}
                className="rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="font-semibold text-white">{reward.title}</div>
                    <div className="text-sm text-zinc-400">
                      {reward.description || 'No description'}
                    </div>
                    <div className="mt-1 text-xs text-zinc-500">
                      Cost: {reward.cost} • Kick ID: {reward.kick_reward_id}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await updateReward(reward.kick_reward_id, {
                            is_enabled: !reward.is_enabled,
                          });
                          await loadRewards();
                        } catch (error) {
                          console.error(error);
                          alert(
                            error instanceof Error
                              ? error.message
                              : 'Failed to update reward'
                          );
                        }
                      }}
                      className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white"
                    >
                      {reward.is_enabled ? 'Disable' : 'Enable'}
                    </button>

                    <button
                      type="button"
                      onClick={async () => {
                        const confirmed = window.confirm(
                          `Delete reward "${reward.title}"?`
                        );

                        if (!confirmed) return;

                        try {
                          await deleteReward(reward.kick_reward_id);
                          await loadRewards();
                        } catch (error) {
                          console.error(error);
                          alert(
                            error instanceof Error
                              ? error.message
                              : 'Failed to delete reward'
                          );
                        }
                      }}
                      className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}