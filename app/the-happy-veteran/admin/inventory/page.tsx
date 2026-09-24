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
} from "@/app/admin/actions";

type InventoryItem = { id: string; name: string; details: string | null; position: number };
type InventoryCategory = { id: string; name: string; position: number; inventory_items: InventoryItem[] | null };

function categoryAnchor(name: string, id: string) {
  const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `inventory-${slug || id}`;
}

const preferredOrder = [
  "house - flower", "house - concentrates", "house - pre-rolls", "house - edibles", "house - dispos",
  "flower - hybrid", "flower - indica", "flower - sativa", "concentrates", "edibles", "pre-rolls", "dispos",
];

export default async function InventoryAdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/the-happy-veteran/login");
  const { data: current } = await supabase.from("profiles").select("role, status").eq("id", user.id).single();
  if (current?.role !== "admin" || current.status !== "approved") redirect("/the-happy-veteran/community");

  const { data } = await supabase.from("inventory_categories")
    .select("id, name, position, inventory_items(id, name, details, position)");
  const inventory = ((data || []) as InventoryCategory[]).map((category) => ({
    ...category,
    inventory_items: category.inventory_items ? [...category.inventory_items].sort((a,b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" })) : null,
  })).sort((a,b) => {
    const ai=preferredOrder.indexOf(a.name.trim().toLowerCase());
    const bi=preferredOrder.indexOf(b.name.trim().toLowerCase());
    if(ai!==-1 && bi!==-1) return ai-bi;
    if(ai!==-1) return -1;
    if(bi!==-1) return 1;
    return a.name.localeCompare(b.name, undefined, { sensitivity:"base" });
  });

  return <main className="admin-page thv-admin-theme"><div className="shell admin-shell">
    <div id="inventory-manager-top" />
    <header className="admin-header"><div><span className="eyebrow">Homegrown4Heroes administration</span><h1>Shared Inventory Manager</h1><p>Manage categories and items without scrolling through the main dashboard.</p></div><div className="actions"><Link className="button button-ghost" href="/the-happy-veteran/admin">Admin Dashboard</Link><Link className="button button-ghost" href="/the-happy-veteran/shared-inventory">View Member Page</Link></div></header>
    {inventory.length ? <nav className="admin-card inventory-admin-jump" aria-label="Quick jump to inventory category">
      <div className="inventory-admin-jump-heading"><div><span className="eyebrow">Quick navigation</span><h2>Jump to section</h2></div><a className="inventory-top-link" href="#inventory-manager-bottom">Go to bottom ↓</a></div>
      <div className="inventory-admin-jump-grid">{inventory.map((category) => <a key={category.id} href={`#${categoryAnchor(category.name, category.id)}`}>{category.name}</a>)}</div>
    </nav> : null}
    <section className="admin-card inventory-manager-card">
      <div className="inventory-add-category"><form action={addInventoryCategory}><label>Add category<div className="inventory-inline-form"><input name="name" placeholder="Example: HOUSE - Flower" required/><button className="button button-small" type="submit">Add Category</button></div></label></form></div>
      {inventory.length ? <div className="inventory-admin-list">{inventory.map((category)=><section className="inventory-admin-category" id={categoryAnchor(category.name, category.id)} key={category.id}>
        <div className="inventory-category-admin-header"><form action={updateInventoryCategory} className="inventory-category-name-form"><input type="hidden" name="id" value={category.id}/><input name="name" defaultValue={category.name} aria-label={`Category name for ${category.name}`} required/><button className="button button-small button-ghost" type="submit">Save Name</button></form><form action={deleteInventoryCategory}><input type="hidden" name="id" value={category.id}/><button className="button button-small button-danger" type="submit">Delete Category</button></form></div><form action={addInventoryItem} className="inventory-add-item-form"><input type="hidden" name="categoryId" value={category.id}/><div><label>New item<input name="name" placeholder="Item name" required/></label></div><div><label>Details<input name="details" placeholder="Optional details"/></label></div><button className="button button-small" type="submit">Add Item</button></form>
        <div className="inventory-admin-items">{category.inventory_items?.length ? category.inventory_items.map((item)=><article className="inventory-admin-item" key={item.id}><form action={updateInventoryItem} className="inventory-item-edit-form"><input type="hidden" name="id" value={item.id}/><label>Item<input name="name" defaultValue={item.name} required/></label><label>Details<input name="details" defaultValue={item.details || ""} placeholder="Optional"/></label><button className="button button-small button-ghost" type="submit">Save</button></form><form action={deleteInventoryItem}><input type="hidden" name="id" value={item.id}/><button className="inventory-delete-link" type="submit">Delete</button></form></article>) : <div className="inventory-category-empty">No items in this category yet.</div>}</div>
        
      </section>)}</div> : <div className="admin-empty-state"><strong>No inventory categories yet.</strong><p>Add the first category above.</p></div>}
    </section>
    <div id="inventory-manager-bottom" className="inventory-manager-bottom">
      <a className="button button-ghost inventory-return-top" href="#inventory-manager-top">↑ Return to top</a>
    </div>
  </div></main>;
}
