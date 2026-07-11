import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell } from "@/components/auth/AuthShell";
import { dashboardPathForRole, type AppRole, type AccountStatus } from "@/hooks/use-auth";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(6, "At least 6 characters"),
  remember: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>) => ({
    redirect: typeof s.redirect === "string" ? s.redirect : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign in — Mancha" },
      { name: "description", content: "Sign in to your Mancha account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/login" });
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", remember: true },
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        if (error.message.toLowerCase().includes("email not confirmed")) {
          toast.error("Please verify your email before signing in.");
        } else {
          toast.error(error.message || "Invalid email or password");
        }
        return;
      }

      // "Remember me" — if unchecked, clear session on tab close.
      if (!values.remember && typeof window !== "undefined") {
        try {
          const raw = window.localStorage.getItem("sb-auth-token") ?? null;
          // Move the auth token to sessionStorage so it dies with the tab.
          const keys = Object.keys(window.localStorage).filter((k) => k.startsWith("sb-"));
          for (const k of keys) {
            const v = window.localStorage.getItem(k);
            if (v) window.sessionStorage.setItem(k, v);
            window.localStorage.removeItem(k);
          }
          void raw;
        } catch {
          /* ignore */
        }
      }

      // Fetch profile to know status + role for routing.
      const { data: profile } = await supabase
        .from("profiles")
        .select("primary_role, status")
        .eq("id", data.user!.id)
        .maybeSingle();

      const status = (profile?.status ?? "pending") as AccountStatus;
      const role = (profile?.primary_role ?? "audience") as AppRole;

      if (status === "suspended") {
        navigate({ to: "/suspended" });
        return;
      }
      if (status === "pending") {
        navigate({ to: "/pending-approval" });
        return;
      }

      toast.success("Welcome back to Mancha");
      navigate({ to: redirect ?? dashboardPathForRole(role) });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue to your stage."
      footer={
        <span className="text-muted-foreground">
          New to Mancha?{" "}
          <Link to="/register" className="story-link font-medium text-brand">
            Create an account
          </Link>
        </span>
      }
    >
      <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@stage.com"
            aria-invalid={!!form.formState.errors.email}
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-brand hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            aria-invalid={!!form.formState.errors.password}
            {...form.register("password")}
          />
          {form.formState.errors.password && (
            <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
          )}
        </div>

        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <Checkbox
            defaultChecked
            onCheckedChange={(v) => form.setValue("remember", Boolean(v))}
          />
          Remember me on this device
        </label>

        <Button
          type="submit"
          size="lg"
          disabled={submitting}
          className="w-full rounded-full bg-brand text-brand-foreground hover:bg-brand/90"
        >
          {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Sign in
        </Button>
      </form>
    </AuthShell>
  );
}
