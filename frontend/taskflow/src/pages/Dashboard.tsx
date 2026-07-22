import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import TaskTable from "../components/TaskTable";
import {
  List,
  LayoutGrid,
  Download,
  ChevronDown,
  Filter,
  Calendar,
  X,
} from "lucide-react";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [activeFilters, setActiveFilters] = useState(["Approved", "Pending"]);

  const removeFilter = (filter: string) => {
    setActiveFilters((prev) => prev.filter((f) => f !== filter));
  };

  return (
    <div className="flex min-h-screen bg-[#f8f9fb]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setSidebarOpen(true)} />

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
                  <span className="hidden xs:inline sm:inline">List</span>
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
                  <span className="hidden xs:inline sm:inline">Grid</span>
                </button>
              </div>

              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download size={16} />
                <span className="hidden sm:inline">Export</span>
              </button>

              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 shadow-sm shadow-purple-200 transition-colors"
              >
                + Add Task
                <ChevronDown size={16} />
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                type="button"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Group By Date
                <ChevronDown size={14} className="text-gray-400" />
              </button>

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
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter size={16} />
                Filters
              </button>

              <button
                type="button"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                <Calendar size={16} className="text-gray-400" />
                10 Mar – 21 Mar, 2026
              </button>
            </div>
          </div>

          {viewMode === "list" ? (
            <TaskTable />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {[
                { title: "Build Login Page", status: "Approved", priority: "High" },
                { title: "API Integration", status: "Pending", priority: "Medium" },
                { title: "Dashboard Design", status: "In Progress", priority: "Low" },
              ].map((task) => (
                <div
                  key={task.title}
                  className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:border-purple-200 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-medium text-gray-400">DC-T535</span>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-md ${
                        task.status === "Approved"
                          ? "bg-emerald-50 text-emerald-700"
                          : task.status === "Pending"
                            ? "bg-orange-50 text-orange-700"
                            : "bg-sky-50 text-sky-700"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">{task.title}</h3>
                  <p className="text-xs text-gray-500">
                    Priority:{" "}
                    <span className="font-medium text-gray-700">{task.priority}</span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
