'use client';

import { BarChart3, Server, Activity, DollarSign } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { KpiCard, KpiCardGrid } from '../components/ui/KpiCard';

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Overview" description="DevPilot platform summary" />

      <KpiCardGrid>
        <KpiCard
          title="Services"
          value="12"
          change="+2"
          trend="up"
          icon={<Server size={16} />}
        />
        <KpiCard
          title="API Calls (24h)"
          value="1.2M"
          change="+15%"
          trend="up"
          icon={<Activity size={16} />}
        />
        <KpiCard
          title="Avg Latency"
          value="124ms"
          change="-8%"
          trend="up"
          icon={<BarChart3 size={16} />}
        />
        <KpiCard
          title="Monthly Cost"
          value="$342"
          change="+5%"
          trend="down"
          icon={<DollarSign size={16} />}
        />
      </KpiCardGrid>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-medium text-white mb-4">LLM Usage (Last 7 days)</h3>
          <div className="h-64 bg-gray-800/50 rounded flex items-center justify-center text-gray-500">
            [Chart placeholder]
          </div>
        </div>
        <div className="card">
          <h3 className="font-medium text-white mb-4">Cost by Model</h3>
          <div className="h-64 bg-gray-800/50 rounded flex items-center justify-center text-gray-500">
            [Chart placeholder]
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-medium text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { action: 'Service deployed', service: 'auth-service', user: 'Alice', time: '2 min ago' },
            { action: 'API key created', service: 'Production', user: 'Bob', time: '15 min ago' },
            { action: 'Evaluation completed', service: 'Customer Support QA', user: 'Alice', time: '1 hour ago' },
            { action: 'Document uploaded', service: 'API Reference v2', user: 'Charlie', time: '3 hours ago' },
          ].map((event, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
              <div className="flex items-center gap-2">
                <span className="text-white text-sm">{event.action}</span>
                <span className="text-gray-400 text-sm">—</span>
                <span className="text-teal-400 text-sm font-mono">{event.service}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-xs">{event.user}</span>
                <span className="text-gray-500 text-xs">{event.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}