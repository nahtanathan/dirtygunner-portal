'use client';

import { AdminResourceManager } from '@/components/admin/AdminResourceManager';
import { useAdminStore } from '@/store/admin-store';
import { bonusHuntSchema } from '@/lib/validators/admin';

export default function AdminBonusHuntsPage() {
  const items = useAdminStore((state) => state.bonusHunts);
  const save = useAdminStore((state) => state.upsertBonusHunt);
  const remove = useAdminStore((state) => state.deleteBonusHunt);

  return (
    <AdminResourceManager
      title="Bonus Hunts"
      description="Manage active hunts and archive sessions with clean P/L support."
      items={items}
      schema={bonusHuntSchema}
      emptyValue={{ id: crypto.randomUUID(), title: '', date: '', status: 'active', provider: '', buyCount: 10, totalCost: 0, totalReturn: 0, profitLoss: 0, notes: '', items: '' }}
      fields={[
        { name: 'id', label: 'ID' },
        { name: 'title', label: 'Title' },
        { name: 'date', label: 'Hunt Date', type: 'datetime-local' },
        { name: 'status', label: 'Status', type: 'select', options: ['active', 'archived'] },
        { name: 'provider', label: 'Provider' },
        { name: 'buyCount', label: 'Buy Count', type: 'number' },
        { name: 'totalCost', label: 'Total Cost', type: 'number' },
        { name: 'totalReturn', label: 'Total Return', type: 'number' },
        { name: 'profitLoss', label: 'Profit / Loss', type: 'number' },
        { name: 'notes', label: 'Notes', type: 'textarea' },
        { name: 'items', label: 'Details JSON / Text', type: 'textarea' },
      ]}
      onSave={(value) => save({ ...value, profitLoss: value.totalReturn - value.totalCost })}
      onDelete={remove}
      renderMeta={(item) => `${item.status} · ${item.buyCount} buys · ${item.profitLoss}`}
    />
  );
}
