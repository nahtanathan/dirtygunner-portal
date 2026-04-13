'use client';

import { AdminResourceManager } from '@/components/admin/AdminResourceManager';
import { useAdminStore } from '@/store/admin-store';
import { challengeSchema } from '@/lib/validators/admin';

export default function AdminChallengesPage() {
  const items = useAdminStore((state) => state.challenges);
  const save = useAdminStore((state) => state.upsertChallenge);
  const remove = useAdminStore((state) => state.deleteChallenge);

  return (
    <AdminResourceManager
      title="Challenges"
      description="Manage challenge goals, progress, rewards, and archive states."
      items={items}
      schema={challengeSchema}
      emptyValue={{ id: crypto.randomUUID(), title: '', description: '', status: 'active', goal: 1000, currentProgress: 0, reward: '', startDate: '', endDate: '' }}
      fields={[
        { name: 'id', label: 'ID' },
        { name: 'title', label: 'Title' },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'status', label: 'Status', type: 'select', options: ['active', 'completed'] },
        { name: 'goal', label: 'Goal', type: 'number' },
        { name: 'currentProgress', label: 'Current Progress', type: 'number' },
        { name: 'reward', label: 'Reward' },
        { name: 'startDate', label: 'Start Date', type: 'datetime-local' },
        { name: 'endDate', label: 'End Date', type: 'datetime-local' },
      ]}
      onSave={save}
      onDelete={remove}
      renderMeta={(item) => `${item.status} · ${item.currentProgress}/${item.goal}`}
    />
  );
}
