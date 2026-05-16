'use client';

import { useState } from 'react';
import {
  BarChart3,
  Activity,
  AlertTriangle,
  DollarSign,
  Search,
  ChevronDown,
  ChevronRight,
  Clock,
  Zap,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { PageHeader } from '../components/ui/PageHeader';
import { KpiCard, KpiCardGrid } from '../components/ui/KpiCard';
import { DataTable, Column } from '../components/ui/DataTable';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Modal } from '../components/ui/Modal';

const volumeData = [
  { time: '00:00', calls: 45, latency: 210 },
  { time: '04:00', calls: 32, latency: 195 },
  { time: '08:00', calls: 128, latency: 245 },
  { time: '10:00', calls: 245, latency: 320 },
  { time: '12:00', calls: 312, latency: 289 },
  { time: '14:00', calls: 298, latency: 267 },
  { time: '16:00', calls: 267, latency: 234 },
  { time: '18:00', calls: 189, latency: 198 },
  { time: '20:00', calls: 134, latency: 178 },
  { time: '22:00', calls: 78, latency: 165 },
];

const costByProvider = [
  { name: 'OpenAI', value: 1240, color: '#14B8A6' },
  { name: 'Anthropic', value: 890, color: '#6366F1' },
  { name: 'Azure', value: 340, color: '#F38764' },
  { name: 'Ollama', value: 120, color: '#727876' },
];

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
  spans: { name: string; duration: number; status: string }[];
}

interface SpanDetail {
  spanId: string;
  name: string;
  startTime: string;
  duration: number;
  status: string;
  attributes: Record<string, string>;
}

const mockTraces: TraceEntry[] = [
  {
    id: '1', traceId: 'trace_a1b2c3d4', model: 'gpt-4', provider: 'OpenAI',
    latency: 1240, tokens: 1523, cost: 0.045, status: 'success', timestamp: '2 min ago',
    spans: [
      { name: 'chat.completion', duration: 890, status: 'ok' },
      { name: 'rag.retrieve', duration: 320, status: 'ok' },
      { name: 'embedding.generate', duration: 30, status: 'ok' },
    ],
  },
  {
    id: '2', traceId: 'trace_e5f6g7h8', model: 'claude-3-opus', provider: 'Anthropic',
    latency: 2340, tokens: 2341, cost: 0.089, status: 'success', timestamp: '5 min ago',
    spans: [
      { name: 'chat.completion', duration: 2100, status: 'ok' },
      { name: 'tool.use', duration: 240, status: 'ok' },
    ],
  },
  {
    id: '3', traceId: 'trace_i9j0k1l2', model: 'gpt-3.5-turbo', provider: 'OpenAI',
    latency: 890, tokens: 892, cost: 0.012, status: 'error', timestamp: '8 min ago',
    spans: [
      { name: 'chat.completion', duration: 500, status: 'ok' },
      { name: 'rag.retrieve', duration: 390, status: 'error' },
    ],
  },
  {
    id: '4', traceId: 'trace_m3n4o5p6', model: 'gpt-4', provider: 'OpenAI',
    latency: 3200, tokens: 4102, cost: 0.123, status: 'success', timestamp: '12 min ago',
    spans: [
      { name: 'chat.completion', duration: 2800, status: 'ok' },
      { name: 'rag.retrieve', duration: 350, status: 'ok' },
      { name: 'guardrail.check', duration: 50, status: 'ok' },
    ],
  },
  {
    id: '5', traceId: 'trace_q7r8s9t0', model: 'claude-3-haiku', provider: 'Anthropic',
    latency: 567, tokens: 623, cost: 0.008, status: 'success', timestamp: '15 min ago',
    spans: [
      { name: 'chat.completion', duration: 450, status: 'ok' },
      { name: 'embedding.generate', duration: 117, status: 'ok' },
    ],
  },
];

const CHART_COLORS = ['#14B8A6', '#6366F1', '#F38764', '#727876', '#E11D48', '#D97706'];

