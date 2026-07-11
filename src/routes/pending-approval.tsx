import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Hourglass } from "lucide-react";
import { StatusScreen } from "@/components/auth/StatusScreen";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/pending-approval")({
  head: () => ({
    meta: [
      { title: "Awaiting approval — Mancha" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PendingApprovalPage,
});

function PendingApprovalPage() {
  const navigate = useNavigate();
  return (
    <StatusScreen
      tone="warning"
      icon={<Hourglass className="h-8 w-8" />}
      title="Awaiting administrator approval"
      message="Thanks for joining Mancha. Your account is currently under review by our team. We'll notify you by email as soon as it's approved — usually within a couple of business days."
      primary={{
        label: "Sign out",
        onClick: async () => {
          await supabase.auth.signOut();
          navigate({ to: "/login" });
        },
      }}
      secondary={{ label: "Return home", to: "/" }}
    />
  );
}
