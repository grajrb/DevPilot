'use client';

import { useState } from 'react';
import { User, Building, CreditCard, Webhook, Save, Check } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { StatusBadge } from '../components/ui/StatusBadge';

type Tab = 'general' | 'team' | 'billing' | 'integrations';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'invited' | 'disabled';
}

const defaultMembers: TeamMember[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@acme.com', role: 'Admin', status: 'active' },
  { id: '2', name: 'Bob Smith', email: 'bob@acme.com', role: 'Developer', status: 'active' },
  { id: '3', name: 'Charlie Lee', email: 'charlie@acme.com', role: 'Viewer', status: 'active' },
  { id: '4', name: 'Diana Wang', email: 'diana@acme.com', role: 'Developer', status: 'invited' },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('general');

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'general', label: 'General', icon: Building },
    { id: 'team', label: 'Team', icon: User },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'integrations', label: 'Integrations', icon: Webhook },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your tenant and preferences" />

      <div className="flex gap-6">
        {/* Tab navigation */}
        <div className="w-48 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-teal-600/15 text-teal-400 border border-teal-600/20'
                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200 border border-transparent'
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
          {activeTab === 'team' && <TeamSettings members={defaultMembers} />}
          {activeTab === 'billing' && <BillingSettings />}
          {activeTab === 'integrations' && <IntegrationsSettings />}
        </div>
      </div>
    </div>
  );
}

function GeneralSettings() {
  const [orgName, setOrgName] = useState('Acme Corp');
  const [llmProvider, setLlmProvider] = useState('openai');
  const [defaultModel, setDefaultModel] = useState('gpt-4');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <h3 className="font-headline font-semibold text-white">General Settings</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Organization Name</label>
          <input
            type="text"
            value={orgName}
            onChange={e => setOrgName(e.target.value)}
            className="input max-w-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Default LLM Provider</label>
          <select className="select max-w-md" value={llmProvider} onChange={e => setLlmProvider(e.target.value)}>
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic</option>
            <option value="azure">Azure OpenAI</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Default Model</label>
          <select className="select max-w-md" value={defaultModel} onChange={e => setDefaultModel(e.target.value)}>
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-4-turbo">GPT-4 Turbo</option>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="claude-3">Claude 3</option>
          </select>
        </div>

        <div className="pt-4">
          <button onClick={handleSave} className="btn-primary flex items-center gap-2">
            {saved ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save Changes</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function TeamSettings({ members: initialMembers }: { members: TeamMember[] }) {
  const [members, setMembers] = useState(initialMembers);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Developer');

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    const newMember: TeamMember = {
      id: String(Date.now()),
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      status: 'invited',
    };
    setMembers(prev => [...prev, newMember]);
    setInviteEmail('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-headline font-semibold text-white">Team Members</h3>
        <div className="flex gap-2">
          <input
            type="email"
            value={inviteEmail}
            onChange={e => setInviteEmail(e.target.value)}
            className="input w-48"
            placeholder="email@company.com"
          />
          <select value={inviteRole} onChange={e => setInviteRole(e.target.value)} className="select w-32">
            <option>Admin</option>
            <option>Developer</option>
            <option>Viewer</option>
          </select>
          <button onClick={handleInvite} className="btn-primary text-sm" disabled={!inviteEmail.trim()}>
            Invite
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {members.map(m => (
              <tr key={m.id}>
                <td className="text-white font-medium">{m.name}</td>
                <td className="text-gray-300">{m.email}</td>
                <td>
                  <span className="text-gray-300">{m.role}</span>
                </td>
                <td>
                  <StatusBadge
                    variant={m.status === 'active' ? 'success' : m.status === 'invited' ? 'info' : 'neutral'}
                    label={m.status}
                  />
                </td>
                <td>
                  <button className="text-xs text-gray-500 hover:text-red-400 transition-colors">
                    Remove
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

function BillingSettings() {
  return (
    <div className="space-y-6">
      <h3 className="font-headline font-semibold text-white">Billing & Usage</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <p className="text-sm text-gray-400">Current Plan</p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xl font-semibold text-white">Pro</p>
            <span className="text-xs text-teal-400 bg-teal-600/15 px-2 py-0.5 rounded">Active</span>
          </div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <p className="text-sm text-gray-400">API Calls (This Month)</p>
          <p className="text-xl font-semibold text-white mt-1">847,293</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <p className="text-sm text-gray-400">Monthly Cost</p>
          <p className="text-xl font-semibold text-white mt-1">$342.50</p>
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-lg border border-gray-700">
        <div className="p-4 border-b border-gray-700">
          <h4 className="font-medium text-white">Usage by Provider</h4>
        </div>
        <div className="divide-y divide-gray-700">
          {[
            { provider: 'OpenAI', model: 'GPT-4', usage: '523K tokens', cost: '$210.00', percent: 61 },
            { provider: 'Anthropic', model: 'Claude 3 Opus', usage: '289K tokens', cost: '$98.50', percent: 29 },
            { provider: 'OpenAI', model: 'GPT-3.5 Turbo', usage: '89K tokens', cost: '$34.00', percent: 10 },
          ].map((item) => (
            <div key={item.model} className="flex items-center justify-between p-4">
              <div className="flex-1">
                <p className="text-sm text-white">{item.provider} — {item.model}</p>
                <div className="mt-1 w-full bg-gray-700 rounded-full h-1.5 max-w-xs">
                  <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${item.percent}%` }} />
                </div>
              </div>
              <div className="text-right ml-4">
                <p className="text-sm text-gray-300">{item.usage}</p>
                <p className="font-mono text-teal-400 text-sm">{item.cost}</p>
              </div>
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

      <div className="space-y-4">
        {[
          { name: 'Production Alerts', url: 'https://hooks.devpilot.app/alerts', events: 124, active: true },
          { name: 'Daily Report', url: 'https://hooks.devpilot.app/report', events: 30, active: true },
        ].map((webhook) => (
          <div key={webhook.name} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-white">{webhook.name}</p>
                <StatusBadge variant={webhook.active ? 'success' : 'neutral'} label={webhook.active ? 'Active' : 'Paused'} />
              </div>
              <p className="text-sm font-mono text-gray-400 mt-1">{webhook.url}</p>
              <p className="text-xs text-gray-500 mt-0.5">{webhook.events} events this week</p>
            </div>
            <button className="btn-ghost text-sm">Configure</button>
          </div>
        ))}
      </div>
    </div>
  );
}