'use client';

import { Plus, FileText, Search } from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { EmptyState } from '../components/ui/EmptyState';
import { StatusBadge } from '../components/ui/StatusBadge';

interface DocItem {
  id: string;
  title: string;
  category: string;
  lastUpdated: string;
  status: 'published' | 'draft';
}

const mockDocs: DocItem[] = [
  { id: '1', title: 'Getting Started Guide', category: 'Onboarding', lastUpdated: '2 days ago', status: 'published' },
  { id: '2', title: 'API Reference v2', category: 'API', lastUpdated: '1 week ago', status: 'published' },
  { id: '3', title: 'Best Practices for LLM Prompts', category: 'Guides', lastUpdated: '5 days ago', status: 'published' },
  { id: '4', title: 'Architecture Overview', category: 'Internal', lastUpdated: '3 days ago', status: 'draft' },
  { id: '5', title: 'Deployment Runbook', category: 'Ops', lastUpdated: '1 hour ago', status: 'draft' },
];

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = mockDocs.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Documentation"
        description="Search and manage your knowledge base"
        actions={
          <button className="btn-primary flex items-center gap-1">
            <Plus size={16} /> New Doc
          </button>
        }
      />

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search documentation..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((doc) => (
          <div
            key={doc.id}
            className="card hover:border-teal-500/50 cursor-pointer transition-colors group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-teal-400" />
                <h3 className="font-medium text-white group-hover:text-teal-400 transition-colors">
                  {doc.title}
                </h3>
              </div>
              <StatusBadge
                variant={doc.status === 'published' ? 'success' : 'warning'}
                label={doc.status}
              />
            </div>
            <p className="text-xs text-gray-500">Category: {doc.category}</p>
            <p className="text-xs text-gray-500 mt-1">Updated {doc.lastUpdated}</p>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <EmptyState
          icon={<FileText size={32} />}
          title="No documents found"
          description="Try a different search term or create a new document"
        />
      )}
    </div>
  );
}