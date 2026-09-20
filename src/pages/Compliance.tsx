import { useState } from 'react';
import { Shield, CheckCircle2, AlertTriangle, Clock, FileText, Lock, Eye, AlertCircle, Activity, Zap, TrendingUp } from 'lucide-react';

const auditLogs = [
  { id: 1, timestamp: '2026-06-15 14:32:01', user: 'system', action: 'IN_DUPLUM_TRIGGERED', entity: 'LN-2026-0840', details: 'Total recovered = 2× principal. Further charges blocked.', hash: 'a7f3c9...' },
  { id: 2, timestamp: '2026-06-15 14:28:45', user: 'sarah.k', action: 'PRODUCT_CHANGE', entity: 'Salary Advance', details: 'APR changed from 38% to 36%. Approved by: credit.lead', hash: 'b2e8d1...' },
  { id: 3, timestamp: '2026-06-15 14:15:22', user: 'system', action: 'CONSENT_WITHDRAWN', entity: 'BRW-00234', details: 'Marketing consent withdrawn. Processing ceased.', hash: 'c4f2a8...' },
  { id: 4, timestamp: '2026-06-15 13:58:11', user: 'james.m', action: 'MANUAL_OVERRIDE', entity: 'LN-2026-0846', details: 'Override: INCOME_VERIFIED_PAYSLIP. Approved by: credit.lead', hash: 'd9e1b3...' },
  { id: 5, timestamp: '2026-06-15 13:42:33', user: 'system', action: 'KFS_GENERATED', entity: 'LN-2026-0847', details: 'Key Facts Statement generated. Version: 2.5', hash: 'e5a7c2...' },
  { id: 6, timestamp: '2026-06-15 13:30:00', user: 'system', action: 'COOLING_OFF_STARTED', entity: 'LN-2026-0839', details: '24h cooling-off period initiated for first-time borrower', hash: 'f1b9d4...' },
  { id: 7, timestamp: '2026-06-15 12:15:44', user: 'compliance', action: 'COLLECTIONS_BLOCK', entity: 'COL-007', details: 'Contact limit reached (3/3). Auto-suppressed until next day.', hash: 'a3c5e7...' },
  { id: 8, timestamp: '2026-06-15 11:45:22', user: 'system', action: 'CONSENT_GRANTED', entity: 'BRW-08912', details: 'Credit check + CRB reporting consent granted. IP: 105.23.x.x', hash: 'b8d2f1...' },
];

const complianceChecks = [
  { category: 'In Duplum (LS-005)', checks: 15847, passed: 15847, failed: 0, status: 'pass' },
  { category: 'KFS Generation (KFS-001)', checks: 15847, passed: 15823, failed: 24, status: 'warning' },
  { category: 'Cooling-Off (COP-001)', checks: 1247, passed: 1247, failed: 0, status: 'pass' },
  { category: 'Consent Coverage (CON-001)', checks: 12847, passed: 12680, failed: 167, status: 'warning' },
  { category: 'Affordability (SUI-001)', checks: 15847, passed: 15847, failed: 0, status: 'pass' },
  { category: 'Collections Conduct (CL-003 to CL-010)', checks: 45230, passed: 45230, failed: 0, status: 'pass' },
  { category: 'Audit Log Integrity (CA-001)', checks: 1, passed: 1, failed: 0, status: 'pass' },
  { category: 'Contact Hours (DLAK)', checks: 45230, passed: 45230, failed: 0, status: 'pass' },
];

const complaints = [
  { id: 'CMP-001', borrower: 'John Doe', category: 'Communication', status: 'Resolved', date: '2026-06-10', resolution: 'Apology issued, contact frequency reduced' },
  { id: 'CMP-002', borrower: 'Jane Smith', category: 'Interest Dispute', status: 'In Progress', date: '2026-06-12', resolution: 'Under review by credit team' },
];

