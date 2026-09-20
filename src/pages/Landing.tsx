import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield, Zap, Building2, Globe, CheckCircle2, ArrowRight,
  Smartphone, BarChart3, Users, Lock, Clock, Award, Package, PhoneCall
} from 'lucide-react';

const features = [
  { icon: Shield, title: 'Compliance-by-Design', desc: 'Hard-coded conduct controls, in duplum enforcement, KFS auto-generation, and cooling-off periods built into every transaction.' },
  { icon: Zap, title: 'M-Pesa Native', desc: 'Direct Daraja API integration — C2B, B2C, STK Push. No aggregator middlemen. Sub-5-minute disbursements.' },
  { icon: Building2, title: 'Multi-Tenant', desc: 'Row-level security, tenant isolation, custom branding per lender. Each tenant gets their own branded experience.' },
  { icon: Globe, title: '30-Day Go-Live', desc: 'From contract to production in 30 days. Pre-built templates, guided onboarding, and dedicated implementation support.' },
  { icon: Lock, title: 'Audit-Ready', desc: 'Tamper-evident audit logs, 7-year retention, hash-chained entries. Every action captured for regulatory review.' },
  { icon: Smartphone, title: 'Mobile-First', desc: 'Progressive Web Apps for borrowers. Works on any device, any network. Optimized for 3G connections.' },
];

const stats = [
  { value: '50+', label: 'Licensed DCPs Target' },
  { value: '15K+', label: 'SACCOs Needing Digitization' },
  { value: '30', label: 'Days to Go-Live' },
  { value: '99.9%', label: 'Platform Uptime SLA' },
];

const complianceBlocks = [
  'CL-005: No contact list access',
  'CL-006: No third-party messaging',
  'CL-007: No social media shaming',
  'CL-008: Pre-approved templates only',
  'CL-009: All communications logged',
  'LS-005: In duplum hard-cap (2× principal)',
  'KFS-001: Auto Key Facts Statement',
  'COP-001: 24h cooling-off enforced',
  'CON-001: Granular consent management',
  'SUI-001: Affordability verification',
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">L</span>
            </div>
            <span className="font-bold text-xl text-gray-900">LendingOS</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-600 hover:text-gray-900">Features</a>
            <a href="#compliance" className="text-sm text-gray-600 hover:text-gray-900">Compliance</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/pricing'); }} className="text-sm text-gray-600 hover:text-gray-900">Pricing</a>
          </div>
          <button
            onClick={() => navigate('/app')}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            Launch Dashboard
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse-gentle"></span>
                Now serving licensed DCPs in Kenya
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Launch a compliant digital lending business in{' '}
                <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">30 days</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                White-label infrastructure for licensed Digital Credit Providers. Compliance-by-design, M-Pesa native, multi-tenant. We don't lend — we power those who do.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => navigate('/app')}
                  className="w-full sm:w-auto bg-primary-600 text-white px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary-600/25"
                >
                  Explore Platform <ArrowRight size={18} />
                </button>
                <button
                  onClick={() => navigate('/pricing')}
                  className="w-full sm:w-auto border border-gray-200 text-gray-700 px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-gray-50 transition-colors"
                >
                  View Pricing
                </button>
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need to launch</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From product configuration to collections, compliance to reporting — a complete lending operating system.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="bg-white rounded-xl p-6 border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all"
              >
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon size={20} className="text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section id="compliance" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-accent-50 text-accent-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                <Shield size={14} /> Compliance-by-Design
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Regulatory compliance isn't optional — it's hard-coded
              </h2>
              <p className="text-gray-600 mb-6">
                Every DLAK Code of Conduct requirement, every CBK regulation, every ODPC data protection mandate is enforced at the platform level. No tenant can bypass these controls.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {complianceBlocks.map((block) => (
                  <div key={block} className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-accent-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{block}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-danger-500"></div>
                <div className="w-3 h-3 rounded-full bg-warning-500"></div>
                <div className="w-3 h-3 rounded-full bg-accent-500"></div>
                <span className="ml-2 text-xs text-gray-400">compliance-engine.ts</span>
              </div>
              <pre className="text-xs sm:text-sm font-mono leading-relaxed overflow-x-auto">
                <code>{`// In Duplum Rule Enforcement
if (totalRecovered >= principal * 2) {
  loan.status = 'IN_DUPLUM_REACHED';
  waiveAllFurtherCharges(loan);
  notifyBorrower(loan, 'maximum_payable');
  auditLog({
    event: 'IN_DUPLUM_TRIGGERED',
    timestamp: new Date(),
    principal: loan.principal,
    totalRecovered,
    hash: chain.getLastHash()
  });
  return HARD_BLOCK;
}

// Collections Conduct Check
const contacts = getContactCount(borrower, today);
if (contacts >= 3) {
  return HARD_BLOCK; // CL-003
}
if (!isPermittedHours()) {
  return HARD_BLOCK; // DLAK hours
}`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">10 Core Modules</h2>
            <p className="text-lg text-gray-600">A complete lending operating system</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { icon: Building2, label: 'Tenant Mgmt' },
              { icon: Package, label: 'Product Builder' },
              { icon: Users, label: 'Borrower Onboarding' },
              { icon: BarChart3, label: 'Decision Engine' },
              { icon: Clock, label: 'Loan Servicing' },
              { icon: Smartphone, label: 'Repayments' },
              { icon: PhoneCall, label: 'Collections' },
              { icon: Award, label: 'Reporting' },
              { icon: Shield, label: 'Compliance' },
              { icon: Zap, label: 'Integrations' },
            ].map((mod) => (
              <div key={mod.label} className="bg-white rounded-xl p-4 text-center border border-gray-100 hover:border-primary-200 transition-colors">
                <mod.icon size={24} className="text-primary-600 mx-auto mb-2" />
                <p className="text-xs font-medium text-gray-700">{mod.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to launch your lending business?</h2>
          <p className="text-primary-100 mb-8 max-w-xl mx-auto">
            Join 25+ design partners already building on LendingOS. Start with our free tier — no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/app')}
              className="w-full sm:w-auto bg-white text-primary-700 px-8 py-3.5 rounded-xl font-semibold hover:bg-primary-50 transition-colors"
            >
              Launch Dashboard
            </button>
            <button
              onClick={() => navigate('/pricing')}
              className="w-full sm:w-auto border border-white/30 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-colors"
            >
              See Pricing
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">L</span>
            </div>
            <span className="font-semibold text-gray-900">LendingOS</span>
          </div>
          <p className="text-sm text-gray-500">© 2026 LendingOS. Compliance-first lending infrastructure for East Africa.</p>
        </div>
      </footer>
    </div>
  );
}
