import { createFileRoute } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { StatusScreen } from "@/components/auth/StatusScreen";

export const Route = createFileRoute("/access-denied")({
  head: () => ({
    meta: [
      { title: "Access denied — Mancha" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <StatusScreen
      tone="danger"
      icon={<ShieldAlert className="h-8 w-8" />}
      title="You don't have access to this stage"
      message="This area is reserved for a different role. If you believe you should have access, please contact an administrator."
      primary={{ label: "Return home", to: "/" }}
      secondary={{ label: "Back to sign in", to: "/login" }}
    />
  ),
});
