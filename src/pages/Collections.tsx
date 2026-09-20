import { useState } from 'react';
import { PhoneCall, AlertTriangle, Clock, CheckCircle2, MessageSquare, Shield, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const delinquencyData = [
  { bucket: '1-30 DPD', count: 578, amount: 28400000 },
  { bucket: '31-60 DPD', count: 312, amount: 15600000 },
  { bucket: '61-90 DPD', count: 116, amount: 5800000 },
  { bucket: '90+ DPD', count: 74, amount: 3700000 },
];

const cases = [
  { id: 'COL-001', borrower: 'David Kiprop', loan: 'LN-2026-0843', dpd: 45, amount: 9440, bucket: '31-60', action: 'SMS Reminder', lastContact: '2026-06-13', ptp: null, agent: 'Auto' },
  { id: 'COL-002', borrower: 'Joseph Mutua', loan: 'LN-2026-0821', dpd: 67, amount: 18200, bucket: '61-90', action: 'Phone Call', lastContact: '2026-06-12', ptp: '2026-06-20', agent: 'Sarah K.' },
  { id: 'COL-003', borrower: 'Ann Wambui', loan: 'LN-2026-0798', dpd: 12, amount: 5600, bucket: '1-30', action: 'Educational SMS', lastContact: '2026-06-14', ptp: null, agent: 'Auto' },
  { id: 'COL-004', borrower: 'Michael Otieno', loan: 'LN-2026-0756', dpd: 95, amount: 24500, bucket: '90+', action: 'Formal Demand', lastContact: '2026-06-10', ptp: null, agent: 'James M.' },
  { id: 'COL-005', borrower: 'Lucy Njeri', loan: 'LN-2026-0834', dpd: 23, amount: 7800, bucket: '1-30', action: 'PTP Reminder', lastContact: '2026-06-14', ptp: '2026-06-16', agent: 'Auto' },
  { id: 'COL-006', borrower: 'Robert Koech', loan: 'LN-2026-0812', dpd: 38, amount: 12300, bucket: '31-60', action: 'Restructure Offer', lastContact: '2026-06-13', ptp: null, agent: 'Sarah K.' },
];

const conductRules = [
  { code: 'CL-005', rule: 'No contact list access', status: 'Enforced', desc: 'Platform prevents tenant access to borrower contacts' },
  { code: 'CL-006', rule: 'No third-party messaging', status: 'Enforced', desc: 'SMS/calls only to borrower, never to family/employers' },
  { code: 'CL-007', rule: 'No social media shaming', status: 'Enforced', desc: 'No API for public debt disclosure' },
  { code: 'CL-008', rule: 'Pre-approved templates only', status: 'Enforced', desc: 'No free-text in collections communications' },
  { code: 'CL-009', rule: 'All communications logged', status: 'Enforced', desc: 'Timestamp, channel, agent, content hash captured' },
  { code: 'CL-003', rule: 'Max 3 contacts/day', status: 'Enforced', desc: 'All channels combined, auto-blocked after limit' },
];

export default function Collections() {
  const [tab, setTab] = useState<'queue' | 'conduct'>('queue');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Collections</h1>
          <p className="text-sm text-gray-500">DLAK-compliant collections with conduct hard-blocks</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Cases', value: '1,080', icon: PhoneCall, color: 'text-primary-600 bg-primary-50' },
          { label: 'Active PTPs', value: '234', icon: Clock, color: 'text-warning-600 bg-warning-50' },
          { label: 'Resolved This Week', value: '89', icon: CheckCircle2, color: 'text-accent-600 bg-accent-50' },
          { label: 'Complaints (Month)', value: '2', icon: Shield, color: 'text-purple-600 bg-purple-50' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 border border-gray-100">
            <div className={`w-8 h-8 ${stat.color.split(' ')[1]} rounded-lg flex items-center justify-center mb-2`}>
              <stat.icon size={16} className={stat.color.split(' ')[0]} />
            </div>
            <p className="text-xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Delinquency Chart */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Delinquency Buckets</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={delinquencyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="bucket" tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <Tooltip formatter={(value: number, name: string) => [name === 'count' ? value : `KES ${(value / 1000000).toFixed(1)}M`, name === 'count' ? 'Loans' : 'Amount']} />
            <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} name="count" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => setTab('queue')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === 'queue' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}
        >
          Collections Queue
        </button>
        <button
          onClick={() => setTab('conduct')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === 'conduct' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}
        >
          Conduct Rules
        </button>
      </div>

      {tab === 'queue' ? (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Case</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Borrower</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">DPD</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Amount</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Action</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">PTP</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Agent</th>
                </tr>
              </thead>
              <tbody>
                {cases.map((c) => (
                  <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-sm font-mono text-primary-600">{c.id}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">{c.borrower}</p>
                      <p className="text-xs text-gray-500">{c.loan}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        c.dpd <= 30 ? 'bg-warning-50 text-warning-700' :
                        c.dpd <= 60 ? 'bg-orange-50 text-orange-700' :
                        c.dpd <= 90 ? 'bg-danger-50 text-danger-700' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {c.dpd} days
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">KES {c.amount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-600 flex items-center gap-1">
                        <MessageSquare size={10} /> {c.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{c.ptp || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{c.agent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {conductRules.map((rule) => (
            <div key={rule.code} className="bg-white rounded-xl p-4 border border-gray-100 flex items-start gap-4">
              <div className="w-8 h-8 bg-accent-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield size={16} className="text-accent-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-gray-500">{rule.code}</span>
                  <span className="text-sm font-medium text-gray-900">{rule.rule}</span>
                  <span className="text-xs bg-accent-50 text-accent-700 px-2 py-0.5 rounded-full">{rule.status}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{rule.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Escalation Notice */}
      <div className="bg-accent-50 border border-accent-200 rounded-xl p-4 flex items-start gap-3">
        <Shield size={18} className="text-accent-600 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-accent-800">Auto-Escalation Monitor (CL-010)</p>
          <p className="text-xs text-accent-700 mt-1">
            Current month complaints: 2/3 threshold. Platform compliance review triggers automatically if complaints exceed 3 per tenant per month.
            All collections contacts are within permitted hours (07:00-20:00). No Sunday/holiday contacts detected.
          </p>
        </div>
      </div>
    </div>
  );
}
