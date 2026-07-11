import type { PortalNavItem } from "@/components/portal/PortalSidebar";
import {
  LayoutDashboard,
  Handshake,
  CalendarDays,
  ClipboardList,
  Megaphone,
  BarChart3,
  Bell,
  Settings,
} from "lucide-react";

export const ORG_NAV: PortalNavItem[] = [
  { title: "Dashboard", url: "/dashboard/organization", icon: LayoutDashboard, exact: true },
  { title: "Collaborations", url: "/dashboard/organization/collaborations", icon: Handshake },
  { title: "Events", url: "/dashboard/organization/events", icon: CalendarDays },
  { title: "Bookings", url: "/dashboard/organization/bookings", icon: ClipboardList },
  { title: "Opportunities", url: "/dashboard/organization/opportunities", icon: Megaphone },
  { title: "Analytics", url: "/dashboard/organization/analytics", icon: BarChart3 },
  { title: "Notifications", url: "/dashboard/organization/notifications", icon: Bell },
  { title: "Settings", url: "/dashboard/organization/settings", icon: Settings },
];
