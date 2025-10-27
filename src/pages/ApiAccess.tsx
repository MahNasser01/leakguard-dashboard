import { useState } from "react";
import { mockApiKeys } from "@/services/mockData";
import { ApiKey } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function ApiAccess() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(mockApiKeys);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");

  const handleCreateApiKey = () => {
    if (!newKeyName) {
      toast.error("API key name is required");
      return;
    }

    const apiKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `lk_${Math.random().toString(36).substr(2, 32)}`,
      createdAt: new Date(),
    };

    setApiKeys([...apiKeys, apiKey]);
    setNewKeyName("");
    setIsDialogOpen(false);
    toast.success("API key created successfully");
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("API key copied to clipboard");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">API Access</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Making an API call</h2>
          <p className="text-sm text-muted-foreground">
            Our full API documentation is available{" "}
            <a href="#" className="text-accent hover:underline">
              here
            </a>
            .
          </p>
          <p className="text-sm text-muted-foreground">
            You can use the{" "}
            <a href="#" className="text-accent hover:underline">
              LeakGuard API
            </a>{" "}
            by submitting a POST request to{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              https://api.leakguard.ai/v2/guard
            </code>
            . You'll need to pass an access key along with your request. You can generate your
            access key on the right, copy and paste that into the example below, and execute your
            "Hello, world!" from your favorite environment.
          </p>
          <p className="text-sm text-muted-foreground">
            Once you have your access key, you're ready to make your first request. As a "hello
            world", let's run LeakGuard on a harmless input.
          </p>

          <div className="space-y-2">
            <div className="flex items-center gap-2 border-b">
              <button className="border-b-2 border-primary px-4 py-2 text-sm font-medium">
                curl
              </button>
              <button className="px-4 py-2 text-sm text-muted-foreground">Python</button>
              <button className="px-4 py-2 text-sm text-muted-foreground">HTTPie</button>
            </div>
            <div className="relative">
              <pre className="rounded-lg bg-muted p-4 text-xs overflow-x-auto">
                <code>{`export LEAKGUARD_API_KEY=<your key>
curl https://api.leakguard.ai/v2/guard \\
  -X POST \\
  -H "Authorization: Bearer $LeakGUARD_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ "messages": [{"content": "Your content goes here", "role": "user"}]}'`}</code>
              </pre>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-2"
                onClick={() => {
                  toast.success("Code copied to clipboard");
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
            <p className="text-sm text-orange-900">
              Note that subsequent <code className="rounded bg-orange-100 px-1 py-0.5">curl</code>{" "}
              requests don't maintain a persistent connection. Failing to maintain it will result in
              higher latency. For better performance it is recommended to do one of the following:
            </p>
            <ul className="mt-2 list-inside list-disc text-sm text-orange-900">
              <li>
                Use a <code className="rounded bg-orange-100 px-1 py-0.5">Session</code> object as
                described under "Python" tab
              </li>
              <li>
                Submit multiple requests within one{" "}
                <code className="rounded bg-orange-100 px-1 py-0.5">curl</code> command (see below)
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Multiple requests with persistent connection:</h3>
            <div className="relative">
              <pre className="rounded-lg bg-muted p-4 text-xs overflow-x-auto">
                <code>{`export LEAKGUARD_API_KEY=<your key>
curl https://api.leakguard.ai/v2/guard <first_request_arguments> \\
  -: https://api.leakguard.ai/v2/guard <second_request_arguments>`}</code>
              </pre>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-2"
                onClick={() => {
                  toast.success("Code copied to clipboard");
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Once you've made your first request:</h3>
            <p className="text-sm text-muted-foreground">
              Learn more about how prompt injections can affect LLMs, and how LeakGuard protects
              you against these threats, by following our{" "}
              <a href="#" className="text-accent hover:underline inline-flex items-center gap-1">
                prompt injection tutorial
                <ExternalLink className="h-3 w-3" />
              </a>
              .
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">API keys</h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Create new API key
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create new API key</DialogTitle>
                  <DialogDescription>
                    Create a new API key to access the LeakGuard API.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="keyName">Key name</Label>
                    <Input
                      id="keyName"
                      placeholder="My API Key"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateApiKey}>Create</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {apiKeys.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-muted-foreground">
                You have no personal access keys. Create one below.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {apiKeys.map((apiKey) => (
                <div
                  key={apiKey.id}
                  className="rounded-lg border bg-card p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{apiKey.name}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyKey(apiKey.key)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <code className="block rounded bg-muted px-3 py-2 text-xs">
                    {apiKey.key}
                  </code>
                  <div className="text-xs text-muted-foreground">
                    Created: {apiKey.createdAt.toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
