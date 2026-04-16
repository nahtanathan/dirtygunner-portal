import { PageHero } from "@/components/ui/PageHero";
import { SiteSettingsForm } from "@/components/admin/SettingsForms";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <PageHero
        eyebrow="Admin Settings"
        title="Site Links"
        description="Edit the channel and social links used across the site."
      />
      <SiteSettingsForm />
    </div>
  );
}