"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function adminClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/the-happy-veteran/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, status")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" || profile.status !== "approved") {
    redirect("/the-happy-veteran/community");
  }
  return supabase;
}

export async function updateMember(formData: FormData) {
  const supabase = await adminClient();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "pending");
  if (!id || !["pending", "approved", "rejected", "suspended"].includes(status)) return;

  await supabase.from("profiles").update({ status }).eq("id", id);
  revalidatePath("/the-happy-veteran/admin");
}


export async function updateMemberRole(formData: FormData) {
  const supabase = await adminClient();
  const id = String(formData.get("id") ?? "");
  const role = String(formData.get("role") ?? "member");

  if (!id || !["member", "admin"].includes(role)) return;

  await supabase.from("profiles").update({ role }).eq("id", id);
  revalidatePath("/the-happy-veteran/admin");
}

export async function saveMenu(formData: FormData) {
  const supabase = await adminClient();
  const menuDate = String(formData.get("menuDate") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const deadline = String(formData.get("deadline") ?? "").trim() || null;
  if (!menuDate || !title || !content) return;

  await supabase
    .from("daily_menus")
    .upsert(
      { menu_date: menuDate, title, content, order_deadline: deadline },
      { onConflict: "menu_date" }
    );

  revalidatePath("/the-happy-veteran/admin");
  revalidatePath("/the-happy-veteran/community");
}

export async function updateOrderStatus(formData: FormData) {
  const supabase = await adminClient();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "new");
  if (!id || !["new", "reviewed", "completed", "cancelled"].includes(status)) return;

  await supabase.from("orders").update({ status }).eq("id", id);
  revalidatePath("/the-happy-veteran/admin");
  revalidatePath("/the-happy-veteran/community");
}


export async function saveSharedInventory(formData: FormData) {
  const supabase = await adminClient();
  const title = String(formData.get("title") ?? "Shared Inventory").trim() || "Shared Inventory";
  const content = String(formData.get("content") ?? "").trim();

  await supabase
    .from("shared_inventory")
    .upsert(
      {
        id: 1,
        title,
        content,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

  revalidatePath("/the-happy-veteran/admin");
  revalidatePath("/the-happy-veteran/shared-inventory");
}


export async function addInventoryCategory(formData: FormData) {
  const supabase = await adminClient();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const { data: last } = await supabase
    .from("inventory_categories")
    .select("position")
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  await supabase.from("inventory_categories").insert({
    name,
    position: (last?.position ?? 0) + 1,
  });

  revalidatePath("/the-happy-veteran/admin");
  revalidatePath("/the-happy-veteran/shared-inventory");
}

export async function updateInventoryCategory(formData: FormData) {
  const supabase = await adminClient();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!id || !name) return;

  await supabase.from("inventory_categories").update({ name }).eq("id", id);
  revalidatePath("/the-happy-veteran/admin");
  revalidatePath("/the-happy-veteran/shared-inventory");
}

export async function deleteInventoryCategory(formData: FormData) {
  const supabase = await adminClient();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await supabase.from("inventory_categories").delete().eq("id", id);
  revalidatePath("/the-happy-veteran/admin");
  revalidatePath("/the-happy-veteran/shared-inventory");
}

export async function addInventoryItem(formData: FormData) {
  const supabase = await adminClient();
  const categoryId = String(formData.get("categoryId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const details = String(formData.get("details") ?? "").trim() || null;
  if (!categoryId || !name) return;

  const { data: last } = await supabase
    .from("inventory_items")
    .select("position")
    .eq("category_id", categoryId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  await supabase.from("inventory_items").insert({
    category_id: categoryId,
    name,
    details,
    position: (last?.position ?? 0) + 1,
  });

  revalidatePath("/the-happy-veteran/admin");
  revalidatePath("/the-happy-veteran/shared-inventory");
}

export async function updateInventoryItem(formData: FormData) {
  const supabase = await adminClient();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const details = String(formData.get("details") ?? "").trim() || null;
  if (!id || !name) return;

  await supabase
    .from("inventory_items")
    .update({
      name,
      details,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  revalidatePath("/the-happy-veteran/admin");
  revalidatePath("/the-happy-veteran/shared-inventory");
}

export async function deleteInventoryItem(formData: FormData) {
  const supabase = await adminClient();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await supabase.from("inventory_items").delete().eq("id", id);
  revalidatePath("/the-happy-veteran/admin");
  revalidatePath("/the-happy-veteran/shared-inventory");
}


export async function updateEdibleExperienceTime(formData: FormData) {
  const supabase = await adminClient();
  const id = String(formData.get("id") ?? "");
  const label = String(formData.get("label") ?? "").trim();
  const minutes = Number(formData.get("minutes"));

  if (!id || !label || !Number.isInteger(minutes) || minutes < 0) return;

  await supabase
    .from("lounge_edible_times")
    .update({
      label,
      minutes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  revalidatePath("/the-happy-veteran/admin");
  revalidatePath("/the-happy-veteran/lounge-experience");
}

export async function updateFlowerExperienceTime(formData: FormData) {
  const supabase = await adminClient();
  const id = String(formData.get("id") ?? "");
  const rating = String(formData.get("rating") ?? "").trim();
  const values = [1, 2, 3, 4].map((index) =>
    Number(formData.get(`minutes${index}`))
  );

  if (
    !id ||
    !rating ||
    values.some((value) => !Number.isInteger(value) || value < 0)
  ) return;

  await supabase
    .from("lounge_flower_times")
    .update({
      rating,
      minutes_1: values[0],
      minutes_2: values[1],
      minutes_3: values[2],
      minutes_4: values[3],
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  revalidatePath("/the-happy-veteran/admin");
  revalidatePath("/the-happy-veteran/lounge-experience");
}
