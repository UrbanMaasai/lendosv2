import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle2, User, Clock, Filter, Download, Eye } from 'lucide-react';
import { dataLayer, AuditLog } from '../services/dataLayer';

interface Override {
  id: string;
  timestamp: string;
  loanId: string;
  borrowerName: string;
  reasonCode: string;
  reasonDescription: string;
  approvedBy: string;
  previousValue: string;
  newValue: string;
  field: string;
}

export default function OverrideTracker() {
  const [overrides, setOverrides] = useState<Override[]>([]);
  const [reasonFilter, setReasonFilter] = useState('all');
  const [selectedOverride, setSelectedOverride] = useState<Override | null>(null);

  useEffect(() => {
    // Generate sample overrides from audit logs
    const logs = dataLayer.getAuditLogs();
    const overrideLogs = logs.filter(l => l.action.includes('OVERRIDE'));

    const sampleOverrides: Override[] = [
      {
        id: 'OVR-001',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        loanId: 'LN-2026-0846',
        borrowerName: 'Grace Wanjiku',
        reasonCode: 'INCOME_VERIFIED_PAYSLIP',
        reasonDescription: 'Income verified via payslip despite low credit score',
        approvedBy: 'Credit Lead',
        previousValue: 'Declined',
        newValue: 'Approved',
        field: 'Decision'
      },
      {
        id: 'OVR-002',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        loanId: 'LN-2026-0843',
        borrowerName: 'David Kiprop',
        reasonCode: 'AFFORDABILITY_REASSESSED',
        reasonDescription: 'DTI recalculated with additional income sources',
        approvedBy: 'Credit Officer',
        previousValue: 'DTI: 58%',
        newValue: 'DTI: 42%',
        field: 'Affordability'
      },
      {
        id: 'OVR-003',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        loanId: 'LN-2026-0821',
        borrowerName: 'Joseph Mutua',
        reasonCode: 'CRB_DISPUTE_PENDING',
        reasonDescription: 'CRB dispute in progress, manual review approved',
        approvedBy: 'Compliance Officer',
        previousValue: 'Blocked',
        newValue: 'Manual Review',
        field: 'CRB Check'
      },
      {
        id: 'OVR-004',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
        loanId: 'LN-2026-0812',
        borrowerName: 'Robert Koech',
        reasonCode: 'RELATIONSHIP_CUSTOMER_EXCEPTION',
        reasonDescription: 'Long-standing customer with good repayment history',
        approvedBy: 'Branch Manager',
        previousValue: 'Max: KES 25,000',
        newValue: 'Max: KES 35,000',
        field: 'Loan Amount'
      },
      {
        id: 'OVR-005',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
        loanId: 'LN-2026-0798',
        borrowerName: 'Ann Wambui',
        reasonCode: 'POLICY_EXCEPTION_APPROVED_BY_CREDIT_LEAD',
        reasonDescription: 'Policy exception for strategic customer segment',
        approvedBy: 'Head of Credit',
        previousValue: 'APR: 48%',
        newValue: 'APR: 42%',
        field: 'Interest Rate'
      }
    ];

    setOverrides(sampleOverrides.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
  }, []);

  const filteredOverrides = reasonFilter === 'all' 
    ? overrides 
    : overrides.filter(o => o.reasonCode === reasonFilter);

  const reasonCodes = [
    { code: 'INCOME_VERIFIED_PAYSLIP', label: 'Income Verified (Payslip)', count: overrides.filter(o => o.reasonCode === 'INCOME_VERIFIED_PAYSLIP').length },
    { code: 'INCOME_VERIFIED_BANK_OR_MOBILE_MONEY', label: 'Income Verified (Bank/Mobile)', count: overrides.filter(o => o.reasonCode === 'INCOME_VERIFIED_BANK_OR_MOBILE_MONEY').length },
    { code: 'CRB_DISPUTE_PENDING', label: 'CRB Dispute Pending', count: overrides.filter(o => o.reasonCode === 'CRB_DISPUTE_PENDING').length },
    { code: 'RELATIONSHIP_CUSTOMER_EXCEPTION', label: 'Relationship Customer', count: overrides.filter(o => o.reasonCode === 'RELATIONSHIP_CUSTOMER_EXCEPTION').length },
    { code: 'POLICY_EXCEPTION_APPROVED_BY_CREDIT_LEAD', label: 'Policy Exception', count: overrides.filter(o => o.reasonCode === 'POLICY_EXCEPTION_APPROVED_BY_CREDIT_LEAD').length },
    { code: 'AFFORDABILITY_REASSESSED', label: 'Affordability Reassessed', count: overrides.filter(o => o.reasonCode === 'AFFORDABILITY_REASSESSED').length },
    { code: 'FRAUD_OR_IDENTITY_CONCERN', label: 'Fraud/Identity Concern', count: overrides.filter(o => o.reasonCode === 'FRAUD_OR_IDENTITY_CONCERN').length },
    { code: 'OTHER_WITH_NOTE', label: 'Other (with note)', count: overrides.filter(o => o.reasonCode === 'OTHER_WITH_NOTE').length },
  ];

  const exportOverrides = () => {
    const csv = [
      'ID,Timestamp,Loan,Borrower,Reason Code,Reason,Approved By,Field,Previous,New',
      ...overrides.map(o => `${o.id},${o.timestamp},${o.loanId},${o.borrowerName},${o.reasonCode},"${o.reasonDescription}",${o.approvedBy},${o.field},"${o.previousValue}","${o.newValue}"`)
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `overrides-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Override Reason Tracker</h1>
          <p className="text-sm text-gray-500">Track and visualize all manual overrides with reason codes</p>
        </div>
        <button
          onClick={exportOverrides}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700"
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-yellow-600" />
            <span className="text-xs text-gray-500">Total Overrides</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{overrides.length}</p>
          <p className="text-xs text-gray-500">Last 30 days</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={16} className="text-green-600" />
            <span className="text-xs text-gray-500">Approved</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{overrides.length}</p>
          <p className="text-xs text-gray-500">All with dual approval</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <User size={16} className="text-blue-600" />
            <span className="text-xs text-gray-500">Unique Approvers</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {new Set(overrides.map(o => o.approvedBy)).size}
          </p>
          <p className="text-xs text-gray-500">Credit leads, compliance</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-purple-600" />
            <span className="text-xs text-gray-500">Avg Review Time</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">2.3h</p>
          <p className="text-xs text-gray-500">Within 4h SLA</p>
        </div>
      </div>

      {/* Reason Code Breakdown */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Override Reason Codes</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {reasonCodes.map((rc) => (
            <button
              key={rc.code}
              onClick={() => setReasonFilter(reasonFilter === rc.code ? 'all' : rc.code)}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                reasonFilter === rc.code
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="text-xs text-gray-500 mb-1">{rc.label}</p>
              <p className="text-2xl font-bold text-gray-900">{rc.count}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <Filter size={16} className="text-gray-400" />
        <select
          value={reasonFilter}
          onChange={(e) => setReasonFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 bg-white"
        >
          <option value="all">All Reason Codes</option>
          {reasonCodes.map(rc => (
            <option key={rc.code} value={rc.code}>{rc.label}</option>
          ))}
        </select>
      </div>

      {/* Overrides Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto scrollbar-thin">
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Override ID</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Loan</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Borrower</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Reason Code</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Field</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Change</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Approved By</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filteredOverrides.map((override) => (
                <tr key={override.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <code className="text-xs font-mono text-gray-700">{override.id}</code>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-xs font-mono text-primary-600">{override.loanId}</code>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-900">{override.borrowerName}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded">
                      {override.reasonCode}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-700">{override.field}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-red-600 line-through">{override.previousValue}</span>
                      <span className="text-gray-400">→</span>
                      <span className="text-green-600 font-medium">{override.newValue}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-700">{override.approvedBy}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedOverride(override)}
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
        {filteredOverrides.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            <AlertTriangle size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No overrides found</p>
          </div>
        )}
      </div>

      {/* Override Detail Modal */}
      {selectedOverride && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setSelectedOverride(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Override Details</h3>
              <button onClick={() => setSelectedOverride(null)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Override ID</p>
                  <p className="text-sm font-mono">{selectedOverride.id}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Timestamp</p>
                  <p className="text-sm">{new Date(selectedOverride.timestamp).toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Loan ID</p>
                  <p className="text-sm font-mono text-primary-600">{selectedOverride.loanId}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Borrower</p>
                  <p className="text-sm">{selectedOverride.borrowerName}</p>
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-xs text-yellow-700 mb-1">Reason Code</p>
                <p className="text-sm font-mono font-medium text-yellow-900">{selectedOverride.reasonCode}</p>
                <p className="text-sm text-yellow-800 mt-2">{selectedOverride.reasonDescription}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-2">Field Changed</p>
                <p className="text-sm font-medium text-gray-900 mb-2">{selectedOverride.field}</p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-red-600 line-through">{selectedOverride.previousValue}</span>
                  <span className="text-gray-400">→</span>
                  <span className="text-green-600 font-medium">{selectedOverride.newValue}</span>
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-600" />
                  <div>
                    <p className="text-xs text-green-700">Approved By</p>
                    <p className="text-sm font-medium text-green-900">{selectedOverride.approvedBy}</p>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle size={14} className="text-blue-600 mt-0.5" />
                  <p className="text-xs text-blue-700">
                    All overrides require dual approval and are logged in the audit trail with before/after values, 
                    reason code, and approver information. This ensures accountability and regulatory compliance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compliance Note */}
      <div className="bg-accent-50 border border-accent-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <CheckCircle2 size={18} className="text-accent-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-accent-800">Override Control Framework</p>
            <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-accent-700">
              <div>✓ Controlled taxonomy of reason codes</div>
              <div>✓ Dual approval required</div>
              <div>✓ Before/after values captured</div>
              <div>✓ Full audit trail logging</div>
              <div>✓ Approver accountability</div>
              <div>✓ 7-year retention</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
