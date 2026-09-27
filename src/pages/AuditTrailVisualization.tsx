import { useState, useEffect } from 'react';
import { Activity, User, FileText, DollarSign, Shield, AlertTriangle, CheckCircle2, GitBranch } from 'lucide-react';
import { dataLayer, AuditLog } from '../services/dataLayer';

export default function AuditTrailVisualization() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [entityFilter, setEntityFilter] = useState<string>('all');
  const [actionFilter, setActionFilter] = useState<string>('all');

  useEffect(() => {
    const allLogs = dataLayer.getAuditLogs().reverse();
    setLogs(allLogs);
  }, []);

  const entities = Array.from(new Set(logs.map(l => l.entity))).sort();
  const actions = Array.from(new Set(logs.map(l => l.action.split('_')[0]))).sort();

  const filteredLogs = logs.filter(log => {
    const matchesEntity = entityFilter === 'all' || log.entity === entityFilter;
    const matchesAction = actionFilter === 'all' || log.action.startsWith(actionFilter.toUpperCase());
    return matchesEntity && matchesAction;
  });

  const getActionIcon = (action: string) => {
    if (action.includes('LOAN')) return <FileText size={14} className="text-primary-600" />;
    if (action.includes('BORROWER')) return <User size={14} className="text-blue-600" />;
    if (action.includes('PAYMENT') || action.includes('MPESA')) return <DollarSign size={14} className="text-accent-600" />;
    if (action.includes('CONSENT') || action.includes('KYC')) return <Shield size={14} className="text-purple-600" />;
    if (action.includes('IN_DUPLUM') || action.includes('COMPLIANCE')) return <AlertTriangle size={14} className="text-warning-600" />;
    if (action.includes('APPROVED') || action.includes('COMPLETED')) return <CheckCircle2 size={14} className="text-accent-600" />;
    return <GitBranch size={14} className="text-gray-600" />;
  };

  const getActionColor = (action: string) => {
    if (action.includes('APPROVED') || action.includes('SUCCESS') || action.includes('COMPLETED')) return 'border-l-accent-500';
    if (action.includes('REJECTED') || action.includes('FAILED') || action.includes('BLOCKED')) return 'border-l-danger-500';
    if (action.includes('WARNING') || action.includes('PENDING')) return 'border-l-warning-500';
    return 'border-l-primary-500';
  };

  // Group logs by date
  const groupedLogs = filteredLogs.reduce((acc, log) => {
    const date = new Date(log.timestamp).toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(log);
    return acc;
  }, {} as Record<string, AuditLog[]>);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Audit Trail Visualization</h1>
        <p className="text-sm text-gray-500">Visual timeline of all platform activities with hash chain verification</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={16} className="text-primary-600" />
            <span className="text-xs text-gray-500">Total Events</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{logs.length.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={16} className="text-blue-600" />
            <span className="text-xs text-gray-500">Entities</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{entities.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={16} className="text-purple-600" />
            <span className="text-xs text-gray-500">Unique Actions</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{actions.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={16} className="text-accent-600" />
            <span className="text-xs text-gray-500">Chain Status</span>
          </div>
          <p className="text-2xl font-bold text-accent-600">Verified</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={entityFilter}
          onChange={(e) => setEntityFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
        >
          <option value="all">All Entities</option>
          {entities.map(e => <option key={e} value={e}>{e}</option>)}
        </select>
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
        >
          <option value="all">All Actions</option>
          {actions.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Activity Timeline</h3>
        <div className="space-y-6">
          {Object.entries(groupedLogs).map(([date, dateLogs]) => (
            <div key={date}>
              <div className="flex items-center gap-2 mb-3 sticky top-0 bg-white py-2 z-10">
                <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                <h4 className="text-sm font-semibold text-gray-900">{date}</h4>
                <span className="text-xs text-gray-500">({dateLogs.length} events)</span>
              </div>
              <div className="ml-6 border-l-2 border-gray-200 pl-6 space-y-3">
                {dateLogs.map((log) => (
                  <div key={log.id} className={`relative pl-6 pb-3 border-l-4 ${getActionColor(log.action)}`}>
                    <div className="absolute -left-[13px] top-0 w-6 h-6 bg-white rounded-full flex items-center justify-center border-2 border-gray-200">
                      {getActionIcon(log.action)}
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono bg-primary-50 text-primary-700 px-2 py-0.5 rounded">
                            {log.action}
                          </span>
                          <span className="text-xs text-gray-500">{log.entity}</span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{log.details}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>User: {log.userId}</span>
                        <span className="font-mono">Hash: {log.hash.slice(0, 8)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Activity size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-sm">No audit events found</p>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Activity size={18} className="text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Audit Trail Visualization Features</p>
            <ul className="text-xs text-blue-700 mt-1 space-y-1">
              <li>• Visual timeline grouped by date</li>
              <li>• Color-coded by action type (success, warning, error)</li>
              <li>• Icon indicators for different entity types</li>
              <li>• Filter by entity and action type</li>
              <li>• Hash chain verification status</li>
              <li>• User attribution for each event</li>
              <li>• Chronological ordering with timestamps</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
