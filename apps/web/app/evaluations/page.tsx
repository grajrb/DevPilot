'use client';

import { Plus, Play, CheckCircle, XCircle, Clock } from 'lucide-react';

const mockEvaluations = [
  {
    id: '1',
    name: 'Customer Support Quality',
    type: 'correctness',
    status: 'completed',
    lastRun: '2 hours ago',
    passRate: 94,
  },
  {
    id: '2',
    name: 'Code Review Accuracy',
    type: 'relevance',
    status: 'running',
    lastRun: 'Running now',
    passRate: null,
  },
  {
    id: '3',
    name: 'Documentation QA',
    type: 'faithfulness',
    status: 'pending',
    lastRun: 'Not yet',
    passRate: null,
  },
];

export default function EvaluationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-headline font-bold text-white">Evaluations</h1>
        <button className="btn-primary">
          <Plus size={16} />
          Create Evaluation
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockEvaluations.map((eval_) => (
          <div key={eval_.id} className="card">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-medium text-white">{eval_.name}</h3>
                <p className="text-sm text-gray-400 capitalize">{eval_.type}</p>
              </div>
              <span
                className={`badge ${
                  eval_.status === 'completed'
                    ? 'badge-success'
                    : eval_.status === 'running'
                    ? 'badge-warning'
                    : 'badge-neutral'
                }`}
              >
                {eval_.status}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Last run: {eval_.lastRun}</span>
              {eval_.passRate !== null && (
                <span className="text-teal-400 font-medium">
                  {eval_.passRate}% pass
                </span>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-800 flex gap-2">
              <button className="btn-ghost text-sm flex-1">
                <Play size={14} className="mr-1" />
                Run
              </button>
              <button className="btn-ghost text-sm flex-1">View</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
