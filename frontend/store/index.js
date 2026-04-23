import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { nodeTypes } from "../lib/node-types";

const STORAGE_KEY =
  process.env.NEXT_PUBLIC_STORAGE_KEY || "system_design_projects";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Helper to restore icons after loading from JSON
const rehydrateNodes = (nodes) => {
  if (!nodes) return [];
  return nodes.map((node) => {
    // Find the matching node type definition based on the ID stored in data
    // Note: node.data.id is the type ID (e.g. "server"), not the node instance ID
    const nodeType = Object.values(nodeTypes).find(
      (type) => type.id === node.data.id
    );

    if (nodeType && nodeType.iconName) {
      return {
        ...node,
        data: {
          ...node.data,
          icon: nodeType.iconName,
        },
      };
    }
    return node;
  });
};

// Helper to rehydrate a project
const rehydrateProject = (project) => {
  if (!project) return null;
  return {
    ...project,
    nodes: rehydrateNodes(project.nodes),
  };
};

// Load data from localStorage
const loadFromStorage = () => {
  if (typeof window === "undefined")
    return { projects: [], currentProject: null, user: null };

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    console.log("Loading from storage:", stored);
    if (!stored) return { projects: [], currentProject: null, user: null };

    const data = JSON.parse(stored);
    console.log("Parsed data:", data);

    // Rehydrate icons for all projects
    const projects = data.projects ? data.projects.map(rehydrateProject) : [];
    const currentProject = rehydrateProject(data.currentProject);
    const user = data.user || null;

    return { projects, currentProject, user };
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    return { projects: [], currentProject: null, user: null };
  }
};

