import { PageHero } from '@/components/ui/PageHero';
import { SiteSettingsForm } from '@/components/admin/SettingsForms';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <PageHero eyebrow="Admin Settings" title="Site-Level Brand Controls" description="Edit channel URLs, branded copy, countdown defaults, and core portal presentation settings." />
      <SiteSettingsForm />
    </div>
  );
}
