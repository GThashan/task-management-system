import {
  LayoutDashboard,
  CheckSquare,
  Clock,
  ChevronDown,
  X,
} from "lucide-react";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ isOpen = false, onClose }: SidebarProps) => {
  const mainNav: NavItem[] = [
    { icon: <LayoutDashboard size={18} />, label: "Dashboard" },
    { icon: <CheckSquare size={18} />, label: "Tasks", active: true },
  
  ];

 
  const sidebarContent = (
    <>
      <div className="flex items-center justify-between p-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-purple-600 flex items-center justify-center text-white shadow-sm">
            <Clock size={20} />
          </div>
          <span className="text-lg font-bold text-gray-900">TaskFlow</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="md:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      <div className="px-4 py-4">
        <button
          type="button"
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50/50 hover:bg-gray-50 transition-colors text-left"
        >
          <span className="text-sm font-medium text-gray-700 truncate">
            TaskFlow Team
          </span>
          <ChevronDown size={16} className="text-gray-400 shrink-0 ml-2" />
        </button>
      </div>

      <nav className="flex-1 px-3 overflow-y-auto">
        <ul className="space-y-0.5">
          {mainNav.map((item) => (
            <li key={item.label}>
              <a
                href="#"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  item.active
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className={item.active ? "text-gray-700" : "text-gray-400"}>
                  {item.icon}
                </span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>

      
        
      </nav>
    </>
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50
          w-64 bg-white border-r border-gray-200
          flex flex-col min-h-screen
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
