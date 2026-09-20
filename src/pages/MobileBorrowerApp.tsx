import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dataLayer, Borrower, Loan, LoanProduct } from '../services/dataLayer';
import { loanLifecycle } from '../services/loanLifecycle';
import { complianceEngine } from '../services/complianceEngine';
import { mpesaSimulator } from '../services/mpesaSimulator';
import {
  Home, FileText, CreditCard, User, ArrowRight, ArrowLeft, CheckCircle2,
  Clock, AlertCircle, Shield, DollarSign, Phone, Lock, Bell, Settings,
  ChevronRight, X, Menu, LogOut, TrendingUp, Calendar, Info
} from 'lucide-react';

type Screen = 'splash' | 'welcome' | 'login' | 'register' | 'kyc' | 'consent' | 'home' | 'products' | 'apply' | 'kfs' | 'cooling' | 'loan-detail' | 'payments' | 'payment-history' | 'profile' | 'settings';

export default function MobileBorrowerApp() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<Screen>('splash');
  const [currentTenant] = useState('tenant_001');
  const [borrower, setBorrower] = useState<Borrower | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<LoanProduct | null>(null);
  const [loanAmount, setLoanAmount] = useState(10000);
  const [currentLoan, setCurrentLoan] = useState<Loan | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [consentGiven, setConsentGiven] = useState({ creditCheck: false, crbReporting: false });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'loans' | 'payments' | 'profile'>('home');
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [products, setProducts] = useState<LoanProduct[]>([]);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    // Splash screen
    const timer = setTimeout(() => {
      const storedBorrower = localStorage.getItem('lendingos_current_borrower');
      if (storedBorrower) {
        const b = JSON.parse(storedBorrower);
        setBorrower(b);
        setScreen('home');
      } else {
        setScreen('welcome');
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setProducts(dataLayer.getProducts(currentTenant).filter(p => p.status === 'Active'));
  }, [currentTenant]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const saveBorrowerToStorage = (b: Borrower) => {
    localStorage.setItem('lendingos_current_borrower', JSON.stringify(b));
    setBorrower(b);
  };

  // Registration
  const handleRegister = () => {
    if (!phoneNumber || !name || !idNumber) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    const existingBorrower = dataLayer.getBorrowerByPhone(phoneNumber, currentTenant);
    if (existingBorrower) {
      saveBorrowerToStorage(existingBorrower);
      setScreen('home');
      showToast('Welcome back!', 'success');
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
    saveBorrowerToStorage(newBorrower);
    setScreen('kyc');
  };

  // KYC
  const handleKYC = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (borrower) {
      borrower.kycVerified = true;
      borrower.kycMethod = 'smile_identity';
      borrower.creditScore = 650 + Math.floor(Math.random() * 100);
      borrower.status = 'Active';
      dataLayer.saveBorrower(borrower);
      saveBorrowerToStorage(borrower);
      dataLayer.addAuditLog(currentTenant, 'system', 'KYC_VERIFIED', 'Borrower', borrower.id, `KYC verified. Score: ${borrower.creditScore}`);
    }
    setLoading(false);
    setScreen('consent');
  };

  // Consent
  const handleConsent = () => {
    if (!consentGiven.creditCheck || !consentGiven.crbReporting) {
      showToast('You must provide all required consents', 'error');
      return;
    }

    if (borrower) {
      borrower.consent.creditCheck = true;
      borrower.consent.crbReporting = true;
      borrower.consent.timestamp = new Date().toISOString();
      dataLayer.saveBorrower(borrower);
      saveBorrowerToStorage(borrower);
      dataLayer.addAuditLog(currentTenant, borrower.id, 'CONSENT_GRANTED', 'Borrower', borrower.id, 'Consent granted');
    }
    setScreen('home');
    showToast('Registration complete!', 'success');
  };

  // Apply
  const handleApply = () => {
    if (!borrower || !selectedProduct) return;

    const result = loanLifecycle.apply(currentTenant, borrower.id, selectedProduct.id, loanAmount, borrower.id);
    
    if (result.success && result.loan) {
      setCurrentLoan(result.loan);
      setScreen('kfs');
    } else {
      showToast(result.error || 'Application failed', 'error');
    }
  };

  // KFS
  const handleKFS = () => {
    if (!currentLoan) return;

    currentLoan.kfsGenerated = true;
    dataLayer.saveLoan(currentLoan);
    dataLayer.addAuditLog(currentTenant, borrower!.id, 'KFS_ACCEPTED', 'Loan', currentLoan.id, 'KFS accepted');
    
    const coolingResult = loanLifecycle.startCoolingOff(currentLoan.id, borrower!.id);
    if (coolingResult.success && coolingResult.loan) {
      setCurrentLoan(coolingResult.loan);
      setScreen('cooling');
    }
  };

  // Disburse
  const handleDisburse = async () => {
    if (!currentLoan || !borrower) return;
    setLoading(true);

    const result = loanLifecycle.disburse(currentLoan.id, borrower.id);
    
    if (result.success && result.loan) {
      setCurrentLoan(result.loan);
      const mpesaResult = await mpesaSimulator.disburse(currentTenant, currentLoan.id, currentLoan.principal, borrower.phone);
      
      if (mpesaResult.success) {
        setScreen('loan-detail');
        showToast('Loan disbursed successfully!', 'success');
      } else {
        showToast('Disbursement failed: ' + mpesaResult.error, 'error');
      }
    } else {
      showToast(result.complianceMessage || 'Disbursement failed', 'error');
    }
    
    setLoading(false);
  };

  // Repay
  const handleRepay = async () => {
    if (!currentLoan || !borrower || paymentAmount <= 0) return;
    setLoading(true);

    const result = loanLifecycle.receivePayment(currentLoan.id, paymentAmount, borrower.id);
    
    if (result.success && result.loan) {
      setCurrentLoan(result.loan);
      await mpesaSimulator.receivePayment(currentTenant, currentLoan.id, paymentAmount, '522533', currentLoan.id);
      
      if (result.loan.status === 'Repaid') {
        showToast('Loan fully repaid! 🎉', 'success');
        setScreen('home');
      } else if (result.loan.status === 'In Duplum') {
        showToast('In duplum limit reached', 'info');
      } else {
        showToast('Payment successful!', 'success');
      }
    } else {
      showToast(result.complianceMessage || 'Payment failed', 'error');
    }
    
    setLoading(false);
    setPaymentAmount(0);
  };

  const logout = () => {
    localStorage.removeItem('lendingos_current_borrower');
    setBorrower(null);
    setScreen('welcome');
    showToast('Logged out successfully', 'info');
  };

  // Splash Screen
  if (screen === 'splash') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <span className="text-4xl font-bold text-primary-600">P</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">PesaFlash</h1>
          <p className="text-primary-100 text-sm">Fast, fair, compliant loans</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto relative overflow-hidden">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 left-4 right-4 z-50 p-4 rounded-xl shadow-lg animate-slide-down ${
          toast.type === 'success' ? 'bg-accent-500' :
          toast.type === 'error' ? 'bg-danger-500' :
          'bg-primary-500'
        } text-white`}>
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
      )}

      {/* Header */}
      {['home', 'loans', 'payments', 'profile', 'loan-detail', 'payment-history'].includes(screen) && (
        <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <div>
                <h1 className="font-bold text-gray-900">PesaFlash</h1>
                <p className="text-xs text-gray-500">Welcome, {borrower?.name?.split(' ')[0]}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="relative p-2 text-gray-500 hover:text-gray-700">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full"></span>
              </button>
              <button onClick={() => setShowMenu(!showMenu)} className="p-2 text-gray-500 hover:text-gray-700">
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Menu Overlay */}
      {showMenu && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setShowMenu(false)}>
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-white shadow-xl p-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900">Menu</h3>
              <button onClick={() => setShowMenu(false)} className="text-gray-400">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-2">
              <button onClick={() => { setScreen('profile'); setShowMenu(false); }} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-left">
                <User size={18} className="text-gray-600" />
                <span className="text-sm text-gray-700">Profile</span>
              </button>
              <button onClick={() => { setScreen('settings'); setShowMenu(false); }} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-left">
                <Settings size={18} className="text-gray-600" />
                <span className="text-sm text-gray-700">Settings</span>
              </button>
              <button onClick={() => { navigate('/'); setShowMenu(false); }} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-left">
                <ArrowLeft size={18} className="text-gray-600" />
                <span className="text-sm text-gray-700">Exit App</span>
              </button>
              <hr className="my-2" />
              <button onClick={() => { logout(); setShowMenu(false); }} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-danger-50 text-left">
                <LogOut size={18} className="text-danger-600" />
                <span className="text-sm text-danger-600">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="pb-20">
        {/* Welcome */}
        {screen === 'welcome' && (
          <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 p-6 flex flex-col justify-center">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <span className="text-5xl font-bold text-primary-600">P</span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-3">Welcome to PesaFlash</h1>
              <p className="text-primary-100">Fast, fair, and compliant digital loans</p>
            </div>
            <div className="space-y-3 bg-white/10 backdrop-blur rounded-2xl p-5 mb-6">
              {[
                'Loans from KES 1,000 to 50,000',
                'Disbursement in under 5 minutes',
                'Transparent pricing, no hidden fees',
                '24-hour cooling-off period',
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-white">
                  <CheckCircle2 size={18} className="text-accent-300 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setScreen('login')}
              className="w-full bg-white text-primary-700 py-4 rounded-2xl font-bold text-lg shadow-lg"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full mt-3 text-primary-100 text-sm"
            >
              ← Back to Platform
            </button>
          </div>
        )}

        {/* Login */}
        {screen === 'login' && (
          <div className="p-6">
            <button onClick={() => setScreen('welcome')} className="flex items-center gap-2 text-gray-500 mb-6">
              <ArrowLeft size={20} /> Back
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In</h2>
            <p className="text-gray-600 mb-6">Enter your phone number to continue</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3">
                  <Phone size={18} className="text-gray-400" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+254 7XX XXX XXX"
                    className="flex-1 outline-none text-gray-900"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  const existing = dataLayer.getBorrowerByPhone(phoneNumber, currentTenant);
                  if (existing) {
                    saveBorrowerToStorage(existing);
                    setScreen('home');
                    showToast('Welcome back!', 'success');
                  } else {
                    setScreen('register');
                  }
                }}
                className="w-full bg-primary-600 text-white py-4 rounded-2xl font-bold"
              >
                Continue
              </button>
              <p className="text-center text-sm text-gray-500">
                New user? <button onClick={() => setScreen('register')} className="text-primary-600 font-medium">Register</button>
              </p>
            </div>
          </div>
        )}

        {/* Register */}
        {screen === 'register' && (
          <div className="p-6">
            <button onClick={() => setScreen('login')} className="flex items-center gap-2 text-gray-500 mb-6">
              <ArrowLeft size={20} /> Back
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-600 mb-6">Fill in your details to get started</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+254 7XX XXX XXX"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">National ID</label>
                <input
                  type="text"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="12345678"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <button
                onClick={handleRegister}
                className="w-full bg-primary-600 text-white py-4 rounded-2xl font-bold"
              >
                Create Account
              </button>
            </div>
          </div>
        )}

        {/* KYC */}
        {screen === 'kyc' && (
          <div className="p-6 min-h-screen flex flex-col justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock size={40} className="text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Verify Your Identity</h2>
              <p className="text-gray-600 mb-8">We'll verify your identity using Smile Identity</p>
              <div className="bg-white rounded-2xl p-5 mb-6 text-left border border-gray-200">
                <p className="text-xs text-gray-500 mb-3 font-medium">VERIFICATION INCLUDES:</p>
                <div className="space-y-2">
                  {['ID document validation', 'Selfie match', 'Liveness detection'].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 size={16} className="text-accent-500" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={handleKYC}
                disabled={loading}
                className="w-full bg-primary-600 text-white py-4 rounded-2xl font-bold disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Start Verification'}
              </button>
            </div>
          </div>
        )}

        {/* Consent */}
        {screen === 'consent' && (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Data Consent</h2>
            <p className="text-gray-600 mb-6">Required under Data Protection Act 2019</p>
            <div className="space-y-3 mb-6">
              <label className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-xl">
                <input
                  type="checkbox"
                  checked={consentGiven.creditCheck}
                  onChange={(e) => setConsentGiven({ ...consentGiven, creditCheck: e.target.checked })}
                  className="mt-1 w-5 h-5"
                />
                <div>
                  <p className="font-medium text-gray-900">Credit Check</p>
                  <p className="text-xs text-gray-500 mt-1">I consent to checking my credit history with CRBs</p>
                </div>
              </label>
              <label className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-xl">
                <input
                  type="checkbox"
                  checked={consentGiven.crbReporting}
                  onChange={(e) => setConsentGiven({ ...consentGiven, crbReporting: e.target.checked })}
                  className="mt-1 w-5 h-5"
                />
                <div>
                  <p className="font-medium text-gray-900">CRB Reporting</p>
                  <p className="text-xs text-gray-500 mt-1">I consent to reporting my loan performance to CRBs</p>
                </div>
              </label>
            </div>
            <button
              onClick={handleConsent}
              className="w-full bg-primary-600 text-white py-4 rounded-2xl font-bold"
            >
              Accept & Continue
            </button>
          </div>
        )}

        {/* Home */}
        {screen === 'home' && borrower && (
          <div className="p-4 space-y-4">
            {/* Balance Card */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-5 text-white">
              <p className="text-primary-100 text-sm mb-1">Available Credit</p>
              <p className="text-3xl font-bold mb-4">KES 25,000</p>
              <button
                onClick={() => setScreen('products')}
                className="bg-white text-primary-700 px-6 py-2.5 rounded-xl font-semibold text-sm"
              >
                Apply for Loan
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <FileText size={18} className="text-primary-600" />
                  <span className="text-xs text-gray-500">Active Loans</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {dataLayer.getLoans(currentTenant).filter(l => l.borrowerId === borrower.id && ['Active', 'Overdue', 'In Duplum'].includes(l.status)).length}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign size={18} className="text-accent-600" />
                  <span className="text-xs text-gray-500">Total Repaid</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  KES {dataLayer.getLoans(currentTenant).filter(l => l.borrowerId === borrower.id && l.status === 'Repaid').reduce((sum, l) => sum + l.paid, 0).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Active Loans */}
            {dataLayer.getLoans(currentTenant).filter(l => l.borrowerId === borrower.id && ['Active', 'Overdue', 'In Duplum', 'Cooling-Off'].includes(l.status)).length > 0 && (
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-3">Active Loans</h3>
                <div className="space-y-3">
                  {dataLayer.getLoans(currentTenant)
                    .filter(l => l.borrowerId === borrower.id && ['Active', 'Overdue', 'In Duplum', 'Cooling-Off'].includes(l.status))
                    .map((loan) => (
                      <div
                        key={loan.id}
                        onClick={() => { setCurrentLoan(loan); setScreen('loan-detail'); }}
                        className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-primary-300"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">{dataLayer.getProduct(loan.productId)?.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            loan.status === 'Active' ? 'bg-accent-50 text-accent-700' :
                            loan.status === 'Overdue' ? 'bg-danger-50 text-danger-700' :
                            loan.status === 'In Duplum' ? 'bg-purple-50 text-purple-700' :
                            'bg-primary-50 text-primary-700'
                          }`}>{loan.status}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Remaining: KES {loan.remaining.toLocaleString()}</span>
                          <ChevronRight size={14} />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3">Recent Activity</h3>
              <div className="space-y-3">
                {dataLayer.getTransactions(currentTenant)
                  .filter(t => dataLayer.getLoan(t.loanId)?.borrowerId === borrower.id)
                  .slice(-3)
                  .reverse()
                  .map((txn) => (
                    <div key={txn.id} className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        txn.type === 'B2C' ? 'bg-accent-50' : 'bg-primary-50'
                      }`}>
                        {txn.type === 'B2C' ? (
                          <TrendingUp size={18} className="text-accent-600" />
                        ) : (
                          <CreditCard size={18} className="text-primary-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {txn.type === 'B2C' ? 'Loan Disbursed' : 'Payment Received'}
                        </p>
                        <p className="text-xs text-gray-500">{new Date(txn.createdAt).toLocaleDateString()}</p>
                      </div>
                      <p className={`text-sm font-semibold ${txn.type === 'B2C' ? 'text-accent-600' : 'text-primary-600'}`}>
                        {txn.type === 'B2C' ? '+' : '-'}KES {txn.amount.toLocaleString()}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Products */}
        {screen === 'products' && (
          <div className="p-4">
            <button onClick={() => setScreen('home')} className="flex items-center gap-2 text-gray-500 mb-4">
              <ArrowLeft size={20} /> Back
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Products</h2>
            <div className="space-y-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    setSelectedProduct(product);
                    setLoanAmount(product.config.minAmount);
                    setScreen('apply');
                  }}
                  className="bg-white p-4 rounded-xl border border-gray-200 cursor-pointer hover:border-primary-300"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <span className="text-xs bg-accent-50 text-accent-700 px-2 py-1 rounded-full">APR {product.config.apr}%</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    KES {product.config.minAmount.toLocaleString()} - {product.config.maxAmount.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">Tenure: {product.config.tenureDays} days</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Apply */}
        {screen === 'apply' && selectedProduct && (
          <div className="p-4">
            <button onClick={() => setScreen('products')} className="flex items-center gap-2 text-gray-500 mb-4">
              <ArrowLeft size={20} /> Back
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Apply for {selectedProduct.name}</h2>
            <div className="bg-white rounded-xl p-5 border border-gray-100 mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">Loan Amount</label>
              <input
                type="range"
                min={selectedProduct.config.minAmount}
                max={selectedProduct.config.maxAmount}
                step={1000}
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full mb-3"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>KES {selectedProduct.config.minAmount.toLocaleString()}</span>
                <span className="font-bold text-primary-600 text-lg">KES {loanAmount.toLocaleString()}</span>
                <span>KES {selectedProduct.config.maxAmount.toLocaleString()}</span>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-100 mb-4">
              <h3 className="font-semibold text-gray-900 mb-3">Loan Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Principal</span>
                  <span className="font-medium">KES {loanAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Interest ({selectedProduct.config.apr}% APR)</span>
                  <span className="font-medium">KES {Math.round(loanAmount * selectedProduct.config.apr / 100 * selectedProduct.config.tenureDays / 365).toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 font-bold">
                  <span>Total Repayment</span>
                  <span className="text-primary-600">KES {Math.round(loanAmount * (1 + selectedProduct.config.apr / 100 * selectedProduct.config.tenureDays / 365)).toLocaleString()}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleApply}
              className="w-full bg-primary-600 text-white py-4 rounded-2xl font-bold"
            >
              Continue to Key Facts Statement
            </button>
          </div>
        )}

        {/* KFS */}
        {screen === 'kfs' && currentLoan && (
          <div className="p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Key Facts Statement</h2>
            <p className="text-sm text-gray-600 mb-4">Please read carefully before proceeding</p>
            <div className="bg-white rounded-xl p-4 border border-gray-100 mb-4 max-h-96 overflow-y-auto">
              <div className="space-y-3 text-sm">
                <div><strong>Loan Amount:</strong> KES {currentLoan.principal.toLocaleString()}</div>
                <div><strong>Interest:</strong> KES {currentLoan.interest.toLocaleString()}</div>
                <div><strong>Total Repayment:</strong> KES {currentLoan.totalDue.toLocaleString()}</div>
                <div><strong>APR:</strong> {selectedProduct?.config.apr}%</div>
                <div><strong>Tenure:</strong> {selectedProduct?.config.tenureDays} days</div>
                <div><strong>Due Date:</strong> {currentLoan.dueDate}</div>
                <hr />
                <div><strong>In Duplum Rule:</strong> Total payable will never exceed 2× principal (KES {(currentLoan.principal * 2).toLocaleString()})</div>
                <div><strong>Cooling-Off:</strong> You have 24 hours to cancel without penalty</div>
                <div><strong>Data Protection:</strong> Your data will be processed per our Privacy Policy</div>
              </div>
            </div>
            <div className="bg-warning-50 border border-warning-200 rounded-xl p-3 mb-4">
              <p className="text-xs text-warning-800 flex items-start gap-2">
                <Info size={14} className="flex-shrink-0 mt-0.5" />
                <span>You must read the entire KFS before proceeding. This is a regulatory requirement.</span>
              </p>
            </div>
            <button
              onClick={handleKFS}
              className="w-full bg-primary-600 text-white py-4 rounded-2xl font-bold"
            >
              I have read and understood
            </button>
          </div>
        )}

        {/* Cooling-Off */}
        {screen === 'cooling' && currentLoan && (
          <div className="p-4 min-h-screen flex flex-col justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock size={40} className="text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Cooling-Off Period</h2>
              <p className="text-gray-600 mb-6">You have 24 hours to reconsider. You can cancel without penalty.</p>
              <div className="bg-white rounded-xl p-4 border border-gray-100 mb-6">
                <p className="text-sm text-gray-700">
                  Cooling-off ends:<br />
                  <strong>{new Date(currentLoan.coolingOffUntil!).toLocaleString()}</strong>
                </p>
              </div>
              <button
                onClick={handleDisburse}
                disabled={loading}
                className="w-full bg-primary-600 text-white py-4 rounded-2xl font-bold disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Proceed with Disbursement'}
              </button>
            </div>
          </div>
        )}

        {/* Loan Detail */}
        {screen === 'loan-detail' && currentLoan && (
          <div className="p-4">
            <button onClick={() => setScreen('home')} className="flex items-center gap-2 text-gray-500 mb-4">
              <ArrowLeft size={20} /> Back
            </button>
            <div className="bg-white rounded-xl p-5 border border-gray-100 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">{dataLayer.getProduct(currentLoan.productId)?.name}</h2>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  currentLoan.status === 'Active' ? 'bg-accent-50 text-accent-700' :
                  currentLoan.status === 'Overdue' ? 'bg-danger-50 text-danger-700' :
                  currentLoan.status === 'In Duplum' ? 'bg-purple-50 text-purple-700' :
                  'bg-gray-100 text-gray-600'
                }`}>{currentLoan.status}</span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Principal</span>
                  <span className="font-medium">KES {currentLoan.principal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Due</span>
                  <span className="font-medium">KES {currentLoan.totalDue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Paid</span>
                  <span className="font-medium text-accent-600">KES {currentLoan.paid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 font-bold">
                  <span>Remaining</span>
                  <span className="text-primary-600">KES {currentLoan.remaining.toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent-500 rounded-full"
                    style={{ width: `${(currentLoan.paid / currentLoan.totalDue) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1 text-center">
                  {Math.round((currentLoan.paid / currentLoan.totalDue) * 100)}% repaid
                </p>
              </div>
            </div>
            {['Active', 'Overdue', 'In Duplum'].includes(currentLoan.status) && (
              <button
                onClick={() => {
                  setPaymentAmount(Math.min(currentLoan.remaining, 5000));
                  setScreen('payments');
                }}
                className="w-full bg-primary-600 text-white py-4 rounded-2xl font-bold"
              >
                Make Payment
              </button>
            )}
          </div>
        )}

        {/* Payments */}
        {screen === 'payments' && currentLoan && (
          <div className="p-4">
            <button onClick={() => setScreen('loan-detail')} className="flex items-center gap-2 text-gray-500 mb-4">
              <ArrowLeft size={20} /> Back
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Make Payment</h2>
            <div className="bg-white rounded-xl p-5 border border-gray-100 mb-4">
              <p className="text-sm text-gray-600 mb-2">Remaining Balance</p>
              <p className="text-3xl font-bold text-gray-900 mb-3">KES {currentLoan.remaining.toLocaleString()}</p>
              {currentLoan.inDuplumReached && (
                <p className="text-xs text-purple-600">⚠️ In duplum limit reached</p>
              )}
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-100 mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">Payment Amount</label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                min={100}
                max={currentLoan.remaining}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-lg font-bold"
              />
              <div className="grid grid-cols-4 gap-2 mt-3">
                {[1000, 5000, 10000, currentLoan.remaining].map((amt, i) => (
                  <button
                    key={i}
                    onClick={() => setPaymentAmount(Math.min(amt, currentLoan.remaining))}
                    className="py-2 border border-gray-200 rounded-lg text-xs font-medium hover:bg-primary-50 hover:border-primary-300"
                  >
                    {i === 3 ? 'Full' : `KES ${amt.toLocaleString()}`}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={handleRepay}
              disabled={loading || paymentAmount <= 0}
              className="w-full bg-primary-600 text-white py-4 rounded-2xl font-bold disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Pay via M-Pesa'}
            </button>
          </div>
        )}

        {/* Profile */}
        {screen === 'profile' && borrower && (
          <div className="p-4">
            <div className="bg-white rounded-xl p-5 border border-gray-100 mb-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{borrower.name.charAt(0)}</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{borrower.name}</h2>
                  <p className="text-sm text-gray-500">{borrower.phone}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">National ID</span>
                  <span className="font-medium">{borrower.idNumber}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">KYC Status</span>
                  <span className={`font-medium ${borrower.kycVerified ? 'text-accent-600' : 'text-warning-600'}`}>
                    {borrower.kycVerified ? '✓ Verified' : 'Pending'}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Credit Score</span>
                  <span className="font-medium">{borrower.creditScore || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium">{new Date(borrower.registeredAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full bg-danger-50 text-danger-600 py-3 rounded-xl font-medium border border-danger-200"
            >
              Logout
            </button>
          </div>
        )}

        {/* Settings */}
        {screen === 'settings' && (
          <div className="p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
            <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
              {['Notifications', 'Privacy', 'Security', 'Help & Support', 'About'].map((item) => (
                <button key={item} className="w-full flex items-center justify-between p-4 hover:bg-gray-50">
                  <span className="text-sm text-gray-900">{item}</span>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      {['home', 'loans', 'payments', 'profile'].includes(screen) && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 max-w-md mx-auto">
          <div className="grid grid-cols-4 gap-1">
            {[
              { id: 'home', icon: Home, label: 'Home' },
              { id: 'loans', icon: FileText, label: 'Loans' },
              { id: 'payments', icon: CreditCard, label: 'Payments' },
              { id: 'profile', icon: User, label: 'Profile' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  if (tab.id === 'home') setScreen('home');
                  else if (tab.id === 'profile') setScreen('profile');
                  else if (tab.id === 'loans') setScreen('home'); // Show loans in home
                  else if (tab.id === 'payments') setScreen('home'); // Show payments in home
                }}
                className={`flex flex-col items-center gap-1 py-3 ${
                  activeTab === tab.id ? 'text-primary-600' : 'text-gray-500'
                }`}
              >
                <tab.icon size={20} />
                <span className="text-xs">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
