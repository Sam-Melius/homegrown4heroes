import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  addInventoryCategory,
  addInventoryItem,
  deleteInventoryCategory,
  deleteInventoryItem,
  updateInventoryCategory,
  updateInventoryItem,
  updateMember,
  updateMemberRole,
  updateOrderStatus,
  updateEdibleExperienceTime,
  updateFlowerExperienceTime,
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
      .select("id, full_name, discord_name, status, role, created_at")
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

  const [{ data: edibleTimes }, { data: flowerTimes }] = await Promise.all([
    supabase
      .from("lounge_edible_times")
      .select("id, label, minutes, position")
      .order("position", { ascending: true }),
    supabase
      .from("lounge_flower_times")
      .select("id, rating, minutes_1, minutes_2, minutes_3, minutes_4, position")
      .order("position", { ascending: true }),
  ]);

  const inventory = (inventoryData || []) as InventoryCategory[];
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

        <section className="admin-card inventory-manager-card">
          <div className="admin-card-header">
            <div>
              <span className="community-label">Member lounge</span>
              <h2>Shared Inventory</h2>
            </div>
            <Link
              className="button button-small button-ghost"
              href="/the-happy-veteran/shared-inventory"
            >
              View Member Page
            </Link>
          </div>

          <div className="inventory-add-category">
            <form action={addInventoryCategory}>
              <label>
                Add category
                <div className="inventory-inline-form">
                  <input
                    name="name"
                    placeholder="Example: Flower"
                    required
                  />
                  <button className="button button-small" type="submit">
                    Add Category
                  </button>
                </div>
              </label>
            </form>
          </div>

          {inventory.length ? (
            <div className="inventory-admin-list">
              {inventory.map((category) => (
                <section className="inventory-admin-category" key={category.id}>
                  <div className="inventory-category-admin-header">
                    <form
                      action={updateInventoryCategory}
                      className="inventory-category-name-form"
                    >
                      <input type="hidden" name="id" value={category.id} />
                      <input
                        name="name"
                        defaultValue={category.name}
                        aria-label={`Category name for ${category.name}`}
                        required
                      />
                      <button
                        className="button button-small button-ghost"
                        type="submit"
                      >
                        Save Name
                      </button>
                    </form>

                    <form action={deleteInventoryCategory}>
                      <input type="hidden" name="id" value={category.id} />
                      <button
                        className="button button-small button-danger"
                        type="submit"
                      >
                        Delete Category
                      </button>
                    </form>
                  </div>

                  <div className="inventory-admin-items">
                    {category.inventory_items?.length ? (
                      category.inventory_items.map((item) => (
                        <article className="inventory-admin-item" key={item.id}>
                          <form
                            action={updateInventoryItem}
                            className="inventory-item-edit-form"
                          >
                            <input type="hidden" name="id" value={item.id} />

                            <label>
                              Item
                              <input
                                name="name"
                                defaultValue={item.name}
                                required
                              />
                            </label>

                            <label>
                              Details
                              <input
                                name="details"
                                defaultValue={item.details || ""}
                                placeholder="Optional"
                              />
                            </label>

                            <button
                              className="button button-small button-ghost"
                              type="submit"
                            >
                              Save
                            </button>
                          </form>

                          <form action={deleteInventoryItem}>
                            <input type="hidden" name="id" value={item.id} />
                            <button
                              className="inventory-delete-link"
                              type="submit"
                            >
                              Delete
                            </button>
                          </form>
                        </article>
                      ))
                    ) : (
                      <div className="inventory-category-empty">
                        No items in this category yet.
                      </div>
                    )}
                  </div>

                  <form
                    action={addInventoryItem}
                    className="inventory-add-item-form"
                  >
                    <input
                      type="hidden"
                      name="categoryId"
                      value={category.id}
                    />
                    <div>
                      <label>
                        New item
                        <input name="name" placeholder="Item name" required />
                      </label>
                    </div>
                    <div>
                      <label>
                        Details
                        <input
                          name="details"
                          placeholder="Optional details"
                        />
                      </label>
                    </div>
                    <button className="button button-small" type="submit">
                      Add Item
                    </button>
                  </form>
                </section>
              ))}
            </div>
          ) : (
            <div className="admin-empty-state">
              <strong>No inventory categories yet.</strong>
              <p>Add the first category above.</p>
            </div>
          )}
        </section>


        <section className="admin-card lounge-experience-admin-card">
          <div className="admin-card-header">
            <div>
              <span className="community-label">Member lounge</span>
              <h2>Suggested Lounge Experience</h2>
            </div>
            <Link
              className="button button-small button-ghost"
              href="/the-happy-veteran/lounge-experience"
            >
              View Member Page
            </Link>
          </div>

          <div className="experience-admin-grid">
            <section>
              <h3>Edibles</h3>
              <div className="experience-admin-list">
                {(edibleTimes || []).map((item) => (
                  <form
                    action={updateEdibleExperienceTime}
                    className="experience-edible-admin-row"
                    key={item.id}
                  >
                    <input type="hidden" name="id" value={item.id} />
                    <label>
                      Label
                      <input name="label" defaultValue={item.label} required />
                    </label>
                    <label>
                      Minutes
                      <input
                        name="minutes"
                        type="number"
                        min="0"
                        step="1"
                        defaultValue={item.minutes}
                        required
                      />
                    </label>
                    <button className="button button-small button-ghost" type="submit">
                      Save
                    </button>
                  </form>
                ))}
              </div>
            </section>

            <section>
              <h3>Flower</h3>
              <p className="admin-form-note">
                Edit the four minute values shown for each flower rating.
              </p>
              <div className="experience-admin-list">
                {(flowerTimes || []).map((item) => (
                  <form
                    action={updateFlowerExperienceTime}
                    className="experience-flower-admin-row"
                    key={item.id}
                  >
                    <input type="hidden" name="id" value={item.id} />
                    <label className="experience-rating-field">
                      Rating
                      <input name="rating" defaultValue={item.rating} required />
                    </label>
                    {[item.minutes_1, item.minutes_2, item.minutes_3, item.minutes_4].map(
                      (value, index) => (
                        <label key={index}>
                          Min {index + 1}
                          <input
                            name={`minutes${index + 1}`}
                            type="number"
                            min="0"
                            step="1"
                            defaultValue={value}
                            required
                          />
                        </label>
                      ),
                    )}
                    <button className="button button-small button-ghost" type="submit">
                      Save
                    </button>
                  </form>
                ))}
              </div>
            </section>
          </div>
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
