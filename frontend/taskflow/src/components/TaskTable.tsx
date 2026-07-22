import { useState, Fragment } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type Row,
} from "@tanstack/react-table";
import { MoreVertical, ChevronDown, ChevronUp } from "lucide-react";

type Task = {
  id: string;
  title: string;
  assignee: string;
  priority: "High" | "Medium" | "Low";
  status: "Pending" | "In Progress" | "Completed" | "Approved";
  dueDate: string;
  groupDate: string;
};

const tasks: Task[] = [
  {
    id: "DC-T535",
    title: "Build Login Page",
    assignee: "Dibbendo",
    priority: "High",
    status: "Approved",
    dueDate: "2026-07-25",
    groupDate: "12/10/2023",
  },
  {
    id: "DC-T536",
    title: "API Integration",
    assignee: "Sarah Chen",
    priority: "Medium",
    status: "Pending",
    dueDate: "2026-07-30",
    groupDate: "12/10/2023",
  },
  {
    id: "DC-T537",
    title: "Dashboard Design",
    assignee: "Mike Ross",
    priority: "Low",
    status: "In Progress",
    dueDate: "2026-08-01",
    groupDate: "12/10/2023",
  },
  {
    id: "DC-T540",
    title: "User Authentication Flow",
    assignee: "Dibbendo",
    priority: "High",
    status: "Completed",
    dueDate: "2026-07-20",
    groupDate: "11/10/2023",
  },
  {
    id: "DC-T541",
    title: "Email Notification System",
    assignee: "Sarah Chen",
    priority: "Medium",
    status: "Pending",
    dueDate: "2026-08-05",
    groupDate: "11/10/2023",
  },
];

const priorityStyles: Record<Task["priority"], string> = {
  High: "bg-red-50 text-red-700 ring-red-100",
  Medium: "bg-amber-50 text-amber-700 ring-amber-100",
  Low: "bg-blue-50 text-blue-700 ring-blue-100",
};

const statusStyles: Record<Task["status"], string> = {
  Approved: "bg-emerald-50 text-emerald-700",
  Pending: "bg-orange-50 text-orange-700",
  "In Progress": "bg-sky-50 text-sky-700",
  Completed: "bg-emerald-50 text-emerald-700",
};

const priorityDot: Record<Task["priority"], string> = {
  High: "bg-red-500",
  Medium: "bg-amber-500",
  Low: "bg-blue-500",
};

const columnHelper = createColumnHelper<Task>();

const columns = [
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
      return (
        <div className="flex items-center gap-2.5 min-w-[180px]">
          <span className={`w-2 h-2 rounded-full shrink-0 ${priorityDot[row.priority]}`} />
          <span className="text-xs font-medium text-gray-400 shrink-0">{row.id}</span>
          <span className="text-sm font-medium text-gray-900 truncate">{info.getValue()}</span>
        </div>
      );
    },
  }),
  columnHelper.accessor("assignee", {
    header: "User",
    cell: (info) => (
      <span className="text-sm text-gray-700 whitespace-nowrap">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("priority", {
    header: "Priority",
    cell: (info) => (
      <span
        className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ring-1 ring-inset ${priorityStyles[info.getValue()]}`}
      >
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => (
      <span
        className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${statusStyles[info.getValue()]}`}
      >
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("dueDate", {
    header: "Due Date",
    cell: (info) => (
      <span className="text-sm text-gray-600 whitespace-nowrap">{info.getValue()}</span>
    ),
  }),
  columnHelper.display({
    id: "actions",
    header: "",
    cell: () => (
      <button
        type="button"
        className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        aria-label="Row actions"
      >
        <MoreVertical size={16} />
      </button>
    ),
  }),
];

const TaskTable = () => {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const table = useReactTable({
    data: tasks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  const groupedRows = table.getRowModel().rows.reduce<Record<string, Row<Task>[]>>(
    (acc, row) => {
      const date = row.original.groupDate;
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

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-gray-100 bg-gray-50/50">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
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
                  <tr key={`group-${date}`} className="bg-gray-50/80 border-b border-gray-100">
                    <td colSpan={columns.length} className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          aria-label={`Select group ${date}`}
                        />
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
                        <button
                          type="button"
                          className="text-xs text-red-500 hover:text-red-600 font-medium ml-auto sm:ml-0"
                        >
                          Delete
                        </button>
                        <span className="hidden sm:inline text-xs text-gray-400">
                          Priority: Ascending
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
                          <td key={cell.id} className="px-4 py-3.5">
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
