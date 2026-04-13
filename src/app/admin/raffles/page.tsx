'use client';

import { AdminResourceManager } from '@/components/admin/AdminResourceManager';
import { useAdminStore } from '@/store/admin-store';
import { raffleSchema } from '@/lib/validators/admin';

export default function AdminRafflesPage() {
  const items = useAdminStore((state) => state.raffles);
  const save = useAdminStore((state) => state.upsertRaffle);
  const remove = useAdminStore((state) => state.deleteRaffle);

  return (
    <AdminResourceManager
      title="Raffles"
      description="Create, edit, archive, and manage community raffle events."
      items={items}
      schema={raffleSchema}
      emptyValue={{ id: crypto.randomUUID(), title: '', description: '', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80', status: 'active', entryMethod: '', totalEntries: 0, startDate: '', endDate: '', winner: '', prizeDetails: '' }}
      fields={[
        { name: 'id', label: 'ID' },
        { name: 'title', label: 'Title' },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'image', label: 'Image URL', type: 'url' },
        { name: 'status', label: 'Status', type: 'select', options: ['active', 'completed', 'archived'] },
        { name: 'entryMethod', label: 'Entry Method' },
        { name: 'totalEntries', label: 'Total Entries', type: 'number' },
        { name: 'startDate', label: 'Start Date', type: 'datetime-local' },
        { name: 'endDate', label: 'End Date', type: 'datetime-local' },
        { name: 'winner', label: 'Winner' },
        { name: 'prizeDetails', label: 'Prize Details', type: 'textarea' },
      ]}
      onSave={save}
      onDelete={remove}
      renderMeta={(item) => `${item.status} · ${item.totalEntries} entries`}
    />
  );
}
