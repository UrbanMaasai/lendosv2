import { useState, useEffect } from 'react';
import { FileText, RefreshCw, CheckCircle2, Clock, AlertTriangle, DollarSign, Calendar } from 'lucide-react';
import { dataLayer, Loan } from '../services/dataLayer';

interface RestructuringRequest {
  id: string;
  loanId: string;
  borrowerName: string;
  currentPrincipal: number;
  currentRemaining: number;
  currentDueDate: string;
  requestedNewTenure: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  processedAt?: string;
  processedBy?: string;
}

export default function LoanRestructuring() {
  const [requests, setRequests] = useState<RestructuringRequest[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [newTenure, setNewTenure] = useState(60);
  const [reason, setReason] = useState('');

  useEffect(() => {
    // Load restructuring requests from localStorage
    const stored = localStorage.getItem('lendingos_restructuring_requests');
    if (stored) {
      setRequests(JSON.parse(stored));
    } else {
      // Seed with sample requests
      const seedRequests: RestructuringRequest[] = [
        {
          id: 'RES-001',
          loanId: 'LN-2026-0843',
          borrowerName: 'David Kiprop',
          currentPrincipal: 12000,
          currentRemaining: 9440,
          currentDueDate: '2026-06-01',
          requestedNewTenure: 90,
          reason: 'Temporary financial hardship due to medical emergency',
          status: 'pending',
          requestedAt: '2026-06-10T10:00:00Z'
        },
        {
          id: 'RES-002',
          loanId: 'LN-2026-0821',
          borrowerName: 'Joseph Mutua',
          currentPrincipal: 18000,
          currentRemaining: 18200,
          currentDueDate: '2026-05-15',
          requestedNewTenure: 120,
          reason: 'Job loss, actively seeking new employment',
          status: 'approved',
          requestedAt: '2026-06-05T14:30:00Z',
          processedAt: '2026-06-06T09:00:00Z',
          processedBy: 'Credit Officer'
        }
      ];
      setRequests(seedRequests);
      localStorage.setItem('lendingos_restructuring_requests', JSON.stringify(seedRequests));
    }
  }, []);

  const saveRequests = (updatedRequests: RestructuringRequest[]) => {
    setRequests(updatedRequests);
    localStorage.setItem('lendingos_restructuring_requests', JSON.stringify(updatedRequests));
  };

  const handleSubmitRequest = () => {
    if (!selectedLoan || !reason) return;

    const borrower = dataLayer.getBorrower(selectedLoan.borrowerId);
    if (!borrower) return;

    const newRequest: RestructuringRequest = {
      id: `RES-${Date.now()}`,
      loanId: selectedLoan.id,
      borrowerName: borrower.name,
      currentPrincipal: selectedLoan.principal,
      currentRemaining: selectedLoan.remaining,
      currentDueDate: selectedLoan.dueDate,
      requestedNewTenure: newTenure,
      reason,
      status: 'pending',
      requestedAt: new Date().toISOString()
    };

    const updatedRequests = [newRequest, ...requests];
    saveRequests(updatedRequests);

    // Log the request
    dataLayer.addAuditLog(
      selectedLoan.tenantId,
      'borrower',
      'RESTRUCTURING_REQUESTED',
      'Loan',
      selectedLoan.id,
      `Borrower requested restructuring: ${newTenure} days. Reason: ${reason}`
    );

    setShowForm(false);
    setSelectedLoan(null);
    setNewTenure(60);
    setReason('');
  };

  const handleProcessRequest = (requestId: string, action: 'approved' | 'rejected') => {
    const updatedRequests = requests.map(r => {
      if (r.id === requestId) {
        const loan = dataLayer.getLoan(r.loanId);
        if (loan && action === 'approved') {
          // Calculate new due date
          const newDueDate = new Date();
          newDueDate.setDate(newDueDate.getDate() + r.requestedNewTenure);
          
          // Update loan
          loan.dueDate = newDueDate.toISOString().split('T')[0];
          dataLayer.saveLoan(loan);

          // Log approval
          dataLayer.addAuditLog(
            loan.tenantId,
            'admin',
            'RESTRUCTURING_APPROVED',
            'Loan',
            loan.id,
            `Restructuring approved. New tenure: ${r.requestedNewTenure} days. New due date: ${loan.dueDate}`
          );
        } else if (loan && action === 'rejected') {
          // Log rejection
          dataLayer.addAuditLog(
            loan.tenantId,
            'admin',
            'RESTRUCTURING_REJECTED',
            'Loan',
            loan.id,
            'Restructuring request rejected'
          );
        }

        return {
          ...r,
          status: action,
          processedAt: new Date().toISOString(),
          processedBy: 'Admin'
        };
      }
      return r;
    });

    saveRequests(updatedRequests);
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const approvedCount = requests.filter(r => r.status === 'approved').length;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <RefreshCw size={20} className="text-primary-600" />
            Loan Restructuring
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {pendingCount} pending · {approvedCount} approved
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          Request Restructuring
        </button>
      </div>

      {/* Request Form */}
      {showForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">New Restructuring Request</h4>
          
          {/* Loan Selection */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">Select Loan</label>
            <select
              value={selectedLoan?.id || ''}
              onChange={(e) => {
                const loan = dataLayer.getLoans().find(l => l.id === e.target.value);
                setSelectedLoan(loan || null);
              }}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              <option value="">Choose a loan...</option>
              {dataLayer.getLoans().filter(l => ['Active', 'Overdue'].includes(l.status)).map(loan => {
                const borrower = dataLayer.getBorrower(loan.borrowerId);
                return (
                  <option key={loan.id} value={loan.id}>
                    {loan.id} - {borrower?.name} (KES {loan.remaining.toLocaleString()} remaining)
                  </option>
                );
              })}
            </select>
          </div>

          {/* New Tenure */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">New Tenure (days)</label>
            <input
              type="number"
              value={newTenure}
              onChange={(e) => setNewTenure(Number(e.target.value))}
              min={30}
              max={180}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>

          {/* Reason */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">Reason for Restructuring</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Explain the reason for requesting restructuring..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSubmitRequest}
              disabled={!selectedLoan || !reason}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Request
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setSelectedLoan(null);
                setNewTenure(60);
                setReason('');
              }}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Requests List */}
      <div className="space-y-3">
        {requests.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <RefreshCw size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No restructuring requests</p>
          </div>
        ) : (
          requests.map((request) => (
            <div
              key={request.id}
              className={`p-4 border rounded-lg ${
                request.status === 'pending' ? 'border-yellow-200 bg-yellow-50' :
                request.status === 'approved' ? 'border-green-200 bg-green-50' :
                'border-red-200 bg-red-50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-gray-500">{request.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      request.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      request.status === 'approved' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{request.borrowerName}</p>
                  <p className="text-xs text-gray-500">Loan: {request.loanId}</p>
                </div>
                <div className="text-right text-xs text-gray-500">
                  <p>Requested: {new Date(request.requestedAt).toLocaleDateString()}</p>
                  {request.processedAt && (
                    <p>Processed: {new Date(request.processedAt).toLocaleDateString()}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3 text-xs">
                <div>
                  <p className="text-gray-500 mb-1">Current Remaining</p>
                  <p className="font-medium text-gray-900">KES {request.currentRemaining.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">New Tenure</p>
                  <p className="font-medium text-gray-900">{request.requestedNewTenure} days</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Current Due Date</p>
                  <p className="font-medium text-gray-900">{request.currentDueDate}</p>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-1">Reason:</p>
                <p className="text-sm text-gray-700">{request.reason}</p>
              </div>

              {request.status === 'pending' && (
                <div className="flex gap-2 pt-3 border-t border-yellow-200">
                  <button
                    onClick={() => handleProcessRequest(request.id, 'approved')}
                    className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleProcessRequest(request.id, 'rejected')}
                    className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              )}

              {request.status === 'approved' && request.processedBy && (
                <div className="pt-3 border-t border-green-200">
                  <p className="text-xs text-green-700">
                    ✓ Approved by {request.processedBy} on {new Date(request.processedAt!).toLocaleDateString()}
                  </p>
                </div>
              )}

              {request.status === 'rejected' && request.processedBy && (
                <div className="pt-3 border-t border-red-200">
                  <p className="text-xs text-red-700">
                    ✗ Rejected by {request.processedBy} on {new Date(request.processedAt!).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
