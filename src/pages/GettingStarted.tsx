import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

export default function GettingStarted() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Getting Started</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome to Lakera Guard. Get started with protecting your AI applications.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">Quick Start Guide</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Learn how to set up Lakera Guard in minutes and protect your AI applications from
              prompt injection attacks.
            </p>
            <Button variant="outline">
              Read Documentation
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">API Integration</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Integrate Lakera Guard API into your application with our comprehensive guides and
              examples.
            </p>
            <Button variant="outline">
              View API Docs
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">Create Your First Project</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Set up a project to manage how Lakera Guard protects your specific application or
              environment.
            </p>
            <Button>Go to Projects</Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">Configure Policies</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Define guardrails and security policies to protect your AI applications from various
              threats.
            </p>
            <Button>Go to Policies</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Next Steps</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-accent">1.</span>
              <span>Create your first project to organize your applications</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">2.</span>
              <span>Configure a policy with the appropriate guardrails</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">3.</span>
              <span>Generate an API key for integration</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">4.</span>
              <span>Integrate the API into your application</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">5.</span>
              <span>Monitor logs and analytics to track threats</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
