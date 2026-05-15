'use client';

import { Plus, FileText, Search, Trash2, Upload, Check, X, File, Download } from 'lucide-react';
import { useState, useRef } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { EmptyState } from '../components/ui/EmptyState';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Modal } from '../components/ui/Modal';

interface DocItem {
  id: string;
  title: string;
  category: string;
  lastUpdated: string;
  status: 'published' | 'draft' | 'processing';
  fileSize?: string;
  fileType?: string;
}

const defaultDocs: DocItem[] = [
  { id: '1', title: 'Getting Started Guide', category: 'Onboarding', lastUpdated: '2 days ago', status: 'published', fileSize: '2.4 MB', fileType: 'PDF' },
  { id: '2', title: 'API Reference v2', category: 'API', lastUpdated: '1 week ago', status: 'published', fileSize: '1.8 MB', fileType: 'Markdown' },
  { id: '3', title: 'Best Practices for LLM Prompts', category: 'Guides', lastUpdated: '5 days ago', status: 'published', fileSize: '4.2 MB', fileType: 'PDF' },
  { id: '4', title: 'Architecture Overview', category: 'Internal', lastUpdated: '3 days ago', status: 'draft', fileSize: '856 KB', fileType: 'DOCX' },
  { id: '5', title: 'Deployment Runbook', category: 'Ops', lastUpdated: '1 hour ago', status: 'draft', fileSize: '1.1 MB', fileType: 'Markdown' },
  { id: '6', title: 'Security Guidelines', category: 'Compliance', lastUpdated: '1 day ago', status: 'processing', fileSize: '3.5 MB', fileType: 'PDF' },
];

export default function DocsPage() {
  const [docs, setDocs] = useState<DocItem[]>(defaultDocs);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState('General');
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = docs.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpload = () => {
    if (!uploadFile) return;
    setUploading(true);
    setTimeout(() => {
      const newDoc: DocItem = {
        id: String(Date.now()),
        title: uploadFile.name.replace(/\.[^/.]+$/, ''),
        category: uploadCategory,
        lastUpdated: 'Just now',
        status: 'processing',
        fileSize: `${(uploadFile.size / (1024 * 1024)).toFixed(1)} MB`,
        fileType: uploadFile.name.split('.').pop()?.toUpperCase() || 'Unknown',
      };
      setDocs(prev => [newDoc, ...prev]);
      setUploading(false);
      setShowUpload(false);
      setUploadFile(null);
      setToast({ message: `"${uploadFile.name}" uploaded and processing`, type: 'success' });
    }, 1500);
  };

  const handleDelete = (id: string) => {
    const doc = docs.find(d => d.id === id);
    setDocs(prev => prev.filter(d => d.id !== id));
    setShowDeleteConfirm(null);
    setToast({ message: `"${doc?.title}" deleted`, type: 'success' });
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg border shadow-lg animate-slide-in text-sm flex items-center gap-2 ${
          toast.type === 'success' ? 'bg-green-900/90 border-green-700 text-green-300' :
          toast.type === 'error' ? 'bg-red-900/90 border-red-700 text-red-300' :
          'bg-blue-900/90 border-blue-700 text-blue-300'
        }`}>
          <Check size={16} />
          {toast.message}
          <button onClick={() => setToast(null)} className="ml-2 hover:text-white">✕</button>
        </div>
      )}

      <PageHeader
        title="Documentation"
        description="Upload, search and manage your knowledge base"
        actions={
          <button onClick={() => setShowUpload(true)} className="btn-primary flex items-center gap-1">
            <Upload size={16} /> Upload Document
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

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FileText size={32} />}
          title="No documents found"
          description="Try a different search term or upload a new document"
          action={
            <button onClick={() => setShowUpload(true)} className="btn-primary text-sm">
              <Upload size={14} /> Upload Document
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doc) => (
            <div
              key={doc.id}
              className="card hover:border-teal-500/50 transition-colors group relative"
            >
              {/* Delete button */}
              <button
                onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(doc.id); }}
                className="absolute top-3 right-3 p-1.5 text-gray-500 hover:text-red-400 hover:bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-all"
                title="Delete document"
              >
                <Trash2 size={14} />
              </button>

              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-teal-600/10 rounded-lg">
                  <FileText size={20} className="text-teal-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-white truncate group-hover:text-teal-400 transition-colors">
                      {doc.title}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{doc.category}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-500">
                <StatusBadge
                  variant={doc.status === 'published' ? 'success' : doc.status === 'processing' ? 'info' : 'warning'}
                  label={doc.status}
                />
                {doc.fileSize && <span>{doc.fileSize}</span>}
                {doc.fileType && <span className="font-mono">{doc.fileType}</span>}
              </div>
              <p className="text-xs text-gray-600 mt-2">Updated {doc.lastUpdated}</p>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={showUpload}
        onClose={() => { setShowUpload(false); setUploadFile(null); }}
        title="Upload Document"
        description="Supported formats: PDF, TXT, Markdown, DOCX (max 50MB)"
        size="md"
        footer={
          <>
            <button onClick={() => { setShowUpload(false); setUploadFile(null); }} className="btn-ghost text-sm">Cancel</button>
            <button
              onClick={handleUpload}
              className="btn-primary text-sm flex items-center gap-1"
              disabled={!uploadFile || uploading}
            >
              {uploading ? (
                <>Processing...</>
              ) : (
                <><Upload size={14} /> Upload</>
              )}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          {/* File drop zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              uploadFile ? 'border-teal-500 bg-teal-600/5' : 'border-gray-700 hover:border-gray-600 bg-gray-800/30'
            }`}
          >
            {uploadFile ? (
              <div className="flex flex-col items-center gap-2">
                <File size={32} className="text-teal-400" />
                <p className="text-sm text-teal-400 font-medium">{uploadFile.name}</p>
                <p className="text-xs text-gray-500">{(uploadFile.size / 1024).toFixed(1)} KB</p>
                <button
                  onClick={(e) => { e.stopPropagation(); setUploadFile(null); }}
                  className="text-xs text-gray-500 hover:text-red-400 mt-1"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload size={32} className="text-gray-500" />
                <p className="text-sm text-gray-400">Drop a file here or click to browse</p>
                <p className="text-xs text-gray-600">PDF, TXT, Markdown, DOCX</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.md,.docx"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setUploadFile(file);
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
            <select value={uploadCategory} onChange={e => setUploadCategory(e.target.value)} className="select">
              <option>General</option>
              <option>API</option>
              <option>Guides</option>
              <option>Onboarding</option>
              <option>Internal</option>
              <option>Ops</option>
              <option>Compliance</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        title="Delete Document"
        size="sm"
        footer={
          <>
            <button onClick={() => setShowDeleteConfirm(null)} className="btn-ghost text-sm">Cancel</button>
            <button onClick={() => showDeleteConfirm && handleDelete(showDeleteConfirm)} className="px-4 py-2 rounded-md font-medium text-sm bg-red-600 hover:bg-red-500 text-white transition-colors">
              Delete
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-300">
          Are you sure you want to delete this document? This will also remove all associated vector embeddings.
        </p>
      </Modal>
    </div>
  );
}