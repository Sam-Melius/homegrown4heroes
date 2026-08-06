import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { saveMenu, updateMember, updateOrderStatus } from "@/app/admin/actions";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/the-happy-veteran/login");

  const { data: current } = await supabase
    .from("profiles")
    .select("role, status")
    .eq("id", user.id)
    .single();

  if (current?.role !== "admin" || current.status !== "approved") {
    redirect("/the-happy-veteran/community");
  }

  const today = new Date().toISOString().slice(0, 10);
  const [{ data: members }, { data: menu }, { data: orders }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, discord_name, status, role, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("daily_menus")
      .select("title, content, order_deadline")
      .eq("menu_date", today)
      .maybeSingle(),
    supabase
      .from("orders")
      .select("id, items, notes, status, created_at, profiles(full_name, discord_name)")
      .order("created_at", { ascending: false })
      .limit(75),
  ]);

  const pendingMembers = members?.filter((member) => member.status === "pending") || [];
  const activeMembers = members?.filter((member) => member.status === "approved") || [];
  const otherMembers = members?.filter((member) => !["pending", "approved"].includes(member.status)) || [];
  const newOrders = orders?.filter((order) => order.status === "new") || [];

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date(`${today}T12:00:00`));

  return (
    <main className="admin-page">
      <div className="shell admin-shell">
        <header className="admin-header">
          <div>
            <span className="eyebrow">Homegrown4Heroes administration</span>
            <h1>Community dashboard</h1>
            <p>{formattedDate}</p>
          </div>
          <Link className="button button-ghost" href="/the-happy-veteran/community">Back to community</Link>
        </header>

        <section className="admin-stats" aria-label="Dashboard summary">
          <article><span>Pending approval</span><strong>{pendingMembers.length}</strong><small>membership requests</small></article>
          <article><span>Approved members</span><strong>{activeMembers.length}</strong><small>active community members</small></article>
          <article><span>New orders</span><strong>{newOrders.length}</strong><small>waiting for review</small></article>
          <article><span>Member Shares</span><strong>{menu ? "Live" : "Missing"}</strong><small>{menu ? "visible in the lounge" : "not yet posted"}</small></article>
        </section>

        <section className="admin-priority-grid">
          <section className="admin-card admin-membership-card">
            <div className="admin-card-header">
              <div>
                <span className="community-label">Priority queue</span>
                <h2>Membership requests</h2>
              </div>
              <span className="admin-count-badge">{pendingMembers.length} pending</span>
            </div>

            {pendingMembers.length ? (
              <div className="approval-list">
                {pendingMembers.map((member) => (
                  <article key={member.id}>
                    <div className="approval-avatar">{(member.full_name || member.discord_name || "M").charAt(0)}</div>
                    <div className="approval-details">
                      <strong>{member.full_name || "Unnamed member"}</strong>
                      <span>Discord: {member.discord_name || "Not supplied"}</span>
                      <small>Requested {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(member.created_at))}</small>
                    </div>
                    <div className="approval-actions">
                      <form action={updateMember}>
                        <input type="hidden" name="id" value={member.id} />
                        <input type="hidden" name="status" value="approved" />
                        <button className="button button-small" type="submit">Approve</button>
                      </form>
                      <form action={updateMember}>
                        <input type="hidden" name="id" value={member.id} />
                        <input type="hidden" name="status" value="rejected" />
                        <button className="button button-small button-danger" type="submit">Reject</button>
                      </form>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="admin-empty-state"><strong>You&apos;re caught up.</strong><p>There are no members waiting for approval.</p></div>
            )}
          </section>

          <form action={saveMenu} className="admin-card menu-editor-card">
            <div className="admin-card-header">
              <div>
                <span className="community-label">Member lounge</span>
                <h2>Member Shares</h2>
              </div>
              <span className={`admin-count-badge ${menu ? "is-live" : ""}`}>{menu ? "Live" : "Not posted"}</span>
            </div>
            <input type="hidden" name="menuDate" value={today} />
            <label>Share title<input name="title" defaultValue={menu?.title || ""} placeholder="Example: Tuesday Share" required /></label>
            <label>Member share details<textarea name="content" rows={9} defaultValue={menu?.content || ""} placeholder={"List one item per line, including any helpful details."} required /></label>
            <label>Request deadline<input name="deadline" defaultValue={menu?.order_deadline || ""} placeholder="Example: 2:00 PM" /></label>
            <button className="button button-full" type="submit">{menu ? "Update member shares" : "Publish member shares"}</button>
            <small className="admin-form-note">Changes appear on the member page as soon as this form is saved.</small>
          </form>
        </section>

        <section className="admin-card orders-card">
          <div className="admin-card-header">
            <div>
              <span className="community-label">Order management</span>
              <h2>Recent member orders</h2>
            </div>
            <span className="admin-count-badge">{orders?.length || 0} shown</span>
          </div>

          <div className="admin-order-list">
            {orders?.length ? orders.map((order) => (
              <article key={order.id} className={`admin-order status-border-${order.status}`}>
                <div className="admin-order-topline">
                  <div>
                    <strong>{order.profiles?.[0]?.full_name || "Member"}</strong>
                    <span>@{order.profiles?.[0]?.discord_name || "unknown"}</span>
                  </div>
                  <time>{new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(order.created_at))}</time>
                </div>
                <div className="admin-order-body">
                  <div>
                    <span className="order-field-label">Items</span>
                    <p>{order.items}</p>
                    {order.notes && <><span className="order-field-label">Notes</span><p>{order.notes}</p></>}
                  </div>
                  <form action={updateOrderStatus} className="order-status-form">
                    <input type="hidden" name="id" value={order.id} />
                    <label>
                      Status
                      <select name="status" defaultValue={order.status}>
                        <option value="new">New</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </label>
                    <button className="button button-small" type="submit">Update</button>
                  </form>
                </div>
                <small className="order-id">Order #{order.id.slice(0, 8)}</small>
              </article>
            )) : <div className="admin-empty-state"><strong>No orders yet.</strong><p>Submitted member orders will appear here.</p></div>}
          </div>
        </section>

        <section className="admin-card member-directory-card">
          <div className="admin-card-header">
            <div>
              <span className="community-label">Member records</span>
              <h2>Community directory</h2>
            </div>
            <span className="admin-count-badge">{members?.length || 0} total</span>
          </div>
          <div className="member-directory-table" role="table">
            {[...activeMembers, ...otherMembers].map((member) => (
              <article key={member.id} role="row">
                <div role="cell"><strong>{member.full_name || "Unnamed member"}</strong><span>{member.discord_name || "No Discord name"}</span></div>
                <span className={`status-pill status-${member.status}`} role="cell">{member.status}</span>
                <span role="cell">{member.role}</span>
                <form action={updateMember} role="cell">
                  <input type="hidden" name="id" value={member.id} />
                  <select name="status" defaultValue={member.status} aria-label={`Status for ${member.full_name || "member"}`}>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="suspended">Suspended</option>
                  </select>
                  <button className="button button-small button-ghost" type="submit">Save</button>
                </form>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
