"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function adminClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, status")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" || profile.status !== "approved") {
    redirect("/community/hub");
  }
  return supabase;
}

export async function updateMember(formData: FormData) {
  const supabase = await adminClient();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "pending");
  if (!id || !["pending", "approved", "rejected", "suspended"].includes(status)) return;

  await supabase.from("profiles").update({ status }).eq("id", id);
  revalidatePath("/admin");
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

  revalidatePath("/admin");
  revalidatePath("/community/hub");
}

export async function updateOrderStatus(formData: FormData) {
  const supabase = await adminClient();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "new");
  if (!id || !["new", "reviewed", "completed", "cancelled"].includes(status)) return;

  await supabase.from("orders").update({ status }).eq("id", id);
  revalidatePath("/admin");
  revalidatePath("/community/hub");
}
