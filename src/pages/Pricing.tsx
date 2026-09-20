import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowLeft } from 'lucide-react';

const tiers = [
  {
    name: 'Free',
    price: 'KES 0',
    period: '/month',
    description: 'For testing, demos, and learning',
    features: [
      'Max 50 active loans',
      '1 loan product',
      'Platform branding',
      'Sandbox M-Pesa only',
      'No API access',
      'Community support',
    ],
    cta: 'Start Free',
    highlighted: false,
  },
  {
    name: 'Starter',
    price: 'KES 9,500',
    period: '/month',
    description: 'For early-stage lenders going live',
    features: [
      'Up to 500 active loans',
      '3 loan products',
      'Custom branding',
      'Live M-Pesa (C2B + B2C)',
      'KES 15/disbursement fee',
      'KES 10/repayment fee',
      'KES 0.50/SMS fee',
      'Email support (48h SLA)',
    ],
    cta: 'Start Starter',
    highlighted: false,
  },
  {
    name: 'Growth',
    price: 'KES 35,000',
    period: '/month',
    description: 'For scaling lenders with full API access',
    features: [
      'Up to 5,000 active loans',
      'Unlimited products',
      'Full white-label (custom domain, PWA)',
      'STK Push enabled',
      'KES 12/disbursement fee',
      'KES 8/repayment fee',
      'KES 0.40/SMS fee',
      'Full REST API + webhooks',
      'Priority support (24h SLA)',
      'Volume discounts available',
    ],
    cta: 'Start Growth',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'KES 150,000+',
    period: '/month',
    description: 'For large lenders with custom needs',
    features: [
      'Unlimited loans',
      'Multiple tenants',
      'Custom mobile apps',
      'Dedicated account manager',
      '4-hour SLA, 24/7 support',
      'Custom implementation (KES 500K-2M)',
      'Dedicated infrastructure',
      'Custom integrations',
      'SLA guarantees',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

export default function Pricing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">L</span>
            </div>
            <span className="font-bold text-xl text-gray-900">LendingOS</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={16} /> Back to Home
          </button>
        </div>
      </nav>

      {/* Pricing Content */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              B2B SaaS + Usage Fees. Start free, scale as you grow. No hidden costs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl p-6 border ${
                  tier.highlighted
                    ? 'border-primary-300 bg-primary-50/50 shadow-lg shadow-primary-100'
                    : 'border-gray-200 bg-white'
                }`}
              >
                {tier.highlighted && (
                  <div className="text-xs font-semibold text-primary-700 bg-primary-100 px-2 py-1 rounded-full inline-block mb-3">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900">{tier.name}</h3>
                <div className="mt-2 mb-1">
                  <span className="text-3xl font-bold text-gray-900">{tier.price}</span>
                  <span className="text-gray-500 text-sm">{tier.period}</span>
                </div>
                <p className="text-sm text-gray-600 mb-6">{tier.description}</p>
                <button
                  onClick={() => navigate('/app')}
                  className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors mb-6 ${
                    tier.highlighted
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tier.cta}
                </button>
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-accent-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Revenue Model */}
          <div className="mt-16 bg-gray-50 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Revenue Model</h3>
            <div className="grid sm:grid-cols-4 gap-4">
              {[
                { label: 'Subscriptions', pct: '50%', color: 'bg-primary-500' },
                { label: 'Usage Fees', pct: '30%', color: 'bg-accent-500' },
                { label: 'Professional Services', pct: '15%', color: 'bg-warning-500' },
                { label: 'Premium Modules', pct: '5%', color: 'bg-purple-500' },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{item.pct}</div>
                  <div className={`w-full h-2 rounded-full ${item.color} opacity-20 mt-2`}>
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: item.pct }}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
