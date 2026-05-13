'use client';

import { useState } from 'react';
import { BarChart3, Activity, AlertTriangle, DollarSign } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { KpiCard, KpiCardGrid } from '../components/ui/KpiCard';
import { DataTable, Column } from '../components/ui/DataTable';
import { StatusBadge } from '../components/ui/StatusBadge';

interface TraceEntry {
  id: string;
  traceId: string;
  model: string;
  provider: string;
  latency: number;
  tokens: number;
  cost: number;
  status: 'success' | 'error';
  timestamp: string;
}

const mockTraces: TraceEntry[] = [
  { id: '1', traceId: 'trace_a1b2c3d4', model: 'gpt-4', provider: 'OpenAI', latency: 1240, tokens: 1523, cost: 0.045, status: 'success', timestamp: '2 min ago' },
  { id: '2', traceId: 'trace_e5f6g7h8', model: 'claude-3-opus', provider: 'Anthropic', latency: 2340, tokens: 2341, cost: 0.089, status: 'success', timestamp: '5 min ago' },
  { id: '3', traceId: 'trace_i9j0k1l2', model: 'gpt-3.5-turbo', provider: 'OpenAI', latency: 890, tokens: 892, cost: 0.012, status: 'error', timestamp: '8 min ago' },
  { id: '4', traceId: 'trace_m3n4o5p6', model: 'gpt-4', provider: 'OpenAI', latency: 3200, tokens: 4102, cost: 0.123, status: 'success', timestamp: '12 min ago' },
  { id: '5', traceId: 'trace_q7r8s9t0', model: 'claude-3-haiku', provider: 'Anthropic', latency: 567, tokens: 623, cost: 0.008, status: 'success', timestamp: '15 min ago' },
];

export default function ObservabilityPage() {
  const [timeRange, setTimeRange] = useState('24h');

  const columns: Column<TraceEntry>[] = [
    { key: 'traceId', header: 'Trace ID', className: 'font-mono', cell: (t) => <span className="font-mono text-teal-400 text-xs">{t.traceId}</span> },
    { key: 'model', header: 'Model', cell: (t) => <span className="text-gray-300">{t.model}</span> },
    { key: 'provider', header: 'Provider', cell: (t) => <span className="text-gray-300">{t.provider}</span> },
    { key: 'latency', header: 'Latency', cell: (t) => <span className="text-gray-300">{t.latency}ms</span> },
    { key: 'tokens', header: 'Tokens', cell: (t) => <span className="text-gray-300 font-mono">{t.tokens.toLocaleString()}</span> },
    { key: 'cost', header: 'Cost', cell: (t) => <span className="text-gray-300 font-mono">${t.cost.toFixed(4)}</span> },
    { key: 'status', header: 'Status', cell: (t) => <StatusBadge variant={t.status === 'success' ? 'success' : 'error'} label={t.status} /> },
    { key: 'timestamp', header: 'Time', cell: (t) => <span className="text-gray-400 text-sm">{t.timestamp}</span> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Observability"
        description="Monitor LLM calls, traces, and costs"
        actions={
          <select className="select w-36" value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value="1h">Last hour</option>
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
        }
      />

      <KpiCardGrid>
        <KpiCard title="Total LLM Calls" value="1.2M" change="+12%" trend="up" icon={<Activity size={16} />} />
        <KpiCard title="Avg Latency" value="245ms" change="-8%" trend="up" icon={<BarChart3 size={16} />} />
        <KpiCard title="Error Rate" value="0.4%" change="-0.2%" trend="up" icon={<AlertTriangle size={16} />} />
        <KpiCard title="Total Cost" value="$1,847" change="+5%" trend="down" icon={<DollarSign size={16} />} />
      </KpiCardGrid>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-medium text-white mb-4">LLM Call Volume</h3>
          <div className="h-64 bg-gray-800/50 rounded flex items-center justify-center text-gray-500">
            [Time series chart placeholder]
          </div>
        </div>
        <div className="card">
          <h3 className="font-medium text-white mb-4">Cost by Provider</h3>
          <div className="h-64 bg-gray-800/50 rounded flex items-center justify-center text-gray-500">
            [Pie chart placeholder]
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-medium text-white mb-4">Recent Traces</h3>
        <DataTable
          columns={columns}
          data={mockTraces}
          keyExtractor={(t) => t.id}
        />
      </div>
    </div>
  );
}