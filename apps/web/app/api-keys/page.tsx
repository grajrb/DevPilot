'use client';

import { useState } from 'react';
import { Plus, Copy, Eye, EyeOff, Trash2 } from 'lucide-react';

const mockApiKeys = [
  { id: '1', name: 'Production', keyPrefix: 'sk-prod-...', createdAt: '2025-01-15', lastUsed: '2 mins ago' },
  { id: '2', name: 'Development', keyPrefix: 'sk-dev-...', createdAt: '2025-01-10', lastUsed: '1 hour ago' },
];

export default function ApiKeysPage() {
  const [showKey, setShowKey] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-headline font-bold text-white">API Keys</h1>
        <button className="btn-primary">
          <Plus size={16} />
          Create Key
        </button>
      </div>

      <div className="card">
        <p className="text-sm text-gray-400 mb-4">
          API keys provide programmatic access to DevPilot LLM endpoints. Keep them secure and never commit to version control.
        </p>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Key</th>
                <th>Created</th>
                <th>Last Used</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockApiKeys.map((key) => (
                <tr key={key.id}>
                  <td className="font-medium text-white">{key.name}</td>
                  <td className="font-mono">
                    <span className="text-gray-300">{key.keyPrefix}</span>
                  </td>
                  <td className="text-gray-300">{key.createdAt}</td>
                  <td className="text-gray-300">{key.lastUsed}</td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        className="p-1 text-gray-400 hover:text-white"
                        title="Copy key"
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        className="p-1 text-gray-400 hover:text-white"
                        title="Toggle visibility"
                        onClick={() => setShowKey(showKey === key.id ? null : key.id)}
                      >
                        {showKey === key.id ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button
                        className="p-1 text-gray-400 hover:text-red-400"
                        title="Delete key"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
