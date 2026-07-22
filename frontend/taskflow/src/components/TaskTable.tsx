import { useState, useMemo, Fragment } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type Row,
} from "@tanstack/react-table";
import { ChevronDown, ChevronUp, Eye, Pencil, Trash2, Loader2 } from "lucide-react";
import type { Task, TaskPriority, TaskStatus } from "../types/task";
import { formatTaskDate } from "../types/task";
import { useTaskStore } from "../store/taskStore";

interface TaskTableProps {
  tasks: Task[];
  isLoading: boolean;
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
}

const priorityStyles: Record<TaskPriority, string> = {
  High: "bg-red-50 text-red-700 ring-red-100",
  Medium: "bg-amber-50 text-amber-700 ring-amber-100",
  Low: "bg-blue-50 text-blue-700 ring-blue-100",
};

const statusStyles: Record<TaskStatus, string> = {
  Pending: "bg-orange-50 text-orange-700",
  "In Progress": "bg-sky-50 text-sky-700",
  Completed: "bg-emerald-50 text-emerald-700",
};

const priorityDot: Record<TaskPriority, string> = {
  High: "bg-red-500",
  Medium: "bg-amber-500",
  Low: "bg-blue-500",
};

const columnHelper = createColumnHelper<Task>();

const TaskTable = ({ tasks, isLoading, onView, onEdit }: TaskTableProps) => {
  const confirmDeleteTask = useTaskStore((s) => s.confirmDeleteTask);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "select",
        header: () => (
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            aria-label="Select all"
          />
        ),
        cell: () => (
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            aria-label="Select row"
          />
        ),
      }),
      columnHelper.accessor("title", {
        header: "Task / Issues",
        cell: (info) => {
          const row = info.row.original;
          const priority = row.priority as TaskPriority;
          return (
            <div className="flex items-center gap-2.5 min-w-[180px]">
              <span className={`w-2 h-2 rounded-full shrink-0 ${priorityDot[priority]}`} />
              <span className="text-xs font-medium text-gray-400 shrink-0">
                TF-{row.id}
              </span>
              <span className="text-sm font-medium text-gray-900 truncate">
                {info.getValue()}
              </span>
            </div>
          );
        },
      }),
      columnHelper.accessor("description", {
        header: "Description",
        cell: (info) => (
          <span className="text-sm text-gray-600 truncate max-w-[200px] block">
            {info.getValue() || "—"}
          </span>
        ),
      }),
      columnHelper.accessor("priority", {
        header: "Priority",
        cell: (info) => {
          const priority = info.getValue() as TaskPriority;
          return (
            <span
              className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ring-1 ring-inset ${priorityStyles[priority]}`}
            >
              {priority}
            </span>
          );
        },
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
          const status = info.getValue() as TaskStatus;
          return (
            <span
              className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${statusStyles[status]}`}
            >
              {status}
            </span>
          );
        },
      }),
      columnHelper.accessor("due_date", {
        header: "Due Date",
        cell: (info) => (
          <span className="text-sm text-gray-600 whitespace-nowrap">
            {formatTaskDate(info.getValue())}
          </span>
        ),
      }),
      columnHelper.display({
        id: "view",
        header: "View",
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => onView(row.original)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
            title="View task"
          >
            <Eye size={14} />
            View
          </button>
        ),
      }),
      columnHelper.display({
        id: "edit",
        header: "Update",
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => onEdit(row.original)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-purple-600 bg-purple-50 border border-purple-100 rounded-lg hover:bg-purple-100 transition-colors"
            title="Edit task"
          >
            <Pencil size={14} />
            Edit
          </button>
        ),
      }),
      columnHelper.display({
        id: "delete",
        header: "Delete",
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => confirmDeleteTask(row.original.id, row.original.title)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-colors"
            title="Delete task"
          >
            <Trash2 size={14} />
            Delete
          </button>
        ),
      }),
    ],
    [onView, onEdit, confirmDeleteTask]
  );

  const table = useReactTable({
    data: tasks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  const groupedRows = table.getRowModel().rows.reduce<Record<string, Row<Task>[]>>(
    (acc, row) => {
      const date = formatTaskDate(row.original.due_date);
      if (!acc[date]) acc[date] = [];
      acc[date].push(row);
      return acc;
    },
    {}
  );

  const toggleGroup = (date: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [date]: prev[date] === false,
    }));
  };

  const isGroupExpanded = (date: string) => expandedGroups[date] !== false;

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 flex flex-col items-center justify-center gap-3">
        <Loader2 size={32} className="animate-spin text-purple-600" />
        <p className="text-sm text-gray-500">Loading tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
        <p className="text-gray-900 font-medium mb-1">No tasks yet</p>
        <p className="text-sm text-gray-500">Create your first task to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-gray-100 bg-gray-50/50">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {Object.entries(groupedRows).map(([date, rows]) => {
              const expanded = isGroupExpanded(date);
              return (
                <Fragment key={date}>
                  <tr className="bg-gray-50/80 border-b border-gray-100">
                    <td colSpan={columns.length} className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => toggleGroup(date)}
                          className="flex items-center gap-2 text-sm font-semibold text-gray-900"
                        >
                          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          {date}
                        </button>
                        <span className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded-full border border-gray-200">
                          {rows.length} items
                        </span>
                      </div>
                    </td>
                  </tr>
                  {expanded &&
                    rows.map((row) => (
                      <tr
                        key={row.id}
                        className="border-b border-gray-50 hover:bg-purple-50/30 transition-colors"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="px-4 py-3.5 whitespace-nowrap">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-100 bg-gray-50/30">
        <p className="text-sm text-gray-500">
          Showing {table.getRowModel().rows.length} of {tasks.length} tasks
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </button>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskTable;
