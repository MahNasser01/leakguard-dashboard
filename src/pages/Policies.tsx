import { useState, useMemo, useEffect } from "react";
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
import { Plus, Search, Copy, Pencil, Shield, FileText, Users, ShieldCheck, ArrowLeft, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useApi } from "@/services/api";

// --- START: New Custom Icon Styling Classes ---
const ICON_STYLES_LIST = {
  "prompt-injection": "h-8 w-8 rounded-lg flex items-center justify-center bg-orange-100/50 backdrop-blur-sm border border-white/20 shadow-lg shadow-orange-500/30",
  "topics": "h-8 w-8 rounded-lg flex items-center justify-center bg-blue-100/50 backdrop-blur-sm border border-white/20 shadow-lg shadow-blue-500/30",
  "pii": "h-8 w-8 rounded-lg flex items-center justify-center bg-purple-100/50 backdrop-blur-sm border border-white/20 shadow-lg shadow-purple-500/30",
  "secrets": "h-8 w-8 rounded-lg flex items-center justify-center bg-gray-200/50 backdrop-blur-sm border border-white/20 shadow-lg shadow-gray-500/30",
};

const ICON_COLORS_LIST = {
  "prompt-injection": "h-4 w-4 text-orange-600 dark:text-orange-500",
  "topics": "h-4 w-4 text-blue-600 dark:text-blue-500",
  "pii": "h-4 w-4 text-purple-600 dark:text-purple-500",
  "secrets": "h-4 w-4 text-gray-700 dark:text-gray-300",
}
// --- END: New Custom Icon Styling Classes ---

// Define constants for pagination
const DEFAULT_ITEMS_PER_PAGE = 25;
const PAGE_OPTIONS = [10, 25, 50, 100];


export default function Policies() {
  const navigate = useNavigate();
  const { policies: policiesApi } = useApi();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);


    useEffect(() => {
    let isMounted = true;
    policiesApi
      .list()
      .then((data) => {
        if (!isMounted) return;
        const mapped: Policy[] = (data || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          policyId: p.policy_id,
          guardrails: p.guardrails || [],
          sensitivity: p.sensitivity,
          projects: p.projects || "-",
          isUserAdded: Boolean(p.is_user_added),
          lastEdited: p.last_edited ? new Date(p.last_edited) : new Date(0),
        }));
        setPolicies(mapped);
      })
      .catch(() => {
        toast.error("Failed to fetch policies");
      });
    return () => {
      isMounted = false;
    };
  }, []);


  const filteredPolicies = useMemo(() => {
    
    const result = policies.filter((policy) => {
      const matchesSearch = policy.name.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;

      if (activeTab === "all") return true;
      if (activeTab === "your") return policy.isUserAdded === true;
      if (activeTab === "catalog") return policy.isUserAdded === false;
      return true;
    });

    if (result.length > 0 && currentPage > Math.ceil(result.length / itemsPerPage)) {
        setCurrentPage(1);
    } else if (result.length === 0) {
        setCurrentPage(1);
    }
    
    return result;
  }, [policies, searchTerm, activeTab, itemsPerPage, currentPage]);
  
  const totalItems = filteredPolicies.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedPolicies = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredPolicies.slice(startIndex, endIndex);
  }, [filteredPolicies, currentPage, itemsPerPage]);
  
  const startItemIndex = Math.min((currentPage - 1) * itemsPerPage + 1, totalItems);
  const endItemIndex = Math.min(currentPage * itemsPerPage, totalItems);

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

  const handleCopyPolicyId = (policyId: string) => {
    navigator.clipboard.writeText(policyId);
    toast.success("Policy ID copied to clipboard");
  };

  const getGuardrailIcon = (guardrailName: string) => {
    switch (guardrailName.toLowerCase()) {
      case "prompt-injection":
        return Shield;
      case "topics":
        return FileText;
      case "pii":
        return Users;
      case "secrets":
        return ShieldCheck;
      default:
        return null;
    }
  };

  // --- NEW: LLevelIndicator Component ---
  const LLevelIndicator = ({ level }: { level: string }) => {
    const levelNumber = parseInt(level.replace("L", ""));
    return (
      <div className="flex items-center gap-1 text-sm font-semibold">
        <div className="flex h-4 gap-0.5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`w-1 ${
                i <= levelNumber
                  ? i <= 2
                    ? "bg-orange-500" // L1, L2
                    : i === 3
                    ? "bg-orange-600" // L3
                    : "bg-red-500" // L4
                  : "bg-gray-300 dark:bg-gray-700" // Inactive bars
              }`}
            />
          ))}
        </div>
        <span className="ml-1 text-foreground">{level}</span>
      </div>
    );
  };
  // --- END: NEW LLevelIndicator Component ---

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
        {totalItems} policies
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
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPolicies.map((policy) => (
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
                  <div className="flex flex-wrap gap-2">
                    {policy.guardrails.map((guardrail) => {
                      const IconComponent = getGuardrailIcon(guardrail);
                      const iconBgClass = ICON_STYLES_LIST[guardrail.toLowerCase() as keyof typeof ICON_STYLES_LIST];
                      const iconColorClass = ICON_COLORS_LIST[guardrail.toLowerCase() as keyof typeof ICON_COLORS_LIST];

                      if (!IconComponent || !iconBgClass || !iconColorClass) {
                        return (
                          <Badge key={guardrail} variant="secondary" className="text-xs">
                            {guardrail}
                          </Badge>
                        );
                      }

                      return (
                        <div 
                          key={guardrail}
                          className={`h-8 w-8 rounded-lg flex items-center justify-center ${iconBgClass}`}
                        >
                          <IconComponent className={iconColorClass} />
                        </div>
                      );
                    })}
                  </div>
                </TableCell>
                {/* --- UPDATED: Use LLevelIndicator Component --- */}
                <TableCell>
                  <LLevelIndicator level={policy.sensitivity} />
                </TableCell>
                {/* --- END UPDATED --- */}
                <TableCell className="text-muted-foreground">{policy.projects}</TableCell>
                <TableCell className="text-muted-foreground">
                  Invalid date
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/policies/edit/${policy.id}`)}
                    className="h-8 w-8 p-0"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between py-4">
            
          <div className="text-sm text-muted-foreground">
            {totalItems === 0
              ? "No policies found"
              : `Showing ${startItemIndex} to ${endItemIndex} of ${totalItems}`}
          </div>
            
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
            
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Requests per page</span>
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
    </div>
  );
}