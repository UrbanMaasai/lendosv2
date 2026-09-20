import { useState, useEffect } from 'react';
import { User, Phone, CreditCard, FileText, Shield, Calendar, TrendingUp, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { dataLayer, Borrower, Loan } from '../services/dataLayer';

export default function Borrower360View() {
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [selectedBorrower, setSelectedBorrower] = useState<Borrower | null>(null);
  const [borrowerLoans, setBorrowerLoans] = useState<Loan[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setBorrowers(dataLayer.getBorrowers());
  }, []);

  useEffect(() => {
    if (selectedBorrower) {
      const loans = dataLayer.getLoans().filter(l => l.borrowerId === selectedBorrower.id);
      setBorrowerLoans(loans);
    }
  }, [selectedBorrower]);

  const filteredBorrowers = borrowers.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.phone.includes(search) ||
    b.idNumber.includes(search)
  );

  const totalBorrowed = borrowerLoans.reduce((sum, l) => sum + l.principal, 0);
  const totalRepaid = borrowerLoans.reduce((sum, l) => sum + l.paid, 0);
  const activeLoans = borrowerLoans.filter(l => ['Active', 'Overdue', 'In Duplum'].includes(l.status));
  const repaidLoans = borrowerLoans.filter(l => l.status === 'Repaid');

  const getCreditScoreColor = (score: number) => {
    if (score >= 700) return 'text-green-600';
    if (score >= 600) return 'text-yellow-600';
    if (score >= 500) return 'text-orange-600';
    return 'text-red-600';
  };

  const getCreditScoreLabel = (score: number) => {
    if (score >= 700) return 'Excellent';
    if (score >= 600) return 'Good';
    if (score >= 500) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Borrower 360° View</h1>
        <p className="text-sm text-gray-500">Complete borrower profile with loan history, payments, and compliance status</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Borrower List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search borrowers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="space-y-2 max-h-[600px] overflow-y-auto scrollbar-thin">
              {filteredBorrowers.map((borrower) => (
                <div
                  key={borrower.id}
                  onClick={() => setSelectedBorrower(borrower)}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    selectedBorrower?.id === borrower.id
                      ? 'bg-primary-50 border-2 border-primary-300'
                      : 'bg-gray-50 border-2 border-transparent hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{borrower.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{borrower.name}</p>
                      <p className="text-xs text-gray-500">{borrower.phone}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-bold ${getCreditScoreColor(borrower.creditScore)}`}>
                        {borrower.creditScore || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Borrower Details */}
        <div className="lg:col-span-2">
          {selectedBorrower ? (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">{selectedBorrower.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900">{selectedBorrower.name}</h2>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Phone size={14} /> {selectedBorrower.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} /> Member since {new Date(selectedBorrower.registeredAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-3xl font-bold ${getCreditScoreColor(selectedBorrower.creditScore)}`}>
                      {selectedBorrower.creditScore || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-500">{getCreditScoreLabel(selectedBorrower.creditScore)}</p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Total Borrowed</p>
                    <p className="text-lg font-bold text-gray-900">KES {totalBorrowed.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Total Repaid</p>
                    <p className="text-lg font-bold text-green-600">KES {totalRepaid.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Active Loans</p>
                    <p className="text-lg font-bold text-gray-900">{activeLoans.length}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Repaid Loans</p>
                    <p className="text-lg font-bold text-gray-900">{repaidLoans.length}</p>
                  </div>
                </div>
              </div>

              {/* KYC & Compliance */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield size={18} className="text-primary-600" />
                  KYC & Compliance Status
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">KYC Status</span>
                      <span className={`text-sm font-medium ${selectedBorrower.kycVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                        {selectedBorrower.kycVerified ? '✓ Verified' : '⚠ Pending'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">KYC Method</span>
                      <span className="text-sm text-gray-900">{selectedBorrower.kycMethod || 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">National ID</span>
                      <span className="text-sm text-gray-900">{selectedBorrower.idNumber}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Credit Check</span>
                      <span className={`text-sm font-medium ${selectedBorrower.consent.creditCheck ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedBorrower.consent.creditCheck ? '✓ Granted' : '✗ Not Granted'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">CRB Reporting</span>
                      <span className={`text-sm font-medium ${selectedBorrower.consent.crbReporting ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedBorrower.consent.crbReporting ? '✓ Granted' : '✗ Not Granted'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Marketing</span>
                      <span className={`text-sm font-medium ${selectedBorrower.consent.marketing ? 'text-green-600' : 'text-gray-400'}`}>
                        {selectedBorrower.consent.marketing ? '✓ Granted' : '✗ Not Granted'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Loan History */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText size={18} className="text-primary-600" />
                  Loan History ({borrowerLoans.length})
                </h3>
                {borrowerLoans.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <FileText size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No loans found</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {borrowerLoans.map((loan) => {
                      const product = dataLayer.getProduct(loan.productId);
                      const progress = (loan.paid / loan.totalDue) * 100;
                      return (
                        <div key={loan.id} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{product?.name || 'Unknown Product'}</p>
                              <p className="text-xs text-gray-500 font-mono">{loan.id}</p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              loan.status === 'Active' ? 'bg-green-50 text-green-700' :
                              loan.status === 'Overdue' ? 'bg-red-50 text-red-700' :
                              loan.status === 'In Duplum' ? 'bg-purple-50 text-purple-700' :
                              loan.status === 'Repaid' ? 'bg-gray-100 text-gray-600' :
                              'bg-yellow-50 text-yellow-700'
                            }`}>
                              {loan.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-3 text-sm mb-3">
                            <div>
                              <p className="text-xs text-gray-500">Principal</p>
                              <p className="font-medium">KES {loan.principal.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Total Due</p>
                              <p className="font-medium">KES {loan.totalDue.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Remaining</p>
                              <p className="font-medium text-primary-600">KES {loan.remaining.toLocaleString()}</p>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                              <span>Progress</span>
                              <span>{progress.toFixed(0)}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  loan.status === 'Repaid' ? 'bg-green-500' :
                                  loan.status === 'Overdue' ? 'bg-red-500' :
                                  'bg-primary-500'
                                }`}
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                          </div>
                          {loan.inDuplumReached && (
                            <div className="mt-3 p-2 bg-purple-50 border border-purple-200 rounded text-xs text-purple-700">
                              <AlertTriangle size={12} className="inline mr-1" />
                              In duplum limit reached - no further charges
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
              <User size={48} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Borrower</h3>
              <p className="text-sm text-gray-500">Choose a borrower from the list to view their complete profile</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
