import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type DemoAccountSpec = {
  email: string;
  password: string;
  role: "admin" | "theatre_group" | "theatre_artist" | "audience" | "organization";
  organization_type?: "corporate" | "university" | "tourism_board" | "film_ott";
  full_name: string;
  organization_name?: string;
  label: string;
};

export const DEMO_ACCOUNTS: DemoAccountSpec[] = [
  { label: "Admin", email: "admin@mancha.demo", password: "1234", role: "admin", full_name: "Mancha Admin" },
  { label: "Theatre Group", email: "group@mancha.demo", password: "1234", role: "theatre_group", full_name: "Demo Theatre Group", organization_name: "Demo Repertory" },
  { label: "Theatre Artist", email: "artist@mancha.demo", password: "1234", role: "theatre_artist", full_name: "Demo Artist" },
  { label: "Audience", email: "audience@mancha.demo", password: "1234", role: "audience", full_name: "Demo Audience" },
  { label: "University", email: "university@mancha.demo", password: "1234", role: "organization", organization_type: "university", full_name: "Demo University", organization_name: "Demo University of the Arts" },
  { label: "Corporate", email: "corporate@mancha.demo", password: "1234", role: "organization", organization_type: "corporate", full_name: "Demo Corporate", organization_name: "Demo Holdings Ltd." },
  { label: "Tourism Board", email: "tourism@mancha.demo", password: "1234", role: "organization", organization_type: "tourism_board", full_name: "Demo Tourism", organization_name: "Demo Tourism Board" },
  { label: "Film & OTT", email: "film@mancha.demo", password: "1234", role: "organization", organization_type: "film_ott", full_name: "Demo Studios", organization_name: "Demo OTT Studios" },
];

export type SeedResult = {
  email: string;
  status: "created" | "updated" | "existed" | "error";
  message?: string;
};

async function ensureAdmin(supabase: any, userId: string) {
  const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (!data) throw new Error("Forbidden: admin only");
}

export const seedDemoAccounts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<SeedResult[]> => {
    await ensureAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const results: SeedResult[] = [];

    for (const acct of DEMO_ACCOUNTS) {
      try {
        let userId: string | null = null;
        let created = false;

        const { data: createData, error: createErr } = await supabaseAdmin.auth.admin.createUser({
          email: acct.email,
          password: acct.password,
          email_confirm: true,
          user_metadata: {
            full_name: acct.full_name,
            role: acct.role === "admin" ? "audience" : acct.role, // trigger blocks admin
            organization_type: acct.organization_type ?? null,
            organization_name: acct.organization_name ?? null,
          },
        });

        if (createErr) {
          // Likely already exists — find them
          const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
          const existing = list?.users.find((u) => u.email?.toLowerCase() === acct.email.toLowerCase());
          if (!existing) {
            results.push({ email: acct.email, status: "error", message: createErr.message });
            continue;
          }
          userId = existing.id;
          // Reset password to demo value in case it drifted
          await supabaseAdmin.auth.admin.updateUserById(userId, {
            password: acct.password,
            email_confirm: true,
          });
        } else {
          userId = createData.user!.id;
          created = true;
        }

        // Ensure profile exists (trigger should have created it on insert; upsert for safety)
        const profilePatch: Record<string, unknown> = {
          id: userId,
          email: acct.email,
          full_name: acct.full_name,
          primary_role: acct.role,
          organization_type: acct.role === "organization" ? acct.organization_type ?? null : null,
          organization_name:
            acct.role === "organization" || acct.role === "theatre_group"
              ? acct.organization_name ?? null
              : null,
          status: "active", // all demo accounts pre-approved
        };

        await supabaseAdmin.from("profiles").upsert(profilePatch, { onConflict: "id" });

        // Ensure a single correct role row
        await supabaseAdmin.from("user_roles").delete().eq("user_id", userId);
        await supabaseAdmin.from("user_roles").insert({ user_id: userId, role: acct.role });

        results.push({ email: acct.email, status: created ? "created" : "updated" });
      } catch (e: any) {
        results.push({ email: acct.email, status: "error", message: e?.message ?? String(e) });
      }
    }

    return results;
  });

export const getDemoAccountStatuses = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const emails = DEMO_ACCOUNTS.map((d) => d.email);
    const { data } = await supabaseAdmin
      .from("profiles")
      .select("email,status,primary_role")
      .in("email", emails);
    return (data ?? []) as { email: string; status: string; primary_role: string }[];
  });
