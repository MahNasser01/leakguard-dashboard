import { Project, Policy, ApiKey, LogEntry } from "@/types";

export const mockProjects: Project[] = [
  {
    id: "1",
    name: "First Project",
    projectId: "project-3043777887",
    policy: "LeakGuard Default Policy",
    metadata: "-",
    createdAt: new Date("2024-01-15"),
  },
];

export const mockPolicies: Policy[] = [
  {
    id: "1",
    name: "LeakGuard Default Policy",
    policyId: "policy-LeakGuard-default",
    guardrails: ["prompt-injection", "pii", "topics", "secrets"],
    sensitivity: "L4",
    projects: "First Project",
    isUserAdded: true,
    lastEdited: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Public-facing Application",
    policyId: "policy-LeakGuard-public",
    guardrails: ["prompt-injection", "pii"],
    sensitivity: "L2",
    projects: "-",
    isUserAdded: true,
    lastEdited: new Date("2024-01-15"),
  },
  {
    id: "3",
    name: "Internal-facing Application",
    policyId: "policy-LeakGuard-internal",
    guardrails: ["prompt-injection", "topics", "secrets"],
    sensitivity: "L1",
    projects: "-",
    isUserAdded: true,
    lastEdited: new Date("2024-01-15"),
  },
  {
    id: "4",
    name: "Prompt Defense Only",
    policyId: "policy-LeakGuard-prompt-only",
    guardrails: ["prompt-injection"],
    sensitivity: "L2",
    projects: "-",
    isUserAdded: false,
    lastEdited: new Date("2024-01-15"),
  },
  {
    id: "5",
    name: "Content Safety",
    policyId: "policy-LeakGuard-content-safety",
    guardrails: ["prompt-injection", "pii"],
    sensitivity: "L2",
    projects: "-",
    isUserAdded: false,
    lastEdited: new Date("2024-01-15"),
  },
];

export const mockApiKeys: ApiKey[] = [];

/*

  id: string;
  timestamp: Date;
  project: string;
  threatsDetected: string[];
  content: string;
  policy: string;
  requestId: string;
  latency: number;
  region: string;
  metadata: string;
*/
export const mockLogs: LogEntry[] = [
  {
    id: "1",
    timestamp: new Date("2024-01-15"),
    project: "First Project",
    threatsDetected: ["prompt-injection", "pii"],
    content: "Hello, world!",
    policy: "LeakGuard Default Policy",
    requestId: "request-1234",
    latency: 500,
    region: "us-east-1",
    metadata: "-",
  },
  
];
