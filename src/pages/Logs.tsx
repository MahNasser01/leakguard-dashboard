import { useState } from "react";
import { mockLogs } from "@/services/mockData";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Filter, RefreshCw, Link as LinkIcon } from "lucide-react";

export default function Logs() {
  const [logs] = useState(mockLogs);
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Logs</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Investigate requests and detected threats to identify malicious actors, vulnerabilities,
          and mitigating actions to take.
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
          All Requests
        </button>
        <button
          className={`pb-2 text-sm font-medium ${
            activeTab === "threats"
              ? "border-b-2 border-primary text-foreground"
              : "text-muted-foreground"
          }`}
          onClick={() => setActiveTab("threats")}
        >
          Threats
        </button>
      </div>

      <div className="flex items-center gap-4">
        <Select defaultValue="all-projects">
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-projects">All projects</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>

        <Button variant="outline">
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Today
        </Button>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Update data
          </Button>
          <Button variant="ghost" size="sm">
            <LinkIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Threats detected</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Policy</TableHead>
              <TableHead>Request ID</TableHead>
              <TableHead>Latency</TableHead>
              <TableHead>LeakGuard Region</TableHead>
              <TableHead>Metadata tags</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={9} className="h-64 text-center">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="text-muted-foreground">No results found</div>
                  <Button variant="link" className="text-accent">
                    Clear all filters ×
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
