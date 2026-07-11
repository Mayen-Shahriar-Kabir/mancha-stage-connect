/**
 * Client-side helpers for Mancha's core business modules.
 * Uses the browser Supabase client; RLS handles authorization.
 */
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Production = Database["public"]["Tables"]["productions"]["Row"];
export type ProductionInsert = Database["public"]["Tables"]["productions"]["Insert"];
export type ProductionUpdate = Database["public"]["Tables"]["productions"]["Update"];
export type Ticket = Database["public"]["Tables"]["tickets"]["Row"];
export type Campaign = Database["public"]["Tables"]["funding_campaigns"]["Row"];
export type Contribution = Database["public"]["Tables"]["funding_contributions"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];
export type Notification = Database["public"]["Tables"]["notifications"]["Row"];

export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") +
  "-" + Math.random().toString(36).slice(2, 7);

export const fmtBDT = (n: number) =>
  n >= 1_00_000 ? `৳${(n / 1_00_000).toFixed(1)}L` : `৳${Math.round(n).toLocaleString()}`;

/* ---------------- Productions ---------------- */
export async function listMyProductions(groupId: string) {
  const { data, error } = await supabase
    .from("productions").select("*").eq("group_id", groupId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function listPublishedProductions() {
  const { data, error } = await supabase
    .from("productions").select("*").eq("is_published", true)
    .order("show_date", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getProduction(id: string) {
  const { data, error } = await supabase.from("productions").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function createProduction(input: Omit<ProductionInsert, "slug"> & { title: string }) {
  const payload: ProductionInsert = { ...input, slug: slugify(input.title) };
  const { data, error } = await supabase.from("productions").insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function updateProduction(id: string, patch: ProductionUpdate) {
  const { data, error } = await supabase.from("productions").update(patch).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteProduction(id: string) {
  const { error } = await supabase.from("productions").delete().eq("id", id);
  if (error) throw error;
}

/* ---------------- Tickets ---------------- */
export async function bookTicket(productionId: string, userId: string, seatCount: number, unitPrice: number) {
  const booking_code = "MN-" + Math.random().toString(36).slice(2, 8).toUpperCase();
  const { data, error } = await supabase.from("tickets").insert({
    production_id: productionId,
    user_id: userId,
    seat_count: seatCount,
    unit_price: unitPrice,
    total_price: unitPrice * seatCount,
    booking_code,
    status: "confirmed",
  }).select().single();
  if (error) throw error;
  return data;
}

export async function cancelTicket(id: string) {
  const { error } = await supabase.from("tickets").update({ status: "cancelled" }).eq("id", id);
  if (error) throw error;
}

export async function listMyTickets(userId: string) {
  const { data, error } = await supabase
    .from("tickets").select("*, production:productions(*)").eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as (Ticket & { production: Production | null })[];
}

export async function listTicketsForGroup(groupId: string) {
  const { data, error } = await supabase
    .from("tickets").select("*, production:productions!inner(*)")
    .eq("production.group_id", groupId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as (Ticket & { production: Production })[];
}

/* ---------------- Funding ---------------- */
export async function listCampaigns() {
  const { data, error } = await supabase
    .from("funding_campaigns").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function listMyCampaigns(groupId: string) {
  const { data, error } = await supabase
    .from("funding_campaigns").select("*").eq("group_id", groupId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createCampaign(input: Database["public"]["Tables"]["funding_campaigns"]["Insert"]) {
  const { data, error } = await supabase.from("funding_campaigns").insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function contribute(campaignId: string, userId: string, amount: number, message?: string) {
  const { data, error } = await supabase.from("funding_contributions").insert({
    campaign_id: campaignId, user_id: userId, amount, message: message ?? null,
  }).select().single();
  if (error) throw error;
  return data;
}

export async function listMyContributions(userId: string) {
  const { data, error } = await supabase
    .from("funding_contributions").select("*, campaign:funding_campaigns(*)")
    .eq("user_id", userId).order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as (Contribution & { campaign: Campaign | null })[];
}

/* ---------------- Reviews ---------------- */
export async function listReviews(targetType: "production" | "group" | "training", targetId: string) {
  const { data, error } = await supabase
    .from("reviews").select("*")
    .eq("target_type", targetType).eq("target_id", targetId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function upsertReview(
  targetType: "production" | "group" | "training",
  targetId: string,
  userId: string,
  rating: number,
  comment: string,
) {
  const { data, error } = await supabase.from("reviews").upsert(
    { target_type: targetType, target_id: targetId, user_id: userId, rating, comment },
    { onConflict: "target_type,target_id,user_id" },
  ).select().single();
  if (error) throw error;
  return data;
}

export async function listMyReviews(userId: string) {
  const { data, error } = await supabase
    .from("reviews").select("*").eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

/* ---------------- Notifications ---------------- */
export async function listMyNotifications(userId: string) {
  const { data, error } = await supabase
    .from("notifications").select("*").eq("user_id", userId)
    .order("created_at", { ascending: false }).limit(50);
  if (error) throw error;
  return data ?? [];
}

export async function markNotificationRead(id: string) {
  await supabase.from("notifications").update({ read: true }).eq("id", id);
}

export async function markAllRead(userId: string) {
  await supabase.from("notifications").update({ read: true }).eq("user_id", userId).eq("read", false);
}

export async function pushNotification(
  userId: string,
  type: Notification["type"],
  title: string,
  body?: string,
  link?: string,
) {
  await supabase.from("notifications").insert({
    user_id: userId, type, title, body: body ?? null, link: link ?? null,
  });
}
