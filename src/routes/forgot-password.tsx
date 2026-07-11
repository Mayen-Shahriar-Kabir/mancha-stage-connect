import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, MailCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell } from "@/components/auth/AuthShell";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
});

type FormValues = z.infer<typeof schema>;

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset your password — Mancha" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      setSent(true);
      toast.success("Check your inbox for the reset link");
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <AuthShell title="Check your inbox" wide>
        <div className="flex flex-col items-center text-center">
          <div className="mb-5 grid h-16 w-16 place-items-center rounded-full bg-brand/10 text-brand">
            <MailCheck className="h-7 w-7" />
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            If an account exists for that email, we've sent a link to reset your password.
            The link expires in one hour.
          </p>
          <Button asChild className="mt-8 rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
            <Link to="/login">Back to sign in</Link>
          </Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Forgot your password?"
      subtitle="Enter the email you signed up with and we'll send you a reset link."
      footer={
        <Link to="/login" className="story-link text-muted-foreground">
          Back to sign in
        </Link>
      }
    >
      <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" {...form.register("email")} />
          {form.formState.errors.email && (
            <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
          )}
        </div>
        <Button
          type="submit"
          size="lg"
          disabled={submitting}
          className="w-full rounded-full bg-brand text-brand-foreground hover:bg-brand/90"
        >
          {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Send reset link
        </Button>
      </form>
    </AuthShell>
  );
}
