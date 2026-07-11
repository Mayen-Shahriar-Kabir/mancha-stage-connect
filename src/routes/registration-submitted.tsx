import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { StatusScreen } from "@/components/auth/StatusScreen";

export const Route = createFileRoute("/registration-submitted")({
  head: () => ({
    meta: [
      { title: "Registration submitted — Mancha" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <StatusScreen
      icon={<CheckCircle2 className="h-8 w-8" />}
      title="Registration submitted"
      message="Your account is currently under administrator review. You will receive access once your registration has been approved. In the meantime, please verify your email using the link we just sent."
      primary={{ label: "Back to sign in", to: "/login" }}
      secondary={{ label: "Return home", to: "/" }}
    />
  ),
});
