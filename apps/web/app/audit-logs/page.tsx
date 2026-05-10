'use client';

import { useState } from 'react';
import { Download, Filter } from 'lucide-react';

const mockAuditLogs = [
  {
    id: '1',
    action: 'user.login',
    user: 'alice@acme.com',
    ip: '192.168.1.1',
    timestamp: '2025-01-15 10:23:45',
    details: 'User logged in successfully',
  },
  {
    id: '2',
    action: 'api_key.create',
    user: 'bob@acme.com',
    ip: '192.168.1.5',
    timestamp: '2025-01-15 09:15:22',
    details: 'Created API key "Production"',
  },
  {
    id: '3',
    action: 'service.update',
    user: 'admin@acme.com',
    ip: '10.0.0.1',
    timestamp: '2025-01-15 08:45:10',
    details: 'Updated service auth-service health check URL',
  },
];

export default function AuditLogsPage() {
  const [filter, setFilter] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-headline font-bold text-white">Audit Logs</h1>
        <button className="btn-ghost">
          <Download size={16} />
          Export
        </button>
      </div>

      <div className="card">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Filter by action, user, or details..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input pl-10"
            />
          </div>
          <select className="select w-40">
            <option value="">All actions</option>
            <option value="user.login">Login</option>
            <option value="api_key.create">API Key Created</option>
            <option value="service.update">Service Updated</option>
          </select>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Action</th>
                <th>User</th>
                <th>IP Address</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {mockAuditLogs.map((log) => (
                <tr key={log.id}>
                  <td className="font-mono text-gray-400 text-sm">{log.timestamp}</td>
                  <td className="font-mono text-teal-400">{log.action}</td>
                  <td className="text-gray-300">{log.user}</td>
                  <td className="text-gray-300 font-mono text-sm">{log.ip}</td>
                  <td className="text-gray-300 text-sm">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
