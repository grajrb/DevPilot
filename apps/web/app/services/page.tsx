'use client';

import { useState } from 'react';
import { Plus, RefreshCw, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { DataTable, Column } from '../components/ui/DataTable';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Modal } from '../components/ui/Modal';

interface Service {
  id: string;
  name: string;
  description: string;
  status: 'healthy' | 'degraded' | 'down';
  prototype: string;
  latency: number | null;
  uptime: string;
  endpoints: number;
}

const defaultServices: Service[] = [
  { id: '1', name: 'auth-service', description: 'Authentication and user management', status: 'healthy', prototype: 'Node.js', latency: 45, uptime: '99.9%', endpoints: 8 },
  { id: '2', name: 'payment-processor', description: 'Payment processing and billing', status: 'healthy', prototype: 'Python', latency: 120, uptime: '99.8%', endpoints: 12 },
  { id: '3', name: 'notification-service', description: 'Email and push notifications', status: 'degraded', prototype: 'Go', latency: 340, uptime: '98.2%', endpoints: 5 },
  { id: '4', name: 'analytics-ingester', description: 'Analytics data ingestion pipeline', status: 'down', prototype: 'Java', latency: null, uptime: '95.1%', endpoints: 3 },
  { id: '5', name: 'search-indexer', description: 'Full-text search indexing service', status: 'healthy', prototype: 'Rust', latency: 88, uptime: '99.7%', endpoints: 6 },
  { id: '6', name: 'cache-layer', description: 'Distributed caching layer (Redis)', status: 'healthy', prototype: 'Go', latency: 12, uptime: '99.9%', endpoints: 4 },
];

const statusVariant = (status: string) => {
  switch (status) {
    case 'healthy': return 'success' as const;
    case 'degraded': return 'warning' as const;
    case 'down': return 'error' as const;
    default: return 'neutral' as const;
  }
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(defaultServices);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formProto, setFormProto] = useState('Node.js');
  const [formEndpoints, setFormEndpoints] = useState(1);

  const openCreate = () => {
    setEditingService(null);
    setFormName('');
    setFormDesc('');
    setFormProto('Node.js');
    setFormEndpoints(1);
    setShowModal(true);
  };

  const openEdit = (service: Service) => {
    setEditingService(service);
    setFormName(service.name);
    setFormDesc(service.description);
    setFormProto(service.prototype);
    setFormEndpoints(service.endpoints);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formName.trim()) return;
    if (editingService) {
      setServices(prev => prev.map(s =>
        s.id === editingService.id
          ? { ...s, name: formName, description: formDesc, prototype: formProto, endpoints: formEndpoints }
          : s
      ));
      setToast({ message: `Service "${formName}" updated`, type: 'success' });
    } else {
      const newService: Service = {
        id: String(Date.now()),
        name: formName,
        description: formDesc,
        status: 'healthy',
        prototype: formProto,
        latency: null,
        uptime: '100%',
        endpoints: formEndpoints,
      };
      setServices(prev => [newService, ...prev]);
      setToast({ message: `Service "${formName}" created`, type: 'success' });
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    const service = services.find(s => s.id === id);
    setServices(prev => prev.filter(s => s.id !== id));
    setToast({ message: `Service "${service?.name}" deleted`, type: 'success' });
  };

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
      cell: (s) => <StatusBadge variant={statusVariant(s.status)} label={s.status} />,
    },
    {
      key: 'prototype',
      header: 'Type',
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
      className: 'w-20',
      cell: (s) => (
        <div className="flex gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); openEdit(s); }}
            className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-gray-800"
            title="Edit"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(s.id); }}
            className="p-1.5 text-gray-400 hover:text-red-400 rounded hover:bg-gray-800"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg border shadow-lg animate-slide-in text-sm bg-green-900/90 border-green-700 text-green-300">
          {toast.message}
          <button onClick={() => setToast(null)} className="ml-3 hover:text-white">✕</button>
        </div>
      )}

      <PageHeader
        title="Services"
        description="Monitor and manage your microservices"
        actions={
          <>
            <button className="btn-ghost flex items-center gap-1">
              <RefreshCw size={16} /> Refresh
            </button>
            <button onClick={openCreate} className="btn-primary flex items-center gap-1">
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

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingService ? 'Edit Service' : 'Add Service'}
        description={editingService ? `Update ${editingService.name}` : 'Register a new microservice'}
        size="md"
        footer={
          <>
            <button onClick={() => setShowModal(false)} className="btn-ghost text-sm">Cancel</button>
            <button onClick={handleSave} className="btn-primary text-sm" disabled={!formName.trim()}>
              {editingService ? 'Save Changes' : 'Create Service'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Service Name</label>
            <input
              value={formName}
              onChange={e => setFormName(e.target.value)}
              className="input"
              placeholder="e.g. my-service"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea
              value={formDesc}
              onChange={e => setFormDesc(e.target.value)}
              className="input min-h-[80px]"
              placeholder="What does this service do?"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Runtime</label>
              <select value={formProto} onChange={e => setFormProto(e.target.value)} className="select">
                <option>Node.js</option>
                <option>Python</option>
                <option>Go</option>
                <option>Java</option>
                <option>Rust</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Endpoints</label>
              <input
                type="number"
                value={formEndpoints}
                onChange={e => setFormEndpoints(Math.max(1, parseInt(e.target.value) || 1))}
                className="input"
                min={1}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}