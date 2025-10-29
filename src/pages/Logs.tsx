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
import { Filter, RefreshCw, Link as LinkIcon, Copy, Shield, FileText, Users, Link, ArrowLeft, ArrowRight } from "lucide-react";

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

// Define constants for pagination
const DEFAULT_ITEMS_PER_PAGE = 10;
const PAGE_OPTIONS = [10, 25, 50, 100];

// --- START: CUSTOM STYLES FOR THREATS (Based on Policy Guardrails) ---
const ICON_STYLES_LOGS = {
  // Prompt Injection (Shield) - Orange/Red
  "prompt injection": "h-6 w-6 rounded-md flex items-center justify-center bg-orange-100/50 backdrop-blur-sm border border-white/20 shadow-lg shadow-orange-500/30",
  // Topic Violation (FileText) - Blue
  "topic violation": "h-6 w-6 rounded-md flex items-center justify-center bg-blue-100/50 backdrop-blur-sm border border-white/20 shadow-lg shadow-blue-500/30",
  // PII (Users) - Purple
  "pii": "h-6 w-6 rounded-md flex items-center justify-center bg-purple-100/50 backdrop-blur-sm border border-white/20 shadow-lg shadow-purple-500/30",
  // Secrets (Link) - Dark Gray/Black
  "secrets": "h-6 w-6 rounded-md flex items-center justify-center bg-gray-200/50 backdrop-blur-sm border border-white/20 shadow-lg shadow-gray-500/30",
};

const ICON_COLORS_LOGS = {
  "prompt injection": "h-4 w-4 text-orange-600 dark:text-orange-500",
  "topic violation": "h-4 w-4 text-blue-600 dark:text-blue-500",
  "pii": "h-4 w-4 text-purple-600 dark:text-purple-500",
  "secrets": "h-4 w-4 text-gray-700 dark:text-gray-300",
}

const getThreatIcon = (threatName: string) => {
  switch (threatName.toLowerCase()) {
    case "prompt injection":
      return Shield;
    case "topic violation":
      return FileText;
    case "pii":
      return Users;
    case "secrets":
      return Link;
    default:
      return null;
  }
};
// --- END: CUSTOM STYLES FOR THREATS ---

// --- MOCK DATA GENERATOR ---
const generateMockLogs = (count: number): LogEntry[] => {
    const projects = ["GenAI-Chat", "Data-Analysis", "Code-Gen", "Finance-Bot"];
    const policies = ["Mandatory-Defense", "Data-Guard", "Relaxed-Filter", "Strict-Defense"];
    const threats = [
        ["Prompt Injection", "Topic Violation"], 
        ["PII", "Secrets"], 
        [], 
        ["Prompt Injection"]
    ];
    const regions = ["us-west-1", "eu-central-1", "ap-south-1", "us-east-1"];
    const mockLogs: LogEntry[] = [];

    for (let i = 1; i <= count; i++) {
        const index = i % 4;
        mockLogs.push({
            id: `log_${i}`,
            timestamp: new Date(Date.now() - i * 60000 * Math.random()).toISOString(),
            project: projects[index],
            threats_detected: threats[index],
            content: `This is log content number ${i}. The length of the message is long for truncation testing.`,
            policy: policies[index],
            request_id: `req_${Math.floor(100 + Math.random() * 900)}_${i}`,
            latency: Math.floor(30 + Math.random() * 150),
            region: regions[index],
            log_entry_metadata: i % 3 === 0 ? `user: test_${i}` : null,
        });
    }
    return mockLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};
// --- END MOCK DATA GENERATOR ---

