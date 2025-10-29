import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockPolicies } from "@/services/mockData";
import { Policy } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function Policies() {
  const navigate = useNavigate();
  const [policies] = useState<Policy[]>(mockPolicies);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredPolicies = policies.filter((policy) =>
    policy.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopyPolicyId = (policyId: string) => {
    navigator.clipboard.writeText(policyId);
    toast.success("Policy ID copied to clipboard");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Policies</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A policy defines the guardrails applied to all API requests in assigned projects.
        </p>
      </div>

      <div className="flex items-center gap-4 border-b">
        <button
          className={`pb-2 text-sm font-medium ${
            activeTab === "all"
              ? "border-b-2 border-primary text-foreground"
              : "text-muted-foreground"
          }`}
          onClick={() => setActiveTab("all")}
        >
          All Policies
        </button>
        <button
          className={`pb-2 text-sm font-medium ${
            activeTab === "your"
              ? "border-b-2 border-primary text-foreground"
              : "text-muted-foreground"
          }`}
          onClick={() => setActiveTab("your")}
        >
          Your Policies
        </button>
        <button
          className={`pb-2 text-sm font-medium ${
            activeTab === "catalog"
              ? "border-b-2 border-primary text-foreground"
              : "text-muted-foreground"
          }`}
          onClick={() => setActiveTab("catalog")}
        >
          LeakGuard Policy Catalog
        </button>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search Policies"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <Button onClick={() => navigate("/policies/create")} className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          New policy
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">
        {filteredPolicies.length} policies
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Policy name</TableHead>
              <TableHead>Policy ID</TableHead>
              <TableHead>Guardrails</TableHead>
              <TableHead>Sensitivity</TableHead>
              <TableHead>Projects</TableHead>
              <TableHead>Last edited</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPolicies.map((policy) => (
              <TableRow key={policy.id}>
                <TableCell className="font-medium text-accent">
                  {policy.name}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">{policy.policyId}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyPolicyId(policy.policyId)}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {policy.guardrails.map((guardrail) => (
                      <Badge key={guardrail} variant="secondary" className="text-xs">
                        {guardrail}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-semibold">
                    {policy.sensitivity}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{policy.projects}</TableCell>
                <TableCell className="text-muted-foreground">
                  Invalid date
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing 1 to 5
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Requests per page</span>
          <select className="rounded-md border border-input bg-background px-3 py-1 text-sm">
            <option>25</option>
            <option>50</option>
            <option>100</option>
          </select>
        </div>
      </div>
    </div>
  );
}