export default function ObservabilityPage() {
  const [timeRange, setTimeRange] = useState('24h');
  const [selectedTrace, setSelectedTrace] = useState<TraceEntry | null>(null);
  const [expandedTrace, setExpandedTrace] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTraces = mockTraces.filter(
    (t) =>
      t.traceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.provider.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleExpand = (id: string) => {
    setExpandedTrace(expandedTrace === id ? null : id);
  };

  const columns: Column<TraceEntry>[] = [
    {
      key: 'expand',
      header: '',
      className: 'w-8',
      cell: (t) => (
        <button onClick={() => toggleExpand(t.id)} className="p-1 text-gray-500 hover:text-white">
          {expandedTrace === t.id ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
      ),
    },
    {
      key: 'traceId',
      header: 'Trace ID',
      cell: (t) => (
        <button
          onClick={() => setSelectedTrace(t)}
          className="font-mono text-sm text-teal-400 hover:text-teal-300 transition-colors"
        >
          {t.traceId}
        </button>
      ),
    },
    { key: 'model', header: 'Model', cell: (t) => <span className="text-gray-300 text-sm">{t.model}</span> },
    { key: 'provider', header: 'Provider', cell: (t) => <span className="text-gray-300 text-sm">{t.provider}</span> },
    {
      key: 'latency',
      header: 'Latency',
      cell: (t) => (
        <span className="font-mono text-sm text-gray-300">
          {t.latency}ms
          <span className="text-gray-600 ml-1">({t.spans.length} spans)</span>
        </span>
      ),
    },
    {
      key: 'tokens',
      header: 'Tokens',
      cell: (t) => <span className="font-mono text-sm text-gray-300">{t.tokens.toLocaleString()}</span>,
    },
    {
      key: 'cost',
      header: 'Cost',
      cell: (t) => <span className="font-mono text-sm text-gray-300">${t.cost.toFixed(4)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      cell: (t) => <StatusBadge variant={t.status === 'success' ? 'success' : 'error'} label={t.status} />,
    },
    {
      key: 'timestamp',
      header: 'Time',
      cell: (t) => <span className="text-gray-500 text-xs">{t.timestamp}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Observability"
        description="Monitor LLM calls, traces, and costs"
        actions={
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
              <input
                type="text"
                placeholder="Search traces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-8 h-9 w-48 text-sm"
              />
            </div>
            <select className="select w-32 h-9 text-sm" value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
              <option value="1h">Last hour</option>
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </select>
          </div>
        }
      />

      <KpiCardGrid>
        <KpiCard title="Total LLM Calls" value="1.2M" change="+12%" trend="up" icon={<Activity size={16} />} />
        <KpiCard title="Avg Latency" value="245ms" change="-8%" trend="up" icon={<BarChart3 size={16} />} />
        <KpiCard title="Error Rate" value="0.4%" change="-0.2%" trend="up" icon={<AlertTriangle size={16} />} />
        <KpiCard title="Total Cost" value="$1,847" change="+5%" trend="down" icon={<DollarSign size={16} />} />
      </KpiCardGrid>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-white">LLM Call Volume</h3>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-teal-400" /> Calls</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-400" /> Latency</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="time" stroke="#6b7280" fontSize={11} />
                <YAxis yAxisId="left" stroke="#6b7280" fontSize={11} />
                <YAxis yAxisId="right" orientation="right" stroke="#6b7280" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '6px', fontSize: '12px' }}
                  labelStyle={{ color: '#f9fafb' }}
                />
                <Line yAxisId="left" type="monotone" dataKey="calls" stroke="#14B8A6" strokeWidth={2} dot={{ r: 3, fill: '#14B8A6' }} />
                <Line yAxisId="right" type="monotone" dataKey="latency" stroke="#6366F1" strokeWidth={2} dot={{ r: 3, fill: '#6366F1' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <h3 className="font-medium text-white mb-4">Cost by Provider</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={costByProvider}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {costByProvider.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '6px', fontSize: '12px' }}
                  labelStyle={{ color: '#f9fafb' }}
                  formatter={(value: number) => [`$${value}`, 'Cost']}
                />
                <Legend
                  formatter={(value) => <span style={{ color: '#9ca3af', fontSize: '12px' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Model Performance */}
      <div className="card">
        <h3 className="font-medium text-white mb-4">Model Performance</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { model: 'GPT-4', calls: 452, avgLatency: 1240, errorRate: 0.3 },
              { model: 'GPT-3.5', calls: 823, avgLatency: 567, errorRate: 0.8 },
              { model: 'Claude 3 Opus', calls: 234, avgLatency: 2340, errorRate: 0.1 },
              { model: 'Claude 3 Haiku', calls: 387, avgLatency: 456, errorRate: 0.2 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="model" stroke="#6b7280" fontSize={11} />
              <YAxis stroke="#6b7280" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '6px', fontSize: '12px' }}
                labelStyle={{ color: '#f9fafb' }}
              />
              <Bar dataKey="calls" fill="#14B8A6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Traces Table with expandable rows */}
      <div className="card">
        <h3 className="font-medium text-white mb-4">Traces</h3>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th className="w-8"></th>
                <th>Trace ID</th>
                <th>Model</th>
                <th>Provider</th>
                <th>Latency</th>
                <th>Tokens</th>
                <th>Cost</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredTraces.map((trace) => (
                <>
                  <tr key={trace.id} className="cursor-pointer hover:bg-gray-900/50" onClick={() => toggleExpand(trace.id)}>
                    <td>
                      {expandedTrace === trace.id ? <ChevronDown size={14} className="text-gray-500" /> : <ChevronRight size={14} className="text-gray-500" />}
                    </td>
                    <td>
                      <button onClick={(e) => { e.stopPropagation(); setSelectedTrace(trace); }} className="font-mono text-sm text-teal-400 hover:text-teal-300">
                        {trace.traceId}
                      </button>
                    </td>
                    <td className="text-sm text-gray-300">{trace.model}</td>
                    <td className="text-sm text-gray-300">{trace.provider}</td>
                    <td className="font-mono text-sm text-gray-300">
                      {trace.latency}ms
                      <span className="text-gray-600 ml-1">({trace.spans.length} spans)</span>
                    </td>
                    <td className="font-mono text-sm text-gray-300">{trace.tokens.toLocaleString()}</td>
                    <td className="font-mono text-sm text-gray-300">${trace.cost.toFixed(4)}</td>
                    <td><StatusBadge variant={trace.status === 'success' ? 'success' : 'error'} label={trace.status} /></td>
                    <td className="text-xs text-gray-500">{trace.timestamp}</td>
                  </tr>
                  {expandedTrace === trace.id && (
                    <tr key={`${trace.id}-spans`}>
                      <td colSpan={9} className="bg-gray-900/30 p-4">
                        <div className="space-y-2">
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Span Timeline</p>
                          <div className="relative">
                            {/* Timeline bar */}
                            <div className="flex items-center gap-1 h-2 mb-3">
                              <span className="text-[10px] text-gray-600 w-10">0ms</span>
                              <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden flex">
                                {trace.spans.map((span, i) => {
                                  const pct = Math.max((span.duration / trace.latency) * 100, 5);
                                  return (
                                    <div
                                      key={i}
                                      className={`h-full ${span.status === 'ok' ? 'bg-teal-500' : 'bg-red-500'} first:rounded-l-full last:rounded-r-full mx-0.5`}
                                      style={{ width: `${pct}%` }}
                                      title={`${span.name}: ${span.duration}ms`}
                                    />
                                  );
                                })}
                              </div>
                              <span className="text-[10px] text-gray-600 w-10 text-right">{trace.latency}ms</span>
                            </div>
                            {/* Span details */}
                            {trace.spans.map((span, i) => (
                              <div key={i} className="flex items-center gap-3 py-1.5 px-2 bg-gray-800/30 rounded">
                                <div className={`w-2 h-2 rounded-full ${span.status === 'ok' ? 'bg-teal-400' : 'bg-red-400'}`} />
                                <span className="text-sm text-gray-300 flex-1">{span.name}</span>
                                <span className="text-xs font-mono text-gray-500">{span.duration}ms</span>
                                <StatusBadge variant={span.status === 'ok' ? 'success' : 'error'} label={span.status} />
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
          <span className="text-sm text-gray-500">{filteredTraces.length} traces</span>
          <div className="flex gap-2">
            <button className="btn-ghost text-xs px-3 py-1.5" disabled>Previous</button>
            <button className="btn-ghost text-xs px-3 py-1.5">Next</button>
          </div>
        </div>
      </div>

      {/* Trace Detail Modal */}
      <Modal
        isOpen={!!selectedTrace}
        onClose={() => setSelectedTrace(null)}
        title={`Trace: ${selectedTrace?.traceId || ''}`}
        description={`${selectedTrace?.model} on ${selectedTrace?.provider}`}
        size="lg"
      >
        {selectedTrace && (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-gray-800/50 rounded p-3">
                <p className="text-xs text-gray-500">Latency</p>
                <p className="text-lg font-semibold text-white font-mono mt-1">{selectedTrace.latency}ms</p>
              </div>
              <div className="bg-gray-800/50 rounded p-3">
                <p className="text-xs text-gray-500">Tokens</p>
                <p className="text-lg font-semibold text-white font-mono mt-1">{selectedTrace.tokens.toLocaleString()}</p>
              </div>
              <div className="bg-gray-800/50 rounded p-3">
                <p className="text-xs text-gray-500">Cost</p>
                <p className="text-lg font-semibold text-white font-mono mt-1">${selectedTrace.cost.toFixed(4)}</p>
              </div>
              <div className="bg-gray-800/50 rounded p-3">
                <p className="text-xs text-gray-500">Status</p>
                <div className="mt-1"><StatusBadge variant={selectedTrace.status === 'success' ? 'success' : 'error'} label={selectedTrace.status} /></div>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Span Details</p>
              {selectedTrace.spans.map((span, i) => (
                <div key={i} className="flex items-center gap-3 py-2 px-3 bg-gray-800/30 rounded mb-1">
                  <div className={`w-2 h-2 rounded-full ${span.status === 'ok' ? 'bg-teal-400' : 'bg-red-400'}`} />
                  <span className="text-sm text-gray-200 flex-1">{span.name}</span>
                  <span className="text-xs font-mono text-gray-400">{span.duration}ms</span>
                  <span className="text-xs font-mono text-gray-500">{((span.duration / selectedTrace.latency) * 100).toFixed(0)}%</span>
                  <StatusBadge variant={span.status === 'ok' ? 'success' : 'error'} label={span.status} />
                </div>
              ))}
            </div>
            <div className="border-t border-gray-800 pt-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Attributes</p>
              <div className="space-y-1">
                {[
                  { key: 'model', value: selectedTrace.model },
                  { key: 'provider', value: selectedTrace.provider },
                  { key: 'temperature', value: '0.7' },
                  { key: 'max_tokens', value: '2048' },
                  { key: 'tenant_id', value: 'acme_corp' },
                ].map((attr) => (
                  <div key={attr.key} className="flex items-center gap-3 py-1">
                    <span className="text-xs font-mono text-teal-400 w-28">{attr.key}</span>
                    <span className="text-xs text-gray-400">{attr.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}