import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole =
  | "admin"
  | "theatre_group"
  | "theatre_artist"
  | "audience"
  | "organization";

export type OrganizationType =
  | "corporate"
  | "university"
  | "tourism_board"
  | "film_ott";

export type AccountStatus = "active" | "pending" | "suspended";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  primary_role: AppRole;
  organization_type: OrganizationType | null;
  organization_name: string | null;
  status: AccountStatus;
}

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    setProfile((data as Profile | null) ?? null);
  };

  const refresh = async () => {
    const { data } = await supabase.auth.getSession();
    setSession(data.session);
    if (data.session?.user) {
      await loadProfile(data.session.user.id);
    } else {
      setProfile(null);
    }
  };

  useEffect(() => {
    // 1) Register listener FIRST — synchronous state, no awaits.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        // Defer supabase calls to avoid deadlocks in the callback.
        setTimeout(() => {
          loadProfile(newSession.user.id);
        }, 0);
      } else {
        setProfile(null);
      }
    });

    // 2) Then hydrate current session.
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) {
        loadProfile(data.session.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        profile,
        loading,
        refresh,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export const ROLE_LABELS: Record<AppRole, string> = {
  admin: "Administrator",
  theatre_group: "Theatre Group",
  theatre_artist: "Theatre Artist",
  audience: "Audience",
  organization: "Organization",
};

export const ORG_TYPE_LABELS: Record<OrganizationType, string> = {
  corporate: "Corporate",
  university: "University",
  tourism_board: "Tourism Board",
  film_ott: "Film & OTT",
};

export function dashboardPathForRole(role: AppRole): string {
  switch (role) {
    case "admin":
      return "/dashboard/admin";
    case "theatre_group":
      return "/dashboard/group";
    case "theatre_artist":
      return "/dashboard/artist";
    case "organization":
      return "/dashboard/organization";
    case "audience":
    default:
      return "/dashboard/audience";
  }
}
