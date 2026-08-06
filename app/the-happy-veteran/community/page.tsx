import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";
import { CommunityBoard } from "@/components/community/community-board";
import { OrderForm } from "@/components/community/order-form";

type OrderSummary = {
  id: string;
  items: string;
  status: "new" | "reviewed" | "completed" | "cancelled";
  created_at: string;
};

export default async function CommunityHub() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/the-happy-veteran/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, discord_name, status, role")
    .eq("id", user.id)
    .single();

  if (profile?.status !== "approved") redirect("/the-happy-veteran/pending");

  const today = new Date().toISOString().slice(0, 10);
  const [{ data: menu }, { data: channels }, { data: messages }, { data: recentOrders }] =
    await Promise.all([
      supabase
        .from("daily_menus")
        .select("title, content, order_deadline")
        .eq("menu_date", today)
        .maybeSingle(),
      supabase
        .from("channels")
        .select("id, name, description")
        .eq("is_active", true)
        .order("position"),
      supabase
        .from("messages")
        .select(
          "id, content, created_at, channel_id, profiles(full_name, discord_name)"
        )
        .order("created_at", { ascending: true })
        .limit(250),
      supabase
        .from("orders")
        .select("id, items, status, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3),
    ]);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date(`${today}T12:00:00`));

  return (
    <main className="member-app">
      <header className="member-topbar">
        <div className="member-identity">
          <span className="eyebrow">Homegrown community</span>
          <strong>Hello, {profile?.full_name || profile?.discord_name || "Member"}</strong>
          <small>{formattedDate}</small>
        </div>
        <nav className="member-actions" aria-label="Member controls">
          <a className="member-nav-link" href="#shares">Member Shares</a>
          <a className="member-nav-link" href="#community">Community</a>
          <a className="member-nav-link" href="#order">Member Ordering</a>
          {profile?.role === "admin" && (
            <Link className="button button-small button-light" href="/the-happy-veteran/admin">
              Admin dashboard
            </Link>
          )}
          <form action={signOut}>
            <button className="button button-small button-ghost member-signout" type="submit">
              Sign out
            </button>
          </form>
        </nav>
      </header>

      <div className="member-shell">
        <section className="member-welcome" aria-labelledby="member-welcome-title">
          <div>
            <span className="community-label">Members-only space</span>
            <h1 id="member-welcome-title">Welcome to The Happy Veteran</h1>
            <p>
              View member shares, connect with the community, and access member ordering.
            </p>
          </div>
          <div className="welcome-mark" aria-hidden="true">HG4H</div>
        </section>

        <section className="daily-layout" id="shares">
          <article className={`daily-menu-card ${menu ? "has-menu" : "no-menu"}`}>
            <div className="card-heading-row">
              <div>
                <span className="community-label">Member Shares</span>
                <h2>{menu?.title || "No member shares have been posted yet"}</h2>
              </div>
              {menu && <span className="menu-live-badge">Available to members</span>}
            </div>
            <div className="menu-content">
              {menu?.content || "Check back later for new member shares."}
            </div>
            <div className="menu-footer">
              {menu?.order_deadline ? (
                <p><strong>Request deadline:</strong> {menu.order_deadline}</p>
              ) : (
                <p>No request deadline has been posted.</p>
              )}
              <a className="button button-small" href="#order">Open Member Ordering</a>
            </div>
          </article>

          <aside className="member-side-card">
            <span className="community-label">How it works</span>
            <ol className="member-steps">
              <li><strong>1</strong><span>Review the latest member shares.</span></li>
              <li><strong>2</strong><span>Save your order to the member dashboard.</span></li>
              <li><strong>3</strong><span>Send the prepared email that opens for you.</span></li>
            </ol>
            <p className="member-help-note">
              Need help? Post in <strong>#questions</strong> below so the group can help.
            </p>
          </aside>
        </section>

        <section id="community" className="community-section-wrap">
          <div className="section-intro-row">
            <div>
              <span className="community-label">Community conversation</span>
              <h2>A small, private place to stay connected</h2>
            </div>
            <p>Choose a channel, read the latest updates, or add to the conversation.</p>
          </div>
          <CommunityBoard
            channels={channels || []}
            initialMessages={(messages || []) as never[]}
          />
        </section>

        <section id="order" className="order-section">
          <div className="section-intro-row order-intro">
            <div>
              <span className="community-label">Member Ordering</span>
              <h2>Submit a member request</h2>
            </div>
            <p>Your order is stored first, then a prepared email opens for final sending.</p>
          </div>
          <OrderForm recentOrders={(recentOrders || []) as OrderSummary[]} />
        </section>
      </div>
    </main>
  );
}