export default function Logs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [query, setQuery] = useState("");

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);

  const fetchLogs = useCallback(async () => {
    setUpdating(true);
    try {
      // NOTE: Using mock data for demonstration purposes
      const data = generateMockLogs(120); 
      setLogs(data); 
      setCurrentPage(1); // Reset page on new data fetch
    } finally {
      setUpdating(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // --- Filtering Logic (No Pagination applied yet) ---
  const filteredLogs = useMemo(() => {
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


  // --- Pagination Logic ---
  const totalItems = filteredLogs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredLogs.slice(startIndex, endIndex);
  }, [filteredLogs, currentPage, itemsPerPage]);

  const startItemIndex = Math.min((currentPage - 1) * itemsPerPage + 1, totalItems);
  const endItemIndex = Math.min(currentPage * itemsPerPage, totalItems);
  
  // --- Pagination Handlers ---
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };


  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
        // Silent failure if clipboard access is denied
    }
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
          onClick={() => { setActiveTab("all"); setCurrentPage(1); }}
        >
          All Requests
        </button>
        <button
          className={`pb-2 text-sm font-medium ${
            activeTab === "threats"
              ? "border-b-2 border-primary text-foreground"
              : "text-muted-foreground"
          }`}
          onClick={() => { setActiveTab("threats"); setCurrentPage(1); }}
        >
          Threats ({logs.filter(l => (l.threats_detected?.length ?? 0) > 0).length})
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
            onChange={(e) => { setQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Search requests, threats, policy, region..."
          />
        </div>

        <Button variant="outline">
          {/* Custom SVG for Calendar icon */}
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
            {updating && paginatedLogs.length === 0 && (
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
            {paginatedLogs.length === 0 && !updating ? (
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
              paginatedLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</TableCell>
                  <TableCell>{log.project}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap items-center gap-2">
                      {(log.threats_detected || []).length === 0 ? (
                        <span className="text-muted-foreground">—</span>
                      ) : (
                        (log.threats_detected || []).map((t, idx) => {
                          const threatKey = t.toLowerCase();
                          const IconComponent = getThreatIcon(threatKey);
                          const iconBgClass = ICON_STYLES_LOGS[threatKey as keyof typeof ICON_STYLES_LOGS];
                          const iconColorClass = ICON_COLORS_LOGS[threatKey as keyof typeof ICON_COLORS_LOGS];

                          if (!IconComponent || !iconBgClass || !iconColorClass) {
                            return (
                              // Fallback for unknown threats
                              <Badge key={`${log.id}-threat-${idx}`} variant="destructive" className="rounded-full">
                                {t}
                              </Badge>
                            );
                          }

                          return (
                            <div key={`${log.id}-threat-${idx}`} className="flex items-center gap-2">
                              <div 
                                className={`h-6 w-6 rounded-md flex items-center justify-center ${iconBgClass}`}
                                title={t}
                              >
                                <IconComponent className={iconColorClass} />
                              </div>
                              <span className="text-xs font-medium text-foreground hidden sm:inline-block">{t}</span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[320px] truncate" title={log.content}>{log.content}</TableCell>
                  <TableCell>{log.policy}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs">{log.request_id}</span>
                      <Button size="icon" variant="ghost" onClick={() => copy(log.request_id)} title="Copy request id" className="h-6 w-6">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">{log.latency} ms</TableCell>
                  <TableCell>{log.region}</TableCell>
                  <TableCell>{log.log_entry_metadata || "—"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* --- START: Pagination Bar --- */}
      <div className="flex items-center justify-between py-4">
            
          {/* LEFT: Item Count ("Showing X to Y") */}
          <div className="text-sm text-muted-foreground">
            {totalItems === 0
              ? "No logs found"
              : `Showing ${startItemIndex} to ${endItemIndex} of ${totalItems}`}
          </div>
            
          {/* CENTER: Back / Page / Next buttons */}
          <div className="flex items-center rounded-lg border mx-auto"> 
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className="h-8 rounded-r-none px-3"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <span className="px-4 text-sm font-medium border-l border-r h-8 flex items-center">
              {currentPage}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages || totalItems === 0}
              className="h-8 rounded-l-none px-3"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
            
          {/* RIGHT: Requests per page control */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline-block">Requests per page</span>
            <select
              className="rounded-md border border-input bg-background px-3 py-1 text-sm"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
            >
              {PAGE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

      </div>
      {/* --- END: Pagination Bar --- */}
    </div>
  );
}
