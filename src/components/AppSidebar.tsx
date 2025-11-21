import { NavLink } from "react-router-dom";
import {
  Rocket,
  BarChart3,
  FileText,
  Shield,
  FolderKanban,
  PlaySquare,
  Key,
  DollarSign,
  Settings,
  BookOpen,
  Users,
  Trophy,
} from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Getting Started", url: "/", icon: Rocket },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Logs", url: "/logs", icon: FileText },
  { title: "Policies", url: "/policies", icon: Shield },
  { title: "Projects", url: "/projects", icon: FolderKanban },
  { title: "Team", url: "/users", icon: Users },
  { title: "Leaderboard", url: "/leaderboard", icon: Trophy },
  { title: "Playground", url: "/playground", icon: PlaySquare },
  { title: "API Access", url: "/api-access", icon: Key },
  { title: "Pricing", url: "/pricing", icon: DollarSign },
  { title: "Settings", url: "/settings", icon: Settings },
];

const footerItems = [
  { title: "Documentation", url: "/documentation", icon: BookOpen },
];

export function AppSidebar() {
  const { state } = useSidebar();

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";

  return (
    <Sidebar className={state === "collapsed" ? "w-14" : "w-60"} collapsible="icon">
      <SidebarHeader>
        <NavLink to="/" className="flex items-center justify-center h-10">
          <Shield className="h-5 w-5" />
        </NavLink>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {state !== "collapsed" && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {footerItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink to={item.url} className={getNavCls}>
                  <item.icon className="h-4 w-4" />
                  {state !== "collapsed" && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
