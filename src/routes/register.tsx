import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell } from "@/components/auth/AuthShell";

const schema = z
  .object({
    full_name: z.string().trim().min(2, "Please tell us your name").max(100),
    email: z.string().trim().email("Enter a valid email").max(255),
    phone: z.string().trim().max(30).optional().or(z.literal("")),
    password: z
      .string()
      .min(8, "At least 8 characters")
      .max(72, "Too long")
      .regex(/[A-Za-z]/, "Include a letter")
      .regex(/[0-9]/, "Include a number"),
    confirm: z.string(),
    role: z.enum(["audience", "theatre_group", "theatre_artist", "organization"]),
    organization_type: z
      .enum(["corporate", "university", "tourism_board", "film_ott"])
      .optional(),
    organization_name: z.string().trim().max(120).optional().or(z.literal("")),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  })
  .refine(
    (d) =>
      d.role !== "organization" ||
      (Boolean(d.organization_type) && Boolean(d.organization_name && d.organization_name.trim())),
    { message: "Organization type and name are required", path: ["organization_name"] },
  )
  .refine(
    (d) => d.role !== "theatre_group" || Boolean(d.organization_name && d.organization_name.trim()),
    { message: "Group name is required", path: ["organization_name"] },
  );

type FormValues = z.infer<typeof schema>;

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Join Mancha" },
      { name: "description", content: "Create your Mancha account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: RegisterPage,
});

const ROLE_OPTIONS = [
  { value: "audience", label: "Audience", hint: "Discover and attend theatre" },
  { value: "theatre_artist", label: "Theatre Artist", hint: "Performer, director, crew" },
  { value: "theatre_group", label: "Theatre Group", hint: "Companies and troupes" },
  { value: "organization", label: "Organization", hint: "Corporate, university, tourism, OTT" },
] as const;

const ORG_TYPE_OPTIONS = [
  { value: "corporate", label: "Corporate" },
  { value: "university", label: "University" },
  { value: "tourism_board", label: "Tourism Board" },
  { value: "film_ott", label: "Film & OTT" },
] as const;

function RegisterPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      password: "",
      confirm: "",
      role: "audience",
      organization_type: undefined,
      organization_name: "",
    },
  });

  const role = form.watch("role");

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: values.full_name,
            phone: values.phone || null,
            role: values.role,
            organization_type: values.role === "organization" ? values.organization_type : null,
            organization_name:
              values.role === "organization" || values.role === "theatre_group"
                ? values.organization_name
                : null,
          },
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      // If email confirmation is required, no session yet.
      if (!data.session) {
        if (values.role === "audience") {
          toast.success("Check your inbox to verify your email, then sign in.");
          navigate({ to: "/login" });
          return;
        }
        navigate({ to: "/registration-submitted" });
        return;
      }

      // Session created immediately (email confirm off).
      if (values.role === "audience") {
        toast.success("Welcome to Mancha");
        navigate({ to: "/dashboard/audience" });
      } else {
        navigate({ to: "/registration-submitted" });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Join the ecosystem"
      subtitle="Reserve your name on Bangladesh's digital stage."
      wide
      footer={
        <span className="text-muted-foreground">
          Already with us?{" "}
          <Link to="/login" className="story-link font-medium text-brand">
            Sign in
          </Link>
        </span>
      }
    >
      <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <div className="space-y-2">
          <Label>I am joining as</Label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {ROLE_OPTIONS.map((r) => {
              const active = role === r.value;
              return (
                <button
                  type="button"
                  key={r.value}
                  onClick={() => form.setValue("role", r.value, { shouldValidate: true })}
                  className={`rounded-2xl border p-3 text-left transition-all ${
                    active
                      ? "border-brand bg-brand/5 shadow-soft"
                      : "border-border hover:border-brand/40"
                  }`}
                >
                  <div className="text-sm font-medium text-foreground">{r.label}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{r.hint}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full name</Label>
            <Input id="full_name" autoComplete="name" {...form.register("full_name")} />
            {form.formState.errors.full_name && (
              <p className="text-xs text-destructive">{form.formState.errors.full_name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input id="phone" autoComplete="tel" {...form.register("phone")} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" {...form.register("email")} />
          {form.formState.errors.email && (
            <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
          )}
        </div>

        {(role === "organization" || role === "theatre_group") && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {role === "organization" && (
              <div className="space-y-2">
                <Label>Organization type</Label>
                <Select
                  value={form.watch("organization_type")}
                  onValueChange={(v) =>
                    form.setValue("organization_type", v as FormValues["organization_type"], {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ORG_TYPE_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className={`space-y-2 ${role === "organization" ? "" : "sm:col-span-2"}`}>
              <Label htmlFor="organization_name">
                {role === "organization" ? "Organization name" : "Group name"}
              </Label>
              <Input id="organization_name" {...form.register("organization_name")} />
              {form.formState.errors.organization_name && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.organization_name.message}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm password</Label>
            <Input
              id="confirm"
              type="password"
              autoComplete="new-password"
              {...form.register("confirm")}
            />
            {form.formState.errors.confirm && (
              <p className="text-xs text-destructive">{form.formState.errors.confirm.message}</p>
            )}
          </div>
        </div>

        {role !== "audience" && (
          <div className="rounded-xl border border-accent/30 bg-accent/5 p-3 text-xs text-muted-foreground">
            Non-audience accounts require administrator approval before you can access your
            dashboard. You'll receive a notification once reviewed.
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={submitting}
          className="w-full rounded-full bg-brand text-brand-foreground hover:bg-brand/90"
        >
          {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Create account
        </Button>
      </form>
    </AuthShell>
  );
}
