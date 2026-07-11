import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  component: AuthenticatedLayout,
});

const STATUS_ROUTES = new Set([
  "/pending-approval",
  "/suspended",
  "/access-denied",
]);

function AuthenticatedLayout() {
  const { loading, session, profile } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (loading) return;
    if (!session) {
      navigate({ to: "/login", search: { redirect: pathname }, replace: true });
      return;
    }
    if (!profile) return; // waiting for profile fetch
    if (STATUS_ROUTES.has(pathname)) return;
    if (profile.status === "suspended") {
      navigate({ to: "/suspended", replace: true });
      return;
    }
    if (profile.status === "pending") {
      navigate({ to: "/pending-approval", replace: true });
    }
  }, [loading, session, profile, pathname, navigate]);

  if (loading || !session || !profile) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  return <Outlet />;
}
