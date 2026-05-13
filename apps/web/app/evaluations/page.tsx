'use client';

import { Plus, Play, CheckCircle, XCircle, Clock, BarChart3 } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { StatusBadge } from '../components/ui/StatusBadge';
import { KpiCard, KpiCardGrid } from '../components/ui/KpiCard';

interface Evaluation {
  id: string;
  name: string;
  type: string;
  status: 'completed' | 'running' | 'pending' | 'failed';
  lastRun: string;
  passRate: number | null;
  totalTests: number;
}

const mockEvaluations: Evaluation[] = [
  { id: '1', name: 'Customer Support Quality', type: 'correctness', status: 'completed', lastRun: '2 hours ago', passRate: 94, totalTests: 250 },
  { id: '2', name: 'Code Review Accuracy', type: 'relevance', status: 'running', lastRun: 'Running now', passRate: null, totalTests: 180 },
  { id: '3', name: 'Documentation QA', type: 'faithfulness', status: 'pending', lastRun: 'Not yet', passRate: null, totalTests: 120 },
  { id: '4', name: 'Prompt Injection Test', type: 'custom', status: 'completed', lastRun: '1 day ago', passRate: 100, totalTests: 50 },
  { id: '5', name: 'Response Consistency', type: 'correctness', status: 'failed', lastRun: '3 hours ago', passRate: 72, totalTests: 200 },
];

const statusVariant = (status: string) => {
  switch (status) {
    case 'completed': return 'success';
    case 'running': return 'info';
    case 'pending': return 'neutral';
    case 'failed': return 'error';
    default: return 'neutral';
  }
};

export default function EvaluationsPage() {
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
        <KpiCard title="Total Evaluations" value="12" change="+3" trend="up" icon={<BarChart3 size={16} />} />
        <KpiCard title="Avg Pass Rate" value="86%" change="+4%" trend="up" icon={<CheckCircle size={16} />} />
        <KpiCard title="Running Now" value="1" change="" icon={<Clock size={16} />} />
        <KpiCard title="Failed Recently" value="1" change="" icon={<XCircle size={16} />} />
      </KpiCardGrid>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockEvaluations.map((eval_) => (
          <div key={eval_.id} className="card hover:border-teal-500/50 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-medium text-white">{eval_.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5 capitalize">{eval_.type} • {eval_.totalTests} tests</p>
              </div>
              <StatusBadge variant={statusVariant(eval_.status) as any} label={eval_.status} />
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Last run: {eval_.lastRun}</span>
              {eval_.passRate !== null && (
                <span className={`font-medium ${eval_.passRate >= 90 ? 'text-teal-400' : eval_.passRate >= 80 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {eval_.passRate}% pass
                </span>
              )}
              {eval_.status === 'running' && (
                <span className="text-blue-400 text-xs animate-pulse">Processing...</span>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-800 flex gap-2">
              <button className="btn-ghost text-sm flex-1 flex items-center justify-center gap-1">
                <Play size={14} /> Run
              </button>
              <button className="btn-ghost text-sm flex-1">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}