// Save data to localStorage
const saveToStorage = (data) => {
  if (typeof window === "undefined") return;

  try {
    console.log("Saving to storage:", data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

const useStore = create((set, get) => ({
  // State
  projects: [],
  currentProject: null,
  selectedNode: null,
  isAiAssistantOpen: false,
  isLoading: false,
  user: null,
  isFocusMode: false,
  theme: "default", // default, sketch, cyberpunk
  snapToGrid: true,
  magicConnectEnabled: false,
  tiltEnabled: true,
  toolMode: "select", // select, pan, rectangle, circle, arrow, text, note
  undoStack: [],
  redoStack: [],

  // Sidebar Filters
  sidebarFilters: {
    category: "",
    type: "",
  },

  // Initialize store
  initialize: async () => {
    // Load local storage data first for immediate feedback
    const data = loadFromStorage();
    set({ projects: data.projects, currentProject: data.currentProject, user: data.user });
  },

  // Auth actions
  login: (userData) => {
    set({ user: userData });
    saveToStorage({ ...get(), user: userData });
    get().fetchProjects();
  },

  logout: () => {
    set({ user: null, projects: [], currentProject: null });
    localStorage.removeItem(STORAGE_KEY);
  },

  // Tool actions
  setToolMode: (mode) => set({ toolMode: mode }),

  // History actions
  undo: () => {
    const { undoStack, redoStack, currentProject } = get();
    if (undoStack.length === 0 || !currentProject) return;

    const previousState = undoStack[undoStack.length - 1];
    const newUndoStack = undoStack.slice(0, -1);
    const newRedoStack = [...redoStack, currentProject];

    set({
      currentProject: previousState,
      undoStack: newUndoStack,
      redoStack: newRedoStack,
    });
    saveToStorage({ projects: get().projects, currentProject: previousState, user: get().user });
  },

  redo: () => {
    const { undoStack, redoStack, currentProject } = get();
    if (redoStack.length === 0 || !currentProject) return;

    const nextState = redoStack[redoStack.length - 1];
    const newRedoStack = redoStack.slice(0, -1);
    const newUndoStack = [...undoStack, currentProject];

    set({
      currentProject: nextState,
      undoStack: newUndoStack,
      redoStack: newRedoStack,
    });
    saveToStorage({ projects: get().projects, currentProject: nextState, user: get().user });
  },

  // Project actions
  fetchProjects: async () => {
    const { user } = get();
    if (!user) return;

    try {
      set({ isLoading: true });
      const res = await fetch(`${API_URL}/api/projects?userId=${user.id}`);
      if (res.ok) {
        const projects = await res.json();
        const rehydratedProjects = projects.map(rehydrateProject);
        set({ projects: rehydratedProjects });
        saveToStorage({ projects: rehydratedProjects, currentProject: get().currentProject, user: get().user });
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  createProject: async (name, description = "") => {
    const { user } = get();
    const newProject = {
      id: uuidv4(),
      name,
      description,
      nodes: [],
      edges: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const state = get();
    const updatedProjects = [...state.projects, newProject];
    const newState = { projects: updatedProjects, currentProject: newProject };

    set(newState);
    saveToStorage({ ...newState, user: user });

    if (user) {
      try {
        await fetch(`${API_URL}/api/projects`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, project: newProject }),
        });
      } catch (error) {
        console.error("Failed to save project to DB:", error);
      }
    }

    return newProject;
  },

  deleteProject: async (projectId) => {
    const { user } = get();
    const state = get();
    const updatedProjects = state.projects.filter((p) => p.id !== projectId);
    const newCurrentProject =
      state.currentProject?.id === projectId ? null : state.currentProject;
    const newState = {
      projects: updatedProjects,
      currentProject: newCurrentProject,
    };

    set(newState);
    saveToStorage({ ...newState, user: user });

    if (user) {
      try {
        await fetch(`${API_URL}/api/projects/${projectId}`, { method: 'DELETE' });
      } catch (error) {
        console.error("Failed to delete project from DB:", error);
      }
    }
  },

  setCurrentProject: (project) => {
    const state = get();
    const newState = { ...state, currentProject: project, undoStack: [], redoStack: [] };
    set(newState);
    saveToStorage({ projects: state.projects, currentProject: project, user: state.user });
  },

  updateCurrentProject: async (updates) => {
    const { user, currentProject, undoStack } = get();
    if (!currentProject) return;

    // Push current state to undo stack before updating
    // Only push if not just updating timestamp or minor UI state
    // For simplicity, we'll push on every update for now, but in production you'd debounce or filter
    const newUndoStack = [...undoStack, currentProject];
    // Limit stack size
    if (newUndoStack.length > 50) newUndoStack.shift();

    const updatedProject = {
      ...currentProject,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const state = get();
    const updatedProjects = state.projects.map((p) =>
      p.id === updatedProject.id ? updatedProject : p
    );

    const newState = {
      projects: updatedProjects,
      currentProject: updatedProject,
      undoStack: newUndoStack,
      redoStack: [], // Clear redo stack on new change
    };
    set(newState);
    saveToStorage({ ...newState, user: user });

    if (user) {
      try {
        await fetch(`${API_URL}/api/projects`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, project: updatedProject }),
        });
      } catch (error) {
        console.error("Failed to update project in DB:", error);
      }
    }
  },

  // Node and Edge actions
  updateNodes: (nodes) => {
    get().updateCurrentProject({ nodes });
  },

  updateEdges: (edges) => {
    get().updateCurrentProject({ edges });
  },

  // UI actions
  setSelectedNode: (node) => set({ selectedNode: node }),
  setAiAssistantOpen: (isOpen) => set({ isAiAssistantOpen: isOpen }),
  setLoading: (isLoading) => set({ isLoading }),
  componentSearchQuery: "",
  componentSearchQuery: "",
  setComponentSearchQuery: (query) => set({ componentSearchQuery: query }),
  setSidebarFilters: (filters) => set({ sidebarFilters: filters }),
  toggleFocusMode: () => set((state) => ({ isFocusMode: !state.isFocusMode })),
  setTheme: (theme) => set({ theme }),
  toggleSnapToGrid: () => set((state) => ({ snapToGrid: !state.snapToGrid })),
  toggleMagicConnect: () => set((state) => ({ magicConnectEnabled: !state.magicConnectEnabled })),
  toggleTilt: () => set((state) => ({ tiltEnabled: !state.tiltEnabled })),

  // Export project
  exportProject: (format = "json") => {
    const state = get();
    if (!state.currentProject) return null;

    const exportData = {
      ...state.currentProject,
      exportedAt: new Date().toISOString(),
      format,
    };

    return exportData;
  },

  // Import project
  importProject: (projectData) => {
    const importedProject = {
      ...projectData,
      id: uuidv4(),
      importedAt: new Date().toISOString(),
      nodes: rehydrateNodes(projectData.nodes),
    };

    const state = get();
    const updatedProjects = [...state.projects, importedProject];
    const newState = {
      projects: updatedProjects,
      currentProject: importedProject,
    };

    set(newState);
    saveToStorage({ ...newState, user: get().user });

    return importedProject;
  },

  loadProject: (project) => {
    const rehydratedProject = rehydrateProject(project);
    get().setCurrentProject(rehydratedProject);
  },
}));

export default useStore;
