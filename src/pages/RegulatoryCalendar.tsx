import { useState } from 'react';
import { Calendar, Clock, AlertTriangle, CheckCircle2, FileText, Bell } from 'lucide-react';

interface RegulatoryDeadline {
  id: string;
  title: string;
  authority: string;
  type: 'filing' | 'audit' | 'report' | 'renewal' | 'training';
  dueDate: string;
  status: 'upcoming' | 'in_progress' | 'completed' | 'overdue';
  priority: 'high' | 'medium' | 'low';
  description: string;
  assignedTo: string;
  reminders: number[];
  documents: string[];
}

export default function RegulatoryCalendar() {
  const [deadlines, setDeadlines] = useState<RegulatoryDeadline[]>([
    {
      id: 'reg_001',
      title: 'CBK Monthly Return - Form A',
      authority: 'Central Bank of Kenya',
      type: 'filing',
      dueDate: '2026-06-30',
      status: 'upcoming',
      priority: 'high',
      description: 'Monthly statistical return covering loan portfolio, disbursements, repayments, PAR, and write-offs',
      assignedTo: 'Compliance Team',
      reminders: [7, 3, 1],
      documents: ['CBK_Form_A_Template.xlsx', 'Data_Requirements.pdf'],
    },
    {
      id: 'reg_002',
      title: 'ODPC Quarterly Data Protection Report',
      authority: 'Office of the Data Protection Commissioner',
      type: 'report',
      dueDate: '2026-07-15',
      status: 'upcoming',
      priority: 'high',
      description: 'Quarterly report on data processing activities, consent status, and data subject requests',
      assignedTo: 'Data Protection Officer',
      reminders: [14, 7, 1],
      documents: ['ODPC_Report_Template.docx', 'Data_Inventory.xlsx'],
    },
    {
      id: 'reg_003',
      title: 'DLAK Code of Conduct Self-Assessment',
      authority: 'Digital Lenders Association of Kenya',
      type: 'audit',
      dueDate: '2026-07-31',
      status: 'in_progress',
      priority: 'medium',
      description: 'Quarterly self-assessment of compliance with DLAK Code of Conduct including collections practices',
      assignedTo: 'Compliance Officer',
      reminders: [30, 14, 7],
      documents: ['DLAK_Assessment_Form.pdf', 'Evidence_Requirements.xlsx'],
    },
    {
      id: 'reg_004',
      title: 'CRB Negative Listing Report',
      authority: 'Metropol / TransUnion',
      type: 'report',
      dueDate: '2026-06-05',
      status: 'completed',
      priority: 'high',
      description: 'Monthly report of borrowers to be negatively listed with CRBs after mandatory pre-notification',
      assignedTo: 'Credit Team',
      reminders: [7, 3, 1],
      documents: ['CRB_Listing_Template.csv', 'Pre_Notification_Log.xlsx'],
    },
    {
      id: 'reg_005',
      title: 'DCP License Renewal',
      authority: 'Central Bank of Kenya',
      type: 'renewal',
      dueDate: '2026-09-30',
      status: 'upcoming',
      priority: 'high',
      description: 'Annual renewal of Digital Credit Provider license with CBK',
      assignedTo: 'Legal Team',
      reminders: [90, 60, 30, 14],
      documents: ['License_Renewal_Application.pdf', 'Compliance_Certificate.pdf', 'Financial_Statements.xlsx'],
    },
    {
      id: 'reg_006',
      title: 'AML/CFT Training',
      authority: 'Internal Compliance',
      type: 'training',
      dueDate: '2026-06-20',
      status: 'upcoming',
      priority: 'medium',
      description: 'Quarterly Anti-Money Laundering and Counter-Financing of Terrorism training for all staff',
      assignedTo: 'HR & Compliance',
      reminders: [14, 7, 1],
      documents: ['AML_Training_Material.pdf', 'Attendance_Sheet.xlsx'],
    },
    {
      id: 'reg_007',
      title: 'VAT Return Filing',
      authority: 'Kenya Revenue Authority',
      type: 'filing',
      dueDate: '2026-06-20',
      status: 'overdue',
      priority: 'high',
      description: 'Monthly VAT return on interest income and fees',
      assignedTo: 'Finance Team',
      reminders: [7, 3, 1],
      documents: ['VAT_Return_Form.pdf', 'Tax_Invoice_Summary.xlsx'],
    },
    {
      id: 'reg_008',
      title: 'In Duplum Compliance Certificate',
      authority: 'Internal Compliance',
      type: 'report',
      dueDate: '2026-06-10',
      status: 'completed',
      priority: 'medium',
      description: 'Monthly certificate confirming all loans comply with in duplum rule (2× principal cap)',
      assignedTo: 'Compliance Team',
      reminders: [7, 3, 1],
      documents: ['In_Duplum_Certificate_Template.pdf', 'Loan_Portfolio_Analysis.xlsx'],
    },
  ]);

  const [selectedDeadline, setSelectedDeadline] = useState<RegulatoryDeadline | null>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'in_progress' | 'completed' | 'overdue'>('all');

  const filteredDeadlines = deadlines.filter(d => {
    if (filter === 'all') return true;
    return d.status === filter;
  });

  const stats = {
    total: deadlines.length,
    upcoming: deadlines.filter(d => d.status === 'upcoming').length,
    inProgress: deadlines.filter(d => d.status === 'in_progress').length,
    completed: deadlines.filter(d => d.status === 'completed').length,
    overdue: deadlines.filter(d => d.status === 'overdue').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-primary-50 text-primary-700 border-primary-200';
      case 'in_progress': return 'bg-warning-50 text-warning-700 border-warning-200';
      case 'completed': return 'bg-accent-50 text-accent-700 border-accent-200';
      case 'overdue': return 'bg-danger-50 text-danger-700 border-danger-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-danger-50 text-danger-700';
      case 'medium': return 'bg-warning-50 text-warning-700';
      case 'low': return 'bg-gray-50 text-gray-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'filing': return <FileText size={16} className="text-primary-600" />;
      case 'audit': return <CheckCircle2 size={16} className="text-purple-600" />;
      case 'report': return <FileText size={16} className="text-blue-600" />;
      case 'renewal': return <Clock size={16} className="text-orange-600" />;
      case 'training': return <Bell size={16} className="text-green-600" />;
      default: return <Calendar size={16} className="text-gray-600" />;
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Regulatory Calendar</h1>
          <p className="text-sm text-gray-500">Track compliance deadlines, filings, and regulatory requirements</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={16} className="text-primary-600" />
            <span className="text-xs text-gray-500">Total Deadlines</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-primary-600" />
            <span className="text-xs text-gray-500">Upcoming</span>
          </div>
          <p className="text-2xl font-bold text-primary-600">{stats.upcoming}</p>
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
            <CheckCircle2 size={16} className="text-accent-600" />
            <span className="text-xs text-gray-500">Completed</span>
          </div>
          <p className="text-2xl font-bold text-accent-600">{stats.completed}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-danger-600" />
            <span className="text-xs text-gray-500">Overdue</span>
          </div>
          <p className="text-2xl font-bold text-danger-600">{stats.overdue}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(['all', 'upcoming', 'in_progress', 'completed', 'overdue'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {f === 'all' ? 'All' : f.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </button>
        ))}
      </div>

      {/* Deadlines List */}
      <div className="space-y-4">
        {filteredDeadlines.map((deadline) => {
          const daysUntilDue = getDaysUntilDue(deadline.dueDate);
          
          return (
            <div
              key={deadline.id}
              onClick={() => setSelectedDeadline(deadline)}
              className="bg-white rounded-xl border border-gray-100 p-5 hover:border-primary-200 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  {getTypeIcon(deadline.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{deadline.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded border ${getStatusColor(deadline.status)}`}>
                        {deadline.status.replace('_', ' ')}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded ${getPriorityColor(deadline.priority)}`}>
                        {deadline.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{deadline.authority}</p>
                    <p className="text-xs text-gray-500">{deadline.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{deadline.dueDate}</p>
                  {deadline.status !== 'completed' && (
                    <p className={`text-xs mt-1 ${
                      daysUntilDue < 0 ? 'text-danger-600' :
                      daysUntilDue <= 7 ? 'text-warning-600' :
                      'text-gray-500'
                    }`}>
                      {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` :
                       daysUntilDue === 0 ? 'Due today' :
                       `${daysUntilDue} days remaining`}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-500 pt-3 border-t border-gray-100">
                <span>Assigned: <strong className="text-gray-700">{deadline.assignedTo}</strong></span>
                <span>Reminders: <strong className="text-gray-700">{deadline.reminders.length}</strong></span>
                <span>Documents: <strong className="text-gray-700">{deadline.documents.length}</strong></span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDeadlines.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No deadlines found</h3>
          <p className="text-sm text-gray-500">Try adjusting your filters</p>
        </div>
      )}

      {/* Deadline Detail Modal */}
      {selectedDeadline && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedDeadline(null)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">{selectedDeadline.title}</h3>
                <button onClick={() => setSelectedDeadline(null)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Authority</p>
                    <p className="text-sm font-medium text-gray-900">{selectedDeadline.authority}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Type</p>
                    <p className="text-sm text-gray-900 capitalize">{selectedDeadline.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Due Date</p>
                    <p className="text-sm font-bold text-gray-900">{selectedDeadline.dueDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(selectedDeadline.status)}`}>
                      {selectedDeadline.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Description</p>
                  <p className="text-sm text-gray-700">{selectedDeadline.description}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Assigned To</p>
                  <p className="text-sm text-gray-900">{selectedDeadline.assignedTo}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-2">Reminders (days before due date)</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedDeadline.reminders.map((days, idx) => (
                      <span key={idx} className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded">
                        {days} days
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-2">Required Documents</p>
                  <div className="space-y-2">
                    {selectedDeadline.documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <FileText size={14} className="text-gray-400" />
                        <span className="text-xs text-gray-700">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <button className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700">
                    Mark as In Progress
                  </button>
                  <button className="flex-1 px-4 py-2 bg-accent-600 text-white rounded-lg text-sm font-medium hover:bg-accent-700">
                    Mark as Completed
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
            <p className="text-sm font-medium text-blue-900">Regulatory Calendar Features</p>
            <ul className="text-xs text-blue-700 mt-1 space-y-1">
              <li>• Track all regulatory deadlines in one place</li>
              <li>• Multiple deadline types: filings, audits, reports, renewals, training</li>
              <li>• Priority levels (high, medium, low) for better planning</li>
              <li>• Automated reminders at configurable intervals</li>
              <li>• Document attachments for each deadline</li>
              <li>• Assignment to team members for accountability</li>
              <li>• Status tracking (upcoming, in progress, completed, overdue)</li>
              <li>• Days remaining countdown with color coding</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
