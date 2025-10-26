import { Project, Policy, ApiKey, LogEntry } from "@/types";

export const mockProjects: Project[] = [
  {
    id: "1",
    name: "First Project",
    projectId: "project-3043777887",
    policy: "Lakera Default Policy",
    metadata: "-",
    createdAt: new Date("2024-01-15"),
  },
];

export const mockPolicies: Policy[] = [
  {
    id: "1",
    name: "Lakera Default Policy",
    policyId: "policy-lakera-default",
    guardrails: ["prompt-injection", "pii", "topics", "secrets"],
    sensitivity: "L4",
    projects: "First Project",
    lastEdited: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Public-facing Application",
    policyId: "policy-lakera-public",
    guardrails: ["prompt-injection", "pii"],
    sensitivity: "L2",
    projects: "-",
    lastEdited: new Date("2024-01-15"),
  },
  {
    id: "3",
    name: "Internal-facing Application",
    policyId: "policy-lakera-internal",
    guardrails: ["prompt-injection", "topics", "secrets"],
    sensitivity: "L1",
    projects: "-",
    lastEdited: new Date("2024-01-15"),
  },
  {
    id: "4",
    name: "Prompt Defense Only",
    policyId: "policy-lakera-prompt-only",
    guardrails: ["prompt-injection"],
    sensitivity: "L2",
    projects: "-",
    lastEdited: new Date("2024-01-15"),
  },
  {
    id: "5",
    name: "Content Safety",
    policyId: "policy-lakera-content-safety",
    guardrails: ["prompt-injection", "pii"],
    sensitivity: "L2",
    projects: "-",
    lastEdited: new Date("2024-01-15"),
  },
];

export const mockApiKeys: ApiKey[] = [];

export const mockLogs: LogEntry[] = [];
