import type { PortalNavItem } from "@/components/portal/PortalSidebar";
import {
  LayoutDashboard,
  UserSquare2,
  Users,
  FileText,
  MailOpen,
  Clapperboard,
  GraduationCap,
  Briefcase,
  Bell,
  Settings,
} from "lucide-react";

export const ARTIST_NAV: PortalNavItem[] = [
  { title: "Dashboard", url: "/dashboard/artist", icon: LayoutDashboard, exact: true },
  { title: "My Portfolio", url: "/dashboard/artist/portfolio", icon: UserSquare2 },
  { title: "Theatre Groups", url: "/dashboard/artist/groups", icon: Users },
  { title: "Applications", url: "/dashboard/artist/applications", icon: FileText },
  { title: "Invitations", url: "/dashboard/artist/invitations", icon: MailOpen, badge: 2 },
  { title: "Productions", url: "/dashboard/artist/productions", icon: Clapperboard },
  { title: "Training & Certificates", url: "/dashboard/artist/training", icon: GraduationCap },
  { title: "Opportunities", url: "/dashboard/artist/opportunities", icon: Briefcase },
  { title: "Notifications", url: "/dashboard/artist/notifications", icon: Bell },
  { title: "Settings", url: "/dashboard/artist/settings", icon: Settings },
];
