export interface Project {
  id: string;
  name: string;
  projectId: string;
  policy: string;
  metadata?: string;
  createdAt: Date;
}

export interface Policy {
  id: string;
  name: string;
  policyId: string;
  guardrails: string[];
  sensitivity: string;
  projects: string;
  isUserAdded: boolean;
  lastEdited: Date;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: Date;
  lastUsed?: Date;
}

export interface LogEntry {
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
}
