import { useState, useEffect } from 'react';
import { Calendar, Clock, Play, Pause, Edit2, Trash2, CheckCircle2, Plus } from 'lucide-react';

interface ScheduledReport {
  id: string;
  name: string;
  type: 'portfolio_summary' | 'compliance_report' | 'financial_report' | 'borrower_report' | 'custom';
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  format: 'pdf' | 'csv' | 'excel';
  recipients: string[];
  nextRun: string;
  lastRun?: string;
  status: 'active' | 'paused';
  createdAt: string;
  filters?: Record<string, any>;
}

export default function ScheduledReports() {
  const [reports, setReports] = useState<ScheduledReport[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newReport, setNewReport] = useState({
    name: '',
    type: 'portfolio_summary' as ScheduledReport['type'],
    frequency: 'monthly' as ScheduledReport['frequency'],
    format: 'pdf' as ScheduledReport['format'],
    recipients: [''],
  });

  useEffect(() => {
    const stored = localStorage.getItem('lendingos_scheduled_reports');
    if (stored) {
      setReports(JSON.parse(stored));
    } else {
      const seedReports: ScheduledReport[] = [
        {
          id: 'sched_001',
          name: 'Monthly Portfolio Summary',
          type: 'portfolio_summary',
          frequency: 'monthly',
          format: 'pdf',
          recipients: ['management@pesaflash.co.ke', 'board@pesaflash.co.ke'],
          nextRun: '2026-07-01T08:00:00Z',
          lastRun: '2026-06-01T08:00:00Z',
          status: 'active',
          createdAt: '2026-01-15T00:00:00Z',
        },
        {
          id: 'sched_002',
          name: 'Weekly Compliance Report',
          type: 'compliance_report',
          frequency: 'weekly',
          format: 'pdf',
          recipients: ['compliance@pesaflash.co.ke'],
          nextRun: '2026-06-17T09:00:00Z',
          lastRun: '2026-06-10T09:00:00Z',
          status: 'active',
          createdAt: '2026-02-01T00:00:00Z',
        },
        {
          id: 'sched_003',
          name: 'Daily Financial Summary',
          type: 'financial_report',
          frequency: 'daily',
          format: 'excel',
          recipients: ['finance@pesaflash.co.ke'],
          nextRun: '2026-06-16T07:00:00Z',
          lastRun: '2026-06-15T07:00:00Z',
          status: 'active',
          createdAt: '2026-03-01T00:00:00Z',
        },
        {
          id: 'sched_004',
          name: 'Quarterly CBK Return',
          type: 'compliance_report',
          frequency: 'quarterly',
          format: 'excel',
          recipients: ['compliance@pesaflash.co.ke', 'cbk@pesaflash.co.ke'],
          nextRun: '2026-07-01T10:00:00Z',
          lastRun: '2026-04-01T10:00:00Z',
          status: 'active',
          createdAt: '2026-01-20T00:00:00Z',
        },
        {
          id: 'sched_005',
          name: 'Monthly Borrower Report',
          type: 'borrower_report',
          frequency: 'monthly',
          format: 'csv',
          recipients: ['reports@pesaflash.co.ke'],
          nextRun: '2026-07-01T08:30:00Z',
          status: 'paused',
          createdAt: '2026-04-10T00:00:00Z',
        },
      ];
      setReports(seedReports);
      localStorage.setItem('lendingos_scheduled_reports', JSON.stringify(seedReports));
    }
  }, []);

  const handleCreateReport = () => {
    const report: ScheduledReport = {
      id: `sched_${Date.now()}`,
      name: newReport.name,
      type: newReport.type,
      frequency: newReport.frequency,
      format: newReport.format,
      recipients: newReport.recipients.filter(r => r.trim() !== ''),
      nextRun: calculateNextRun(newReport.frequency),
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    const updated = [report, ...reports];
    setReports(updated);
    localStorage.setItem('lendingos_scheduled_reports', JSON.stringify(updated));

    setShowCreateModal(false);
    setNewReport({
      name: '',
      type: 'portfolio_summary',
      frequency: 'monthly',
      format: 'pdf',
      recipients: [''],
    });
  };

  const calculateNextRun = (frequency: string): string => {
    const now = new Date();
    const next = new Date(now);

    switch (frequency) {
      case 'daily':
        next.setDate(next.getDate() + 1);
        next.setHours(7, 0, 0, 0);
        break;
      case 'weekly':
        next.setDate(next.getDate() + (7 - next.getDay()));
        next.setHours(9, 0, 0, 0);
        break;
      case 'monthly':
        next.setMonth(next.getMonth() + 1, 1);
        next.setHours(8, 0, 0, 0);
        break;
      case 'quarterly':
        const quarter = Math.floor(next.getMonth() / 3);
        next.setMonth((quarter + 1) * 3, 1);
        next.setHours(10, 0, 0, 0);
        break;
    }

    return next.toISOString();
  };

  const handleToggleStatus = (reportId: string) => {
    const updated = reports.map(r => {
      if (r.id === reportId) {
        return { ...r, status: (r.status === 'active' ? 'paused' : 'active') as 'active' | 'paused' };
      }
      return r;
    });
    setReports(updated);
    localStorage.setItem('lendingos_scheduled_reports', JSON.stringify(updated));
  };

  const handleDeleteReport = (reportId: string) => {
    const updated = reports.filter(r => r.id !== reportId);
    setReports(updated);
    localStorage.setItem('lendingos_scheduled_reports', JSON.stringify(updated));
  };

  const handleRunNow = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;

    const updated = reports.map(r => {
      if (r.id === reportId) {
        return { ...r, lastRun: new Date().toISOString() };
      }
      return r;
    });
    setReports(updated);
    localStorage.setItem('lendingos_scheduled_reports', JSON.stringify(updated));

    alert(`Report "${report.name}" generated and sent to ${report.recipients.join(', ')}`);
  };

  const stats = {
    total: reports.length,
    active: reports.filter(r => r.status === 'active').length,
    paused: reports.filter(r => r.status === 'paused').length,
    daily: reports.filter(r => r.frequency === 'daily').length,
    weekly: reports.filter(r => r.frequency === 'weekly').length,
    monthly: reports.filter(r => r.frequency === 'monthly').length,
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'weekly': return 'bg-green-50 text-green-700 border-green-200';
      case 'monthly': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'quarterly': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scheduled Reports</h1>
          <p className="text-sm text-gray-500">Automate report generation and distribution</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700"
        >
          <Plus size={16} /> New Schedule
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={16} className="text-primary-600" />
            <span className="text-xs text-gray-500">Total Schedules</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={16} className="text-accent-600" />
            <span className="text-xs text-gray-500">Active</span>
          </div>
          <p className="text-2xl font-bold text-accent-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Pause size={16} className="text-gray-600" />
            <span className="text-xs text-gray-500">Paused</span>
          </div>
          <p className="text-2xl font-bold text-gray-600">{stats.paused}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-blue-600" />
            <span className="text-xs text-gray-500">Daily</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{stats.daily}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-green-600" />
            <span className="text-xs text-gray-500">Weekly</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.weekly}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-purple-600" />
            <span className="text-xs text-gray-500">Monthly</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">{stats.monthly}</p>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Scheduled Reports</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {reports.map((report) => (
            <div key={report.id} className="p-4 hover:bg-gray-50/50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900">{report.name}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded border ${getFrequencyColor(report.frequency)}`}>
                      {report.frequency}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      report.status === 'active' ? 'bg-accent-50 text-accent-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Type: {report.type.replace(/_/g, ' ')} · Format: {report.format.toUpperCase()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRunNow(report.id)}
                    className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"
                    title="Run now"
                  >
                    <Play size={16} />
                  </button>
                  <button
                    onClick={() => handleToggleStatus(report.id)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    title={report.status === 'active' ? 'Pause' : 'Resume'}
                  >
                    {report.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                  <button
                    onClick={() => handleDeleteReport(report.id)}
                    className="p-2 text-danger-600 hover:bg-danger-50 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <p className="text-gray-500 mb-1">Next Run</p>
                  <p className="font-medium text-gray-900">
                    {new Date(report.nextRun).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Last Run</p>
                  <p className="font-medium text-gray-900">
                    {report.lastRun ? new Date(report.lastRun).toLocaleString() : 'Never'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Recipients</p>
                  <p className="font-medium text-gray-900">
                    {report.recipients.length} email{report.recipients.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Create Scheduled Report</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Report Name</label>
                  <input
                    type="text"
                    value={newReport.name}
                    onChange={(e) => setNewReport({ ...newReport, name: e.target.value })}
                    placeholder="Monthly Portfolio Summary"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Report Type</label>
                  <select
                    value={newReport.type}
                    onChange={(e) => setNewReport({ ...newReport, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  >
                    <option value="portfolio_summary">Portfolio Summary</option>
                    <option value="compliance_report">Compliance Report</option>
                    <option value="financial_report">Financial Report</option>
                    <option value="borrower_report">Borrower Report</option>
                    <option value="custom">Custom Report</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Frequency</label>
                    <select
                      value={newReport.frequency}
                      onChange={(e) => setNewReport({ ...newReport, frequency: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Format</label>
                    <select
                      value={newReport.format}
                      onChange={(e) => setNewReport({ ...newReport, format: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    >
                      <option value="pdf">PDF</option>
                      <option value="csv">CSV</option>
                      <option value="excel">Excel</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Recipients</label>
                  {newReport.recipients.map((email, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          const updated = [...newReport.recipients];
                          updated[idx] = e.target.value;
                          setNewReport({ ...newReport, recipients: updated });
                        }}
                        placeholder="email@example.com"
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      />
                      {newReport.recipients.length > 1 && (
                        <button
                          onClick={() => {
                            const updated = newReport.recipients.filter((_, i) => i !== idx);
                            setNewReport({ ...newReport, recipients: updated });
                          }}
                          className="px-3 py-2 text-danger-600 hover:bg-danger-50 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => setNewReport({ ...newReport, recipients: [...newReport.recipients, ''] })}
                    className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                  >
                    + Add recipient
                  </button>
                </div>
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleCreateReport}
                    disabled={!newReport.name || newReport.recipients.filter(r => r.trim()).length === 0}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50"
                  >
                    Create Schedule
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
          <Calendar size={18} className="text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Scheduled Reports Features</p>
            <ul className="text-xs text-blue-700 mt-1 space-y-1">
              <li>• Automate report generation on daily, weekly, monthly, or quarterly schedules</li>
              <li>• Multiple report types: Portfolio, Compliance, Financial, Borrower, Custom</li>
              <li>• Export formats: PDF, CSV, Excel</li>
              <li>• Email distribution to multiple recipients</li>
              <li>• Pause/resume schedules as needed</li>
              <li>• Run reports manually on demand</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
