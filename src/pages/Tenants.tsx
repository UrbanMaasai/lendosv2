import { useState } from 'react';
import { Building2, Plus, MoreVertical, Globe, Users, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

const tenants = [
  { id: 1, name: 'PesaFlash', subdomain: 'pesaflash', tier: 'Growth', loans: 3847, status: 'Active', users: 12, created: '2026-01-15' },
  { id: 2, name: 'QuickCredit SACCO', subdomain: 'quickcredit', tier: 'Starter', loans: 423, status: 'Active', users: 5, created: '2026-02-20' },
  { id: 3, name: 'M-Kopo Finance', subdomain: 'mkopo', tier: 'Enterprise', loans: 8921, status: 'Active', users: 28, created: '2025-11-01' },
  { id: 4, name: 'SME Lend Kenya', subdomain: 'smelend', tier: 'Growth', loans: 2156, status: 'Active', users: 8, created: '2026-03-10' },
  { id: 5, name: 'Chama Loans', subdomain: 'chama', tier: 'Starter', loans: 187, status: 'Active', users: 3, created: '2026-04-05' },
  { id: 6, name: 'Boda Finance', subdomain: 'bodafin', tier: 'Free', loans: 42, status: 'Sandbox', users: 2, created: '2026-06-01' },
  { id: 7, name: 'Nafasi Credit', subdomain: 'nafasi', tier: 'Starter', loans: 312, status: 'Active', users: 4, created: '2026-03-22' },
  { id: 8, name: 'Test Lender Demo', subdomain: 'demo', tier: 'Free', loans: 12, status: 'Suspended', users: 1, created: '2026-05-15' },
];

export default function Tenants() {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? tenants : tenants.filter(t => t.status.toLowerCase() === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tenant Management</h1>
          <p className="text-sm text-gray-500">Manage licensed lenders on the platform</p>
        </div>
        <button className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
          <Plus size={16} /> New Tenant
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Tenants', value: '8', icon: Building2 },
          { label: 'Active', value: '6', icon: CheckCircle2 },
          { label: 'Sandbox', value: '1', icon: Clock },
          { label: 'Total Active Loans', value: '15,900', icon: Users },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center">
                <stat.icon size={18} className="text-primary-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        {['all', 'active', 'sandbox', 'suspended'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === f ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Tenant</th>
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Tier</th>
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Active Loans</th>
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Users</th>
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Status</th>
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((tenant) => (
                <tr key={tenant.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                        <span className="text-primary-700 font-bold text-xs">{tenant.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{tenant.name}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Globe size={10} /> {tenant.subdomain}.lendingos.co.ke
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      tenant.tier === 'Enterprise' ? 'bg-purple-50 text-purple-700' :
                      tenant.tier === 'Growth' ? 'bg-primary-50 text-primary-700' :
                      tenant.tier === 'Starter' ? 'bg-accent-50 text-accent-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {tenant.tier}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{tenant.loans.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{tenant.users}</td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1 text-xs font-medium ${
                      tenant.status === 'Active' ? 'text-accent-600' :
                      tenant.status === 'Sandbox' ? 'text-warning-600' :
                      'text-danger-600'
                    }`}>
                      {tenant.status === 'Active' ? <CheckCircle2 size={12} /> :
                       tenant.status === 'Sandbox' ? <Clock size={12} /> :
                       <AlertCircle size={12} />}
                      {tenant.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
