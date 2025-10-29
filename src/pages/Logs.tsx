import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Filter, RefreshCw, Link as LinkIcon, Copy } from "lucide-react";

type LogEntry = {
  id: string;
  timestamp: string;
  project: string;
  threats_detected: string[];
  content: string;
  policy: string;
  request_id: string;
  latency: number;
  region: string;
  log_entry_metadata?: string | null;
};

export default function Logs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [query, setQuery] = useState("");

  const fetchLogs = useCallback(async () => {
    setUpdating(true);
    try {
      const res = await fetch("http://localhost:8000/api/logs?limit=100");
      if (!res.ok) return;
      const data: LogEntry[] = await res.json();
      setLogs(Array.isArray(data) ? data : []);
    } finally {
      setUpdating(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const visibleLogs = useMemo(() => {
    const byTab = activeTab === "threats" ? logs.filter(l => (l.threats_detected?.length ?? 0) > 0) : logs;
    if (!query.trim()) return byTab;
    const q = query.toLowerCase();
    return byTab.filter(l =>
      l.project.toLowerCase().includes(q) ||
      l.policy.toLowerCase().includes(q) ||
      l.request_id.toLowerCase().includes(q) ||
      l.region.toLowerCase().includes(q) ||
      l.content.toLowerCase().includes(q) ||
      (l.threats_detected || []).some(t => t.toLowerCase().includes(q))
    );
  }, [logs, activeTab, query]);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
  }, []);

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

        <div className="hidden md:block w-px h-8 bg-border" />

        <div className="w-full max-w-sm">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search requests, threats, policy, region..."
          />
        </div>

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
          <Button variant="outline" size="sm" onClick={fetchLogs} disabled={updating}>
            <RefreshCw className={`mr-2 h-4 w-4 ${updating ? "animate-spin" : ""}`} />
            {updating ? "Updating" : "Update data"}
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
              <TableHead className="text-right">Latency</TableHead>
              <TableHead>LeakGuard Region</TableHead>
              <TableHead>Metadata tags</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {updating && visibleLogs.length === 0 && (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  <TableCell><div className="h-4 w-40 rounded bg-muted animate-pulse" /></TableCell>
                  <TableCell><div className="h-4 w-24 rounded bg-muted animate-pulse" /></TableCell>
                  <TableCell><div className="h-6 w-28 rounded bg-muted animate-pulse" /></TableCell>
                  <TableCell><div className="h-4 w-64 rounded bg-muted animate-pulse" /></TableCell>
                  <TableCell><div className="h-4 w-20 rounded bg-muted animate-pulse" /></TableCell>
                  <TableCell><div className="h-4 w-28 rounded bg-muted animate-pulse" /></TableCell>
                  <TableCell className="text-right"><div className="h-4 ml-auto w-12 rounded bg-muted animate-pulse" /></TableCell>
                  <TableCell><div className="h-4 w-24 rounded bg-muted animate-pulse" /></TableCell>
                  <TableCell><div className="h-4 w-24 rounded bg-muted animate-pulse" /></TableCell>
                </TableRow>
              ))
            )}
            {visibleLogs.length === 0 && !updating ? (
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
            ) : (
              visibleLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                  <TableCell>{log.project}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {(log.threats_detected || []).length === 0 ? (
                        <span className="text-muted-foreground">—</span>
                      ) : (
                        (log.threats_detected || []).map((t, idx) => (
                          <Badge key={`${log.id}-threat-${idx}`} variant="destructive" className="rounded-full">
                            {t}
                          </Badge>
                        ))
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[320px] truncate" title={log.content}>{log.content}</TableCell>
                  <TableCell>{log.policy}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs">{log.request_id}</span>
                      <Button size="icon" variant="ghost" onClick={() => copy(log.request_id)} title="Copy request id">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{log.latency} ms</TableCell>
                  <TableCell>{log.region}</TableCell>
                  <TableCell>{log.log_entry_metadata || "—"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
