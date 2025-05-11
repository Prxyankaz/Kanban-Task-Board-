import { createStore } from "zustand/vanilla";
import { useStore } from "zustand";

export type TaskStatus = "todo" | "inProgress" | "done";

export interface Task {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  dueDate: string;
  status: TaskStatus;
  projectId: string;
}

export interface Project {
  id: string;
  name: string;
}

interface KanbanState {
  projects: Project[];
  tasks: Task[];
  currentProjectId: string | null;
  addProject: (name: string) => void;
  renameProject: (id: string, name: string) => void;
  deleteProject: (id: string) => void;
  setCurrentProject: (id: string) => void;
  addTask: (task: Omit<Task, "id" | "createdAt">) => void;
  updateTask: (id: string, task: Partial<Omit<Task, "id">>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, status: TaskStatus) => void;
}

const createKanbanStore = () =>
  createStore<KanbanState>((set) => ({
    projects: [],
    tasks: [],
    currentProjectId: null,
    addProject: (name) =>
      set((state) => {
        const newProject = { id: Date.now().toString(), name };
        return {
          projects: [...state.projects, newProject],
          currentProjectId:
            state.projects.length === 0 ? newProject.id : state.currentProjectId,
        };
      }),
    renameProject: (id, name) =>
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === id ? { ...p, name } : p
        ),
      })),
    deleteProject: (id) =>
      set((state) => {
        const filteredProjects = state.projects.filter((p) => p.id !== id);
        const filteredTasks = state.tasks.filter((t) => t.projectId !== id);
        return {
          projects: filteredProjects,
          tasks: filteredTasks,
          currentProjectId:
            state.currentProjectId === id
              ? filteredProjects.length > 0
                ? filteredProjects[0].id
                : null
              : state.currentProjectId,
        };
      }),
    setCurrentProject: (id) => set({ currentProjectId: id }),
    addTask: (task) =>
      set((state) => ({
        tasks: [
          ...state.tasks,
          {
            ...task,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
          },
        ],
      })),
    updateTask: (id, updatedTask) =>
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === id ? { ...t, ...updatedTask } : t
        ),
      })),
    deleteTask: (id) =>
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
      })),
    moveTask: (id, status) =>
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === id ? { ...t, status } : t
        ),
      })),
  }));

export const vanillaStore = createKanbanStore();
export const useKanbanStore = () => useStore(vanillaStore);

export const loadFromLocalStorage = () => {
  try {
    const saved = localStorage.getItem("kanbanState");
    if (saved) {
      vanillaStore.setState(JSON.parse(saved));
    }
  } catch (e) {
    console.error("Error loading state:", e);
  }
};

vanillaStore.subscribe(() => {
  try {
    const state = vanillaStore.getState();
    localStorage.setItem(
      "kanbanState",
      JSON.stringify({
        projects: state.projects,
        tasks: state.tasks,
        currentProjectId: state.currentProjectId,
      })
    );
  } catch (e) {
    console.error("Error saving state:", e);
  }
});
