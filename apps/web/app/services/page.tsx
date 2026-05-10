'use client';

import { useState } from 'react';
import { Plus, MoreHorizontal, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

const mockServices = [
  {
    id: '1',
    name: 'auth-service',
    description: 'Authentication and user management',
    status: 'healthy' as const,
    prototype: 'Node.js',
    latency: 45,
    uptime: '99.9%',
  },
  {
    id: '2',
    name: 'payment-processor',
    description: 'Payment processing and billing',
    status: 'healthy' as const,
    prototype: 'Python',
    latency: 120,
    uptime: '99.8%',
  },
  {
    id: '3',
    name: 'notification-service',
    description: 'Email and push notifications',
    status: 'degraded' as const,
    prototype: 'Go',
    latency: 340,
    uptime: '98.2%',
  },
  {
    id: '4',
    name: 'analytics-ingester',
    description: 'Analytics data ingestion pipeline',
    status: 'down' as const,
    prototype: 'Java',
    latency: null,
    uptime: '95.1%',
  },
];

export default function ServicesPage() {
  const [services] = useState(mockServices);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-headline font-bold text-white">Services</h1>
        <div className="flex gap-2">
          <button className="btn-ghost">
            <RefreshCw size={16} />
            Refresh
          </button>
          <button className="btn-primary">
            <Plus size={16} />
            Add Service
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Prototype</th>
              <th>Latency</th>
              <th>Uptime</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id}>
                <td className="font-mono text-teal-400">{service.name}</td>
                <td className="text-gray-300">{service.description}</td>
                <td>
                  <span
                    className={cn(
                      'badge',
                      service.status === 'healthy' && 'badge-success',
                      service.status === 'degraded' && 'badge-warning',
                      service.status === 'down' && 'badge-error'
                    )}
                  >
                    {service.status}
                  </span>
                </td>
                <td className="text-gray-300">{service.prototype}</td>
                <td className="text-gray-300">
                  {service.latency ? `${service.latency}ms` : '-'}
                </td>
                <td className="text-gray-300">{service.uptime}</td>
                <td>
                  <button className="p-1 text-gray-400 hover:text-white">
                    <MoreHorizontal size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
