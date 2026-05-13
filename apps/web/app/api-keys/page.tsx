'use client';

import { useState } from 'react';
import { Plus, Copy, Eye, EyeOff, Trash2 } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { DataTable, Column } from '../components/ui/DataTable';
import { StatusBadge } from '../components/ui/StatusBadge';

interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  createdAt: string;
  lastUsed: string;
  status: 'active' | 'expired' | 'revoked';
}

const mockApiKeys: ApiKey[] = [
  { id: '1', name: 'Production', keyPrefix: 'sk-prod-...a3f8', createdAt: '2025-01-15', lastUsed: '2 mins ago', status: 'active' },
  { id: '2', name: 'Development', keyPrefix: 'sk-dev-...b2c1', createdAt: '2025-01-10', lastUsed: '1 hour ago', status: 'active' },
  { id: '3', name: 'Staging', keyPrefix: 'sk-stage-...d4e7', createdAt: '2024-12-20', lastUsed: 'Never', status: 'expired' },
];

export default function ApiKeysPage() {
  const [keys] = useState(mockApiKeys);

  const columns: Column<ApiKey>[] = [
    { key: 'name', header: 'Name', cell: (k) => <span className="font-medium text-white">{k.name}</span> },
    {
      key: 'keyPrefix',
      header: 'Key',
      cell: (k) => <span className="font-mono text-gray-300">{k.keyPrefix}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      cell: (k) => (
        <StatusBadge
          variant={k.status === 'active' ? 'success' : k.status === 'expired' ? 'warning' : 'error'}
          label={k.status}
        />
      ),
    },
    { key: 'createdAt', header: 'Created', cell: (k) => <span className="text-gray-300">{k.createdAt}</span> },
    { key: 'lastUsed', header: 'Last Used', cell: (k) => <span className="text-gray-300">{k.lastUsed}</span> },
    {
      key: 'actions',
      header: '',
      className: 'w-28',
      cell: (k) => (
        <div className="flex gap-1">
          <button className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-gray-800" title="Copy key">
            <Copy size={14} />
          </button>
          <button className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-gray-800" title="Toggle visibility">
            <Eye size={14} />
          </button>
          <button className="p-1.5 text-gray-400 hover:text-red-400 rounded hover:bg-gray-800" title="Delete key">
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="API Keys"
        description="Manage programmatic access to DevPilot LLM endpoints"
        actions={
          <button className="btn-primary flex items-center gap-1">
            <Plus size={16} /> Create Key
          </button>
        }
      />

      <div className="card">
        <p className="text-sm text-gray-400 mb-4">
          API keys provide programmatic access to DevPilot LLM endpoints. Keep them secure and never commit to version control.
        </p>

        <DataTable
          columns={columns}
          data={keys}
          keyExtractor={(k) => k.id}
        />
      </div>
    </div>
  );
}