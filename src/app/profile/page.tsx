import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { ProfilePageClient } from "@/components/profile/profile-page-client";

export default async function ProfilePage() {
  const session = await getSession();

  if (!session?.sub) {
    redirect("/");
  }

  return <ProfilePageClient />;
}