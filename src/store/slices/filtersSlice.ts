import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { CaseStatus } from "@/types/case";

export interface CaseFilters {
  status: CaseStatus | "ALL";
  clientId?: number;
  courtType?: string;
  dateFrom?: Date;
  dateTo?: Date;
  searchTerm?: string;
}

export interface ClientFilters {
  type?: "INDIVIDUAL" | "COMPANY" | "ALL";
  searchTerm?: string;
  hasActiveCases?: boolean;
}

export interface DeadlineFilters {
  status: "PENDING" | "COMPLETED" | "ALL";
  nextDays?: number;
  caseId?: number;
  type?: string;
}

export interface TaskFilters {
  status: "OPEN" | "IN_PROGRESS" | "COMPLETED" | "ALL";
  assignedTo?: number;
  caseId?: number;
  priority?: "LOW" | "MEDIUM" | "HIGH";
}

export interface FiltersState {
  // Current filters
  caseFilters: CaseFilters;
  clientFilters: ClientFilters;
  deadlineFilters: DeadlineFilters;
  taskFilters: TaskFilters;

  // Saved filter presets
  savedCaseFilters: Record<string, CaseFilters>;
  savedClientFilters: Record<string, ClientFilters>;

  // Actions - Cases
  setCaseFilters: (filters: Partial<CaseFilters>) => void;
  resetCaseFilters: () => void;
  saveCaseFilterPreset: (name: string, filters: CaseFilters) => void;
  applyCaseFilterPreset: (name: string) => void;

  // Actions - Clients
  setClientFilters: (filters: Partial<ClientFilters>) => void;
  resetClientFilters: () => void;
  saveClientFilterPreset: (name: string, filters: ClientFilters) => void;
  applyClientFilterPreset: (name: string) => void;

  // Actions - Deadlines
  setDeadlineFilters: (filters: Partial<DeadlineFilters>) => void;
  resetDeadlineFilters: () => void;

  // Actions - Tasks
  setTaskFilters: (filters: Partial<TaskFilters>) => void;
  resetTaskFilters: () => void;

  // Bulk actions
  resetAllFilters: () => void;
}

const defaultCaseFilters: CaseFilters = {
  status: "ALL",
};

const defaultClientFilters: ClientFilters = {
  type: "ALL",
};

const defaultDeadlineFilters: DeadlineFilters = {
  status: "ALL",
};

const defaultTaskFilters: TaskFilters = {
  status: "ALL",
};

export const useFiltersStore = create<FiltersState>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        caseFilters: defaultCaseFilters,
        clientFilters: defaultClientFilters,
        deadlineFilters: defaultDeadlineFilters,
        taskFilters: defaultTaskFilters,
        savedCaseFilters: {},
        savedClientFilters: {},

        // Case filters
        setCaseFilters: (filters) =>
          set((state) => {
            state.caseFilters = { ...state.caseFilters, ...filters };
          }),

        resetCaseFilters: () =>
          set((state) => {
            state.caseFilters = defaultCaseFilters;
          }),

        saveCaseFilterPreset: (name, filters) =>
          set((state) => {
            state.savedCaseFilters[name] = filters;
          }),

        applyCaseFilterPreset: (name) =>
          set((state) => {
            const preset = state.savedCaseFilters[name];
            if (preset) {
              state.caseFilters = preset;
            }
          }),

        // Client filters
        setClientFilters: (filters) =>
          set((state) => {
            state.clientFilters = { ...state.clientFilters, ...filters };
          }),

        resetClientFilters: () =>
          set((state) => {
            state.clientFilters = defaultClientFilters;
          }),

        saveClientFilterPreset: (name, filters) =>
          set((state) => {
            state.savedClientFilters[name] = filters;
          }),

        applyClientFilterPreset: (name) =>
          set((state) => {
            const preset = state.savedClientFilters[name];
            if (preset) {
              state.clientFilters = preset;
            }
          }),

        // Deadline filters
        setDeadlineFilters: (filters) =>
          set((state) => {
            state.deadlineFilters = { ...state.deadlineFilters, ...filters };
          }),

        resetDeadlineFilters: () =>
          set((state) => {
            state.deadlineFilters = defaultDeadlineFilters;
          }),

        // Task filters
        setTaskFilters: (filters) =>
          set((state) => {
            state.taskFilters = { ...state.taskFilters, ...filters };
          }),

        resetTaskFilters: () =>
          set((state) => {
            state.taskFilters = defaultTaskFilters;
          }),

        // Reset all
        resetAllFilters: () =>
          set((state) => {
            state.caseFilters = defaultCaseFilters;
            state.clientFilters = defaultClientFilters;
            state.deadlineFilters = defaultDeadlineFilters;
            state.taskFilters = defaultTaskFilters;
          }),
      })),
      {
        name: "legal-saas-filters-storage",
        partialize: (state) => ({
          caseFilters: state.caseFilters,
          clientFilters: state.clientFilters,
          deadlineFilters: state.deadlineFilters,
          taskFilters: state.taskFilters,
          savedCaseFilters: state.savedCaseFilters,
          savedClientFilters: state.savedClientFilters,
        }),
      }
    ),
    { name: "Filters Store" }
  )
);
