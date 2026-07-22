import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import type { Task, TaskFormData, TaskPriority, TaskStatus } from "../types/task";
import {
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
  toInputDate,
  formatTaskDate,
} from "../types/task";

export type TaskModalMode = "create" | "edit" | "view";

interface TaskModalProps {
  isOpen: boolean;
  mode: TaskModalMode;
  task?: Task | null;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => Promise<boolean>;
}

const emptyForm: TaskFormData = {
  title: "",
  description: "",
  priority: "Medium",
  status: "Pending",
  due_date: new Date().toISOString().slice(0, 10),
};

const TaskModal = ({ isOpen, mode, task, isLoading = false, onClose, onSubmit }: TaskModalProps) => {
  const [form, setForm] = useState<TaskFormData>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const isView = mode === "view";
  const title =
    mode === "create" ? "Add New Task" : mode === "edit" ? "Edit Task" : "Task Details";

  useEffect(() => {
    if (!isOpen) return;

    if (task && (mode === "edit" || mode === "view")) {
      setForm({
        title: task.title,
        description: task.description ?? "",
        priority: task.priority as TaskPriority,
        status: task.status as TaskStatus,
        due_date: toInputDate(task.due_date),
      });
    } else {
      setForm(emptyForm);
    }
  }, [isOpen, task, mode]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isView) return;

    setSubmitting(true);
    const success = await onSubmit(form);
    setSubmitting(false);

    if (success) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl animate-slideDown max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {isView && task && (
            <div className="flex flex-wrap gap-3 pb-2 border-b border-gray-100 text-xs text-gray-500">
              <span>
                ID: <strong className="text-gray-700">TF-{task.id}</strong>
              </span>
              {task.created_at && (
                <span>
                  Created:{" "}
                  <strong className="text-gray-700">{formatTaskDate(task.created_at)}</strong>
                </span>
              )}
              {task.updated_at && (
                <span>
                  Updated:{" "}
                  <strong className="text-gray-700">{formatTaskDate(task.updated_at)}</strong>
                </span>
              )}
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-8">
              <Loader2 size={28} className="animate-spin text-purple-600" />
              <p className="text-sm text-gray-500">Loading task details...</p>
            </div>
          ) : (
            <>
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Title
                </label>
                <input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  readOnly={isView}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 read-only:bg-gray-50 read-only:text-gray-700"
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  readOnly={isView}
                  rows={3}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 resize-none read-only:bg-gray-50 read-only:text-gray-700"
                  placeholder="Enter task description"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                    disabled={isView}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 disabled:bg-gray-50"
                  >
                    {PRIORITY_OPTIONS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    disabled={isView}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 disabled:bg-gray-50"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Due Date
                </label>
                <input
                  id="due_date"
                  name="due_date"
                  type="date"
                  value={form.due_date}
                  onChange={handleChange}
                  required
                  readOnly={isView}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 read-only:bg-gray-50"
                />
              </div>

              {!isView && (
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-purple-600 rounded-xl hover:bg-purple-700 disabled:opacity-60 transition-colors"
                  >
                    {submitting && <Loader2 size={16} className="animate-spin" />}
                    {mode === "create" ? "Create Task" : "Save Changes"}
                  </button>
                </div>
              )}

              {isView && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
