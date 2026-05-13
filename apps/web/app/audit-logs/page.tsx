'use client';

import { useState } from 'react';
import { Download, Filter, Search } from 'lucide-react';
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
];

export default function AuditLogsPage() {
  const [filterText, setFilterText] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  const filtered = mockAuditLogs.filter((log) => {
    const matchesText =
      !filterText ||
      log.action.toLowerCase().includes(filterText.toLowerCase()) ||
      log.user.toLowerCase().includes(filterText.toLowerCase()) ||
      log.details.toLowerCase().includes(filterText.toLowerCase());
    const matchesAction = !actionFilter || log.action === actionFilter;
    return matchesText && matchesAction;
  });

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
          <button className="btn-ghost flex items-center gap-1">
            <Download size={16} /> Export
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
            className="select w-40"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
          >
            <option value="">All actions</option>
            <option value="user.login">Login</option>
            <option value="user.logout">Logout</option>
            <option value="api_key.create">API Key Created</option>
            <option value="service.update">Service Updated</option>
            <option value="evaluation.run">Evaluation Run</option>
          </select>
        </div>

        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(l) => l.id}
        />
      </div>
    </div>
  );
}