export default function Compliance() {
  const [tab, setTab] = useState<'overview' | 'audit' | 'complaints'>('overview');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliance & Audit</h1>
          <p className="text-sm text-gray-500">Regulatory compliance monitoring and tamper-evident audit trail</p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-accent-50 text-accent-700 px-3 py-1.5 rounded-full">
          <CheckCircle2 size={14} /> Hash chain verified · 7-year retention active
        </div>
      </div>

      {/* Compliance Score */}
      <div className="bg-gradient-to-r from-accent-50 to-primary-50 rounded-xl p-6 border border-accent-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">Platform Compliance Score</h3>
            <p className="text-sm text-gray-600">Real-time monitoring of all hard-blocks and controls</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-accent-600">99.4%</p>
            <p className="text-xs text-gray-500">Overall compliance rate</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Hard-Blocks Active', value: '12/12', icon: Lock },
            { label: 'Audit Entries (Today)', value: '2,847', icon: FileText },
            { label: 'Open Complaints', value: '1', icon: AlertCircle },
            { label: 'Overrides (Week)', value: '23', icon: Eye },
          ].map((item) => (
            <div key={item.label} className="bg-white/80 rounded-lg p-3">
              <item.icon size={16} className="text-primary-600 mb-1" />
              <p className="text-lg font-bold text-gray-900">{item.value}</p>
              <p className="text-xs text-gray-500">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Real-Time Monitoring */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity size={18} className="text-primary-600" />
            <h3 className="font-semibold text-gray-900">Real-Time Compliance Monitoring</h3>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></div>
            <span className="text-accent-600 font-medium">Live</span>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'In Duplum Checks', current: 15847, total: 15847, status: 'pass', icon: Lock },
            { label: 'Consent Validations', current: 12680, total: 12847, status: 'warning', icon: Shield },
            { label: 'Collections Conduct', current: 45230, total: 45230, status: 'pass', icon: Zap },
            { label: 'Contact Hours', current: 45230, total: 45230, status: 'pass', icon: Clock },
          ].map((monitor) => (
            <div key={monitor.label} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <monitor.icon size={16} className={monitor.status === 'pass' ? 'text-accent-600' : 'text-warning-600'} />
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  monitor.status === 'pass' ? 'bg-accent-50 text-accent-700' : 'bg-warning-50 text-warning-700'
                }`}>
                  {monitor.status === 'pass' ? '✓' : '⚠'}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-900">{monitor.label}</p>
              <p className="text-xs text-gray-500 mt-1">
                {monitor.current.toLocaleString()} / {monitor.total.toLocaleString()}
              </p>
              <div className="mt-2 w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${monitor.status === 'pass' ? 'bg-accent-500' : 'bg-warning-500'}`}
                  style={{ width: `${(monitor.current / monitor.total) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {(['overview', 'audit', 'complaints'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}
          >
            {t === 'overview' ? 'Compliance Checks' : t === 'audit' ? 'Audit Log' : 'Complaints'}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Control</th>
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Checks</th>
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Passed</th>
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Failed</th>
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {complianceChecks.map((check) => (
                <tr key={check.category} className="border-b border-gray-50">
                  <td className="px-6 py-3 text-sm font-medium text-gray-900">{check.category}</td>
                  <td className="px-6 py-3 text-sm text-gray-700">{check.checks.toLocaleString()}</td>
                  <td className="px-6 py-3 text-sm text-accent-600">{check.passed.toLocaleString()}</td>
                  <td className="px-6 py-3 text-sm">
                    {check.failed > 0 ? (
                      <span className="text-warning-600 font-medium">{check.failed}</span>
                    ) : (
                      <span className="text-gray-400">0</span>
                    )}
                  </td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${
                      check.status === 'pass' ? 'bg-accent-50 text-accent-700' : 'bg-warning-50 text-warning-700'
                    }`}>
                      {check.status === 'pass' ? <CheckCircle2 size={10} /> : <AlertTriangle size={10} />}
                      {check.status === 'pass' ? 'Passing' : 'Attention'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'audit' && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Tamper-Evident Audit Log (Append-Only, Hash-Chained)</span>
            <span className="text-xs text-accent-600 font-medium">Chain: Verified ✓</span>
          </div>
          <div className="divide-y divide-gray-50 max-h-96 overflow-y-auto scrollbar-thin">
            {auditLogs.map((log) => (
              <div key={log.id} className="px-6 py-3 hover:bg-gray-50/50">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded">{log.action}</span>
                    <span className="text-xs text-gray-500">{log.entity}</span>
                  </div>
                  <span className="text-xs text-gray-400 font-mono">{log.hash}</span>
                </div>
                <p className="text-sm text-gray-700">{log.details}</p>
                <p className="text-xs text-gray-400 mt-1">{log.timestamp} · User: {log.user}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'complaints' && (
        <div className="space-y-4">
          {complaints.map((complaint) => (
            <div key={complaint.id} className="bg-white rounded-xl p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-primary-600">{complaint.id}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    complaint.status === 'Resolved' ? 'bg-accent-50 text-accent-700' : 'bg-warning-50 text-warning-700'
                  }`}>
                    {complaint.status}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{complaint.date}</span>
              </div>
              <p className="text-sm text-gray-700"><strong>Borrower:</strong> {complaint.borrower}</p>
              <p className="text-sm text-gray-700"><strong>Category:</strong> {complaint.category}</p>
              <p className="text-sm text-gray-600 mt-1">{complaint.resolution}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
