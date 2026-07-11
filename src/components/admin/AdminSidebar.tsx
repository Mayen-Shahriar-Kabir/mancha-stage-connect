import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  UserCheck,
  Users,
  Clapperboard,
  HandCoins,
  CreditCard,
  Star,
  BarChart3,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const NAV = [
  { title: "Dashboard", url: "/dashboard/admin", icon: LayoutDashboard, exact: true },
  { title: "Approvals", url: "/dashboard/admin/approvals", icon: UserCheck, badge: "34" },
  { title: "Users", url: "/dashboard/admin/users", icon: Users },
  { title: "Productions", url: "/dashboard/admin/productions", icon: Clapperboard },
  { title: "Funding", url: "/dashboard/admin/funding", icon: HandCoins },
  { title: "Subscriptions", url: "/dashboard/admin/subscriptions", icon: CreditCard },
  { title: "Reviews", url: "/dashboard/admin/reviews", icon: Star },
  { title: "Reports", url: "/dashboard/admin/reports", icon: BarChart3 },
  { title: "Settings", url: "/dashboard/admin/settings", icon: Settings },
] as const;

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isActive = (url: string, exact?: boolean) =>
    exact ? pathname === url : pathname === url || pathname.startsWith(url + "/");

  return (
    <Sidebar collapsible="icon" className="border-r border-border/60">
      <SidebarHeader className="border-b border-border/60">
        <Link to="/dashboard/admin" className="flex items-center gap-2.5 px-2 py-1.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand text-brand-foreground shadow-gold">
            <span className="font-display text-lg leading-none">M</span>
          </span>
          {!collapsed && (
            <span className="flex flex-col leading-none">
              <span className="font-display text-lg">Mancha</span>
              <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Admin Console
              </span>
            </span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Operations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map((item) => {
                const active = isActive(item.url, item.exact);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                      <Link
                        to={item.url}
                        className="flex items-center gap-2"
                        data-active={active || undefined}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    {"badge" in item && item.badge && !collapsed ? (
                      <SidebarMenuBadge className="bg-brand/10 text-brand">
                        {item.badge}
                      </SidebarMenuBadge>
                    ) : null}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
