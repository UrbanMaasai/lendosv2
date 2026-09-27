import { useState, useEffect } from 'react';
import { Shield, Trash2, Download, AlertTriangle, CheckCircle2, Clock, User, FileText, Plus } from 'lucide-react';
import { dataLayer } from '../services/dataLayer';

interface DataRequest {
  id: string;
  type: 'access' | 'deletion' | 'correction' | 'portability';
  borrowerId: string;
  borrowerName: string;
  borrowerPhone: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  requestedAt: string;
  completedAt?: string;
  reason?: string;
  processedBy?: string;
  dataCategories?: string[];
}

export default function DataPrivacyCenter() {
  const [requests, setRequests] = useState<DataRequest[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed' | 'rejected'>('all');
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [newRequest, setNewRequest] = useState({
    type: 'deletion' as DataRequest['type'],
    borrowerId: '',
    reason: '',
  });

  useEffect(() => {
    const stored = localStorage.getItem('lendingos_data_requests');
    if (stored) {
      setRequests(JSON.parse(stored));
    } else {
      const seedRequests: DataRequest[] = [
        {
          id: 'DR-001',
          type: 'deletion',
          borrowerId: 'brw_010',
          borrowerName: 'Mary Wanjiru',
          borrowerPhone: '+254723456780',
          status: 'pending',
          requestedAt: '2026-06-14T10:30:00Z',
          reason: 'Customer requested account deletion under right to be forgotten',
          dataCategories: ['personal_data', 'loan_history', 'transaction_data'],
        },
        {
          id: 'DR-002',
          type: 'access',
          borrowerId: 'brw_015',
          borrowerName: 'John Doe',
          borrowerPhone: '+254712345678',
          status: 'in_progress',
          requestedAt: '2026-06-13T14:20:00Z',
          reason: 'Customer requesting copy of all personal data held',
          dataCategories: ['personal_data', 'consent_records', 'audit_logs'],
        },
        {
          id: 'DR-003',
          type: 'correction',
          borrowerId: 'brw_020',
          borrowerName: 'Jane Smith',
          borrowerPhone: '+254734567890',
          status: 'completed',
          requestedAt: '2026-06-10T09:15:00Z',
          completedAt: '2026-06-11T16:30:00Z',
          reason: 'Phone number incorrect, needs update',
          processedBy: 'Data Protection Officer',
          dataCategories: ['personal_data'],
        },
        {
          id: 'DR-004',
          type: 'portability',
          borrowerId: 'brw_025',
          borrowerName: 'Mike Johnson',
          borrowerPhone: '+254745678901',
          status: 'completed',
          requestedAt: '2026-06-08T11:45:00Z',
          completedAt: '2026-06-09T14:20:00Z',
          reason: 'Customer moving to another lender, needs data export',
          processedBy: 'Data Protection Officer',
          dataCategories: ['loan_history', 'payment_history', 'credit_score'],
        },
        {
          id: 'DR-005',
          type: 'deletion',
          borrowerId: 'brw_030',
          borrowerName: 'Sarah Williams',
          borrowerPhone: '+254756789012',
          status: 'rejected',
          requestedAt: '2026-06-05T16:00:00Z',
          completedAt: '2026-06-06T10:15:00Z',
          reason: 'Request deletion of all data',
          processedBy: 'Compliance Officer',
          dataCategories: ['all_data'],
        },
      ];
      setRequests(seedRequests);
      localStorage.setItem('lendingos_data_requests', JSON.stringify(seedRequests));
    }
  }, []);

  const filteredRequests = requests.filter(r => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    inProgress: requests.filter(r => r.status === 'in_progress').length,
    completed: requests.filter(r => r.status === 'completed').length,
    deletion: requests.filter(r => r.type === 'deletion').length,
  };

  const handleCreateRequest = () => {
    if (!newRequest.borrowerId || !newRequest.reason) {
      alert('Please fill in all required fields');
      return;
    }

    const borrowers = dataLayer.getBorrowers();
    const borrower = borrowers.find(b => b.id === newRequest.borrowerId);
    if (!borrower) {
      alert('Borrower not found');
      return;
    }

    const request: DataRequest = {
      id: `DR-${Date.now()}`,
      type: newRequest.type,
      borrowerId: newRequest.borrowerId,
      borrowerName: borrower.name,
      borrowerPhone: borrower.phone,
      status: 'pending',
      requestedAt: new Date().toISOString(),
      reason: newRequest.reason,
      dataCategories: newRequest.type === 'deletion' ? ['all_data'] : ['personal_data'],
    };

    const updated = [request, ...requests];
    setRequests(updated);
    localStorage.setItem('lendingos_data_requests', JSON.stringify(updated));

    // Log to audit trail
    dataLayer.addAuditLog(
      borrower.tenantId,
      'system',
      'DATA_REQUEST_CREATED',
      'DataRequest',
      request.id,
      `${newRequest.type} request created for ${borrower.name}`
    );

    setShowNewRequest(false);
    setNewRequest({ type: 'deletion', borrowerId: '', reason: '' });
  };

  const handleProcessRequest = (requestId: string, status: 'completed' | 'rejected') => {
    const updated = requests.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status,
          completedAt: new Date().toISOString(),
          processedBy: 'Data Protection Officer',
        };
      }
      return r;
    });
    setRequests(updated);
    localStorage.setItem('lendingos_data_requests', JSON.stringify(updated));

    const request = requests.find(r => r.id === requestId);
    if (request) {
      const borrower = dataLayer.getBorrower(request.borrowerId);
      if (borrower) {
        dataLayer.addAuditLog(
          borrower.tenantId,
          'admin',
          `DATA_REQUEST_${status.toUpperCase()}`,
          'DataRequest',
          requestId,
          `${request.type} request ${status} for ${request.borrowerName}`
        );
      }
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deletion': return <Trash2 size={16} className="text-danger-600" />;
      case 'access': return <FileText size={16} className="text-primary-600" />;
      case 'correction': return <CheckCircle2 size={16} className="text-warning-600" />;
      case 'portability': return <Download size={16} className="text-purple-600" />;
      default: return <Shield size={16} className="text-gray-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      deletion: 'Right to Erasure',
      access: 'Right to Access',
      correction: 'Right to Rectification',
      portability: 'Right to Portability',
    };
    return labels[type] || type;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning-50 text-warning-700 border-warning-200';
      case 'in_progress': return 'bg-primary-50 text-primary-700 border-primary-200';
      case 'completed': return 'bg-accent-50 text-accent-700 border-accent-200';
      case 'rejected': return 'bg-danger-50 text-danger-700 border-danger-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Privacy Center</h1>
          <p className="text-sm text-gray-500">Manage data subject requests under Data Protection Act 2019</p>
        </div>
        <button
          onClick={() => setShowNewRequest(true)}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700"
        >
          <Plus size={16} /> New Request
        </button>
      </div>

      {/* Compliance Notice */}
      <div className="bg-accent-50 border border-accent-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Shield size={18} className="text-accent-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-accent-800">Data Protection Act 2019 Compliance</p>
            <p className="text-xs text-accent-700 mt-1">
              All data subject requests must be processed within 30 days. Deletion requests require verification that no regulatory retention requirements apply (7-year retention for loan data).
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={16} className="text-primary-600" />
            <span className="text-xs text-gray-500">Total Requests</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
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
            <Clock size={16} className="text-primary-600" />
            <span className="text-xs text-gray-500">In Progress</span>
          </div>
          <p className="text-2xl font-bold text-primary-600">{stats.inProgress}</p>
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
            <Trash2 size={16} className="text-danger-600" />
            <span className="text-xs text-gray-500">Deletion Requests</span>
          </div>
          <p className="text-2xl font-bold text-danger-600">{stats.deletion}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(['all', 'pending', 'in_progress', 'completed', 'rejected'] as const).map((f) => (
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

      {/* Requests List */}
      <div className="space-y-3">
        {filteredRequests.map((request) => (
          <div key={request.id} className="bg-white rounded-xl p-5 border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3 flex-1">
                {getTypeIcon(request.type)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-gray-500">{request.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded border ${getStatusColor(request.status)}`}>
                      {request.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{getTypeLabel(request.type)}</h4>
                  <p className="text-sm text-gray-600 mb-2">{request.reason}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <User size={12} /> {request.borrowerName}
                    </span>
                    <span>{request.borrowerPhone}</span>
                  </div>
                </div>
              </div>
              <div className="text-right text-xs text-gray-500">
                <p>Requested: {new Date(request.requestedAt).toLocaleDateString()}</p>
                {request.completedAt && (
                  <p>Completed: {new Date(request.completedAt).toLocaleDateString()}</p>
                )}
              </div>
            </div>

            {request.dataCategories && (
              <div className="flex flex-wrap gap-1 mb-3">
                {request.dataCategories.map((cat, idx) => (
                  <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                    {cat.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            )}

            {(request.status === 'pending' || request.status === 'in_progress') && (
              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleProcessRequest(request.id, 'completed')}
                  className="flex-1 px-3 py-2 bg-accent-600 text-white rounded-lg text-xs font-medium hover:bg-accent-700"
                >
                  Complete Request
                </button>
                <button
                  onClick={() => handleProcessRequest(request.id, 'rejected')}
                  className="flex-1 px-3 py-2 bg-danger-600 text-white rounded-lg text-xs font-medium hover:bg-danger-700"
                >
                  Reject Request
                </button>
              </div>
            )}

            {request.processedBy && (
              <div className="pt-3 border-t border-gray-100 text-xs text-gray-500">
                Processed by {request.processedBy} on {new Date(request.completedAt!).toLocaleDateString()}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <Shield size={48} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No requests found</h3>
          <p className="text-sm text-gray-500">Try adjusting your filters</p>
        </div>
      )}

      {/* New Request Modal */}
      {showNewRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">New Data Request</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Request Type</label>
                  <select
                    value={newRequest.type}
                    onChange={(e) => setNewRequest({ ...newRequest, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  >
                    <option value="deletion">Right to Erasure (Deletion)</option>
                    <option value="access">Right to Access</option>
                    <option value="correction">Right to Rectification</option>
                    <option value="portability">Right to Portability</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Borrower ID</label>
                  <input
                    type="text"
                    value={newRequest.borrowerId}
                    onChange={(e) => setNewRequest({ ...newRequest, borrowerId: e.target.value })}
                    placeholder="brw_001"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Reason</label>
                  <textarea
                    value={newRequest.reason}
                    onChange={(e) => setNewRequest({ ...newRequest, reason: e.target.value })}
                    rows={3}
                    placeholder="Explain the reason for this request..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleCreateRequest}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
                  >
                    Create Request
                  </button>
                  <button
                    onClick={() => setShowNewRequest(false)}
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
          <Shield size={18} className="text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Data Subject Rights (ODPC)</p>
            <ul className="text-xs text-blue-700 mt-1 space-y-1">
              <li>• <strong>Right to Erasure:</strong> Delete personal data (subject to regulatory retention)</li>
              <li>• <strong>Right to Access:</strong> Obtain copy of all personal data held</li>
              <li>• <strong>Right to Rectification:</strong> Correct inaccurate personal data</li>
              <li>• <strong>Right to Portability:</strong> Receive data in machine-readable format</li>
              <li>• All requests must be processed within 30 days</li>
              <li>• All actions logged in audit trail for compliance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
