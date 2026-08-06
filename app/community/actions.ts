"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function approvedUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/the-happy-veteran/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("status, full_name, discord_name")
    .eq("id", user.id)
    .single();

  if (profile?.status !== "approved") redirect("/the-happy-veteran/pending");

  return { supabase, user, profile };
}

export async function submitMessage(formData: FormData) {
  const { supabase, user } = await approvedUser();
  const content = String(formData.get("content") ?? "").trim();
  const channelId = String(formData.get("channelId") ?? "");

  if (!content || content.length > 2000 || !channelId) return;

  await supabase.from("messages").insert({
    user_id: user.id,
    channel_id: channelId,
    content,
  });

  revalidatePath("/the-happy-veteran/community");
}

export type OrderSubmissionResult =
  | { success: true; mailtoUrl: string }
  | { success: false; message: string };

export async function submitOrder(formData: FormData): Promise<OrderSubmissionResult> {
  const { supabase, user, profile } = await approvedUser();
  const items = String(formData.get("items") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!items) {
    return { success: false, message: "Please list at least one item." };
  }

  const { data: order, error } = await supabase
    .from("orders")
    .insert({ user_id: user.id, items, notes })
    .select("id, created_at")
    .single();

  if (error || !order) {
    return {
      success: false,
      message: "The order could not be saved. Please try again.",
    };
  }

  const memberName = profile?.full_name || "Homegrown4Heroes member";
  const submittedAt = new Date(order.created_at).toLocaleString("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  });
  const subject = `New Homegrown4Heroes order - ${memberName}`;
  const body = [
    "New Homegrown4Heroes order",
    "",
    `Order ID: ${order.id}`,
    `Member: ${memberName}`,
    `Discord: ${profile?.discord_name || "Not supplied"}`,
    `Email: ${user.email || "Not supplied"}`,
    `Submitted: ${submittedAt}`,
    "",
    "Items:",
    items,
    "",
    "Notes:",
    notes || "None",
  ].join("\n");

  const mailtoUrl =
    `mailto:thvlynchburg@homegrown4heroes.org` +
    `?cc=${encodeURIComponent("jennifer@homegrown4heroes.org")}` +
    `&subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;

  revalidatePath("/the-happy-veteran/community");

  return { success: true, mailtoUrl };
}
