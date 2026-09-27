import { useState } from 'react';
import { FileText, Download, Calendar, CheckCircle2, Clock, AlertTriangle, Building2, Shield } from 'lucide-react';

interface RegulatoryReport {
  id: string;
  name: string;
  authority: string;
  frequency: 'Monthly' | 'Quarterly' | 'Annual';
  dueDate: string;
  status: 'Ready' | 'In Progress' | 'Overdue' | 'Submitted';
  format: string;
  description: string;
  tenants: number;
  lastGenerated?: string;
}

export default function RegulatoryReporting() {
  const [selectedReport, setSelectedReport] = useState<RegulatoryReport | null>(null);
  const [filter, setFilter] = useState<'all' | 'ready' | 'progress' | 'overdue'>('all');

  const reports: RegulatoryReport[] = [
    {
      id: 'CBK-MR-001',
      name: 'CBK Monthly Return - Form A',
      authority: 'Central Bank of Kenya',
      frequency: 'Monthly',
      dueDate: 'Last business day of month',
      status: 'Ready',
      format: 'CBK Template A (Excel)',
      description: 'Monthly statistical return covering loan portfolio, disbursements, repayments, PAR, and write-offs',
      tenants: 8,
      lastGenerated: '2026-05-31',
    },
    {
      id: 'CBK-MR-002',
      name: 'CBK Quarterly Prudential Return',
      authority: 'Central Bank of Kenya',
      frequency: 'Quarterly',
      dueDate: 'Within 30 days of quarter end',
      status: 'Ready',
      format: 'CBK Template Q (Excel)',
      description: 'Quarterly prudential return with capital adequacy, liquidity, and risk-weighted assets',
      tenants: 8,
      lastGenerated: '2026-03-31',
    },
    {
      id: 'ODPC-QR-001',
      name: 'ODPC Data Processing Report',
      authority: 'Office of the Data Protection Commissioner',
      frequency: 'Quarterly',
      dueDate: 'Within 30 days of quarter end',
      status: 'In Progress',
      format: 'ODPC Form DP-1',
      description: 'Quarterly report on data processing activities, consent status, and data subject requests',
      tenants: 8,
      lastGenerated: '2026-03-31',
    },
    {
      id: 'DLAK-QA-001',
      name: 'DLAK Code of Conduct Self-Assessment',
      authority: 'Digital Lenders Association of Kenya',
      frequency: 'Quarterly',
      dueDate: 'Within 15 days of quarter end',
      status: 'In Progress',
      format: 'DLAK Self-Assessment Template',
      description: 'Quarterly self-assessment of compliance with DLAK Code of Conduct including collections practices',
      tenants: 8,
      lastGenerated: '2026-03-31',
    },
    {
      id: 'CRB-ML-001',
      name: 'CRB Monthly Negative Listing Report',
      authority: 'Metropol / TransUnion',
      frequency: 'Monthly',
      dueDate: '5th of each month',
      status: 'Ready',
      format: 'CRB Standard Format (CSV)',
      description: 'Monthly report of borrowers to be negatively listed with CRBs after mandatory pre-notification',
      tenants: 6,
      lastGenerated: '2026-06-05',
    },
    {
      id: 'ID-DC-001',
      name: 'In Duplum Compliance Certificate',
      authority: 'Internal Compliance',
      frequency: 'Monthly',
      dueDate: '10th of each month',
      status: 'Ready',
      format: 'Auto-generated PDF',
      description: 'Monthly certificate confirming all loans comply with in duplum rule (2× principal cap)',
      tenants: 8,
      lastGenerated: '2026-06-10',
    },
    {
      id: 'KPI-AR-001',
      name: 'Annual Performance Report',
      authority: 'Board / Investors',
      frequency: 'Annual',
      dueDate: 'Within 90 days of fiscal year end',
      status: 'Ready',
      format: 'Board Template (PDF)',
      description: 'Annual performance report covering portfolio growth, profitability, risk metrics, and compliance',
      tenants: 8,
    },
    {
      id: 'TAX-VAT-001',
      name: 'VAT Return',
      authority: 'Kenya Revenue Authority',
      frequency: 'Monthly',
      dueDate: '20th of following month',
      status: 'Overdue',
      format: 'iTax Format',
      description: 'Monthly VAT return on interest income and fees',
      tenants: 8,
      lastGenerated: '2026-04-20',
    },
  ];

  const filteredReports = filter === 'all' 
    ? reports 
    : reports.filter(r => {
        if (filter === 'ready') return r.status === 'Ready';
        if (filter === 'progress') return r.status === 'In Progress';
        if (filter === 'overdue') return r.status === 'Overdue';
        return true;
      });

  const stats = {
    total: reports.length,
    ready: reports.filter(r => r.status === 'Ready').length,
    inProgress: reports.filter(r => r.status === 'In Progress').length,
    overdue: reports.filter(r => r.status === 'Overdue').length,
    submitted: reports.filter(r => r.status === 'Submitted').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ready': return 'bg-accent-50 text-accent-700 border-accent-200';
      case 'In Progress': return 'bg-warning-50 text-warning-700 border-warning-200';
      case 'Overdue': return 'bg-danger-50 text-danger-700 border-danger-200';
      case 'Submitted': return 'bg-primary-50 text-primary-700 border-primary-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Regulatory Reporting Center</h1>
          <p className="text-sm text-gray-500">Generate and manage all regulatory filings for CBK, ODPC, DLAK, and CRBs</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={16} className="text-primary-600" />
            <span className="text-xs text-gray-500">Total Reports</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={16} className="text-accent-600" />
            <span className="text-xs text-gray-500">Ready</span>
          </div>
          <p className="text-2xl font-bold text-accent-600">{stats.ready}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-warning-600" />
            <span className="text-xs text-gray-500">In Progress</span>
          </div>
          <p className="text-2xl font-bold text-warning-600">{stats.inProgress}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-danger-600" />
            <span className="text-xs text-gray-500">Overdue</span>
          </div>
          <p className="text-2xl font-bold text-danger-600">{stats.overdue}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={16} className="text-primary-600" />
            <span className="text-xs text-gray-500">Submitted</span>
          </div>
          <p className="text-2xl font-bold text-primary-600">{stats.submitted}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        {(['all', 'ready', 'progress', 'overdue'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === f ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {f === 'all' ? 'All' : f === 'progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Reports Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            onClick={() => setSelectedReport(report)}
            className="bg-white rounded-xl p-5 border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-gray-500">{report.id}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900">{report.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{report.authority}</p>
              </div>
              <div className="text-right">
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{report.frequency}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">{report.description}</p>
            <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Calendar size={12} /> Due: {report.dueDate}
                </span>
                <span className="flex items-center gap-1">
                  <Building2 size={12} /> {report.tenants} tenants
                </span>
              </div>
              {report.lastGenerated && (
                <span>Last: {report.lastGenerated}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setSelectedReport(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">{selectedReport.name}</h3>
              <button onClick={() => setSelectedReport(null)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Report ID</p>
                  <p className="text-sm font-mono">{selectedReport.id}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Authority</p>
                  <p className="text-sm">{selectedReport.authority}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Frequency</p>
                  <p className="text-sm">{selectedReport.frequency}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Due Date</p>
                  <p className="text-sm">{selectedReport.dueDate}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Description</p>
                <p className="text-sm text-gray-700">{selectedReport.description}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Output Format</p>
                <p className="text-sm font-mono">{selectedReport.format}</p>
              </div>
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Shield size={14} className="text-primary-600 mt-0.5" />
                  <p className="text-xs text-primary-700">
                    Reports are auto-generated from platform data with compliance validation. 
                    All submissions are logged in the audit trail with hash verification.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700">
                  <Download size={16} /> Generate Report
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 bg-accent-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-accent-700">
                  <CheckCircle2 size={16} /> Mark as Submitted
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
