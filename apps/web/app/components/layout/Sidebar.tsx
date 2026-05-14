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
  Building2,
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

const tenantOptions = [
  { id: 'acme', name: 'Acme Corp' },
  { id: 'dev', name: 'Dev Team' },
  { id: 'staging', name: 'Staging' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [currentTenant, setCurrentTenant] = useState(tenantOptions[0]);
  const [tenantOpen, setTenantOpen] = useState(false);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-gray-900 border-r border-gray-800 flex flex-col transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-gray-800 px-4 flex-shrink-0">
        {!collapsed && (
          <Link href="/overview" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-teal-500 to-indigo-600 flex items-center justify-center">
              <span className="text-xs font-bold text-white">DP</span>
            </div>
            <span className="font-headline font-bold text-lg text-white tracking-tight">
              DevPilot
            </span>
          </Link>
        )}
        {collapsed && (
          <Link href="/overview" className="mx-auto">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-teal-500 to-indigo-600 flex items-center justify-center">
              <span className="text-xs font-bold text-white">DP</span>
            </div>
          </Link>
        )}
      </div>

      {/* Tenant Switcher */}
      {!collapsed && (
        <div className="px-3 pt-3 pb-2 border-b border-gray-800/50">
          <div className="relative">
            <button
              onClick={() => setTenantOpen(!tenantOpen)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md bg-gray-800/50 hover:bg-gray-800 text-sm text-gray-300 transition-colors"
            >
              <Building2 size={14} className="text-teal-400 flex-shrink-0" />
              <span className="truncate flex-1 text-left">{currentTenant.name}</span>
              <ChevronRight
                size={14}
                className={cn(
                  'text-gray-500 transition-transform',
                  tenantOpen && 'rotate-90'
                )}
              />
            </button>
            {tenantOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50">
                {tenantOptions.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setCurrentTenant(t);
                      setTenantOpen(false);
                    }}
                    className={cn(
                      'w-full text-left px-3 py-2 text-sm transition-colors first:rounded-t-md last:rounded-b-md',
                      currentTenant.id === t.id
                        ? 'bg-teal-600/20 text-teal-400'
                        : 'text-gray-300 hover:bg-gray-700'
                    )}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 px-3 py-4 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all',
                isActive
                  ? 'bg-teal-600/15 text-teal-400 border border-teal-600/20'
                  : 'text-gray-400 hover:bg-gray-800/60 hover:text-gray-200 border border-transparent'
              )}
              title={collapsed ? item.name : undefined}
            >
              <item.icon className={cn(
                'h-5 w-5 flex-shrink-0 transition-colors',
                isActive ? 'text-teal-400' : 'text-gray-500'
              )} />
              {!collapsed && <span>{item.name}</span>}
              {!collapsed && isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle + version */}
      <div className="border-t border-gray-800 p-3 flex-shrink-0">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'flex items-center gap-2 w-full rounded-md px-3 py-2 text-xs text-gray-500 hover:text-gray-300 hover:bg-gray-800/60 transition-colors',
            collapsed && 'justify-center'
          )}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : (
            <>
              <ChevronLeft size={16} />
              <span>Collapse</span>
            </>
          )}
        </button>
        {!collapsed && (
          <div className="text-center mt-2">
            <span className="text-[10px] text-gray-600">DevPilot v0.1.0</span>
          </div>
        )}
      </div>
    </aside>
  );
}