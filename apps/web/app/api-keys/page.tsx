'use client';

import { useState } from 'react';
import { Plus, Copy, Eye, EyeOff, Trash2, Check } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { DataTable, Column } from '../components/ui/DataTable';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Modal } from '../components/ui/Modal';

interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  createdAt: string;
  lastUsed: string;
  status: 'active' | 'expired' | 'revoked';
}

const defaultKeys: ApiKey[] = [
  { id: '1', name: 'Production', keyPrefix: 'sk-prod-...a3f8', createdAt: '2025-01-15', lastUsed: '2 mins ago', status: 'active' },
  { id: '2', name: 'Development', keyPrefix: 'sk-dev-...b2c1', createdAt: '2025-01-10', lastUsed: '1 hour ago', status: 'active' },
  { id: '3', name: 'Staging', keyPrefix: 'sk-stage-...d4e7', createdAt: '2024-12-20', lastUsed: 'Never', status: 'expired' },
];

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>(defaultKeys);
  const [showCreate, setShowCreate] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const handleCreate = () => {
    if (!newKeyName.trim()) return;
    const rawKey = `sk-${Array.from({length: 48}, () => 'abcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 36)]).join('')}`;
    const prefix = rawKey.slice(0, 16) + '...' + rawKey.slice(-4);
    const newEntry: ApiKey = {
      id: String(Date.now()),
      name: newKeyName,
      keyPrefix: prefix,
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
      status: 'active',
    };
    setKeys(prev => [newEntry, ...prev]);
    setGeneratedKey(rawKey);
    setToast({ message: `API key "${newKeyName}" created`, type: 'success' });
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
    setToast({ message: 'Copied to clipboard', type: 'success' });
  };

  const handleDelete = (id: string) => {
    const key = keys.find(k => k.id === id);
    setKeys(prev => prev.filter(k => k.id !== id));
    setToast({ message: `API key "${key?.name}" revoked`, type: 'success' });
  };

  const columns: Column<ApiKey>[] = [
    { key: 'name', header: 'Name', cell: (k) => <span className="font-medium text-white">{k.name}</span> },
    { key: 'keyPrefix', header: 'Key', cell: (k) => <span className="font-mono text-gray-300">{k.keyPrefix}</span> },
    {
      key: 'status',
      header: 'Status',
      cell: (k) => (
        <StatusBadge variant={k.status === 'active' ? 'success' : k.status === 'expired' ? 'warning' : 'error'} label={k.status} />
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
          <button
            onClick={(e) => { e.stopPropagation(); handleCopy(`dp-${k.keyPrefix}`, `copy-${k.id}`); }}
            className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-gray-800"
            title="Copy key"
          >
            {copiedIndex === `copy-${k.id}` ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(k.id); }}
            className="p-1.5 text-gray-400 hover:text-red-400 rounded hover:bg-gray-800"
            title="Revoke key"
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
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg border shadow-lg animate-slide-in text-sm ${
          toast.type === 'success' ? 'bg-green-900/90 border-green-700 text-green-300' :
          toast.type === 'error' ? 'bg-red-900/90 border-red-700 text-red-300' :
          'bg-blue-900/90 border-blue-700 text-blue-300'
        }`}>
          {toast.message}
          <button onClick={() => setToast(null)} className="ml-3 hover:text-white">✕</button>
        </div>
      )}

      <PageHeader
        title="API Keys"
        description="Manage programmatic access to DevPilot LLM endpoints"
        actions={
          <button onClick={() => { setNewKeyName(''); setGeneratedKey(null); setShowCreate(true); }} className="btn-primary flex items-center gap-1">
            <Plus size={16} /> Create Key
          </button>
        }
      />

      <div className="card">
        <p className="text-sm text-gray-400 mb-4">
          API keys provide programmatic access to DevPilot LLM endpoints. Keep them secure and never commit to version control.
        </p>
        <DataTable columns={columns} data={keys} keyExtractor={(k) => k.id} />
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={showCreate && !generatedKey}
        onClose={() => setShowCreate(false)}
        title="Create API Key"
        description="Give your key a descriptive name"
        size="sm"
        footer={
          <>
            <button onClick={() => setShowCreate(false)} className="btn-ghost text-sm">Cancel</button>
            <button onClick={handleCreate} className="btn-primary text-sm" disabled={!newKeyName.trim()}>Generate Key</button>
          </>
        }
      >
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Key Name</label>
          <input
            value={newKeyName}
            onChange={e => setNewKeyName(e.target.value)}
            className="input"
            placeholder="e.g. Production"
            autoFocus
            onKeyDown={e => { if (e.key === 'Enter' && newKeyName.trim()) handleCreate(); }}
          />
        </div>
      </Modal>

      {/* Show Generated Key */}
      <Modal
        isOpen={!!generatedKey}
        onClose={() => { setGeneratedKey(null); setShowCreate(false); }}
        title="API Key Created"
        description="Copy this key now. You won't be able to see it again."
        size="md"
        footer={
          <button
            onClick={() => { if (generatedKey) handleCopy(generatedKey, 'gen'); }}
            className="btn-primary text-sm flex items-center gap-1"
          >
            {copiedIndex === 'gen' ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy Key</>}
          </button>
        }
      >
        <div className="space-y-3">
          <div className="bg-gray-950 border border-gray-700 rounded-md p-4">
            <code className="text-sm text-teal-400 break-all font-mono select-all">{generatedKey}</code>
          </div>
          <p className="text-xs text-yellow-400 flex items-center gap-1">
            ⚠ This key will not be shown again. Store it securely.
          </p>
        </div>
      </Modal>
    </div>
  );
}