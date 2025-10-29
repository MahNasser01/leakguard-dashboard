import { useState, useEffect, useMemo } from "react";
import { Project } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, ArrowLeft, ArrowRight } from "lucide-react"; // Added ArrowLeft, ArrowRight
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, Copy } from "lucide-react";
import { toast } from "sonner";

// Define constants for pagination
const DEFAULT_ITEMS_PER_PAGE = 25;
const PAGE_OPTIONS = [10, 25, 50, 100];

// --- NEW: LLevelIndicator Component (copied from Policies.jsx) ---
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

// Helper to map policy names to a dummy L-Level for visual display
const mapPolicyToLLevel = (policyName: string): string => {
    if (policyName.toLowerCase().includes("strict")) return "L4";
    if (policyName.toLowerCase().includes("default")) return "L3";
    if (policyName.toLowerCase().includes("base")) return "L2";
    return "L1"; // Generic/Catch-all
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  // NOTE: API_BASE usage kept as per original file, but fetch calls will fail in the preview environment.
  const API_BASE = (import.meta as any).env.VITE_API_BASE || "http://localhost:8000";
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    application: "",
    model: "",
  });

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);

  // --- Filtering and Pagination Logic ---
  const filteredProjects = useMemo(() => {
    const q = searchTerm.toLowerCase();
    const result = projects.filter((project) =>
      project.name.toLowerCase().includes(q)
    );
    // Reset current page if filters change
    if (result.length > 0 && currentPage > Math.ceil(result.length / itemsPerPage)) {
        setCurrentPage(1);
    } else if (result.length === 0) {
        setCurrentPage(1);
    }
    return result;
  }, [projects, searchTerm, itemsPerPage, currentPage]);

  const totalItems = filteredProjects.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProjects.slice(startIndex, endIndex);
  }, [filteredProjects, currentPage, itemsPerPage]);

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

  const handleCreateProject = () => {
    if (!newProject.name) {
      toast.error("Project name is required");
      return;
    }

    const payload = {
      name: newProject.name,
      project_id: `project-${Math.random().toString(36).slice(2, 11)}`,
      policy: "LeakGuard Default Policy", // Default policy assigned on creation
      project_metadata: "-",
    };

    // NOTE: fetch call is preserved but will not run correctly in this environment.
    fetch(`${API_BASE}/api/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to create project");
        return res.json();
      })
      .then((data) => {
        const created: Project = {
          id: data.id || payload.project_id,
          name: data.name || payload.name,
          projectId: data.project_id || payload.project_id,
          policy: data.policy || payload.policy,
          metadata: data.project_metadata || payload.project_metadata,
          createdAt: new Date(data.created_at || Date.now()),
        };
        setProjects((p) => [created, ...p]);
        setNewProject({ name: "", application: "", model: "" });
        setIsDialogOpen(false);
        toast.success("Project created successfully");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to create project (using mock data for UI update)");
        // Add a mock project on error to demonstrate UI changes
        const mockProject: Project = {
            id: `mock-${Date.now()}`,
            name: newProject.name || "Mock Project",
            projectId: `proj-${Math.random().toString(36).slice(2, 6)}`,
            policy: Math.random() < 0.5 ? "Strict Policy" : "Loose Base Policy", // Varied policy names
            metadata: "Test",
            createdAt: new Date(),
        };
        setProjects((p) => [mockProject, ...p]);
        setNewProject({ name: "", application: "", model: "" });
        setIsDialogOpen(false);
      });
  };

  useEffect(() => {
    // NOTE: fetch call is preserved but will not run correctly in this environment.
    fetch(`${API_BASE}/api/projects`)
      .then((res) => res.json())
      .then((data) => {
        const mapped: Project[] = data.map((d: any) => ({
          id: d.id,
          name: d.name,
          projectId: d.project_id || d.projectId,
          policy: d.policy,
          metadata: d.project_metadata || d.metadata || "-",
          createdAt: d.created_at ? new Date(d.created_at) : new Date(),
        }));
        setProjects(mapped);
      })
      .catch((err) => {
        console.error("Failed to load projects", err);
        // Load mock data if backend fetch fails
        const mockData: Project[] = [
            { id: "p1", name: "GenAI Chat", projectId: "p-gac83n", policy: "Strict Policy", metadata: "Customer-facing", createdAt: new Date(Date.now() - 86400000) },
            { id: "p2", name: "Data Pipeline", projectId: "p-dpl02x", policy: "Loose Base Policy", metadata: "Internal-only", createdAt: new Date(Date.now() - 172800000) },
            { id: "p3", name: "R&D Sandbox", projectId: "p-rds51z", policy: "LeakGuard Default Policy", metadata: "-", createdAt: new Date(Date.now() - 345600000) },
        ];
        setProjects(mockData);
      });
  }, []);

  const handleCopyProjectId = (projectId: string) => {
    navigator.clipboard.writeText(projectId);
    toast.success("Project ID copied to clipboard");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Projects</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage the applications and components protected by LeakGuard.
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search project"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              New project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create project</DialogTitle>
              <DialogDescription>
                Set up a project to manage how LeakGuard protects a specific application,
                environment, or component.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name*</Label>
                <Input
                  id="name"
                  placeholder="my_project_1"
                  value={newProject.name}
                  onChange={(e) =>
                    setNewProject({ ...newProject, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="application">Application - Optional</Label>
                <Input
                  id="application"
                  placeholder="e.g. Q&A"
                  value={newProject.application}
                  onChange={(e) =>
                    setNewProject({ ...newProject, application: e.target.value })
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Specify the application or product this project relates to
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model - Optional</Label>
                <Input
                  id="model"
                  placeholder="e.g. GPT-4"
                  value={newProject.model}
                  onChange={(e) =>
                    setNewProject({ ...newProject, model: e.target.value })
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Specify the underlying LLM, e.g. GPT-3.5 Turbo.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateProject}>Save project</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="text-sm text-muted-foreground">
        {totalItems} project{totalItems !== 1 ? "s" : ""}
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project name</TableHead>
              <TableHead>Project ID</TableHead>
              <TableHead>Policy</TableHead>
              <TableHead>Metadata</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-64 text-center text-muted-foreground">
                  No projects found
                </TableCell>
              </TableRow>
            ) : (
              paginatedProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium text-accent">{project.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{project.projectId}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyProjectId(project.projectId)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  {/* --- UPDATED: Use LLevelIndicator Component for Policy --- */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                        <LLevelIndicator level={mapPolicyToLLevel(project.policy)} />
                        <span className="text-muted-foreground text-sm">{project.policy}</span>
                    </div>
                  </TableCell>
                  {/* --- END UPDATED --- */}
                  <TableCell className="text-muted-foreground">{project.metadata}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* --- START: Pagination Bar (Styled like Policies component) --- */}
      <div className="flex items-center justify-between py-4">
            
          {/* LEFT: Item Count ("Showing X to Y") */}
          <div className="text-sm text-muted-foreground">
            {totalItems === 0
              ? "No projects found"
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
      {/* --- END: Pagination Bar --- */}
    </div>
  );
}
