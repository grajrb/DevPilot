'use client';

import { useState } from 'react';
import { Download, Filter, Search, Check } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { DataTable, Column } from '../components/ui/DataTable';

interface AuditLogEntry {
  id: string;
  action: string;
  user: string;
  ip: string;
  timestamp: string;
  details: string;
}

const mockAuditLogs: AuditLogEntry[] = [
  { id: '1', action: 'user.login', user: 'alice@acme.com', ip: '192.168.1.1', timestamp: '2025-01-15 10:23:45', details: 'User logged in successfully' },
  { id: '2', action: 'api_key.create', user: 'bob@acme.com', ip: '192.168.1.5', timestamp: '2025-01-15 09:15:22', details: 'Created API key "Production"' },
  { id: '3', action: 'service.update', user: 'admin@acme.com', ip: '10.0.0.1', timestamp: '2025-01-15 08:45:10', details: 'Updated service auth-service health check URL' },
  { id: '4', action: 'user.logout', user: 'alice@acme.com', ip: '192.168.1.1', timestamp: '2025-01-15 08:30:00', details: 'User logged out' },
  { id: '5', action: 'evaluation.run', user: 'charlie@acme.com', ip: '10.0.0.2', timestamp: '2025-01-15 07:12:33', details: 'Started evaluation "Customer Support QA"' },
  { id: '6', action: 'tenant.settings.update', user: 'admin@acme.com', ip: '10.0.0.1', timestamp: '2025-01-14 16:45:00', details: 'Updated tenant LLM provider settings' },
  { id: '7', action: 'user.role.update', user: 'admin@acme.com', ip: '10.0.0.1', timestamp: '2025-01-14 14:20:15', details: 'Changed bob@acme.com role to Developer' },
  { id: '8', action: 'document.upload', user: 'charlie@acme.com', ip: '192.168.1.10', timestamp: '2025-01-14 11:05:30', details: 'Uploaded "API Reference v2" document' },
];

export default function AuditLogsPage() {
  const [filterText, setFilterText] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [copied, setCopied] = useState(false);

  const filtered = mockAuditLogs.filter((log) => {
    const matchesText =
      !filterText ||
      log.action.toLowerCase().includes(filterText.toLowerCase()) ||
      log.user.toLowerCase().includes(filterText.toLowerCase()) ||
      log.details.toLowerCase().includes(filterText.toLowerCase());
    const matchesAction = !actionFilter || log.action === actionFilter;
    return matchesText && matchesAction;
  });

  const handleExport = () => {
    const headers = ['Timestamp', 'Action', 'User', 'IP Address', 'Details'];
    const rows = filtered.map(l => [l.timestamp, l.action, l.user, l.ip, l.details]);
    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const uniqueActions = [...new Set(mockAuditLogs.map(l => l.action))];

  const columns: Column<AuditLogEntry>[] = [
    { key: 'timestamp', header: 'Timestamp', cell: (l) => <span className="font-mono text-gray-400 text-sm">{l.timestamp}</span> },
    { key: 'action', header: 'Action', cell: (l) => <span className="font-mono text-teal-400">{l.action}</span> },
    { key: 'user', header: 'User', cell: (l) => <span className="text-gray-300">{l.user}</span> },
    { key: 'ip', header: 'IP Address', cell: (l) => <span className="text-gray-300 font-mono text-sm">{l.ip}</span> },
    { key: 'details', header: 'Details', cell: (l) => <span className="text-gray-300 text-sm">{l.details}</span> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs"
        description="Track all changes and access to your DevPilot instance"
        actions={
          <button onClick={handleExport} className="btn-ghost flex items-center gap-1">
            {copied ? <Check size={16} className="text-green-400" /> : <Download size={16} />}
            {copied ? 'Exported!' : 'Export CSV'}
          </button>
        }
      />

      <div className="card">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Filter by action, user, or details..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="input pl-10"
            />
          </div>
          <select
            className="select w-44"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
          >
            <option value="">All actions</option>
            {uniqueActions.map(action => (
              <option key={action} value={action}>{action.replace(/\./g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
            ))}
          </select>
        </div>

        <DataTable columns={columns} data={filtered} keyExtractor={(l) => l.id} />

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
          <span className="text-sm text-gray-500">{filtered.length} of {mockAuditLogs.length} entries</span>
          <div className="flex gap-2">
            <button className="btn-ghost text-xs px-3 py-1.5" disabled>Previous</button>
            <button className="btn-ghost text-xs px-3 py-1.5">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}