import { useState, useEffect } from 'react';
import { FileText, Search, Filter, Shield, CheckCircle2, AlertTriangle, Lock, Eye, Download, Hash } from 'lucide-react';
import { dataLayer, AuditLog } from '../services/dataLayer';

export default function AuditLogExplorer() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [chainVerified, setChainVerified] = useState(true);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  useEffect(() => {
    const allLogs = dataLayer.getAuditLogs();
    setLogs(allLogs.reverse()); // Most recent first
    setChainVerified(dataLayer.verifyAuditChain());
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = search === '' || 
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.entityId.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.userId.toLowerCase().includes(search.toLowerCase());
    const matchesAction = actionFilter === 'all' || log.action.includes(actionFilter.toUpperCase());
    return matchesSearch && matchesAction;
  });

  const actionCounts = logs.reduce((acc, log) => {
    const category = log.action.split('_')[0];
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const exportLogs = () => {
    const csv = [
      'Timestamp,Tenant,User,Action,Entity,Entity ID,Details,Previous Hash,Hash',
      ...logs.map(l => `${l.timestamp},${l.tenantId},${l.userId},${l.action},${l.entity},${l.entityId},"${l.details}",${l.previousHash},${l.hash}`)
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Log Explorer</h1>
          <p className="text-sm text-gray-500">Tamper-evident, hash-chained audit trail with 7-year retention</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full ${
            chainVerified ? 'bg-accent-50 text-accent-700' : 'bg-danger-50 text-danger-700'
          }`}>
            {chainVerified ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
            {chainVerified ? 'Chain Verified' : 'Chain Broken!'}
          </div>
          <button
            onClick={exportLogs}
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={16} className="text-primary-600" />
            <span className="text-xs text-gray-500">Total Entries</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{logs.length.toLocaleString()}</p>
        </div>
        {Object.entries(actionCounts).slice(0, 4).map(([category, count]) => (
          <div key={category} className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <Hash size={16} className="text-gray-400" />
              <span className="text-xs text-gray-500">{category}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{count}</p>
          </div>
        ))}
      </div>

      {/* Chain Visualization */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Lock size={18} className="text-primary-600" />
          Hash Chain Integrity
        </h3>
        <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs overflow-x-auto">
          <div className="text-gray-400 mb-2">// Hash chain verification</div>
          {logs.slice(0, 5).map((log, idx) => (
            <div key={log.id} className="flex items-start gap-2 mb-1">
              <span className="text-gray-500">[{idx}]</span>
              <span className="text-green-400">hash: {log.hash}</span>
              <span className="text-gray-500">← prev: {log.previousHash}</span>
              <span className="text-blue-400">action: {log.action}</span>
            </div>
          ))}
          {logs.length > 5 && (
            <div className="text-gray-500 mt-2">... {logs.length - 5} more entries</div>
          )}
          <div className="mt-3 pt-3 border-t border-gray-700">
            <span className={chainVerified ? 'text-green-400' : 'text-red-400'}>
              {chainVerified ? '✓ Chain integrity verified - no tampering detected' : '✗ Chain integrity compromised!'}
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-gray-200 flex-1">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search actions, entities, users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm outline-none w-full text-gray-700"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 bg-white"
          >
            <option value="all">All Actions</option>
            <option value="LOAN">Loan</option>
            <option value="BORROWER">Borrower</option>
            <option value="CONSENT">Consent</option>
            <option value="KYC">KYC</option>
            <option value="KFS">KFS</option>
            <option value="COOLING">Cooling-Off</option>
            <option value="MPESA">M-Pesa</option>
            <option value="PAYMENT">Payment</option>
            <option value="IN_DUPLUM">In Duplum</option>
            <option value="COLLECTION">Collection</option>
            <option value="PRODUCT">Product</option>
            <option value="TENANT">Tenant</option>
          </select>
        </div>
      </div>

      {/* Log Entries */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto scrollbar-thin">
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Timestamp</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Action</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Entity</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">User</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Hash</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-xs text-gray-600 font-mono whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono bg-primary-50 text-primary-700 px-2 py-0.5 rounded">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-xs text-gray-700">{log.entity}</p>
                      <p className="text-xs text-gray-500 font-mono">{log.entityId}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">{log.userId}</td>
                  <td className="px-4 py-3">
                    <code className="text-xs text-gray-500 font-mono">{log.hash.slice(0, 8)}...</code>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="p-1 text-gray-400 hover:text-primary-600"
                    >
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredLogs.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            <FileText size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No audit log entries found</p>
          </div>
        )}
      </div>

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setSelectedLog(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Audit Log Entry</h3>
              <button onClick={() => setSelectedLog(null)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Timestamp</p>
                  <p className="text-sm font-mono">{new Date(selectedLog.timestamp).toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">User</p>
                  <p className="text-sm font-medium">{selectedLog.userId}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Action</p>
                  <p className="text-sm font-mono text-primary-700">{selectedLog.action}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Entity</p>
                  <p className="text-sm">{selectedLog.entity} ({selectedLog.entityId})</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Details</p>
                <p className="text-sm text-gray-700">{selectedLog.details}</p>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs">
                <div className="text-gray-400 mb-2">// Hash Chain</div>
                <div className="text-green-400">Current Hash: {selectedLog.hash}</div>
                <div className="text-gray-500 mt-1">Previous Hash: {selectedLog.previousHash}</div>
                <div className="text-blue-400 mt-2">// Verification: hash(prev + action + entityId + details + timestamp)</div>
              </div>
              <div className="bg-accent-50 border border-accent-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-accent-600" />
                  <p className="text-xs text-accent-700">
                    This entry is part of a tamper-evident hash chain. Any modification to this or previous entries would break the chain integrity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
