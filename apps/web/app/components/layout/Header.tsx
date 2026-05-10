'use client';

import { Bell, Search, User, LogOut, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth/useAuth';

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-800 bg-gray-900/80 px-6 backdrop-blur-sm">
      <h1 className="text-lg font-headline font-semibold text-white">
        {title}
      </h1>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="search"
            placeholder="Search..."
            className="h-9 w-64 rounded-md bg-gray-800 border border-gray-700 pl-10 pr-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md">
          <Bell size={20} />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-tertiary"></span>
        </button>

        {/* User menu */}
        <div className="relative group">
          <button className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-800 transition-colors">
            <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
              <User size={16} className="text-gray-300" />
            </div>
          </button>

          <div className="absolute right-0 top-full mt-2 w-56 rounded-md bg-gray-800 border border-gray-700 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            <div className="p-3 border-b border-gray-700">
              <p className="text-sm font-medium text-white">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {user?.email}
              </p>
            </div>
            <div className="p-1">
              <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md">
                <Settings size={16} />
                Settings
              </button>
              <button
                onClick={logout}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
