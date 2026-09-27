import { useState, useEffect } from 'react';
import { Package, CheckCircle2, Clock, AlertTriangle, User, Eye, Filter } from 'lucide-react';
import { dataLayer } from '../services/dataLayer';

interface ProductChange {
  id: string;
  productId: string;
  productName: string;
  tenantId: string;
  tenantName: string;
  field: string;
  previousValue: string;
  newValue: string;
  requestedBy: string;
  requestedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reason: string;
}

export default function ProductChangeApproval() {
  const [changes, setChanges] = useState<ProductChange[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedChange, setSelectedChange] = useState<ProductChange | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('lendingos_product_changes');
    if (stored) {
      setChanges(JSON.parse(stored));
    } else {
      const seedChanges: ProductChange[] = [
        {
          id: 'PC-001',
          productId: 'prod_001',
          productName: 'Salary Advance',
          tenantId: 'tenant_001',
          tenantName: 'PesaFlash',
          field: 'APR',
          previousValue: '38%',
          newValue: '36%',
          requestedBy: 'Credit Officer',
          requestedAt: '2026-06-14T10:30:00Z',
          approvedBy: 'Credit Lead',
          approvedAt: '2026-06-14T14:20:00Z',
          status: 'Approved',
          reason: 'Competitive pricing adjustment to match market rates',
        },
        {
          id: 'PC-002',
          productId: 'prod_002',
          productName: 'Micro Personal',
          tenantId: 'tenant_001',
          tenantName: 'PesaFlash',
          field: 'Max Amount',
          previousValue: 'KES 40,000',
          newValue: 'KES 50,000',
          requestedBy: 'Product Manager',
          requestedAt: '2026-06-15T09:15:00Z',
          status: 'Pending',
          reason: 'Increase limit to serve growing customer segment',
        },
        {
          id: 'PC-003',
          productId: 'prod_003',
          productName: 'SME Working Capital',
          tenantId: 'tenant_002',
          tenantName: 'QuickCredit SACCO',
          field: 'Late Payment Penalty',
          previousValue: '5% per month',
          newValue: '3% per month',
          requestedBy: 'Compliance Officer',
          requestedAt: '2026-06-13T16:45:00Z',
          status: 'Pending',
          reason: 'Reduce penalty to improve borrower relations and comply with FCP guidelines',
        },
        {
          id: 'PC-004',
          productId: 'prod_001',
          productName: 'Salary Advance',
          tenantId: 'tenant_001',
          tenantName: 'PesaFlash',
          field: 'Tenure',
          previousValue: '30 days',
          newValue: '45 days',
          requestedBy: 'Product Manager',
          requestedAt: '2026-06-10T11:20:00Z',
          approvedBy: 'Credit Lead',
          approvedAt: '2026-06-10T15:30:00Z',
          status: 'Approved',
          reason: 'Extend tenure to reduce monthly payment burden on borrowers',
        },
        {
          id: 'PC-005',
          productId: 'prod_002',
          productName: 'Micro Personal',
          tenantId: 'tenant_001',
          tenantName: 'PesaFlash',
          field: 'Min Credit Score',
          previousValue: '500',
          newValue: '450',
          requestedBy: 'Credit Officer',
          requestedAt: '2026-06-12T13:10:00Z',
          status: 'Rejected',
          reason: 'Lower credit score threshold to increase approval rate',
        },
      ];
      setChanges(seedChanges);
      localStorage.setItem('lendingos_product_changes', JSON.stringify(seedChanges));
    }
  }, []);

  const filteredChanges = changes.filter(c => {
    if (filter === 'all') return true;
    return c.status.toLowerCase() === filter;
  });

  const stats = {
    total: changes.length,
    pending: changes.filter(c => c.status === 'Pending').length,
    approved: changes.filter(c => c.status === 'Approved').length,
    rejected: changes.filter(c => c.status === 'Rejected').length,
  };

  const handleApprove = (changeId: string) => {
    const updated = changes.map(c => {
      if (c.id === changeId) {
        return {
          ...c,
          status: 'Approved' as const,
          approvedBy: 'Platform Admin',
          approvedAt: new Date().toISOString(),
        };
      }
      return c;
    });
    setChanges(updated);
    localStorage.setItem('lendingos_product_changes', JSON.stringify(updated));

    // Log approval
    const change = changes.find(c => c.id === changeId);
    if (change) {
      dataLayer.addAuditLog(
        change.tenantId,
        'admin',
        'PRODUCT_CHANGE_APPROVED',
        'Product',
        change.productId,
        `Change approved: ${change.field} from ${change.previousValue} to ${change.newValue}`
      );
    }

    if (selectedChange?.id === changeId) {
      setSelectedChange({ ...selectedChange, status: 'Approved', approvedBy: 'Platform Admin', approvedAt: new Date().toISOString() });
    }
  };

  const handleReject = (changeId: string) => {
    const updated = changes.map(c => {
      if (c.id === changeId) {
        return {
          ...c,
          status: 'Rejected' as const,
          approvedBy: 'Platform Admin',
          approvedAt: new Date().toISOString(),
        };
      }
      return c;
    });
    setChanges(updated);
    localStorage.setItem('lendingos_product_changes', JSON.stringify(updated));

    // Log rejection
    const change = changes.find(c => c.id === changeId);
    if (change) {
      dataLayer.addAuditLog(
        change.tenantId,
        'admin',
        'PRODUCT_CHANGE_REJECTED',
        'Product',
        change.productId,
        `Change rejected: ${change.field} from ${change.previousValue} to ${change.newValue}`
      );
    }

    if (selectedChange?.id === changeId) {
      setSelectedChange({ ...selectedChange, status: 'Rejected', approvedBy: 'Platform Admin', approvedAt: new Date().toISOString() });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Change Approval</h1>
          <p className="text-sm text-gray-500">Dual approval workflow for product configuration changes</p>
        </div>
      </div>

      {/* Compliance Notice */}
      <div className="bg-warning-50 border border-warning-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle size={18} className="text-warning-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-warning-800">Product Governance Policy</p>
            <p className="text-xs text-warning-700 mt-1">
              All changes to interest rates, fees, penalties, and eligibility criteria require dual approval.
              Changes are logged in the audit trail with before/after values and approver information.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Package size={16} className="text-primary-600" />
            <span className="text-xs text-gray-500">Total Changes</span>
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
            <CheckCircle2 size={16} className="text-accent-600" />
            <span className="text-xs text-gray-500">Approved</span>
          </div>
          <p className="text-2xl font-bold text-accent-600">{stats.approved}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-danger-600" />
            <span className="text-xs text-gray-500">Rejected</span>
          </div>
          <p className="text-2xl font-bold text-danger-600">{stats.rejected}</p>
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
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Changes Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto scrollbar-thin">
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">ID</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Product</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Tenant</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Field</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Change</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Status</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Requested By</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filteredChanges.map((change) => (
                <tr key={change.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <code className="text-xs font-mono text-primary-600">{change.id}</code>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">{change.productName}</p>
                    <p className="text-xs text-gray-500 font-mono">{change.productId}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{change.tenantName}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{change.field}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-danger-600 line-through">{change.previousValue}</span>
                      <span className="text-gray-400">→</span>
                      <span className="text-accent-600 font-medium">{change.newValue}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded border ${
                      change.status === 'Pending' ? 'bg-warning-50 text-warning-700 border-warning-200' :
                      change.status === 'Approved' ? 'bg-accent-50 text-accent-700 border-accent-200' :
                      'bg-danger-50 text-danger-700 border-danger-200'
                    }`}>
                      {change.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{change.requestedBy}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedChange(change)}
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
        {filteredChanges.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            <Package size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No product changes found</p>
          </div>
        )}
      </div>

      {/* Change Detail Modal */}
      {selectedChange && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setSelectedChange(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Product Change Details</h3>
              <button onClick={() => setSelectedChange(null)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Change ID</p>
                  <p className="text-sm font-mono">{selectedChange.id}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="text-sm">{selectedChange.status}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Product</p>
                  <p className="text-sm">{selectedChange.productName}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Tenant</p>
                  <p className="text-sm">{selectedChange.tenantName}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Field Changed</p>
                <p className="text-sm font-medium text-gray-900">{selectedChange.field}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-2">Value Change</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 p-2 bg-danger-50 border border-danger-200 rounded">
                    <p className="text-xs text-danger-700">Previous</p>
                    <p className="text-sm font-medium text-danger-900">{selectedChange.previousValue}</p>
                  </div>
                  <span className="text-gray-400">→</span>
                  <div className="flex-1 p-2 bg-accent-50 border border-accent-200 rounded">
                    <p className="text-xs text-accent-700">New</p>
                    <p className="text-sm font-medium text-accent-900">{selectedChange.newValue}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Reason</p>
                <p className="text-sm text-gray-700">{selectedChange.reason}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Requested By</p>
                <p className="text-sm text-gray-700">{selectedChange.requestedBy}</p>
                <p className="text-xs text-gray-500">{new Date(selectedChange.requestedAt).toLocaleString()}</p>
              </div>
              {selectedChange.approvedBy && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Processed By</p>
                  <p className="text-sm text-gray-700">{selectedChange.approvedBy}</p>
                  <p className="text-xs text-gray-500">{new Date(selectedChange.approvedAt!).toLocaleString()}</p>
                </div>
              )}
              {selectedChange.status === 'Pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(selectedChange.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-accent-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-accent-700"
                  >
                    <CheckCircle2 size={16} /> Approve
                  </button>
                  <button
                    onClick={() => handleReject(selectedChange.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-danger-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-danger-700"
                  >
                    <AlertTriangle size={16} /> Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
