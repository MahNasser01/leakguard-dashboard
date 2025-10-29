import { useAuth } from "@clerk/clerk-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface PolicyCreateData {
  name: string;
  policy_id: string;
  guardrails: string[];
  sensitivity: string;
  projects?: string;
}

export interface ProjectCreateData {
  name: string;
  project_id: string;
  policy: string;
  project_metadata?: string;
}

export interface ApiKeyCreateData {
  name: string;
  project_id?: string;
}

// Helper function to get auth headers
async function getAuthHeaders(getToken: () => Promise<string | null>) {
  const token = await getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const policyApi = {
  async create(data: PolicyCreateData, getToken: () => Promise<string | null>) {
    const response = await fetch(`${API_BASE_URL}/api/policies`, {
      method: "POST",
      headers: await getAuthHeaders(getToken),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to create policy: ${response.statusText}`);
    }
    return response.json();
  },

  async list(getToken: () => Promise<string | null>) {
    const response = await fetch(`${API_BASE_URL}/api/policies`, {
      headers: await getAuthHeaders(getToken),
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch policies: ${response.statusText}`);
    }
    return response.json();
  },

  async delete(policyId: string, getToken: () => Promise<string | null>) {
    const response = await fetch(`${API_BASE_URL}/api/policies/${policyId}`, {
      method: "DELETE",
      headers: await getAuthHeaders(getToken),
    });
    if (!response.ok) {
      throw new Error(`Failed to delete policy: ${response.statusText}`);
    }
    return response.json();
  },
};

export const projectApi = {
  async create(data: ProjectCreateData, getToken: () => Promise<string | null>) {
    const response = await fetch(`${API_BASE_URL}/api/projects`, {
      method: "POST",
      headers: await getAuthHeaders(getToken),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to create project: ${response.statusText}`);
    }
    return response.json();
  },

  async list(getToken: () => Promise<string | null>) {
    const response = await fetch(`${API_BASE_URL}/api/projects`, {
      headers: await getAuthHeaders(getToken),
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    return response.json();
  },
};

export const apiKeyApi = {
  async create(data: ApiKeyCreateData, getToken: () => Promise<string | null>) {
    const response = await fetch(`${API_BASE_URL}/api/api-keys`, {
      method: "POST",
      headers: await getAuthHeaders(getToken),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to create API key: ${response.statusText}`);
    }
    return response.json();
  },

  async list(getToken: () => Promise<string | null>) {
    const response = await fetch(`${API_BASE_URL}/api/api-keys`, {
      headers: await getAuthHeaders(getToken),
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch API keys: ${response.statusText}`);
    }
    return response.json();
  },

  async delete(keyId: string, getToken: () => Promise<string | null>) {
    const response = await fetch(`${API_BASE_URL}/api/api-keys/${keyId}`, {
      method: "DELETE",
      headers: await getAuthHeaders(getToken),
    });
    if (!response.ok) {
      throw new Error(`Failed to delete API key: ${response.statusText}`);
    }
    return response.json();
  },
};

// Hook for easier API calls with Clerk auth
export function useApi() {
  const { getToken } = useAuth();
  
  return {
    policies: {
      create: (data: PolicyCreateData) => policyApi.create(data, getToken),
      list: () => policyApi.list(getToken),
      delete: (id: string) => policyApi.delete(id, getToken),
    },
    projects: {
      create: (data: ProjectCreateData) => projectApi.create(data, getToken),
      list: () => projectApi.list(getToken),
    },
    apiKeys: {
      create: (data: ApiKeyCreateData) => apiKeyApi.create(data, getToken),
      list: () => apiKeyApi.list(getToken),
      delete: (id: string) => apiKeyApi.delete(id, getToken),
    },
  };
}
