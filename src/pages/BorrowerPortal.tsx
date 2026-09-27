import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dataLayer, Borrower, Loan, LoanProduct } from '../services/dataLayer';
import { loanLifecycle } from '../services/loanLifecycle';
import { complianceEngine } from '../services/complianceEngine';
import { mpesaSimulator } from '../services/mpesaSimulator';
import {
  Shield, CheckCircle2, AlertTriangle, Clock, DollarSign, Phone,
  ArrowRight, ArrowLeft, User, FileText, CreditCard, Lock
} from 'lucide-react';

type JourneyStep = 'welcome' | 'register' | 'kyc' | 'consent' | 'browse' | 'apply' | 'kfs' | 'cooling' | 'disbursed' | 'repay';

export default function BorrowerPortal() {
  const navigate = useNavigate();
  const [step, setStep] = useState<JourneyStep>('welcome');
  const [currentTenant] = useState('tenant_001'); // PesaFlash
  const [borrower, setBorrower] = useState<Borrower | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<LoanProduct | null>(null);
  const [loanAmount, setLoanAmount] = useState(10000);
  const [currentLoan, setCurrentLoan] = useState<Loan | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [consentGiven, setConsentGiven] = useState({ creditCheck: false, crbReporting: false });
  const [loading, setLoading] = useState(false);
  const [complianceMessage, setComplianceMessage] = useState('');
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [products, setProducts] = useState<LoanProduct[]>([]);

  useEffect(() => {
    setProducts(dataLayer.getProducts(currentTenant).filter(p => p.status === 'Active'));
  }, [currentTenant]);

  // Registration
  const handleRegister = () => {
    if (!phoneNumber || !name || !idNumber) {
      alert('Please fill in all fields');
      return;
    }

    const existingBorrower = dataLayer.getBorrowerByPhone(phoneNumber, currentTenant);
    if (existingBorrower) {
      setBorrower(existingBorrower);
      setStep('browse');
      return;
    }

    const newBorrower: Borrower = {
      id: dataLayer.generateId('brw'),
      tenantId: currentTenant,
      phone: phoneNumber,
      name,
      idNumber,
      kycVerified: false,
      kycMethod: null,
      creditScore: 0,
      consent: {
        creditCheck: false,
        crbReporting: false,
        marketing: false,
        version: '2.5',
        timestamp: new Date().toISOString(),
        ipAddress: '105.23.45.100',
      },
      status: 'Pending KYC',
      registeredAt: new Date().toISOString(),
    };

    dataLayer.saveBorrower(newBorrower);
    dataLayer.addAuditLog(currentTenant, 'system', 'BORROWER_REGISTERED', 'Borrower', newBorrower.id, `New borrower registered: ${name}`);
    setBorrower(newBorrower);
    setStep('kyc');
  };

  // KYC Verification
  const handleKYC = async () => {
    setLoading(true);
    // Simulate KYC verification
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (borrower) {
      borrower.kycVerified = true;
      borrower.kycMethod = 'smile_identity';
      borrower.creditScore = 650 + Math.floor(Math.random() * 100);
      borrower.status = 'Active';
      dataLayer.saveBorrower(borrower);
      setBorrower({ ...borrower });
      dataLayer.addAuditLog(currentTenant, 'system', 'KYC_VERIFIED', 'Borrower', borrower.id, `KYC verified via Smile Identity. Credit score: ${borrower.creditScore}`);
    }
    setLoading(false);
    setStep('consent');
  };

  // Consent
  const handleConsent = () => {
    if (!consentGiven.creditCheck || !consentGiven.crbReporting) {
      alert('You must provide consent for credit check and CRB reporting to proceed');
      return;
    }

    if (borrower) {
      borrower.consent.creditCheck = true;
      borrower.consent.crbReporting = true;
      borrower.consent.timestamp = new Date().toISOString();
      dataLayer.saveBorrower(borrower);
      setBorrower({ ...borrower });
      dataLayer.addAuditLog(currentTenant, borrower.id, 'CONSENT_GRANTED', 'Borrower', borrower.id, 'Credit check and CRB reporting consent granted');
    }
    setStep('browse');
  };

  // Apply for loan
  const handleApply = () => {
    if (!borrower || !selectedProduct) return;

    const result = loanLifecycle.apply(currentTenant, borrower.id, selectedProduct.id, loanAmount, borrower.id);
    
    if (result.success && result.loan) {
      setCurrentLoan(result.loan);
      setStep('kfs');
    } else {
      alert(result.error);
    }
  };

  // Generate KFS and proceed to cooling-off
  const handleKFS = () => {
    if (!currentLoan) return;

    currentLoan.kfsGenerated = true;
    dataLayer.saveLoan(currentLoan);
    dataLayer.addAuditLog(currentTenant, borrower!.id, 'KFS_ACCEPTED', 'Loan', currentLoan.id, 'Borrower accepted Key Facts Statement');
    
    // Start cooling-off
    const coolingResult = loanLifecycle.startCoolingOff(currentLoan.id, borrower!.id);
    if (coolingResult.success && coolingResult.loan) {
      setCurrentLoan(coolingResult.loan);
      setStep('cooling');
    }
  };

  // Disburse after cooling-off
  const handleDisburse = async () => {
    if (!currentLoan || !borrower) return;
    setLoading(true);

    const result = loanLifecycle.disburse(currentLoan.id, borrower.id);
    
    if (result.success && result.loan) {
      setCurrentLoan(result.loan);
      setComplianceMessage('');
      
      // Simulate M-Pesa disbursement
      const mpesaResult = await mpesaSimulator.disburse(currentTenant, currentLoan.id, currentLoan.principal, borrower.phone);
      
      if (mpesaResult.success) {
        setStep('disbursed');
      } else {
        alert('Disbursement failed: ' + mpesaResult.error);
      }
    } else {
      setComplianceMessage(result.complianceMessage || result.error || 'Disbursement failed');
    }
    
    setLoading(false);
  };

  // Make repayment
  const handleRepay = async () => {
    if (!currentLoan || !borrower || paymentAmount <= 0) return;
    setLoading(true);

    const result = loanLifecycle.receivePayment(currentLoan.id, paymentAmount, borrower.id);
    
    if (result.success && result.loan) {
      setCurrentLoan(result.loan);
      setComplianceMessage('');
      
      // Simulate M-Pesa payment
      await mpesaSimulator.receivePayment(currentTenant, currentLoan.id, paymentAmount, '522533', currentLoan.id);
      
      if (result.loan.status === 'Repaid') {
        alert('Loan fully repaid! 🎉');
        setStep('browse');
      } else if (result.loan.status === 'In Duplum') {
        setComplianceMessage('In duplum limit reached. No further charges will be applied.');
      }
    } else {
      setComplianceMessage(result.complianceMessage || result.error || 'Payment failed');
    }
    
    setLoading(false);
    setPaymentAmount(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-bold text-gray-900">PesaFlash</span>
          </button>
          <div className="flex items-center gap-2 text-xs text-accent-600">
            <Shield size={14} />
            <span>CBK Licensed DCP</span>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4">
        {/* Progress Indicator */}
        {step !== 'welcome' && (
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>Step {getStepNumber(step)} of 8</span>
              <span>{getStepLabel(step)}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 rounded-full transition-all duration-500"
                style={{ width: `${(getStepNumber(step) / 8) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Welcome */}
        {step === 'welcome' && (
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign size={32} className="text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to PesaFlash</h1>
            <p className="text-gray-600 mb-6">Fast, fair, and compliant digital loans</p>
            <div className="space-y-3 text-left bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 size={16} className="text-accent-500" />
                <span>Loans from KES 1,000 to 50,000</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 size={16} className="text-accent-500" />
                <span>Disbursement in under 5 minutes</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 size={16} className="text-accent-500" />
                <span>Transparent pricing, no hidden fees</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 size={16} className="text-accent-500" />
                <span>24-hour cooling-off period</span>
              </div>
            </div>
            <button
              onClick={() => setStep('register')}
              className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
            >
              Get Started <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate('/app')}
              className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700"
            >
              ← Back to Platform Admin
            </button>
          </div>
        )}

        {/* Registration */}
        {step === 'register' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <User size={20} className="text-primary-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Register</h2>
                <p className="text-sm text-gray-500">Enter your details to get started</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+254 7XX XXX XXX"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">National ID Number</label>
                <input
                  type="text"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="12345678"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleRegister}
                className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
              >
                Continue <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* KYC */}
        {step === 'kyc' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={32} className="text-primary-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Identity Verification</h2>
            <p className="text-sm text-gray-600 mb-6">We'll verify your identity using Smile Identity</p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <p className="text-xs text-gray-500 mb-2">Verification includes:</p>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• ID document validation</li>
                <li>• Selfie match</li>
                <li>• Liveness detection</li>
              </ul>
            </div>
            <button
              onClick={handleKYC}
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Start Verification'}
            </button>
          </div>
        )}

        {/* Consent */}
        {step === 'consent' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
                <Shield size={20} className="text-accent-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Data Consent</h2>
                <p className="text-sm text-gray-500">Required under Data Protection Act 2019</p>
              </div>
            </div>
            <div className="space-y-4 mb-6">
              <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={consentGiven.creditCheck}
                  onChange={(e) => setConsentGiven({ ...consentGiven, creditCheck: e.target.checked })}
                  className="mt-1"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Credit Check Consent</p>
                  <p className="text-xs text-gray-500">I consent to PesaFlash checking my credit history with CRBs</p>
                </div>
              </label>
              <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={consentGiven.crbReporting}
                  onChange={(e) => setConsentGiven({ ...consentGiven, crbReporting: e.target.checked })}
                  className="mt-1"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">CRB Reporting Consent</p>
                  <p className="text-xs text-gray-500">I consent to PesaFlash reporting my loan performance to CRBs</p>
                </div>
              </label>
            </div>
            <button
              onClick={handleConsent}
              className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
            >
              Accept & Continue
            </button>
          </div>
        )}

        {/* Browse Products */}
        {step === 'browse' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Available Products</h2>
              <div className="space-y-3">
                {products.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      setSelectedProduct(product);
                      setLoanAmount(product.config.minAmount);
                      setStep('apply');
                    }}
                    className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-primary-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{product.name}</h3>
                      <span className="text-xs bg-accent-50 text-accent-700 px-2 py-0.5 rounded-full">APR {product.config.apr}%</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      KES {product.config.minAmount.toLocaleString()} - {product.config.maxAmount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Tenure: {product.config.tenureDays} days</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Existing Loans */}
            {borrower && dataLayer.getLoans(currentTenant).filter(l => l.borrowerId === borrower.id && l.status !== 'Repaid').length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Your Active Loans</h3>
                {dataLayer.getLoans(currentTenant)
                  .filter(l => l.borrowerId === borrower.id && !['Repaid', 'Application'].includes(l.status))
                  .map((loan) => (
                    <div key={loan.id} className="p-3 border border-gray-200 rounded-lg mb-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">{dataLayer.getProduct(loan.productId)?.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          loan.status === 'Active' ? 'bg-accent-50 text-accent-700' :
                          loan.status === 'Overdue' ? 'bg-danger-50 text-danger-700' :
                          loan.status === 'In Duplum' ? 'bg-purple-50 text-purple-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>{loan.status}</span>
                      </div>
                      <p className="text-xs text-gray-500">Remaining: KES {loan.remaining.toLocaleString()}</p>
                      {['Active', 'Overdue', 'In Duplum'].includes(loan.status) && (
                        <button
                          onClick={() => {
                            setCurrentLoan(loan);
                            setPaymentAmount(Math.min(loan.remaining, 5000));
                            setStep('repay');
                          }}
                          className="mt-2 text-xs text-primary-600 font-medium hover:text-primary-700"
                        >
                          Make Payment →
                        </button>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Apply */}
        {step === 'apply' && selectedProduct && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <button onClick={() => setStep('browse')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
              <ArrowLeft size={14} /> Back
            </button>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Apply for {selectedProduct.name}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Loan Amount</label>
                <input
                  type="range"
                  min={selectedProduct.config.minAmount}
                  max={selectedProduct.config.maxAmount}
                  step={1000}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>KES {selectedProduct.config.minAmount.toLocaleString()}</span>
                  <span className="font-bold text-primary-600">KES {loanAmount.toLocaleString()}</span>
                  <span>KES {selectedProduct.config.maxAmount.toLocaleString()}</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Principal</span>
                  <span className="font-medium">KES {loanAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Interest ({selectedProduct.config.apr}% APR)</span>
                  <span className="font-medium">KES {Math.round(loanAmount * selectedProduct.config.apr / 100 * selectedProduct.config.tenureDays / 365).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-gray-200">
                  <span>Total Repayment</span>
                  <span>KES {Math.round(loanAmount * (1 + selectedProduct.config.apr / 100 * selectedProduct.config.tenureDays / 365)).toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={handleApply}
                className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
              >
                Continue to Key Facts Statement
              </button>
            </div>
          </div>
        )}

        {/* KFS */}
        {step === 'kfs' && currentLoan && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
                <FileText size={20} className="text-warning-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Key Facts Statement</h2>
                <p className="text-sm text-gray-500">Please read carefully before proceeding</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mb-4 max-h-64 overflow-y-auto scrollbar-thin text-sm space-y-2">
              <p><strong>Loan Amount:</strong> KES {currentLoan.principal.toLocaleString()}</p>
              <p><strong>Interest:</strong> KES {currentLoan.interest.toLocaleString()}</p>
              <p><strong>Total Repayment:</strong> KES {currentLoan.totalDue.toLocaleString()}</p>
              <p><strong>APR:</strong> {selectedProduct?.config.apr}%</p>
              <p><strong>Tenure:</strong> {selectedProduct?.config.tenureDays} days</p>
              <p><strong>Due Date:</strong> {currentLoan.dueDate}</p>
              <p className="pt-2 border-t border-gray-200"><strong>In Duplum Rule:</strong> Total amount payable will never exceed 2× the principal (KES {(currentLoan.principal * 2).toLocaleString()})</p>
              <p><strong>Late Payment:</strong> Penalties may apply but will stop at in duplum limit</p>
              <p><strong>Cooling-Off:</strong> You have 24 hours to cancel without penalty after acceptance</p>
              <p><strong>Data Protection:</strong> Your data will be processed per our Privacy Policy. You can withdraw consent at any time.</p>
            </div>
            <div className="bg-warning-50 border border-warning-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-warning-800">
                ⚠️ You must scroll through the entire KFS before proceeding. This is a regulatory requirement.
              </p>
            </div>
            <button
              onClick={handleKFS}
              className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
            >
              I have read and understood
            </button>
          </div>
        )}

        {/* Cooling-Off */}
        {step === 'cooling' && currentLoan && (
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock size={32} className="text-primary-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Cooling-Off Period</h2>
            <p className="text-sm text-gray-600 mb-4">
              You have 24 hours to reconsider. You can cancel without penalty.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700">
                Cooling-off ends: <strong>{new Date(currentLoan.coolingOffUntil!).toLocaleString()}</strong>
              </p>
            </div>
            <button
              onClick={handleDisburse}
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Proceed with Disbursement'}
            </button>
            {complianceMessage && (
              <div className="mt-4 bg-danger-50 border border-danger-200 rounded-lg p-3">
                <p className="text-sm text-danger-800">{complianceMessage}</p>
              </div>
            )}
          </div>
        )}

        {/* Disbursed */}
        {step === 'disbursed' && currentLoan && (
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-accent-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Loan Disbursed!</h2>
            <p className="text-sm text-gray-600 mb-4">
              KES {currentLoan.principal.toLocaleString()} has been sent to your M-Pesa
            </p>
            <div className="bg-accent-50 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-accent-800"><strong>Loan ID:</strong> {currentLoan.id}</p>
              <p className="text-sm text-accent-800"><strong>Amount:</strong> KES {currentLoan.principal.toLocaleString()}</p>
              <p className="text-sm text-accent-800"><strong>Due Date:</strong> {currentLoan.dueDate}</p>
              <p className="text-sm text-accent-800"><strong>Total Repayment:</strong> KES {currentLoan.totalDue.toLocaleString()}</p>
            </div>
            <button
              onClick={() => {
                setStep('repay');
                setPaymentAmount(Math.min(currentLoan.remaining, 5000));
              }}
              className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors mb-2"
            >
              Make Repayment
            </button>
            <button
              onClick={() => setStep('browse')}
              className="w-full text-sm text-gray-500 hover:text-gray-700"
            >
              Back to Dashboard
            </button>
          </div>
        )}

        {/* Repay */}
        {step === 'repay' && currentLoan && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <button onClick={() => setStep('browse')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
              <ArrowLeft size={14} /> Back
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
                <CreditCard size={20} className="text-accent-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Make Repayment</h2>
                <p className="text-sm text-gray-500">Via M-Pesa STK Push</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Remaining Balance</span>
                <span className="font-bold text-gray-900">KES {currentLoan.remaining.toLocaleString()}</span>
              </div>
              {currentLoan.inDuplumReached && (
                <p className="text-xs text-purple-600 mt-1">⚠️ In duplum limit reached — no further charges</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Amount</label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                min={100}
                max={currentLoan.remaining}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <div className="flex gap-2 mt-2">
                {[1000, 5000, 10000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setPaymentAmount(Math.min(amt, currentLoan.remaining))}
                    className="flex-1 text-xs py-1 border border-gray-200 rounded hover:bg-gray-50"
                  >
                    KES {amt.toLocaleString()}
                  </button>
                ))}
                <button
                  onClick={() => setPaymentAmount(currentLoan.remaining)}
                  className="flex-1 text-xs py-1 border border-primary-200 text-primary-600 rounded hover:bg-primary-50"
                >
                  Full
                </button>
              </div>
            </div>
            <button
              onClick={handleRepay}
              disabled={loading || paymentAmount <= 0}
              className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Pay via M-Pesa'}
            </button>
            {complianceMessage && (
              <div className="mt-4 bg-warning-50 border border-warning-200 rounded-lg p-3">
                <p className="text-sm text-warning-800">{complianceMessage}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function getStepNumber(step: JourneyStep): number {
  const steps: JourneyStep[] = ['welcome', 'register', 'kyc', 'consent', 'browse', 'apply', 'kfs', 'cooling', 'disbursed', 'repay'];
  return steps.indexOf(step) + 1;
}

function getStepLabel(step: JourneyStep): string {
  const labels: Record<JourneyStep, string> = {
    welcome: 'Welcome',
    register: 'Registration',
    kyc: 'KYC Verification',
    consent: 'Data Consent',
    browse: 'Browse Products',
    apply: 'Loan Application',
    kfs: 'Key Facts Statement',
    cooling: 'Cooling-Off Period',
    disbursed: 'Loan Disbursed',
    repay: 'Repayment',
  };
  return labels[step];
}
