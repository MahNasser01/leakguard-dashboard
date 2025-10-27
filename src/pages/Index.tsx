import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Activity, Settings } from "lucide-react";

const Index = () => {
  const { user } = useUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">
          Welcome back, {user?.firstName || "User"}!
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Monitor and protect your data with AI-powered leak detection
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Link to="/projects">
          <div className="rounded-lg border bg-card p-6 transition-colors hover:bg-accent/50">
            <Shield className="mb-3 h-8 w-8 text-primary" />
            <h3 className="mb-2 font-semibold">Projects</h3>
            <p className="text-sm text-muted-foreground">
              Manage your security projects
            </p>
          </div>
        </Link>

        <Link to="/policies">
          <div className="rounded-lg border bg-card p-6 transition-colors hover:bg-accent/50">
            <Lock className="mb-3 h-8 w-8 text-primary" />
            <h3 className="mb-2 font-semibold">Policies</h3>
            <p className="text-sm text-muted-foreground">
              Configure detection policies
            </p>
          </div>
        </Link>

        <Link to="/logs">
          <div className="rounded-lg border bg-card p-6 transition-colors hover:bg-accent/50">
            <Activity className="mb-3 h-8 w-8 text-primary" />
            <h3 className="mb-2 font-semibold">Logs</h3>
            <p className="text-sm text-muted-foreground">
              View detected threats
            </p>
          </div>
        </Link>

        <Link to="/settings">
          <div className="rounded-lg border bg-card p-6 transition-colors hover:bg-accent/50">
            <Settings className="mb-3 h-8 w-8 text-primary" />
            <h3 className="mb-2 font-semibold">Settings</h3>
            <p className="text-sm text-muted-foreground">
              Configure your account
            </p>
          </div>
        </Link>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold">Quick Start</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              1
            </div>
            <div>
              <h3 className="font-medium">Create a Project</h3>
              <p className="text-sm text-muted-foreground">
                Set up your first project to start monitoring
              </p>
              <Link to="/projects">
                <Button variant="link" className="h-auto p-0">
                  Go to Projects →
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              2
            </div>
            <div>
              <h3 className="font-medium">Configure Policies</h3>
              <p className="text-sm text-muted-foreground">
                Define rules for detecting data leaks
              </p>
              <Link to="/policies">
                <Button variant="link" className="h-auto p-0">
                  Go to Policies →
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              3
            </div>
            <div>
              <h3 className="font-medium">Generate API Keys</h3>
              <p className="text-sm text-muted-foreground">
                Create keys to integrate with your applications
              </p>
              <Link to="/api-access">
                <Button variant="link" className="h-auto p-0">
                  Go to API Access →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
