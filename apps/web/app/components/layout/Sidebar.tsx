'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Code2,
  FileText,
  Bot,
  BarChart3,
  ClipboardCheck,
  Key,
  FileSearch,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navigation = [
  { name: 'Overview', href: '/overview', icon: LayoutDashboard },
  { name: 'Services', href: '/services', icon: Code2 },
  { name: 'Docs', href: '/docs', icon: FileText },
  { name: 'Copilot', href: '/copilot', icon: Bot },
  { name: 'Observability', href: '/observability', icon: BarChart3 },
  { name: 'Evaluations', href: '/evaluations', icon: ClipboardCheck },
  { name: 'API Keys', href: '/api-keys', icon: Key },
  { name: 'Audit Logs', href: '/audit-logs', icon: FileSearch },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-gray-900 border-r border-gray-800 transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-gray-800 px-4">
        {!collapsed && (
          <Link href="/overview" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-gradient-to-br from-teal-500 to-indigo-600" />
            <span className="font-headline font-bold text-lg text-white">
              DevPilot
            </span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto p-1 rounded text-gray-400 hover:text-white hover:bg-gray-800"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
              )}
              title={collapsed ? item.name : undefined}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-800 p-4">
        {!collapsed ? (
          <div className="text-xs text-gray-500">
            DevPilot v0.1.0
          </div>
        ) : (
          <div className="text-center text-xs text-gray-500">v0.1</div>
        )}
      </div>
    </aside>
  );
}
