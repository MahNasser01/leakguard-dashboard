import { useState, useEffect } from "react";
import { Project } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield } from "lucide-react";
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

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const API_BASE = (import.meta as any).env.VITE_API_BASE || "http://localhost:8000";
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    application: "",
    model: "",
  });

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProject = () => {
    if (!newProject.name) {
      toast.error("Project name is required");
      return;
    }

    const payload = {
      name: newProject.name,
      project_id: `project-${Math.random().toString(36).slice(2, 11)}`,
      policy: "LeakGuard Default Policy",
      project_metadata: "-",
    };

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
          id: data.id,
          name: data.name,
          projectId: data.project_id || data.projectId,
          policy: data.policy,
          metadata: data.project_metadata || data.metadata || "-",
          createdAt: new Date(data.created_at),
        };
        setProjects((p) => [created, ...p]);
        setNewProject({ name: "", application: "", model: "" });
        setIsDialogOpen(false);
        toast.success("Project created successfully");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to create project");
      });
  };

  useEffect(() => {
    // fetch projects from backend
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
        {filteredProjects.length} project{filteredProjects.length !== 1 ? "s" : ""}
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
            {filteredProjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No projects found
                </TableCell>
              </TableRow>
            ) : (
              filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
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
                  <TableCell>
                    <span className="inline-flex items-center gap-1 text-accent">
                      <Shield className="h-3 w-3" />
                      {project.policy}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{project.metadata}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing 1 to {filteredProjects.length}
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
