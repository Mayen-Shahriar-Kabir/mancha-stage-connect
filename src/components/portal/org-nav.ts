import type { PortalNavItem } from "@/components/portal/PortalSidebar";
import {
  LayoutDashboard,
  ClipboardList,
  Handshake,
  History,
  Settings,
  Sparkles,
  Video,
  Briefcase,
  Users,
  Building2,
  GraduationCap,
  CalendarDays,
} from "lucide-react";
import type { OrganizationType } from "@/hooks/use-auth";

const CORPORATE_NAV: PortalNavItem[] = [
  { title: "Dashboard", url: "/dashboard/organization", icon: LayoutDashboard, exact: true },
  { title: "Bookings", url: "/dashboard/organization/bookings", icon: ClipboardList },
  { title: "Sponsorships", url: "/dashboard/organization/sponsorships", icon: Handshake },
  { title: "History", url: "/dashboard/organization/history", icon: History },
  { title: "Settings", url: "/dashboard/organization/settings", icon: Settings },
];

const TOURISM_NAV: PortalNavItem[] = [
  { title: "Dashboard", url: "/dashboard/organization", icon: LayoutDashboard, exact: true },
  { title: "Bookings", url: "/dashboard/organization/bookings", icon: ClipboardList },
  { title: "Cultural Programs", url: "/dashboard/organization/cultural-programs", icon: Sparkles },
  { title: "History", url: "/dashboard/organization/history", icon: History },
  { title: "Settings", url: "/dashboard/organization/settings", icon: Settings },
];

const FILM_NAV: PortalNavItem[] = [
  { title: "Dashboard", url: "/dashboard/organization", icon: LayoutDashboard, exact: true },
  { title: "Auditions", url: "/dashboard/organization/auditions", icon: Video },
  { title: "Jobs", url: "/dashboard/organization/jobs", icon: Briefcase },
  { title: "Applications", url: "/dashboard/organization/applications", icon: Users },
  { title: "Settings", url: "/dashboard/organization/settings", icon: Settings },
];

const UNIVERSITY_NAV: PortalNavItem[] = [
  { title: "Dashboard", url: "/dashboard/organization", icon: LayoutDashboard, exact: true },
  { title: "Venue Booking", url: "/dashboard/organization/venues", icon: Building2 },
  { title: "Internships", url: "/dashboard/organization/internships", icon: GraduationCap },
  { title: "Campus Programs", url: "/dashboard/organization/campus-programs", icon: CalendarDays },
  { title: "Settings", url: "/dashboard/organization/settings", icon: Settings },
];

export function getOrgNav(type: OrganizationType | null | undefined): PortalNavItem[] {
  switch (type) {
    case "university":
      return UNIVERSITY_NAV;
    case "tourism_board":
      return TOURISM_NAV;
    case "film_ott":
      return FILM_NAV;
    case "corporate":
    default:
      return CORPORATE_NAV;
  }
}

// Kept for legacy imports; defaults to corporate.
export const ORG_NAV = CORPORATE_NAV;
