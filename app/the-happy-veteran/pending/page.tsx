import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";

export default async function PendingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/the-happy-veteran/login");
  const { data: profile } = await supabase.from("profiles").select("full_name, discord_name, status").eq("id", user.id).single();
  if (profile?.status === "approved") redirect("/the-happy-veteran/community");
  return <main className="community-page thv-auth-theme thv-pending-theme"><div className="shell narrow pending-card"><span className="eyebrow">Membership pending</span><h1>Your request is in the queue.</h1><p>Jennifer will compare <strong>{profile?.discord_name || "your Discord username"}</strong> with the Discord community before approving access.</p><p>Signed in as {profile?.full_name || user.email}.</p><form action={signOut}><button className="button button-ghost" type="submit">Sign out</button></form></div></main>;
}
