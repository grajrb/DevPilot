'use client';

import { useState } from 'react';
import { Plus, Play, CheckCircle, XCircle, Clock, BarChart3, Eye, ChevronDown, ChevronRight } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { StatusBadge } from '../components/ui/StatusBadge';
import { KpiCard, KpiCardGrid } from '../components/ui/KpiCard';
import { Modal } from '../components/ui/Modal';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

interface Evaluation {
  id: string;
  name: string;
  type: string;
  status: 'completed' | 'running' | 'pending' | 'failed';
  lastRun: string;
  passRate: number | null;
  totalTests: number;
  passed: number;
  failed: number;
  avgScore: number;
  totalCost: number;
  runs: EvaluationRun[];
}

interface EvaluationRun {
  id: string;
  startedAt: string;
  status: string;
  passed: number;
  failed: number;
  total: number;
  avgScore: number;
  cost: number;
}

const mockEvaluations: Evaluation[] = [
  {
    id: '1', name: 'Customer Support Quality', type: 'correctness',
    status: 'completed', lastRun: '2 hours ago', passRate: 94, totalTests: 250,
    passed: 235, failed: 15, avgScore: 0.92, totalCost: 4.50,
    runs: [
      { id: 'r1', startedAt: '2025-01-15 08:00', status: 'completed', passed: 235, failed: 15, total: 250, avgScore: 0.92, cost: 4.50 },
      { id: 'r2', startedAt: '2025-01-14 08:00', status: 'completed', passed: 228, failed: 22, total: 250, avgScore: 0.89, cost: 4.30 },
      { id: 'r3', startedAt: '2025-01-13 08:00', status: 'completed', passed: 218, failed: 32, total: 250, avgScore: 0.85, cost: 4.10 },
    ],
  },
  {
    id: '2', name: 'Code Review Accuracy', type: 'relevance',
    status: 'running', lastRun: 'Running now', passRate: null, totalTests: 180,
    passed: 0, failed: 0, avgScore: 0, totalCost: 0,
    runs: [],
  },
  {
    id: '3', name: 'Documentation QA', type: 'faithfulness',
    status: 'pending', lastRun: 'Not yet', passRate: null, totalTests: 120,
    passed: 0, failed: 0, avgScore: 0, totalCost: 0,
    runs: [],
  },
  {
    id: '4', name: 'Prompt Injection Test', type: 'custom',
    status: 'completed', lastRun: '1 day ago', passRate: 100, totalTests: 50,
    passed: 50, failed: 0, avgScore: 0.99, totalCost: 0.85,
    runs: [
      { id: 'r4', startedAt: '2025-01-14 10:00', status: 'completed', passed: 50, failed: 0, total: 50, avgScore: 0.99, cost: 0.85 },
    ],
  },
  {
    id: '5', name: 'Response Consistency', type: 'correctness',
    status: 'failed', lastRun: '3 hours ago', passRate: 72, totalTests: 200,
    passed: 144, failed: 56, avgScore: 0.72, totalCost: 3.60,
    runs: [
      { id: 'r5', startedAt: '2025-01-15 15:00', status: 'failed', passed: 144, failed: 56, total: 200, avgScore: 0.72, cost: 3.60 },
    ],
  },
];

const statusVariant = (status: string) => {
  switch (status) {
    case 'completed': return 'success' as const;
    case 'running': return 'info' as const;
    case 'pending': return 'neutral' as const;
    case 'failed': return 'error' as const;
    default: return 'neutral' as const;
  }
};

