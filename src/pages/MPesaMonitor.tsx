import { useState, useEffect } from 'react';
import { Smartphone, CheckCircle2, XCircle, Clock, DollarSign, TrendingUp, TrendingDown, Filter, Download } from 'lucide-react';
import { dataLayer, MPesaTransaction } from '../services/dataLayer';

export default function MPesaMonitor() {
  const [transactions, setTransactions] = useState<MPesaTransaction[]>([]);
  const [typeFilter, setTypeFilter] = useState<'all' | 'B2C' | 'C2B' | 'STK'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Success' | 'Failed' | 'Pending'>('all');

  useEffect(() => {
    const allTransactions = dataLayer.getTransactions();
    setTransactions(allTransactions.reverse()); // Most recent first
  }, []);

  const filteredTransactions = transactions.filter(t => {
    const matchesType = typeFilter === 'all' || t.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesType && matchesStatus;
  });

  const totalDisbursed = transactions
    .filter(t => t.type === 'B2C' && t.status === 'Success')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalCollected = transactions
    .filter(t => (t.type === 'C2B' || t.type === 'STK') && t.status === 'Success')
    .reduce((sum, t) => sum + t.amount, 0);

  const successRate = transactions.length > 0
    ? (transactions.filter(t => t.status === 'Success').length / transactions.length) * 100
    : 0;

  const typeCounts = {
    B2C: transactions.filter(t => t.type === 'B2C').length,
    C2B: transactions.filter(t => t.type === 'C2B').length,
    STK: transactions.filter(t => t.type === 'STK').length,
  };

  const exportTransactions = () => {
    const csv = [
      'ID,Tenant,Loan,Type,Amount,Status,Receipt,Created,Completed',
      ...transactions.map(t => `${t.id},${t.tenantId},${t.loanId},${t.type},${t.amount},${t.status},${t.mpesaReceipt || ''},${t.createdAt},${t.completedAt || ''}`)
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mpesa-transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">M-Pesa Transaction Monitor</h1>
          <p className="text-sm text-gray-500">Real-time view of all M-Pesa transactions with reconciliation</p>
        </div>
        <button
          onClick={exportTransactions}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700"
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-green-600" />
            <span className="text-xs text-gray-500">Total Disbursed</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">KES {totalDisbursed.toLocaleString()}</p>
          <p className="text-xs text-gray-500">{typeCounts.B2C} transactions</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={16} className="text-blue-600" />
            <span className="text-xs text-gray-500">Total Collected</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">KES {totalCollected.toLocaleString()}</p>
          <p className="text-xs text-gray-500">{typeCounts.C2B + typeCounts.STK} transactions</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={16} className="text-green-600" />
            <span className="text-xs text-gray-500">Success Rate</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{successRate.toFixed(1)}%</p>
          <p className="text-xs text-gray-500">{transactions.filter(t => t.status === 'Success').length} successful</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-yellow-600" />
            <span className="text-xs text-gray-500">Pending</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{transactions.filter(t => t.status === 'Pending').length}</p>
          <p className="text-xs text-gray-500">Awaiting confirmation</p>
        </div>
      </div>

      {/* Transaction Type Breakdown */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Transaction Types</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-900">B2C (Disbursements)</span>
              <Smartphone size={16} className="text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-900">{typeCounts.B2C}</p>
            <p className="text-xs text-green-700">Business to Customer</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-900">C2B (Repayments)</span>
              <Smartphone size={16} className="text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-900">{typeCounts.C2B}</p>
            <p className="text-xs text-blue-700">Customer to Business</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-purple-900">STK Push</span>
              <Smartphone size={16} className="text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-purple-900">{typeCounts.STK}</p>
            <p className="text-xs text-purple-700">Borrower-initiated</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 bg-white"
          >
            <option value="all">All Types</option>
            <option value="B2C">B2C (Disbursements)</option>
            <option value="C2B">C2B (Repayments)</option>
            <option value="STK">STK Push</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 bg-white"
          >
            <option value="all">All Status</option>
            <option value="Success">Success</option>
            <option value="Failed">Failed</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto scrollbar-thin">
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Transaction ID</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Type</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Loan</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Amount</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Status</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Receipt</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((txn) => (
                <tr key={txn.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <code className="text-xs font-mono text-gray-700">{txn.id}</code>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      txn.type === 'B2C' ? 'bg-green-50 text-green-700' :
                      txn.type === 'C2B' ? 'bg-blue-50 text-blue-700' :
                      'bg-purple-50 text-purple-700'
                    }`}>
                      {txn.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-xs font-mono text-gray-600">{txn.loanId}</code>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-gray-900">KES {txn.amount.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`flex items-center gap-1 text-xs font-medium ${
                      txn.status === 'Success' ? 'text-green-600' :
                      txn.status === 'Failed' ? 'text-red-600' :
                      'text-yellow-600'
                    }`}>
                      {txn.status === 'Success' ? <CheckCircle2 size={12} /> :
                       txn.status === 'Failed' ? <XCircle size={12} /> :
                       <Clock size={12} />}
                      {txn.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {txn.mpesaReceipt ? (
                      <code className="text-xs font-mono text-gray-600">{txn.mpesaReceipt}</code>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    {new Date(txn.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredTransactions.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            <Smartphone size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No transactions found</p>
          </div>
        )}
      </div>

      {/* Reconciliation Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <DollarSign size={18} className="text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Auto-Reconciliation</p>
            <p className="text-xs text-blue-700 mt-1">
              All C2B transactions are automatically reconciled via Account Reference field (maps to Loan ID). 
              Unmatched payments are routed to suspense account and flagged for manual review.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
