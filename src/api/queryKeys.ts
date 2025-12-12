// Centralized query keys for better maintainability and type safety
export const queryKeys = {
  // Auth
  auth: {
    user: () => ["auth", "user"] as const,
  },

  // Clients
  clients: {
    all: () => ["clients"] as const,
    detail: (id: number) => ["clients", id] as const,
    cases: (clientId: number) => ["clients", clientId, "cases"] as const,
  },

  // Cases
  cases: {
    all: () => ["cases"] as const,
    filtered: (filters: Record<string, any>) => ["cases", filters] as const,
    detail: (id: number) => ["cases", id] as const,
    deadlines: (caseId: number) => ["cases", caseId, "deadlines"] as const,
    tasks: (caseId: number) => ["cases", caseId, "tasks"] as const,
  },

  // Deadlines
  deadlines: {
    all: () => ["deadlines"] as const,
    filtered: (filters: Record<string, any>) => ["deadlines", filters] as const,
    upcoming: (days: number) => ["deadlines", { nextDays: days }] as const,
  },

  // Tasks
  tasks: {
    all: () => ["tasks"] as const,
    filtered: (filters: Record<string, any>) => ["tasks", filters] as const,
    byStatus: (status: string) => ["tasks", { status }] as const,
  },
} as const;

