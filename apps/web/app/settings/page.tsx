'use client';

import { useState } from 'react';
import { User, Building, CreditCard, Webhook, Save } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: Building },
    { id: 'team', label: 'Team', icon: User },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'integrations', label: 'Integrations', icon: Webhook },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-headline font-bold text-white">Settings</h1>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-48 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 card">
          {activeTab === 'general' && <GeneralSettings />}
          {activeTab === 'team' && <TeamSettings />}
          {activeTab === 'billing' && <BillingSettings />}
          {activeTab === 'integrations' && <IntegrationsSettings />}
        </div>
      </div>
    </div>
  );
}

function GeneralSettings() {
  return (
    <div className="space-y-6">
      <h3 className="font-headline font-semibold text-white">General Settings</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Organization Name
          </label>
          <input
            type="text"
            defaultValue="Acme Corp"
            className="input max-w-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Default LLM Provider
          </label>
          <select className="select max-w-md" defaultValue="openai">
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic</option>
            <option value="azure">Azure OpenAI</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Default Model
          </label>
          <select className="select max-w-md" defaultValue="gpt-4">
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-4-turbo">GPT-4 Turbo</option>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="claude-3">Claude 3</option>
          </select>
        </div>

        <div className="pt-4">
          <button className="btn-primary">
            <Save size={16} className="mr-2" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function TeamSettings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-headline font-semibold text-white">Team Members</h3>
        <button className="btn-primary">
          <User size={16} className="mr-2" />
          Invite User
        </button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-white">Alice Johnson</td>
              <td>alice@acme.com</td>
              <td>Admin</td>
              <td><span className="badge badge-success">Active</span></td>
            </tr>
            <tr>
              <td className="text-white">Bob Smith</td>
              <td>bob@acme.com</td>
              <td>Developer</td>
              <td><span className="badge badge-success">Active</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BillingSettings() {
  return (
    <div className="space-y-6">
      <h3 className="font-headline font-semibold text-white">Billing & Usage</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <p className="text-sm text-gray-400">Current Plan</p>
          <p className="text-xl font-semibold text-white mt-1">Pro</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-400">API Calls (This Month)</p>
          <p className="text-xl font-semibold text-white mt-1">847,293</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-400">Monthly Cost</p>
          <p className="text-xl font-semibold text-white mt-1">$342.50</p>
        </div>
      </div>

      <div className="card">
        <h4 className="font-medium text-white mb-3">Usage Breakdown</h4>
        <div className="space-y-3">
          {[
            { provider: 'OpenAI', model: 'GPT-4', usage: '523K tokens', cost: '$210' },
            { provider: 'Anthropic', model: 'Claude 3', usage: '289K tokens', cost: '$98' },
          ].map((item) => (
            <div key={item.model} className="flex justify-between items-center py-2 border-b border-gray-800 last:border-0">
              <div>
                <p className="text-sm text-white">{item.provider} - {item.model}</p>
                <p className="text-xs text-gray-400">{item.usage}</p>
              </div>
              <span className="font-mono text-teal-400">{item.cost}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function IntegrationsSettings() {
  return (
    <div className="space-y-6">
      <h3 className="font-headline font-semibold text-white">Webhooks</h3>

      <div className="card">
        <p className="text-sm text-gray-400 mb-4">
          Configure webhook endpoints to receive real-time notifications for events.
        </p>

        <div className="space-y-4">
          {[
            { name: 'Production Alerts', url: 'https://api.acme.com/webhooks/alerts', events: 124 },
            { name: 'Daily Report', url: 'https://api.acme.com/webhooks/report', events: 30 },
          ].map((webhook) => (
            <div key={webhook.name} className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0">
              <div>
                <p className="font-medium text-white">{webhook.name}</p>
                <p className="text-sm font-mono text-gray-400 truncate max-w-md">{webhook.url}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400">{webhook.events} events/week</span>
                <button className="text-sm text-teal-400 hover:text-teal-300">Edit</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
