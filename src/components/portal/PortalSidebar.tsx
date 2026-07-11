import { Link, useRouterState } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
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

export type PortalNavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  exact?: boolean;
  badge?: string | number;
};

interface Props {
  brandLabel: string;
  groupLabel: string;
  homeUrl: string;
  items: PortalNavItem[];
}

export function PortalSidebar({ brandLabel, groupLabel, homeUrl, items }: Props) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isActive = (url: string, exact?: boolean) =>
    exact ? pathname === url : pathname === url || pathname.startsWith(url + "/");

  return (
    <Sidebar collapsible="icon" className="border-r border-border/60">
      <SidebarHeader className="border-b border-border/60">
        <Link to={homeUrl} className="flex items-center gap-2.5 px-2 py-1.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand text-brand-foreground shadow-gold">
            <span className="font-display text-lg leading-none">M</span>
          </span>
          {!collapsed && (
            <span className="flex flex-col leading-none">
              <span className="font-display text-lg">{brandLabel}</span>
              <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {groupLabel}
              </span>
            </span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
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
                        <span className="flex-1">{item.title}</span>
                        {item.badge != null && !collapsed ? (
                          <span className="ml-auto rounded-full bg-brand/10 px-1.5 py-0.5 text-[10px] font-semibold text-brand">
                            {item.badge}
                          </span>
                        ) : null}
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
