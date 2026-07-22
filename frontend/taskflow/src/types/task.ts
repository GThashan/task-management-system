export type TaskPriority = "High" | "Medium" | "Low";
export type TaskStatus = "Pending" | "In Progress" | "Completed";

export interface Task {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string;
  created_at: string;
  updated_at: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string;
}

export interface TaskFilters {
  search?: string;
  status?: string;
  priority?: string;
  sort?: "newest" | "oldest" | "due_date";
}

export const PRIORITY_OPTIONS: TaskPriority[] = ["High", "Medium", "Low"];
export const STATUS_OPTIONS: TaskStatus[] = ["Pending", "In Progress", "Completed"];

export function formatTaskDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function toInputDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr.slice(0, 10);
  return date.toISOString().slice(0, 10);
}
