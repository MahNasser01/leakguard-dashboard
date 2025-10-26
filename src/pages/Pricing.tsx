import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

export default function Pricing() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Plans</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          The default pricing plan (Community) provides free access to a limited number of
          requests. Contact sales to update your plan and get access to advanced features.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="relative">
          <CardHeader>
            <CardTitle className="text-2xl">Community</CardTitle>
            <div className="mt-4">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-muted-foreground"> per month</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full" disabled>
              Your current plan
            </Button>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm font-medium">Requests included</span>
                <span className="text-sm text-muted-foreground">10k / month</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm font-medium">Maximum prompt size</span>
                <span className="text-sm text-muted-foreground">8k tokens</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm font-medium">Hosting</span>
                <span className="text-sm text-muted-foreground">SaaS</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm font-medium">Support</span>
                <span className="text-sm text-muted-foreground">Community</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm font-medium">API Support</span>
                <Check className="h-4 w-4 text-accent" />
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm font-medium">Dashboards</span>
                <Check className="h-4 w-4 text-accent" />
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm font-medium">Reports</span>
                <Check className="h-4 w-4 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Enterprise</CardTitle>
            <div className="mt-4">
              <span className="text-4xl font-bold">Let's chat!</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full bg-primary hover:bg-primary/90">
              Talk to us
            </Button>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm font-medium">Requests included</span>
                <span className="text-sm text-muted-foreground">Flexible</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm font-medium">Maximum prompt size</span>
                <span className="text-sm text-muted-foreground">Configurable</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm font-medium">Hosting</span>
                <span className="text-sm text-muted-foreground">SaaS or Self-hosted</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm font-medium">Support</span>
                <span className="text-sm text-muted-foreground">Enterprise-level support</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm font-medium">API Support</span>
                <Check className="h-4 w-4 text-accent" />
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm font-medium">Dashboards</span>
                <Check className="h-4 w-4 text-accent" />
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm font-medium">Reports</span>
                <Check className="h-4 w-4 text-accent" />
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm font-medium">SSO Support</span>
                <Check className="h-4 w-4 text-accent" />
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm font-medium">Role-based access control</span>
                <Check className="h-4 w-4 text-accent" />
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm font-medium">SIEM integration</span>
                <Check className="h-4 w-4 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
