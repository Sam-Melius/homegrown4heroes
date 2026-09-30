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
      const preferredOrder = [
        "house - flower",
        "house - concentrates",
        "house - pre-rolls",
        "house - edibles",
        "house - dispos",
        "flower - hybrid",
        "flower - indica",
        "flower - sativa",
        "concentrates",
        "edibles",
        "pre-rolls",
        "dispos",
      ];
      const normalize = (value: string) => value.trim().toLowerCase();
      const aIndex = preferredOrder.indexOf(normalize(a.name));
      const bIndex = preferredOrder.indexOf(normalize(b.name));

      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
    });

  const categoryId = (name: string, id: string) =>
    `inventory-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${id.slice(0, 6)}`;

  const normalize = (value: string) => value.trim().toLowerCase();
  const houseLabels: Record<string, string> = {
    "house - flower": "Flower",
    "house - concentrates": "Concentrates",
    "house - pre-rolls": "Prerolls",
    "house - prerolls": "Prerolls",
    "house - edibles": "Baked & Candies",
    "house - baked & candies": "Baked & Candies",
  };
  const nonInfusedNames = new Set(["chips", "drinks", "snacks"]);

  const houseCategories = inventory
    .filter((category) => houseLabels[normalize(category.name)])
    .sort((a, b) =>
      houseLabels[normalize(a.name)].localeCompare(houseLabels[normalize(b.name)], undefined, {
        sensitivity: "base",
      }),
    );

  const nonInfusedCategories = inventory
    .filter((category) => nonInfusedNames.has(normalize(category.name)))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));

  const directoryIds = new Set([
    ...houseCategories.map((category) => category.id),
    ...nonInfusedCategories.map((category) => category.id),
  ]);

  const otherCategories = inventory.filter((category) => !directoryIds.has(category.id));

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
          <>
            <nav className="inventory-tv-directory" aria-label="Inventory categories">
              {houseCategories.length ? (
                <section className="inventory-directory-group inventory-directory-house">
                  <h2>HOUSE</h2>
                  <div className="inventory-directory-links inventory-directory-links-house">
                    {houseCategories.map((category) => (
                      <a key={category.id} href={`#${categoryId(category.name, category.id)}`}>
                        {houseLabels[normalize(category.name)]}
                      </a>
                    ))}
                  </div>
                </section>
              ) : null}
              {nonInfusedCategories.length ? (
                <section className="inventory-directory-group">
                  <h2>Non-Infused</h2>
                  <div className="inventory-directory-links">
                    {nonInfusedCategories.map((category) => (
                      <a key={category.id} href={`#${categoryId(category.name, category.id)}`}>
                        {category.name}
                      </a>
                    ))}
                  </div>
                </section>
              ) : null}
              {otherCategories.length ? (
                <section className="inventory-directory-group inventory-directory-other">
                  <h2>More Categories</h2>
                  <div className="inventory-directory-links">
                    {otherCategories.map((category) => (
                      <a key={category.id} href={`#${categoryId(category.name, category.id)}`}>
                        {category.name}
                      </a>
                    ))}
                  </div>
                </section>
              ) : null}
            </nav>
            <div className="member-inventory-grid">
            {inventory.map((category) => (
              <section
                className={`member-inventory-category ${category.name.trim().toLowerCase().startsWith("house -") ? "house-inventory-category" : ""}`}
                id={categoryId(category.name, category.id)}
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
          </>
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
