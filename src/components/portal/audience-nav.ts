import type { PortalNavItem } from "@/components/portal/PortalSidebar";
import {
  LayoutDashboard,
  Ticket,
  Heart,
  Crown,
  Users,
  CalendarDays,
  Star,
  Bell,
  Settings,
} from "lucide-react";

export const AUDIENCE_NAV: PortalNavItem[] = [
  { title: "Dashboard", url: "/dashboard/audience", icon: LayoutDashboard, exact: true },
  { title: "My Tickets", url: "/dashboard/audience/tickets", icon: Ticket, badge: 2 },
  { title: "Watchlist", url: "/dashboard/audience/watchlist", icon: Heart },
  { title: "Premium", url: "/dashboard/audience/premium", icon: Crown },
  { title: "Community", url: "/dashboard/audience/community", icon: Users },
  { title: "Meetups", url: "/dashboard/audience/meetups", icon: CalendarDays },
  { title: "Reviews", url: "/dashboard/audience/reviews", icon: Star },
  { title: "Notifications", url: "/dashboard/audience/notifications", icon: Bell },
  { title: "Settings", url: "/dashboard/audience/settings", icon: Settings },
];
