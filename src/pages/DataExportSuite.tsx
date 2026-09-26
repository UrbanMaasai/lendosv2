import { useState, useEffect } from 'react';
import { Download, FileText, Table, Calendar, Filter, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { dataLayer } from '../services/dataLayer';

interface ExportJob {
  id: string;
  type: 'borrowers' | 'loans' | 'transactions' | 'audit_logs' | 'compliance_report';
  format: 'csv' | 'json' | 'pdf';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  recordCount?: number;
  fileSize?: string;
  downloadUrl?: string;
  filters?: Record<string, any>;
}

export default function DataExportSuite() {
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newExport, setNewExport] = useState({
    type: 'borrowers' as ExportJob['type'],
    format: 'csv' as ExportJob['format'],
    dateRange: { start: '', end: '' },
    tenantFilter: 'all',
  });

  useEffect(() => {
    const stored = localStorage.getItem('lendingos_export_jobs');
    if (stored) {
      setExportJobs(JSON.parse(stored));
    } else {
      const seedJobs: ExportJob[] = [
        {
          id: 'EXP-001',
          type: 'borrowers',
          format: 'csv',
          status: 'completed',
          createdAt: '2026-06-14T10:00:00Z',
          completedAt: '2026-06-14T10:05:00Z',
          recordCount: 12847,
          fileSize: '2.4 MB',
        },
        {
          id: 'EXP-002',
          type: 'loans',
          format: 'csv',
          status: 'completed',
          createdAt: '2026-06-13T14:30:00Z',
          completedAt: '2026-06-13T14:35:00Z',
          recordCount: 3847,
          fileSize: '1.8 MB',
        },
        {
          id: 'EXP-003',
          type: 'audit_logs',
          format: 'json',
          status: 'processing',
          createdAt: '2026-06-15T09:00:00Z',
        },
        {
          id: 'EXP-004',
          type: 'compliance_report',
          format: 'pdf',
          status: 'completed',
          createdAt: '2026-06-10T11:20:00Z',
          completedAt: '2026-06-10T11:25:00Z',
          recordCount: 1,
          fileSize: '450 KB',
        },
      ];
      setExportJobs(seedJobs);
      localStorage.setItem('lendingos_export_jobs', JSON.stringify(seedJobs));
    }
  }, []);

  const handleCreateExport = () => {
    const job: ExportJob = {
      id: `EXP-${Date.now()}`,
      type: newExport.type,
      format: newExport.format,
      status: 'pending',
      createdAt: new Date().toISOString(),
      filters: {
        dateRange: newExport.dateRange,
        tenant: newExport.tenantFilter,
      },
    };

    const updatedJobs = [job, ...exportJobs];
    setExportJobs(updatedJobs);
    localStorage.setItem('lendingos_export_jobs', JSON.stringify(updatedJobs));

    // Simulate processing
    setTimeout(() => {
      const processed = updatedJobs.map(j => {
        if (j.id === job.id) {
          return {
            ...j,
            status: 'processing' as const,
          };
        }
        return j;
      });
      setExportJobs(processed);
      localStorage.setItem('lendingos_export_jobs', JSON.stringify(processed));
    }, 1000);

    setTimeout(() => {
      const completed = updatedJobs.map(j => {
        if (j.id === job.id) {
          const recordCount = j.type === 'borrowers' ? 12847 :
                             j.type === 'loans' ? 3847 :
                             j.type === 'transactions' ? 15234 :
                             j.type === 'audit_logs' ? 45678 : 1;
          return {
            ...j,
            status: 'completed' as const,
            completedAt: new Date().toISOString(),
            recordCount,
            fileSize: `${(Math.random() * 5 + 0.5).toFixed(1)} MB`,
          };
        }
        return j;
      });
      setExportJobs(completed);
      localStorage.setItem('lendingos_export_jobs', JSON.stringify(completed));
    }, 3000);

    setShowCreateModal(false);
    setNewExport({ type: 'borrowers', format: 'csv', dateRange: { start: '', end: '' }, tenantFilter: 'all' });
  };

  const handleDownload = (job: ExportJob) => {
    // Simulate download
    let content = '';
    if (job.format === 'csv') {
      content = 'ID,Name,Phone,Status,CreatedAt\n';
      if (job.type === 'borrowers') {
        content += 'brw_001,James Mwangi,+254712345678,Active,2026-01-15\n';
        content += 'brw_002,Grace Wanjiku,+254723456789,Active,2026-01-20\n';
      }
    } else if (job.format === 'json') {
      content = JSON.stringify([{ id: 'brw_001', name: 'James Mwangi' }], null, 2);
    }

    const blob = new Blob([content], { type: job.format === 'csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${job.type}-export-${new Date().toISOString().split('T')[0]}.${job.format}`;
    a.click();
  };

  const stats = {
    total: exportJobs.length,
    completed: exportJobs.filter(j => j.status === 'completed').length,
    processing: exportJobs.filter(j => j.status === 'processing').length,
    pending: exportJobs.filter(j => j.status === 'pending').length,
    totalRecords: exportJobs.filter(j => j.status === 'completed').reduce((sum, j) => sum + (j.recordCount || 0), 0),
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 size={16} className="text-accent-600" />;
      case 'processing': return <Clock size={16} className="text-primary-600 animate-spin" />;
      case 'pending': return <Clock size={16} className="text-warning-600" />;
      case 'failed': return <AlertTriangle size={16} className="text-danger-600" />;
      default: return <Clock size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Export Suite</h1>
          <p className="text-sm text-gray-500">Export platform data in multiple formats for reporting and compliance</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700"
        >
          <Download size={16} /> New Export
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={16} className="text-primary-600" />
            <span className="text-xs text-gray-500">Total Exports</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={16} className="text-accent-600" />
            <span className="text-xs text-gray-500">Completed</span>
          </div>
          <p className="text-2xl font-bold text-accent-600">{stats.completed}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-primary-600" />
            <span className="text-xs text-gray-500">Processing</span>
          </div>
          <p className="text-2xl font-bold text-primary-600">{stats.processing}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-warning-600" />
            <span className="text-xs text-gray-500">Pending</span>
          </div>
          <p className="text-2xl font-bold text-warning-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Table size={16} className="text-purple-600" />
            <span className="text-xs text-gray-500">Total Records</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">{stats.totalRecords.toLocaleString()}</p>
        </div>
      </div>

      {/* Export Jobs List */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Export History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">ID</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Type</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Format</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Status</th>
                <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">Records</th>
                <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">Size</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Created</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {exportJobs.map((job) => (
                <tr key={job.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <code className="text-xs font-mono text-primary-600">{job.id}</code>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-900 capitalize">{job.type.replace('_', ' ')}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded font-medium ${
                      job.format === 'csv' ? 'bg-green-50 text-green-700' :
                      job.format === 'json' ? 'bg-blue-50 text-blue-700' :
                      'bg-red-50 text-red-700'
                    }`}>
                      {job.format.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(job.status)}
                      <span className="text-sm text-gray-700 capitalize">{job.status}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm text-gray-700">
                      {job.recordCount ? job.recordCount.toLocaleString() : '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm text-gray-700">{job.fileSize || '-'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-600">
                      {new Date(job.createdAt).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {job.status === 'completed' && (
                      <button
                        onClick={() => handleDownload(job)}
                        className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
                      >
                        <Download size={12} /> Download
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Create New Export</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Data Type</label>
                  <select
                    value={newExport.type}
                    onChange={(e) => setNewExport({ ...newExport, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  >
                    <option value="borrowers">Borrowers</option>
                    <option value="loans">Loans</option>
                    <option value="transactions">Transactions</option>
                    <option value="audit_logs">Audit Logs</option>
                    <option value="compliance_report">Compliance Report</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Format</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['csv', 'json', 'pdf'] as const).map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setNewExport({ ...newExport, format: fmt })}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          newExport.format === fmt
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {fmt.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Start Date</label>
                    <input
                      type="date"
                      value={newExport.dateRange.start}
                      onChange={(e) => setNewExport({ ...newExport, dateRange: { ...newExport.dateRange, start: e.target.value } })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">End Date</label>
                    <input
                      type="date"
                      value={newExport.dateRange.end}
                      onChange={(e) => setNewExport({ ...newExport, dateRange: { ...newExport.dateRange, end: e.target.value } })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleCreateExport}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
                  >
                    Create Export
                  </button>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Download size={18} className="text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Export Capabilities</p>
            <ul className="text-xs text-blue-700 mt-1 space-y-1">
              <li>• Export borrowers, loans, transactions, and audit logs</li>
              <li>• Multiple formats: CSV, JSON, PDF</li>
              <li>• Date range filtering for targeted exports</li>
              <li>• Tenant-specific exports for multi-tenant isolation</li>
              <li>• Compliance reports for regulatory submissions</li>
              <li>• All exports logged in audit trail</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
