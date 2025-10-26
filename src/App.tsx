import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./layouts/DashboardLayout";
import GettingStarted from "./pages/GettingStarted";
import Analytics from "./pages/Analytics";
import Logs from "./pages/Logs";
import Policies from "./pages/Policies";
import Projects from "./pages/Projects";
import Playground from "./pages/Playground";
import ApiAccess from "./pages/ApiAccess";
import Pricing from "./pages/Pricing";
import Settings from "./pages/Settings";
import Documentation from "./pages/Documentation";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <DashboardLayout>
                <GettingStarted />
              </DashboardLayout>
            }
          />
          <Route
            path="/analytics"
            element={
              <DashboardLayout>
                <Analytics />
              </DashboardLayout>
            }
          />
          <Route
            path="/logs"
            element={
              <DashboardLayout>
                <Logs />
              </DashboardLayout>
            }
          />
          <Route
            path="/policies"
            element={
              <DashboardLayout>
                <Policies />
              </DashboardLayout>
            }
          />
          <Route
            path="/projects"
            element={
              <DashboardLayout>
                <Projects />
              </DashboardLayout>
            }
          />
          <Route
            path="/playground"
            element={
              <DashboardLayout>
                <Playground />
              </DashboardLayout>
            }
          />
          <Route
            path="/api-access"
            element={
              <DashboardLayout>
                <ApiAccess />
              </DashboardLayout>
            }
          />
          <Route
            path="/pricing"
            element={
              <DashboardLayout>
                <Pricing />
              </DashboardLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <DashboardLayout>
                <Settings />
              </DashboardLayout>
            }
          />
          <Route
            path="/documentation"
            element={
              <DashboardLayout>
                <Documentation />
              </DashboardLayout>
            }
          />
          <Route
            path="/account"
            element={
              <DashboardLayout>
                <Account />
              </DashboardLayout>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
