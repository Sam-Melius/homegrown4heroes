import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  updateMember,
  updateMemberRole,
  updateOrderStatus,
} from "@/app/admin/actions";

type InventoryItem = {
  id: string;
  name: string;
  details: string | null;
  position: number;
};

type InventoryCategory = {
  id: string;
  name: string;
  position: number;
  inventory_items: InventoryItem[] | null;
};

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

  const [
    { data: members },
    { data: inventoryData },
    { data: orders },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, member_id, discord_name, status, role, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("inventory_categories")
      .select("id, name, position, inventory_items(id, name, details, position)")
      .order("position", { ascending: true })
      .order("position", { referencedTable: "inventory_items", ascending: true }),
    supabase
      .from("orders")
      .select("id, items, notes, status, created_at, profiles(full_name, discord_name)")
      .order("created_at", { ascending: false })
      .limit(75),
  ]);

  const inventory = ((inventoryData || []) as InventoryCategory[])
    .map((category) => ({
      ...category,
      inventory_items: category.inventory_items
        ? [...category.inventory_items].sort((a, b) =>
            a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
          )
        : null,
    }))
    .sort((a, b) => {
      const aIsFlower = a.name.trim().toLowerCase() === "flower";
      const bIsFlower = b.name.trim().toLowerCase() === "flower";

      if (aIsFlower && !bIsFlower) return -1;
      if (!aIsFlower && bIsFlower) return 1;

      return a.position - b.position;
    });
  const inventoryItemCount = inventory.reduce(
    (total, category) => total + (category.inventory_items?.length || 0),
    0,
  );

  const pendingMembers =
    members?.filter((member) => member.status === "pending") || [];
  const activeMembers =
    members?.filter((member) => member.status === "approved") || [];
  const otherMembers =
    members?.filter(
      (member) => !["pending", "approved"].includes(member.status),
    ) || [];
  const newOrders =
    orders?.filter((order) => order.status === "new") || [];

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date(`${today}T12:00:00`));

  return (
    <main className="admin-page thv-admin-theme">
      <div className="shell admin-shell">
        <header className="admin-header">
          <div>
            <span className="eyebrow">Homegrown4Heroes administration</span>
            <h1>Community dashboard</h1>
            <p>{formattedDate}</p>
          </div>
          <Link
            className="button button-ghost"
            href="/the-happy-veteran/community"
          >
            Back to community
          </Link>
        </header>

        <section className="admin-stats" aria-label="Dashboard summary">
          <article>
            <span>Pending approval</span>
            <strong>{pendingMembers.length}</strong>
            <small>membership requests</small>
          </article>
          <article>
            <span>Approved members</span>
            <strong>{activeMembers.length}</strong>
            <small>active community members</small>
          </article>
          <article>
            <span>New orders</span>
            <strong>{newOrders.length}</strong>
            <small>waiting for review</small>
          </article>
          <article>
            <span>Shared Inventory</span>
            <strong>{inventoryItemCount}</strong>
            <small>current items</small>
          </article>
        </section>

        <section className="admin-management-grid" aria-label="Admin management pages">
          <Link className="admin-management-card" href="/the-happy-veteran/admin/inventory">
            <span className="community-label">Manage</span>
            <h2>Shared Inventory</h2>
            <p>Add, edit, and remove inventory categories and items on a dedicated page.</p>
            <strong>Open Inventory Manager →</strong>
          </Link>
          <Link className="admin-management-card" href="/the-happy-veteran/admin/lounge-experience">
            <span className="community-label">Manage</span>
            <h2>Lounge Experience</h2>
            <p>Update the suggested edible and flower experience values without scrolling through the dashboard.</p>
            <strong>Open Experience Manager →</strong>
          </Link>
        </section>

        <section className="admin-priority-grid">
          <section className="admin-card admin-membership-card">
            <div className="admin-card-header">
              <div>
                <span className="community-label">Priority queue</span>
                <h2>Membership requests</h2>
              </div>
              <span className="admin-count-badge">
                {pendingMembers.length} pending
              </span>
            </div>

            {pendingMembers.length ? (
              <div className="approval-list">
                {pendingMembers.map((member) => (
                  <article key={member.id}>
                    <div className="approval-avatar">
                      {(member.full_name || member.discord_name || "M").charAt(0)}
                    </div>
                    <div className="approval-details">
                      <strong>{member.full_name || "Unnamed member"}</strong>
                      <span>
                        Member ID: {member.member_id || "Not supplied"}
                      </span>
                      <span>
                        Discord: {member.discord_name || "Not supplied"}
                      </span>
                      <small>
                        Requested{" "}
                        {new Intl.DateTimeFormat("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }).format(new Date(member.created_at))}
                      </small>
                    </div>
                    <div className="approval-actions">
                      <form action={updateMember}>
                        <input type="hidden" name="id" value={member.id} />
                        <input
                          type="hidden"
                          name="status"
                          value="approved"
                        />
                        <button
                          className="button button-small"
                          type="submit"
                        >
                          Approve
                        </button>
                      </form>
                      <form action={updateMember}>
                        <input type="hidden" name="id" value={member.id} />
                        <input
                          type="hidden"
                          name="status"
                          value="rejected"
                        />
                        <button
                          className="button button-small button-danger"
                          type="submit"
                        >
                          Reject
                        </button>
                      </form>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="admin-empty-state">
                <strong>You&apos;re caught up.</strong>
                <p>There are no members waiting for approval.</p>
              </div>
            )}
          </section>

          <section className="admin-card">
            <div className="admin-card-header">
              <div>
                <span className="community-label">Quick access</span>
                <h2>The Happy Veteran</h2>
              </div>
            </div>
            <p>
              Use the community page to review member resources, community
              conversations, and the member ordering flow.
            </p>
            <Link
              className="button button-full"
              href="/the-happy-veteran/community"
            >
              Open Member Lounge
            </Link>
          </section>
        </section>

        <section className="admin-card orders-card">
          <div className="admin-card-header">
            <div>
              <span className="community-label">Order management</span>
              <h2>Recent member orders</h2>
            </div>
            <span className="admin-count-badge">
              {orders?.length || 0} shown
            </span>
          </div>

          <div className="admin-order-list">
            {orders?.length ? (
              orders.map((order) => (
                <article
                  key={order.id}
                  className={`admin-order status-border-${order.status}`}
                >
                  <div className="admin-order-topline">
                    <div>
                      <strong>
                        {order.profiles?.[0]?.full_name || "Member"}
                      </strong>
                      <span>
                        @{order.profiles?.[0]?.discord_name || "unknown"}
                      </span>
                    </div>
                    <time>
                      {new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      }).format(new Date(order.created_at))}
                    </time>
                  </div>

                  <div className="admin-order-body">
                    <div>
                      <span className="order-field-label">Items</span>
                      <p>{order.items}</p>
                      {order.notes && (
                        <>
                          <span className="order-field-label">Notes</span>
                          <p>{order.notes}</p>
                        </>
                      )}
                    </div>

                    <form
                      action={updateOrderStatus}
                      className="order-status-form"
                    >
                      <input type="hidden" name="id" value={order.id} />
                      <label>
                        Status
                        <select
                          name="status"
                          defaultValue={order.status}
                        >
                          <option value="new">New</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </label>
                      <button
                        className="button button-small"
                        type="submit"
                      >
                        Update
                      </button>
                    </form>
                  </div>

                  <small className="order-id">
                    Order #{order.id.slice(0, 8)}
                  </small>
                </article>
              ))
            ) : (
              <div className="admin-empty-state">
                <strong>No orders yet.</strong>
                <p>Submitted member orders will appear here.</p>
              </div>
            )}
          </div>
        </section>

        <section className="admin-card member-directory-card">
          <div className="admin-card-header">
            <div>
              <span className="community-label">Member records</span>
              <h2>Community directory</h2>
            </div>
            <span className="admin-count-badge">
              {members?.length || 0} total
            </span>
          </div>

          <div className="member-directory-table" role="table">
            {[...activeMembers, ...otherMembers].map((member) => (
              <article key={member.id} role="row">
                <div role="cell">
                  <strong>{member.full_name || "Unnamed member"}</strong>
                  <span>{member.discord_name || "No Discord name"}</span>
                </div>

                <span
                  className={`status-pill status-${member.status}`}
                  role="cell"
                >
                  {member.status}
                </span>

                <form
                  action={updateMemberRole}
                  role="cell"
                  className="member-role-form"
                >
                  <input type="hidden" name="id" value={member.id} />
                  <select
                    name="role"
                    defaultValue={member.role}
                    aria-label={`Role for ${
                      member.full_name || "member"
                    }`}
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    className="button button-small button-ghost"
                    type="submit"
                  >
                    Save Role
                  </button>
                </form>

                <form
                  action={updateMember}
                  role="cell"
                  className="member-status-form"
                >
                  <input type="hidden" name="id" value={member.id} />
                  <select
                    name="status"
                    defaultValue={member.status}
                    aria-label={`Status for ${
                      member.full_name || "member"
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="suspended">Suspended</option>
                  </select>
                  <button
                    className="button button-small button-ghost"
                    type="submit"
                  >
                    Save Status
                  </button>
                </form>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