export default function EvaluationsPage() {
  const [evaluations] = useState(mockEvaluations);
  const [selectedEval, setSelectedEval] = useState<Evaluation | null>(null);
  const [expandedRun, setExpandedRun] = useState<string | null>(null);

  const completed = evaluations.filter(e => e.status === 'completed' || e.status === 'failed');
  const avgPassRate = completed.length > 0
    ? Math.round(completed.reduce((sum, e) => sum + (e.passRate || 0), 0) / completed.length)
    : 0;

  const passFailData = evaluations
    .filter(e => e.status === 'completed' || e.status === 'failed')
    .map(e => ({
      name: e.name.length > 18 ? e.name.slice(0, 18) + '...' : e.name,
      passed: e.passed,
      failed: e.failed,
    }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Evaluations"
        description="Run and monitor LLM evaluation suites"
        actions={
          <button className="btn-primary flex items-center gap-1">
            <Plus size={16} /> Create Evaluation
          </button>
        }
      />

      <KpiCardGrid>
        <KpiCard title="Total Evaluations" value={String(evaluations.length)} change="" icon={<BarChart3 size={16} />} />
        <KpiCard title="Avg Pass Rate" value={`${avgPassRate}%`} change={`+${avgPassRate - 80}%` as any} trend="up" icon={<CheckCircle size={16} />} />
        <KpiCard title="Running Now" value={String(evaluations.filter(e => e.status === 'running').length)} change="" icon={<Clock size={16} />} />
        <KpiCard title="Failed Recently" value={String(evaluations.filter(e => e.status === 'failed').length)} change="" icon={<XCircle size={16} />} />
      </KpiCardGrid>

      {/* Pass/Fail Chart */}
      {passFailData.length > 0 && (
        <div className="card">
          <h3 className="font-medium text-white mb-4">Pass/Fail by Evaluation</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={passFailData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis type="number" stroke="#6b7280" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#6b7280" fontSize={11} width={140} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '6px', fontSize: '12px' }}
                  labelStyle={{ color: '#f9fafb' }}
                />
                <Legend formatter={(value) => <span style={{ color: '#9ca3af', fontSize: '12px' }}>{value}</span>} />
                <Bar dataKey="passed" stackId="a" fill="#14B8A6" radius={[0, 4, 4, 0]} />
                <Bar dataKey="failed" stackId="a" fill="#E11D48" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Evaluation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {evaluations.map((eval_) => (
          <div
            key={eval_.id}
            className="card hover:border-teal-500/50 transition-colors cursor-pointer"
            onClick={() => setSelectedEval(eval_)}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-medium text-white">{eval_.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5 capitalize">{eval_.type} • {eval_.totalTests} tests</p>
              </div>
              <StatusBadge variant={statusVariant(eval_.status)} label={eval_.status} />
            </div>

            {/* Pass/Fail mini bar */}
            {(eval_.status === 'completed' || eval_.status === 'failed') && (
              <div className="mb-3">
                <div className="flex items-center gap-2 text-xs mb-1">
                  <span className="text-green-400">{eval_.passed} passed</span>
                  {eval_.failed > 0 && <span className="text-red-400">• {eval_.failed} failed</span>}
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden flex">
                  {eval_.passed > 0 && (
                    <div className="bg-teal-500 h-full" style={{ width: `${(eval_.passed / eval_.totalTests) * 100}%` }} />
                  )}
                  {eval_.failed > 0 && (
                    <div className="bg-red-500 h-full" style={{ width: `${(eval_.failed / eval_.totalTests) * 100}%` }} />
                  )}
                </div>
              </div>
            )}
            {eval_.status === 'running' && (
              <div className="mb-3">
                <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full w-2/3 animate-pulse" />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Last run: {eval_.lastRun}</span>
              {eval_.passRate !== null && (
                <span className={`font-medium ${eval_.passRate >= 90 ? 'text-teal-400' : eval_.passRate >= 80 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {eval_.passRate}% pass
                </span>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-800 flex gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedEval(eval_); }}
                className="btn-ghost text-sm flex-1 flex items-center justify-center gap-1"
              >
                <Eye size={14} /> View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Evaluation Detail Modal */}
      <Modal
        isOpen={!!selectedEval}
        onClose={() => setSelectedEval(null)}
        title={selectedEval?.name || ''}
        description={`${selectedEval?.type} • ${selectedEval?.totalTests} tests • ${selectedEval?.runs.length} runs`}
        size="lg"
      >
        {selectedEval && (
          <div className="space-y-6">
            {/* Summary KPI */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-gray-800/50 rounded p-3">
                <p className="text-xs text-gray-500">Pass Rate</p>
                <p className={`text-lg font-semibold mt-1 ${selectedEval.passRate && selectedEval.passRate >= 90 ? 'text-teal-400' : selectedEval.passRate && selectedEval.passRate >= 80 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {selectedEval.passRate ? `${selectedEval.passRate}%` : '-'}
                </p>
              </div>
              <div className="bg-gray-800/50 rounded p-3">
                <p className="text-xs text-gray-500">Avg Score</p>
                <p className="text-lg font-semibold text-white mt-1 font-mono">
                  {selectedEval.avgScore > 0 ? selectedEval.avgScore.toFixed(3) : '-'}
                </p>
              </div>
              <div className="bg-gray-800/50 rounded p-3">
                <p className="text-xs text-gray-500">Passed / Failed</p>
                <p className="text-lg font-semibold mt-1">
                  <span className="text-teal-400">{selectedEval.passed}</span>
                  <span className="text-gray-600"> / </span>
                  <span className="text-red-400">{selectedEval.failed}</span>
                </p>
              </div>
              <div className="bg-gray-800/50 rounded p-3">
                <p className="text-xs text-gray-500">Total Cost</p>
                <p className="text-lg font-semibold text-white mt-1 font-mono">${selectedEval.totalCost.toFixed(2)}</p>
              </div>
            </div>

            {/* Runs table */}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Run History</p>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Passed</th>
                      <th>Failed</th>
                      <th>Score</th>
                      <th>Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedEval.runs.map((run) => (
                      <tr
                        key={run.id}
                        className="cursor-pointer hover:bg-gray-900/50"
                        onClick={() => setExpandedRun(expandedRun === run.id ? null : run.id)}
                      >
                        <td className="text-sm text-gray-300">{run.startedAt}</td>
                        <td><StatusBadge variant={run.status === 'completed' ? 'success' : 'error'} label={run.status} /></td>
                        <td className="text-sm text-teal-400 font-mono">{run.passed}</td>
                        <td className="text-sm text-red-400 font-mono">{run.failed}</td>
                        <td className="font-mono text-sm text-gray-300">{run.avgScore.toFixed(3)}</td>
                        <td className="font-mono text-sm text-gray-300">${run.cost.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Run detail (mock results) */}
            {expandedRun && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Run Results (Sample)</p>
                <div className="space-y-1">
                  {[
                    { id: 1, input: 'How do I reset my password?', expected: 'Steps to reset password', score: 0.95, passed: true },
                    { id: 2, input: 'What is the refund policy?', expected: 'Refund policy details', score: 0.88, passed: true },
                    { id: 3, input: 'Can I upgrade my plan?', expected: 'Upgrade instructions', score: 0.45, passed: false },
                    { id: 4, input: 'Where are my invoices?', expected: 'Invoice location info', score: 0.92, passed: true },
                    { id: 5, input: 'How to cancel subscription?', expected: 'Cancellation steps', score: 0.38, passed: false },
                  ].map((result) => (
                    <div key={result.id} className="flex items-center gap-3 py-1.5 px-3 bg-gray-800/30 rounded">
                      {result.passed
                        ? <CheckCircle size={14} className="text-teal-400 flex-shrink-0" />
                        : <XCircle size={14} className="text-red-400 flex-shrink-0" />
                      }
                      <span className="text-sm text-gray-300 flex-1 truncate">{result.input}</span>
                      <span className="text-xs text-gray-500">{result.expected}</span>
                      <span className={`text-xs font-mono ${result.score >= 0.8 ? 'text-teal-400' : 'text-red-400'}`}>
                        {(result.score * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}