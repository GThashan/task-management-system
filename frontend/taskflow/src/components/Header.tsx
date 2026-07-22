import { Search, Clock, Bell, ChevronDown, Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="flex items-center gap-3 px-4 py-3 md:px-6 md:py-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-1 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="search"
              placeholder="Search tasks, projects..."
              className="w-full pl-10 pr-16 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all"
            />
            <kbd className="hidden sm:inline-flex absolute right-3 top-1/2 -translate-y-1/2 items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-gray-400 bg-white border border-gray-200 rounded">
              ⌘ K
            </kbd>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 md:gap-4 shrink-0">
          <button
            type="button"
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            aria-label="Time tracker"
          >
            <Clock size={20} />
          </button>

          <button
            type="button"
            className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
          </button>

          <div className="hidden sm:block w-px h-8 bg-gray-200" />

          <button
            type="button"
            className="flex items-center gap-2 md:gap-3 p-1.5 md:p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold shrink-0">
              D
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-900 leading-tight">Dibbendo</p>
              <p className="text-xs text-gray-500 leading-tight">Designer</p>
            </div>
            <ChevronDown size={16} className="hidden md:block text-gray-400" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
