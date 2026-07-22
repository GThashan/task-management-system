import { useState, useEffect, useMemo, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import TaskTable from "../components/TaskTable";
import TaskModal, { type TaskModalMode } from "../components/TaskModal";
import {
  List,
  LayoutGrid,
  ChevronDown,
  Filter,
  Calendar,
  X,
  Eye,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";
import { useTaskStore } from "../store/taskStore";
import type { Task, TaskStatus } from "../types/task";
import { formatTaskDate } from "../types/task";

const STATUS_FILTERS: TaskStatus[] = ["Pending", "In Progress", "Completed"];

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<TaskModalMode>("create");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [viewLoading, setViewLoading] = useState(false);

  const { tasks, isLoading, fetchTasks, fetchTaskById, createTask, updateTask, confirmDeleteTask } =
    useTaskStore();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchTasks(debouncedSearch ? { search: debouncedSearch } : undefined);
  }, [fetchTasks, debouncedSearch]);

  const filteredTasks = useMemo(() => {
    if (activeFilters.length === 0) return tasks;
    return tasks.filter((t) => activeFilters.includes(t.status));
  }, [tasks, activeFilters]);

  const toggleFilter = (status: string) => {
    setActiveFilters((prev) =>
      prev.includes(status) ? prev.filter((f) => f !== status) : [...prev, status]
    );
  };

  const removeFilter = (filter: string) => {
    setActiveFilters((prev) => prev.filter((f) => f !== filter));
  };

  const openModal = useCallback(
    async (mode: TaskModalMode, task: Task | null = null) => {
      setModalMode(mode);
      setModalOpen(true);

      if (mode === "view" && task) {
        setViewLoading(true);
        setSelectedTask(task);
        const fresh = await fetchTaskById(task.id);
        setSelectedTask(fresh ?? task);
        setViewLoading(false);
      } else {
        setSelectedTask(task);
      }
    },
    [fetchTaskById]
  );

  const closeModal = () => {
    setModalOpen(false);
    setSelectedTask(null);
    setViewLoading(false);
  };

  const handleModalSubmit = async (data: Parameters<typeof createTask>[0]) => {
    if (modalMode === "create") return createTask(data);
    if (modalMode === "edit" && selectedTask) return updateTask(selectedTask.id, data);
    return false;
  };

  const statusColor = (status: string) => {
    if (status === "Completed") return "bg-emerald-50 text-emerald-700";
    if (status === "Pending") return "bg-orange-50 text-orange-700";
    return "bg-sky-50 text-sky-700";
  };

  return (
    <div className="flex min-h-screen bg-[#f8f9fb]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-2xl md:text-[28px] font-bold text-gray-900 tracking-tight">
              Tasks
            </h1>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    viewMode === "list"
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <List size={16} />
                  <span className="hidden sm:inline">List</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    viewMode === "grid"
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <LayoutGrid size={16} />
                  <span className="hidden sm:inline">Grid</span>
                </button>
              </div>

              

              <button
                type="button"
                onClick={() => openModal("create")}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 shadow-sm shadow-purple-200 transition-colors"
              >
                + Add Task
                <ChevronDown size={16} />
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="relative group">
                <button
                  type="button"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Filter by Status
                  <ChevronDown size={14} className="text-gray-400" />
                </button>
                <div className="hidden group-hover:block absolute top-full left-0 mt-1 w-44 bg-white rounded-xl border border-gray-200 shadow-lg py-1 z-10">
                  {STATUS_FILTERS.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => toggleFilter(status)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                        activeFilters.includes(status)
                          ? "text-purple-600 font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {activeFilters.map((filter) => (
                <span
                  key={filter}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-purple-700 bg-purple-50 border border-purple-100 rounded-lg"
                >
                  {filter}
                  <button
                    type="button"
                    onClick={() => removeFilter(filter)}
                    className="text-purple-400 hover:text-purple-600"
                    aria-label={`Remove ${filter} filter`}
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}

              {activeFilters.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveFilters([])}
                  className="text-sm font-medium text-purple-600 hover:text-purple-700"
                >
                  Clear Filter
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() =>
                  fetchTasks(debouncedSearch ? { search: debouncedSearch } : undefined)
                }
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter size={16} />
                Refresh
              </button>

              <button
                type="button"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                <Calendar size={16} className="text-gray-400" />
                {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}
              </button>
            </div>
          </div>

          {viewMode === "list" ? (
            <TaskTable
              tasks={filteredTasks}
              isLoading={isLoading}
              onView={(task) => openModal("view", task)}
              onEdit={(task) => openModal("edit", task)}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {isLoading ? (
                <div className="col-span-full flex flex-col items-center justify-center gap-3 py-12">
                  <Loader2 size={32} className="animate-spin text-purple-600" />
                  <p className="text-sm text-gray-500">Loading tasks...</p>
                </div>
              ) : filteredTasks.length === 0 ? (
                <p className="col-span-full text-center text-gray-500 py-12">No tasks found.</p>
              ) : (
                filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:border-purple-200 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-xs font-medium text-gray-400">TF-{task.id}</span>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-md ${statusColor(task.status)}`}
                      >
                        {task.status}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">{task.title}</h3>
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                      {task.description || "No description"}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span>
                        Priority:{" "}
                        <span className="font-medium text-gray-700">{task.priority}</span>
                      </span>
                      <span>Due: {formatTaskDate(task.due_date)}</span>
                    </div>
                    <div className="flex gap-2 pt-3 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => openModal("view", task)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100"
                      >
                        <Eye size={14} /> View
                      </button>
                      <button
                        type="button"
                        onClick={() => openModal("edit", task)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100"
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => confirmDeleteTask(task.id, task.title)}
                        className="flex items-center justify-center p-2 text-red-500 bg-red-50 rounded-lg hover:bg-red-100"
                        aria-label="Delete task"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </main>
      </div>

      <TaskModal
        isOpen={modalOpen}
        mode={modalMode}
        task={selectedTask}
        isLoading={viewLoading}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};

export default Dashboard;
