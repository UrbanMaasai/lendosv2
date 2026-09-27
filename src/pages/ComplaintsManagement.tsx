import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, Clock, User, MessageSquare, Filter, Download, Eye, TrendingUp } from 'lucide-react';
import { dataLayer } from '../services/dataLayer';

interface Complaint {
  id: string;
  tenantId: string;
  borrowerId: string;
  borrowerName: string;
  borrowerPhone: string;
  category: 'Collections' | 'Interest/Charges' | 'Service Quality' | 'Data Privacy' | 'Technical' | 'Other';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Escalated' | 'Closed';
  description: string;
  resolution?: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  slaHours: number;
  slaBreached: boolean;
}

export default function ComplaintsManagement() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filter, setFilter] = useState<'all' | 'open' | 'progress' | 'resolved' | 'escalated'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('lendingos_complaints');
    if (stored) {
      setComplaints(JSON.parse(stored));
    } else {
      const seedComplaints: Complaint[] = [
        {
          id: 'CMP-2026-001',
          tenantId: 'tenant_001',
          borrowerId: 'brw_001',
          borrowerName: 'James Mwangi',
          borrowerPhone: '+254712345678',
          category: 'Collections',
          priority: 'High',
          status: 'In Progress',
          description: 'Received 4 SMS messages in one day about overdue payment. DLAK limit is 3 per day.',
          assignedTo: 'Sarah K.',
          createdAt: '2026-06-14T10:30:00Z',
          updatedAt: '2026-06-14T14:20:00Z',
          slaHours: 24,
          slaBreached: false,
        },
        {
          id: 'CMP-2026-002',
          tenantId: 'tenant_001',
          borrowerId: 'brw_003',
          borrowerName: 'Peter Ochieng',
          borrowerPhone: '+254734567890',
          category: 'Interest/Charges',
          priority: 'Medium',
          status: 'Open',
          description: 'Interest charged seems higher than disclosed in KFS. Request clarification on calculation.',
          assignedTo: 'Credit Team',
          createdAt: '2026-06-15T09:15:00Z',
          updatedAt: '2026-06-15T09:15:00Z',
          slaHours: 48,
          slaBreached: false,
        },
        {
          id: 'CMP-2026-003',
          tenantId: 'tenant_001',
          borrowerId: 'brw_005',
          borrowerName: 'David Kiprop',
          borrowerPhone: '+254756789012',
          category: 'Data Privacy',
          priority: 'Critical',
          status: 'Escalated',
          description: 'Received marketing SMS after withdrawing marketing consent on 2026-06-10. Request immediate cessation.',
          assignedTo: 'Compliance Officer',
          createdAt: '2026-06-13T16:45:00Z',
          updatedAt: '2026-06-14T08:00:00Z',
          slaHours: 4,
          slaBreached: true,
        },
        {
          id: 'CMP-2026-004',
          tenantId: 'tenant_002',
          borrowerId: 'brw_010',
          borrowerName: 'Mary Wanjiru',
          borrowerPhone: '+254723456780',
          category: 'Service Quality',
          priority: 'Low',
          status: 'Resolved',
          description: 'Mobile app crashed during loan application. Had to restart phone.',
          resolution: 'App updated to latest version. Issue resolved.',
          assignedTo: 'Tech Support',
          createdAt: '2026-06-10T11:20:00Z',
          updatedAt: '2026-06-11T15:30:00Z',
          resolvedAt: '2026-06-11T15:30:00Z',
          slaHours: 72,
          slaBreached: false,
        },
        {
          id: 'CMP-2026-005',
          tenantId: 'tenant_001',
          borrowerId: 'brw_007',
          borrowerName: 'Hassan Ali',
          borrowerPhone: '+254778567234',
          category: 'Technical',
          priority: 'Medium',
          status: 'Resolved',
          description: 'M-Pesa payment not reflecting in loan account despite successful transaction.',
          resolution: 'Payment reconciliation completed. Loan account updated.',
          assignedTo: 'Operations',
          createdAt: '2026-06-12T13:10:00Z',
          updatedAt: '2026-06-13T10:45:00Z',
          resolvedAt: '2026-06-13T10:45:00Z',
          slaHours: 24,
          slaBreached: false,
        },
      ];
      setComplaints(seedComplaints);
      localStorage.setItem('lendingos_complaints', JSON.stringify(seedComplaints));
    }
  }, []);

  const filteredComplaints = complaints.filter(c => {
    const matchesStatus = filter === 'all' || 
      (filter === 'open' && c.status === 'Open') ||
      (filter === 'progress' && c.status === 'In Progress') ||
      (filter === 'resolved' && c.status === 'Resolved') ||
      (filter === 'escalated' && c.status === 'Escalated');
    const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
    return matchesStatus && matchesCategory;
  });

  const stats = {
    total: complaints.length,
    open: complaints.filter(c => c.status === 'Open').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    escalated: complaints.filter(c => c.status === 'Escalated').length,
    slaBreached: complaints.filter(c => c.slaBreached).length,
    avgResolutionTime: '18.5h',
  };

  const categoryCounts = complaints.reduce((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-warning-50 text-warning-700 border-warning-200';
      case 'In Progress': return 'bg-primary-50 text-primary-700 border-primary-200';
      case 'Resolved': return 'bg-accent-50 text-accent-700 border-accent-200';
      case 'Escalated': return 'bg-danger-50 text-danger-700 border-danger-200';
      case 'Closed': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-danger-500 text-white';
      case 'High': return 'bg-danger-100 text-danger-700';
      case 'Medium': return 'bg-warning-100 text-warning-700';
      case 'Low': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const exportComplaints = () => {
    const csv = [
      'ID,Tenant,Borrower,Category,Priority,Status,Description,Assigned To,Created,Updated,SLA Hours,SLA Breached',
      ...complaints.map(c => `${c.id},${c.tenantId},${c.borrowerName},${c.category},${c.priority},${c.status},"${c.description}",${c.assignedTo},${c.createdAt},${c.updatedAt},${c.slaHours},${c.slaBreached}`)
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `complaints-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Complaints Management</h1>
          <p className="text-sm text-gray-500">Track and resolve borrower complaints with SLA monitoring</p>
        </div>
        <button
          onClick={exportComplaints}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700"
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare size={16} className="text-primary-600" />
            <span className="text-xs text-gray-500">Total</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={16} className="text-warning-600" />
            <span className="text-xs text-gray-500">Open</span>
          </div>
          <p className="text-2xl font-bold text-warning-600">{stats.open}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-primary-600" />
            <span className="text-xs text-gray-500">In Progress</span>
          </div>
          <p className="text-2xl font-bold text-primary-600">{stats.inProgress}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={16} className="text-danger-600" />
            <span className="text-xs text-gray-500">Escalated</span>
          </div>
          <p className="text-2xl font-bold text-danger-600">{stats.escalated}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={16} className="text-danger-600" />
            <span className="text-xs text-gray-500">SLA Breached</span>
          </div>
          <p className="text-2xl font-bold text-danger-600">{stats.slaBreached}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-accent-600" />
            <span className="text-xs text-gray-500">Avg Resolution</span>
          </div>
          <p className="text-2xl font-bold text-accent-600">{stats.avgResolutionTime}</p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Complaints by Category</h3>
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
          {Object.entries(categoryCounts).map(([category, count]) => (
            <div key={category} className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-gray-900">{count}</p>
              <p className="text-xs text-gray-500 mt-1">{category}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 bg-white"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="escalated">Escalated</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 bg-white"
          >
            <option value="all">All Categories</option>
            <option value="Collections">Collections</option>
            <option value="Interest/Charges">Interest/Charges</option>
            <option value="Service Quality">Service Quality</option>
            <option value="Data Privacy">Data Privacy</option>
            <option value="Technical">Technical</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto scrollbar-thin">
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">ID</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Borrower</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Category</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Priority</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Status</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Assigned To</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">SLA</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map((complaint) => (
                <tr key={complaint.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <code className="text-xs font-mono text-primary-600">{complaint.id}</code>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{complaint.borrowerName}</p>
                      <p className="text-xs text-gray-500">{complaint.borrowerPhone}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{complaint.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded font-medium ${getPriorityColor(complaint.priority)}`}>
                      {complaint.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(complaint.status)}`}>
                      {complaint.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{complaint.assignedTo}</td>
                  <td className="px-4 py-3">
                    {complaint.slaBreached ? (
                      <span className="text-xs text-danger-600 font-medium flex items-center gap-1">
                        <AlertCircle size={12} /> Breached
                      </span>
                    ) : (
                      <span className="text-xs text-gray-600">{complaint.slaHours}h</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedComplaint(complaint)}
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
        {filteredComplaints.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            <MessageSquare size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No complaints found</p>
          </div>
        )}
      </div>

      {/* Complaint Detail Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setSelectedComplaint(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Complaint Details</h3>
              <button onClick={() => setSelectedComplaint(null)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Complaint ID</p>
                  <p className="text-sm font-mono">{selectedComplaint.id}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="text-sm">{selectedComplaint.status}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Borrower</p>
                  <p className="text-sm">{selectedComplaint.borrowerName}</p>
                  <p className="text-xs text-gray-500">{selectedComplaint.borrowerPhone}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Assigned To</p>
                  <p className="text-sm">{selectedComplaint.assignedTo}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Description</p>
                <p className="text-sm text-gray-700">{selectedComplaint.description}</p>
              </div>
              {selectedComplaint.resolution && (
                <div className="bg-accent-50 border border-accent-200 rounded-lg p-3">
                  <p className="text-xs text-accent-700 mb-1">Resolution</p>
                  <p className="text-sm text-accent-800">{selectedComplaint.resolution}</p>
                </div>
              )}
              <div className="bg-warning-50 border border-warning-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle size={14} className="text-warning-600 mt-0.5" />
                  <div className="text-xs text-warning-700">
                    <p className="font-medium mb-1">DLAK Code of Conduct - CL-010</p>
                    <p>
                      If this tenant receives &gt;3 complaints per month, automatic escalation to platform compliance review is triggered.
                      Current month complaints for this tenant: {complaints.filter(c => c.tenantId === selectedComplaint.tenantId).length}/3
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
