import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function CommunityGate() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    return <main className="community-page thv-auth-theme thv-enter-theme"><div className="shell narrow setup-panel"><span className="eyebrow">Setup required</span><h1>Connect Supabase to unlock the member area.</h1><p>Add the values from your Supabase project to <code>.env.local</code>, then run the included SQL migration.</p><pre>{`NEXT_PUBLIC_SUPABASE_URL=...\nNEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...\nNEXT_PUBLIC_SITE_URL=http://localhost:3000`}</pre></div></main>;
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/the-happy-veteran/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("status")
    .eq("id", user.id)
    .single();

  if (profile?.status !== "approved") redirect("/the-happy-veteran/pending");
  redirect("/the-happy-veteran/community");
}
