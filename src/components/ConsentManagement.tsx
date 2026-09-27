import { useState, useEffect } from 'react';
import { Shield, CheckCircle2, XCircle, AlertTriangle, Eye, Lock } from 'lucide-react';
import { dataLayer, Borrower } from '../services/dataLayer';

export default function ConsentManagement() {
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [filter, setFilter] = useState<'all' | 'complete' | 'partial' | 'none'>('all');
  const [selectedBorrower, setSelectedBorrower] = useState<Borrower | null>(null);

  useEffect(() => {
    setBorrowers(dataLayer.getBorrowers());
  }, []);

  const getConsentStatus = (borrower: Borrower) => {
    const consents = [
      borrower.consent.creditCheck,
      borrower.consent.crbReporting,
      borrower.consent.marketing
    ];
    const granted = consents.filter(c => c).length;
    
    if (granted === 3) return 'complete';
    if (granted > 0) return 'partial';
    return 'none';
  };

  const filteredBorrowers = borrowers.filter(b => {
    if (filter === 'all') return true;
    return getConsentStatus(b) === filter;
  });

  const handleWithdrawConsent = (borrowerId: string, consentType: keyof Borrower['consent']) => {
    const borrower = borrowers.find(b => b.id === borrowerId);
    if (!borrower) return;

    // Update consent
    (borrower.consent as any)[consentType] = false;
    dataLayer.saveBorrower(borrower);

    // Log the withdrawal
    dataLayer.addAuditLog(
      borrower.tenantId,
      'admin',
      'CONSENT_WITHDRAWN',
      'Borrower',
      borrower.id,
      `Consent withdrawn: ${consentType}. Previous value: true`
    );

    // Refresh
    setBorrowers([...borrowers]);
    if (selectedBorrower?.id === borrowerId) {
      setSelectedBorrower({ ...borrower });
    }
  };

  const stats = {
    total: borrowers.length,
    complete: borrowers.filter(b => getConsentStatus(b) === 'complete').length,
    partial: borrowers.filter(b => getConsentStatus(b) === 'partial').length,
    none: borrowers.filter(b => getConsentStatus(b) === 'none').length,
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Shield size={20} className="text-primary-600" />
            Consent Management
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Track and manage borrower data consents (Data Protection Act 2019)
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500">Total Borrowers</p>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <p className="text-2xl font-bold text-green-900">{stats.complete}</p>
          <p className="text-xs text-green-700">Complete Consent</p>
        </div>
        <div className="p-3 bg-yellow-50 rounded-lg">
          <p className="text-2xl font-bold text-yellow-900">{stats.partial}</p>
          <p className="text-xs text-yellow-700">Partial Consent</p>
        </div>
        <div className="p-3 bg-red-50 rounded-lg">
          <p className="text-2xl font-bold text-red-900">{stats.none}</p>
          <p className="text-xs text-red-700">No Consent</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {(['all', 'complete', 'partial', 'none'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === f
                ? 'bg-primary-50 text-primary-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Borrowers List */}
      <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin">
        {filteredBorrowers.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Shield size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No borrowers found</p>
          </div>
        ) : (
          filteredBorrowers.map((borrower) => {
            const status = getConsentStatus(borrower);
            return (
              <div
                key={borrower.id}
                onClick={() => setSelectedBorrower(borrower)}
                className={`p-3 border rounded-lg cursor-pointer hover:shadow-md transition-all ${
                  selectedBorrower?.id === borrower.id
                    ? 'border-primary-300 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      status === 'complete' ? 'bg-green-500' :
                      status === 'partial' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{borrower.name}</p>
                      <p className="text-xs text-gray-500">{borrower.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      status === 'complete' ? 'bg-green-50 text-green-700' :
                      status === 'partial' ? 'bg-yellow-50 text-yellow-700' :
                      'bg-red-50 text-red-700'
                    }`}>
                      {status}
                    </span>
                    <Eye size={14} className="text-gray-400" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Selected Borrower Details */}
      {selectedBorrower && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-900">{selectedBorrower.name}</h4>
              <p className="text-xs text-gray-500">
                Consent version: {selectedBorrower.consent.version} · 
                Last updated: {new Date(selectedBorrower.consent.timestamp).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => setSelectedBorrower(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle size={18} />
            </button>
          </div>

          <div className="space-y-3">
            {/* Credit Check Consent */}
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                {selectedBorrower.consent.creditCheck ? (
                  <CheckCircle2 size={18} className="text-green-600" />
                ) : (
                  <XCircle size={18} className="text-red-600" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">Credit Check</p>
                  <p className="text-xs text-gray-500">Permission to check credit history with CRBs</p>
                </div>
              </div>
              {selectedBorrower.consent.creditCheck && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWithdrawConsent(selectedBorrower.id, 'creditCheck');
                  }}
                  className="px-3 py-1 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Withdraw
                </button>
              )}
            </div>

            {/* CRB Reporting Consent */}
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                {selectedBorrower.consent.crbReporting ? (
                  <CheckCircle2 size={18} className="text-green-600" />
                ) : (
                  <XCircle size={18} className="text-red-600" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">CRB Reporting</p>
                  <p className="text-xs text-gray-500">Permission to report loan performance to CRBs</p>
                </div>
              </div>
              {selectedBorrower.consent.crbReporting && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWithdrawConsent(selectedBorrower.id, 'crbReporting');
                  }}
                  className="px-3 py-1 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Withdraw
                </button>
              )}
            </div>

            {/* Marketing Consent */}
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                {selectedBorrower.consent.marketing ? (
                  <CheckCircle2 size={18} className="text-green-600" />
                ) : (
                  <XCircle size={18} className="text-red-600" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">Marketing</p>
                  <p className="text-xs text-gray-500">Permission to send marketing communications</p>
                </div>
              </div>
              {selectedBorrower.consent.marketing && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWithdrawConsent(selectedBorrower.id, 'marketing');
                  }}
                  className="px-3 py-1 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Withdraw
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <Lock size={14} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-800">
                <p className="font-medium mb-1">Consent Withdrawal Impact</p>
                <p>
                  Withdrawing consent will immediately stop processing for that purpose. 
                  For credit check consent, the borrower will no longer be eligible for new loans.
                  All withdrawals are logged in the audit trail.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
