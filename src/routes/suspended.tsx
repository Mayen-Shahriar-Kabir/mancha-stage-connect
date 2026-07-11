import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Ban } from "lucide-react";
import { StatusScreen } from "@/components/auth/StatusScreen";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/suspended")({
  head: () => ({
    meta: [
      { title: "Account suspended — Mancha" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SuspendedPage,
});

function SuspendedPage() {
  const navigate = useNavigate();
  return (
    <StatusScreen
      tone="danger"
      icon={<Ban className="h-8 w-8" />}
      title="Account suspended"
      message="Your Mancha account has been suspended. If you believe this is a mistake, please contact our support team so we can help resolve the issue."
      primary={{ label: "Contact support", to: "/contact" }}
      secondary={{
        label: "Sign out",
        onClick: async () => {
          await supabase.auth.signOut();
          navigate({ to: "/login" });
        },
      }}
    />
  );
}
