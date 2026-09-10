import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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

export default async function SharedInventoryPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/the-happy-veteran/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("status")
    .eq("id", user.id)
    .single();

  if (profile?.status !== "approved") {
    redirect("/the-happy-veteran/pending");
  }

  const { data } = await supabase
    .from("inventory_categories")
    .select("id, name, position, inventory_items(id, name, details, position)")
    .order("position", { ascending: true })
    .order("position", {
      referencedTable: "inventory_items",
      ascending: true,
    });

  const inventory = ((data || []) as InventoryCategory[])
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

  return (
    <main className="shared-inventory-page thv-subpage-theme">
      <div className="shell shared-inventory-shell">
        <Link
          className="text-link"
          href="/the-happy-veteran/community"
        >
          ← Back to The Happy Veteran
        </Link>

        <header className="shared-inventory-header">
          <span className="eyebrow">Members only</span>
          <h1>Shared Inventory</h1>
        </header>

        {inventory.length ? (
          <div className="member-inventory-grid">
            {inventory.map((category) => (
              <section
                className="member-inventory-category"
                key={category.id}
              >
                <h2>{category.name}</h2>

                {category.inventory_items?.length ? (
                  <div className="member-inventory-items">
                    {category.inventory_items.map((item) => (
                      <article key={item.id}>
                        <strong>{item.name}</strong>
                        {item.details && <span>{item.details}</span>}
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="inventory-empty-category">
                    No items currently listed.
                  </p>
                )}
              </section>
            ))}
          </div>
        ) : (
          <div className="admin-empty-state">
            <strong>No inventory has been posted yet.</strong>
            <p>Check back later for an updated shared inventory.</p>
          </div>
        )}
      </div>
    </main>
  );
}
