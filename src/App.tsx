import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
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
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<ProtectedRoute><DashboardLayout><Index /></DashboardLayout></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><DashboardLayout><Projects /></DashboardLayout></ProtectedRoute>} />
          <Route path="/policies" element={<ProtectedRoute><DashboardLayout><Policies /></DashboardLayout></ProtectedRoute>} />
          <Route path="/api-access" element={<ProtectedRoute><DashboardLayout><ApiAccess /></DashboardLayout></ProtectedRoute>} />
          <Route path="/logs" element={<ProtectedRoute><DashboardLayout><Logs /></DashboardLayout></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><DashboardLayout><Analytics /></DashboardLayout></ProtectedRoute>} />
          <Route path="/pricing" element={<ProtectedRoute><DashboardLayout><Pricing /></DashboardLayout></ProtectedRoute>} />
          <Route path="/getting-started" element={<ProtectedRoute><DashboardLayout><GettingStarted /></DashboardLayout></ProtectedRoute>} />
          <Route path="/playground" element={<ProtectedRoute><DashboardLayout><Playground /></DashboardLayout></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><DashboardLayout><Settings /></DashboardLayout></ProtectedRoute>} />
          <Route path="/documentation" element={<ProtectedRoute><DashboardLayout><Documentation /></DashboardLayout></ProtectedRoute>} />
          <Route path="/account" element={<ProtectedRoute><DashboardLayout><Account /></DashboardLayout></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
