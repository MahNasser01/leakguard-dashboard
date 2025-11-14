export interface Project {
  id: string;
  name: string;
  projectId: string;
  policy: string;
  metadata?: string;
  createdAt: Date;
  isPublic?: boolean;
  proxySlug?: string;
  supportedLlms?: string[];
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

export interface ProjectProxyConfig {
  isPublic: boolean;
  proxySlug?: string;
  supportedLlms?: string[];
}

export interface LLMChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface LLMChatRequest {
  model: string;
  messages: LLMChatMessage[];
}

export interface LLMChatResponse {
  id: string;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
