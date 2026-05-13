'use client';

import { useState } from 'react';
import { Plus, RefreshCw, MoreHorizontal } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { DataTable, Column } from '../components/ui/DataTable';
import { StatusBadge } from '../components/ui/StatusBadge';

interface Service {
  id: string;
  name: string;
  description: string;
  status: 'healthy' | 'degraded' | 'down';
  prototype: string;
  latency: number | null;
  uptime: string;
}

const mockServices: Service[] = [
  { id: '1', name: 'auth-service', description: 'Authentication and user management', status: 'healthy', prototype: 'Node.js', latency: 45, uptime: '99.9%' },
  { id: '2', name: 'payment-processor', description: 'Payment processing and billing', status: 'healthy', prototype: 'Python', latency: 120, uptime: '99.8%' },
  { id: '3', name: 'notification-service', description: 'Email and push notifications', status: 'degraded', prototype: 'Go', latency: 340, uptime: '98.2%' },
  { id: '4', name: 'analytics-ingester', description: 'Analytics data ingestion pipeline', status: 'down', prototype: 'Java', latency: null, uptime: '95.1%' },
  { id: '5', name: 'search-indexer', description: 'Full-text search indexing service', status: 'healthy', prototype: 'Rust', latency: 88, uptime: '99.7%' },
  { id: '6', name: 'cache-layer', description: 'Distributed caching layer (Redis)', status: 'healthy', prototype: 'Go', latency: 12, uptime: '99.9%' },
];

const statusVariant = (status: string) => {
  switch (status) {
    case 'healthy': return 'success';
    case 'degraded': return 'warning';
    case 'down': return 'error';
    default: return 'neutral';
  }
};

export default function ServicesPage() {
  const [services] = useState(mockServices);

  const columns: Column<Service>[] = [
    {
      key: 'name',
      header: 'Name',
      cell: (s) => <span className="font-mono text-teal-400">{s.name}</span>,
    },
    {
      key: 'description',
      header: 'Description',
      cell: (s) => <span className="text-gray-300">{s.description}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      cell: (s) => <StatusBadge variant={statusVariant(s.status) as any} label={s.status} />,
    },
    {
      key: 'prototype',
      header: 'Prototype',
      cell: (s) => <span className="text-gray-300">{s.prototype}</span>,
    },
    {
      key: 'latency',
      header: 'Latency',
      cell: (s) => <span className="text-gray-300">{s.latency ? `${s.latency}ms` : '-'}</span>,
    },
    {
      key: 'uptime',
      header: 'Uptime',
      cell: (s) => <span className="text-gray-300">{s.uptime}</span>,
    },
    {
      key: 'actions',
      header: '',
      className: 'w-12',
      cell: () => (
        <button className="p-1 text-gray-400 hover:text-white">
          <MoreHorizontal size={16} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Services"
        description="Monitor and manage your microservices"
        actions={
          <>
            <button className="btn-ghost flex items-center gap-1">
              <RefreshCw size={16} /> Refresh
            </button>
            <button className="btn-primary flex items-center gap-1">
              <Plus size={16} /> Add Service
            </button>
          </>
        }
      />

      <DataTable
        columns={columns}
        data={services}
        keyExtractor={(s) => s.id}
      />
    </div>
  );
}