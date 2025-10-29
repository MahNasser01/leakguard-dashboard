import { ReactNode } from "react";
import { UserButton } from "@clerk/clerk-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 bg-background">
          <div className="border-b bg-card">
            <div className="flex h-14 items-center justify-between px-6">
              <div className="flex items-center gap-3">
                <SidebarTrigger />
                <Link to="/" className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-primary" />
                  <span className="text-base font-semibold tracking-tight">LeakGuard</span>
                </Link>
              </div>
              <UserButton afterSignOutUrl="/auth" />
            </div>
          </div>
          <div className="p-6">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
