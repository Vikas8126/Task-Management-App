import React, { useState } from "react";
import { Search, CheckCircle, Bell, Menu } from "lucide-react";

interface NavbarProps {
  totalTasks: number;
  completedTasks: number;
  onSearch: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  totalTasks,
  completedTasks,
  onSearch,
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 w-full z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Left - Logo + Mobile Menu */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            {/* Mobile Menu Icon */}
            <button className="lg:hidden p-2 rounded-md hover:bg-gray-100 text-gray-600">
              <Menu className="h-5 w-5" />
            </button>

            {/* Logo */}
             <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent whitespace-nowrap">
              TaskFlow
            </h1>
          </div>

          {/* Center - Responsive Search */}
          <div className="flex-1 max-w-md md:max-w-lg lg:max-w-2xl mx-4">
            <div
              className={`relative transition-all duration-300 ${
                isSearchFocused ? "scale-105" : ""
              }`}
            >
              {/* Search Icon */}
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search
                  className={`h-5 w-5 transition-colors duration-200 ${
                    isSearchFocused ? "text-blue-500" : "text-gray-400"
                  }`}
                />
              </div>

              {/* Input */}
              <input
                type="text"
                placeholder="Search projects and tasks..."
                className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-200 bg-gray-50
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:bg-white
                           placeholder-gray-400 text-gray-700 text-sm sm:text-base
                           transition-all duration-300 outline-none"
                onChange={(e) => onSearch(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
            </div>
          </div>

          {/* Right - Stats + Controls */}
          <div className="flex items-center space-x-3 sm:space-x-5 flex-shrink-0">
            {/* Task Progress */}
            <div className="hidden md:flex items-center bg-green-50 px-3 py-1.5 rounded-full shadow-sm">
              <CheckCircle className="h-4 w-4 text-green-600 mr-1.5" />
              <span className="text-sm font-medium text-green-700 whitespace-nowrap">
                {completedTasks}/{totalTasks}
              </span>
            </div>

            {/* % Progress - Desktop only */}
            <span className="hidden xl:inline text-xs text-gray-500 whitespace-nowrap">
              {totalTasks > 0
                ? Math.round((completedTasks / totalTasks) * 100)
                : 0}
              % Complete
            </span>

            {/* Mobile/Tablet Progress */}
            <div className="md:hidden flex items-center bg-green-50 px-2 py-1 rounded-full shadow-sm">
              <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm font-medium text-green-700">
                {completedTasks}/{totalTasks}
              </span>
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
              <Bell className="h-5 w-5" />
              {totalTasks > 0 && (
                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-blue-500 rounded-full ring-2 ring-white"></span>
              )}
            </button>

            {/* Avatar */}
            <div className="h-9 w-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold cursor-pointer hover:scale-105 transition-transform shadow">
              <span className="text-sm">V</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
