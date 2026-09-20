import { useState, useEffect } from 'react';
import { FileText, CheckCircle2, XCircle, Clock, AlertTriangle, Filter, Play, Pause } from 'lucide-react';
import { dataLayer, Loan } from '../services/dataLayer';
import { loanLifecycle } from '../services/loanLifecycle';

export default function BulkLoanOperations() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [selectedLoans, setSelectedLoans] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending');
  const [processing, setProcessing] = useState(false);
  const [logs, setLogs] = useState<Array<{ type: 'success' | 'error' | 'info'; message: string }>>([]);

  useEffect(() => {
    const allLoans = dataLayer.getLoans();
    setLoans(allLoans);
  }, []);

  const filteredLoans = loans.filter(l => {
    if (filter === 'pending') return l.status === 'Application' || l.status === 'KYC Review' || l.status === 'Decision';
    if (filter === 'approved') return l.status === 'Approved';
    return true;
  });

  const toggleLoan = (loanId: string) => {
    const newSelected = new Set(selectedLoans);
    if (newSelected.has(loanId)) {
      newSelected.delete(loanId);
    } else {
      newSelected.add(loanId);
    }
    setSelectedLoans(newSelected);
  };

  const selectAll = () => {
    if (selectedLoans.size === filteredLoans.length) {
      setSelectedLoans(new Set());
    } else {
      setSelectedLoans(new Set(filteredLoans.map(l => l.id)));
    }
  };

  const addLog = (type: 'success' | 'error' | 'info', message: string) => {
    setLogs(prev => [...prev, { type, message }]);
  };

  const bulkApprove = async () => {
    if (selectedLoans.size === 0) {
      addLog('error', 'No loans selected');
      return;
    }

    setProcessing(true);
    setLogs([]);
    addLog('info', `Starting bulk approval for ${selectedLoans.size} loans...`);

    let successCount = 0;
    let failCount = 0;

    for (const loanId of Array.from(selectedLoans)) {
      const loan = loans.find(l => l.id === loanId);
      if (!loan) continue;

      const result = loanLifecycle.decide(loanId, true, 'admin');
      
      if (result.success) {
        successCount++;
        addLog('success', `✓ ${loanId} approved`);
      } else {
        failCount++;
        addLog('error', `✗ ${loanId} failed: ${result.error}`);
      }

      // Small delay to simulate processing
      await new Promise(r => setTimeout(r, 200));
    }

    addLog('info', `Bulk approval complete: ${successCount} approved, ${failCount} failed`);
    setProcessing(false);
    setSelectedLoans(new Set());

    // Refresh loans
    setLoans(dataLayer.getLoans());
  };

  const bulkReject = async () => {
    if (selectedLoans.size === 0) {
      addLog('error', 'No loans selected');
      return;
    }

    setProcessing(true);
    setLogs([]);
    addLog('info', `Starting bulk rejection for ${selectedLoans.size} loans...`);

    let successCount = 0;
    let failCount = 0;

    for (const loanId of Array.from(selectedLoans)) {
      const loan = loans.find(l => l.id === loanId);
      if (!loan) continue;

      const result = loanLifecycle.decide(loanId, false, 'admin');
      
      if (result.success) {
        successCount++;
        addLog('success', `✓ ${loanId} rejected`);
      } else {
        failCount++;
        addLog('error', `✗ ${loanId} failed: ${result.error}`);
      }

      await new Promise(r => setTimeout(r, 200));
    }

    addLog('info', `Bulk rejection complete: ${successCount} rejected, ${failCount} failed`);
    setProcessing(false);
    setSelectedLoans(new Set());

    setLoans(dataLayer.getLoans());
  };

  const stats = {
    total: filteredLoans.length,
    selected: selectedLoans.size,
    pendingApproval: loans.filter(l => l.status === 'Decision').length,
    pendingKYC: loans.filter(l => l.status === 'KYC Review').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bulk Loan Operations</h1>
          <p className="text-sm text-gray-500">Process multiple loans simultaneously with compliance checks</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={16} className="text-primary-600" />
            <span className="text-xs text-gray-500">Total Loans</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={16} className="text-accent-600" />
            <span className="text-xs text-gray-500">Selected</span>
          </div>
          <p className="text-2xl font-bold text-accent-600">{stats.selected}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-warning-600" />
            <span className="text-xs text-gray-500">Pending Approval</span>
          </div>
          <p className="text-2xl font-bold text-warning-600">{stats.pendingApproval}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-primary-600" />
            <span className="text-xs text-gray-500">Pending KYC</span>
          </div>
          <p className="text-2xl font-bold text-primary-600">{stats.pendingKYC}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={bulkApprove}
            disabled={selectedLoans.size === 0 || processing}
            className="flex-1 flex items-center justify-center gap-2 bg-accent-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-accent-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? <Pause size={16} /> : <CheckCircle2 size={16} />}
            Approve Selected ({selectedLoans.size})
          </button>
          <button
            onClick={bulkReject}
            disabled={selectedLoans.size === 0 || processing}
            className="flex-1 flex items-center justify-center gap-2 bg-danger-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-danger-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? <Pause size={16} /> : <XCircle size={16} />}
            Reject Selected ({selectedLoans.size})
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <Filter size={16} className="text-gray-400" />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 bg-white"
        >
          <option value="pending">Pending Review</option>
          <option value="approved">Approved</option>
          <option value="all">All Loans</option>
        </select>
      </div>

      {/* Loans Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto scrollbar-thin">
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedLoans.size === filteredLoans.length && filteredLoans.length > 0}
                    onChange={selectAll}
                    className="rounded"
                  />
                </th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Loan ID</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Borrower</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Product</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Amount</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Status</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {filteredLoans.map((loan) => {
                const borrower = dataLayer.getBorrower(loan.borrowerId);
                const product = dataLayer.getProduct(loan.productId);
                return (
                  <tr key={loan.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedLoans.has(loan.id)}
                        onChange={() => toggleLoan(loan.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-xs font-mono text-primary-600">{loan.id}</code>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{borrower?.name || 'Unknown'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{product?.name || 'Unknown'}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">KES {loan.principal.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded ${
                        loan.status === 'Application' ? 'bg-gray-100 text-gray-700' :
                        loan.status === 'KYC Review' ? 'bg-warning-50 text-warning-700' :
                        loan.status === 'Decision' ? 'bg-primary-50 text-primary-700' :
                        loan.status === 'Approved' ? 'bg-accent-50 text-accent-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">
                      {new Date(loan.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredLoans.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            <FileText size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No loans found</p>
          </div>
        )}
      </div>

      {/* Processing Logs */}
      {logs.length > 0 && (
        <div className="bg-gray-900 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-white mb-3">Processing Logs</h3>
          <div className="space-y-1 font-mono text-xs max-h-64 overflow-y-auto scrollbar-thin">
            {logs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-2">
                {log.type === 'success' && <CheckCircle2 size={12} className="text-green-400 mt-0.5 flex-shrink-0" />}
                {log.type === 'error' && <XCircle size={12} className="text-red-400 mt-0.5 flex-shrink-0" />}
                {log.type === 'info' && <Clock size={12} className="text-blue-400 mt-0.5 flex-shrink-0" />}
                <span className={
                  log.type === 'success' ? 'text-green-400' :
                  log.type === 'error' ? 'text-red-400' :
                  'text-blue-400'
                }>
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Compliance Notice */}
      <div className="bg-accent-50 border border-accent-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle size={18} className="text-accent-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-accent-800">Bulk Operations Compliance</p>
            <p className="text-xs text-accent-700 mt-1">
              All bulk operations are subject to compliance checks including affordability assessment, CRB verification,
              and consent validation. Each operation is logged in the audit trail with approver information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
