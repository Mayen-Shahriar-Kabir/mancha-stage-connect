import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Clapperboard,
  HandCoins,
  Heart,
  GraduationCap,
  Briefcase,
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
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const NAV = [
  { title: "Dashboard", url: "/dashboard/group", icon: LayoutDashboard, exact: true },
  { title: "Members", url: "/dashboard/group/members", icon: Users },
  { title: "Productions", url: "/dashboard/group/productions", icon: Clapperboard },
  { title: "Funding", url: "/dashboard/group/funding", icon: HandCoins },
  { title: "Community", url: "/dashboard/group/community", icon: Heart },
  { title: "Learning", url: "/dashboard/group/learning", icon: GraduationCap },
  { title: "Opportunities", url: "/dashboard/group/opportunities", icon: Briefcase },
  { title: "Analytics", url: "/dashboard/group/analytics", icon: BarChart3 },
  { title: "Settings", url: "/dashboard/group/settings", icon: Settings },
] as const;

export function GroupSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isActive = (url: string, exact?: boolean) =>
    exact ? pathname === url : pathname === url || pathname.startsWith(url + "/");

  return (
    <Sidebar collapsible="icon" className="border-r border-border/60">
      <SidebarHeader className="border-b border-border/60">
        <Link to="/dashboard/group" className="flex items-center gap-2.5 px-2 py-1.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand text-brand-foreground shadow-gold">
            <span className="font-display text-lg leading-none">M</span>
          </span>
          {!collapsed && (
            <span className="flex flex-col leading-none">
              <span className="font-display text-lg">Mancha</span>
              <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Group Studio
              </span>
            </span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Studio</SidebarGroupLabel>
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
