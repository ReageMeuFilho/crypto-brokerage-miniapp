"use client";

import { Search, Bell, Menu } from "lucide-react";
import { useState } from "react";

interface TopHeaderProps {
  title?: string;
  showSearch?: boolean;
  showNotifications?: boolean;
  showMenu?: boolean;
}

export function TopHeader({
  title,
  showSearch = true,
  showNotifications = true,
  showMenu = false,
}: TopHeaderProps) {
  const [notificationCount] = useState(3);

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 safe-area-inset-top">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Left side */}
        <div className="flex items-center gap-3">
          {showMenu && (
            <button
              className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          {title && (
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h1>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {showSearch && (
            <button
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          )}
          {showNotifications && (
            <button
              className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                  {notificationCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

