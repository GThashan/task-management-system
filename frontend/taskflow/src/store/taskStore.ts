import { create } from "zustand";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { tasksApi, ApiError } from "../services/api";
import { useAuthStore } from "./authStore";
import type { Task, TaskFormData, TaskFilters } from "../types/task";

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  selectedTask: Task | null;
  fetchTasks: (filters?: TaskFilters) => Promise<void>;
  fetchTaskById: (id: number) => Promise<Task | null>;
  createTask: (data: TaskFormData) => Promise<boolean>;
  updateTask: (id: number, data: TaskFormData) => Promise<boolean>;
  deleteTask: (id: number) => Promise<boolean>;
  confirmDeleteTask: (id: number, title: string) => Promise<void>;
  setSelectedTask: (task: Task | null) => void;
}

const getToken = () => useAuthStore.getState().token;

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  selectedTask: null,

  fetchTasks: async (filters) => {
    const token = getToken();
    if (!token) return;

    set({ isLoading: true });
    try {
      const tasks = await tasksApi.getAll(token, filters);
      set({ tasks, isLoading: false });
    } catch (err) {
      set({ isLoading: false });
      toast.error(err instanceof ApiError ? err.message : "Failed to load tasks");
    }
  },

  fetchTaskById: async (id) => {
    const token = getToken();
    if (!token) return null;

    try {
      const task = await tasksApi.getById(token, id);
      set({ selectedTask: task });
      return task;
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to load task");
      return null;
    }
  },

  createTask: async (data) => {
    const token = getToken();
    if (!token) return false;

    try {
      await tasksApi.create(token, data);
      toast.success("Task created successfully");
      await get().fetchTasks();
      return true;
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to create task");
      return false;
    }
  },

  updateTask: async (id, data) => {
    const token = getToken();
    if (!token) return false;

    try {
      await tasksApi.update(token, id, data);
      toast.success("Task updated successfully");
      await get().fetchTasks();
      return true;
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update task");
      return false;
    }
  },

  deleteTask: async (id) => {
    const token = getToken();
    if (!token) return false;

    try {
      await tasksApi.delete(token, id);
      toast.success("Task deleted successfully");
      set({ tasks: get().tasks.filter((t) => t.id !== id) });
      return true;
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to delete task");
      return false;
    }
  },

  confirmDeleteTask: async (id, title) => {
    const result = await Swal.fire({
      title: "Delete task?",
      html: `Are you sure you want to delete <strong>${title}</strong>? This cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#9333ea",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      await get().deleteTask(id);
    }
  },

  setSelectedTask: (task) => set({ selectedTask: task }),
}));
