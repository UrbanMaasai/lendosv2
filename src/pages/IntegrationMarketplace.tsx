import { useState } from 'react';
import { Plug, CheckCircle2, Download, Star, ExternalLink, Search, Filter, Clock } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  category: 'payments' | 'credit' | 'kyc' | 'sms' | 'accounting' | 'crm' | 'analytics';
  description: string;
  provider: string;
  status: 'available' | 'installed' | 'coming_soon';
  rating: number;
  installs: number;
  pricing: string;
  features: string[];
  documentationUrl: string;
  icon: string;
}

export default function IntegrationMarketplace() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'int_001',
      name: 'M-Pesa Daraja API',
      category: 'payments',
      description: 'Direct integration with Safaricom M-Pesa for disbursements and collections',
      provider: 'Safaricom',
      status: 'installed',
      rating: 4.9,
      installs: 2847,
      pricing: 'Usage-based',
      features: ['C2B Collections', 'B2C Disbursements', 'STK Push', 'Real-time callbacks'],
      documentationUrl: 'https://developer.safaricom.co.ke',
      icon: '📱',
    },
    {
      id: 'int_002',
      name: 'Metropol CRB',
      category: 'credit',
      description: 'Credit reference bureau integration for credit checks and scoring',
      provider: 'Metropol',
      status: 'installed',
      rating: 4.7,
      installs: 1923,
      pricing: 'Per check',
      features: ['Credit Reports', 'Credit Scores', 'Negative Listing', 'Real-time API'],
      documentationUrl: 'https://www.metropol.co.ke',
      icon: '📊',
    },
    {
      id: 'int_003',
      name: 'TransUnion CRB',
      category: 'credit',
      description: 'Alternative CRB integration for cross-verification',
      provider: 'TransUnion',
      status: 'installed',
      rating: 4.6,
      installs: 1456,
      pricing: 'Per check',
      features: ['Credit Reports', 'Credit Scores', 'Fraud Detection', 'Identity Verification'],
      documentationUrl: 'https://www.transunion.co.ke',
      icon: '📈',
    },
    {
      id: 'int_004',
      name: 'Smile Identity',
      category: 'kyc',
      description: 'KYC verification with ID validation and liveness detection',
      provider: 'Smile Identity',
      status: 'installed',
      rating: 4.8,
      installs: 2134,
      pricing: 'Per verification',
      features: ['ID Verification', 'Selfie Match', 'Liveness Detection', 'Document OCR'],
      documentationUrl: 'https://www.smileidentity.com',
      icon: '🪪',
    },
    {
      id: 'int_005',
      name: "Africa's Talking SMS",
      category: 'sms',
      description: 'SMS gateway for notifications, OTPs, and collections reminders',
      provider: "Africa's Talking",
      status: 'installed',
      rating: 4.5,
      installs: 3456,
      pricing: 'Per SMS',
      features: ['Bulk SMS', 'Two-way SMS', 'USSD', 'Delivery Reports'],
      documentationUrl: 'https://africastalking.com',
      icon: '💬',
    },
    {
      id: 'int_006',
      name: 'QuickBooks Online',
      category: 'accounting',
      description: 'Accounting integration for financial reporting and reconciliation',
      provider: 'Intuit',
      status: 'available',
      rating: 4.4,
      installs: 892,
      pricing: 'Subscription',
      features: ['Journal Entries', 'Chart of Accounts', 'Financial Reports', 'Auto-reconciliation'],
      documentationUrl: 'https://developer.intuit.com',
      icon: '📒',
    },
    {
      id: 'int_007',
      name: 'Sage Accounting',
      category: 'accounting',
      description: 'Enterprise accounting integration for large lenders',
      provider: 'Sage',
      status: 'available',
      rating: 4.3,
      installs: 567,
      pricing: 'Subscription',
      features: ['General Ledger', 'Accounts Receivable', 'Financial Statements', 'Multi-currency'],
      documentationUrl: 'https://developer.sage.com',
      icon: '💼',
    },
    {
      id: 'int_008',
      name: 'Salesforce CRM',
      category: 'crm',
      description: 'Customer relationship management for borrower engagement',
      provider: 'Salesforce',
      status: 'available',
      rating: 4.6,
      installs: 1234,
      pricing: 'Subscription',
      features: ['Contact Management', 'Lead Tracking', 'Campaign Management', 'Analytics'],
      documentationUrl: 'https://developer.salesforce.com',
      icon: '☁️',
    },
    {
      id: 'int_009',
      name: 'HubSpot CRM',
      category: 'crm',
      description: 'Alternative CRM for marketing and sales automation',
      provider: 'HubSpot',
      status: 'coming_soon',
      rating: 4.5,
      installs: 0,
      pricing: 'Freemium',
      features: ['Email Marketing', 'Lead Scoring', 'Automation', 'Reporting'],
      documentationUrl: 'https://developers.hubspot.com',
      icon: '🎯',
    },
    {
      id: 'int_010',
      name: 'Google Analytics',
      category: 'analytics',
      description: 'Web analytics for tracking borrower journey and conversions',
      provider: 'Google',
      status: 'available',
      rating: 4.7,
      installs: 2890,
      pricing: 'Free',
      features: ['Traffic Analysis', 'Conversion Tracking', 'User Behavior', 'Custom Reports'],
      documentationUrl: 'https://analytics.google.com',
      icon: '📊',
    },
    {
      id: 'int_011',
      name: 'Mixpanel',
      category: 'analytics',
      description: 'Product analytics for detailed user behavior tracking',
      provider: 'Mixpanel',
      status: 'available',
      rating: 4.6,
      installs: 1567,
      pricing: 'Freemium',
      features: ['Event Tracking', 'Funnels', 'Cohorts', 'A/B Testing'],
      documentationUrl: 'https://mixpanel.com',
      icon: '📈',
    },
    {
      id: 'int_012',
      name: 'Airtel Money',
      category: 'payments',
      description: 'Alternative mobile money integration for broader reach',
      provider: 'Airtel',
      status: 'coming_soon',
      rating: 0,
      installs: 0,
      pricing: 'Usage-based',
      features: ['Collections', 'Disbursements', 'Balance Enquiry', 'Transaction History'],
      documentationUrl: 'https://www.airtel.co.ke',
      icon: '📲',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = searchQuery === '' || 
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.provider.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || integration.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || integration.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    total: integrations.length,
    installed: integrations.filter(i => i.status === 'installed').length,
    available: integrations.filter(i => i.status === 'available').length,
    comingSoon: integrations.filter(i => i.status === 'coming_soon').length,
  };

  const categories = [
    { id: 'all', label: 'All Categories', count: integrations.length },
    { id: 'payments', label: 'Payments', count: integrations.filter(i => i.category === 'payments').length },
    { id: 'credit', label: 'Credit Bureau', count: integrations.filter(i => i.category === 'credit').length },
    { id: 'kyc', label: 'KYC & Identity', count: integrations.filter(i => i.category === 'kyc').length },
    { id: 'sms', label: 'SMS & Communication', count: integrations.filter(i => i.category === 'sms').length },
    { id: 'accounting', label: 'Accounting', count: integrations.filter(i => i.category === 'accounting').length },
    { id: 'crm', label: 'CRM', count: integrations.filter(i => i.category === 'crm').length },
    { id: 'analytics', label: 'Analytics', count: integrations.filter(i => i.category === 'analytics').length },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'installed': return 'bg-accent-50 text-accent-700 border-accent-200';
      case 'available': return 'bg-primary-50 text-primary-700 border-primary-200';
      case 'coming_soon': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'payments': return 'bg-green-50 text-green-700';
      case 'credit': return 'bg-blue-50 text-blue-700';
      case 'kyc': return 'bg-purple-50 text-purple-700';
      case 'sms': return 'bg-orange-50 text-orange-700';
      case 'accounting': return 'bg-indigo-50 text-indigo-700';
      case 'crm': return 'bg-pink-50 text-pink-700';
      case 'analytics': return 'bg-cyan-50 text-cyan-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Integration Marketplace</h1>
          <p className="text-sm text-gray-500">Discover and install pre-built integrations for your lending platform</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Plug size={16} className="text-primary-600" />
            <span className="text-xs text-gray-500">Total Integrations</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={16} className="text-accent-600" />
            <span className="text-xs text-gray-500">Installed</span>
          </div>
          <p className="text-2xl font-bold text-accent-600">{stats.installed}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Download size={16} className="text-primary-600" />
            <span className="text-xs text-gray-500">Available</span>
          </div>
          <p className="text-2xl font-bold text-primary-600">{stats.available}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-gray-600" />
            <span className="text-xs text-gray-500">Coming Soon</span>
          </div>
          <p className="text-2xl font-bold text-gray-600">{stats.comingSoon}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search integrations..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label} ({cat.count})
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              <option value="all">All Status</option>
              <option value="installed">Installed</option>
              <option value="available">Available</option>
              <option value="coming_soon">Coming Soon</option>
            </select>
          </div>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIntegrations.map((integration) => (
          <div key={integration.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:border-primary-200 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{integration.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                  <p className="text-xs text-gray-500">by {integration.provider}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(integration.status)}`}>
                {integration.status.replace('_', ' ')}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-3">{integration.description}</p>

            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(integration.category)}`}>
                {integration.category}
              </span>
              <div className="flex items-center gap-1">
                <Star size={12} className="text-yellow-500 fill-yellow-500" />
                <span className="text-xs text-gray-700">{integration.rating}</span>
              </div>
              <span className="text-xs text-gray-500">
                {integration.installs > 0 ? `${integration.installs.toLocaleString()} installs` : 'New'}
              </span>
            </div>

            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-1">Key Features:</p>
              <div className="flex flex-wrap gap-1">
                {integration.features.slice(0, 3).map((feature, idx) => (
                  <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                    {feature}
                  </span>
                ))}
                {integration.features.length > 3 && (
                  <span className="text-xs text-gray-500">+{integration.features.length - 3} more</span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-500">{integration.pricing}</span>
              <div className="flex gap-2">
                <a
                  href={integration.documentationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  <ExternalLink size={12} /> Docs
                </a>
                {integration.status === 'available' && (
                  <button className="text-xs bg-primary-600 text-white px-3 py-1 rounded hover:bg-primary-700">
                    Install
                  </button>
                )}
                {integration.status === 'installed' && (
                  <button className="text-xs bg-accent-600 text-white px-3 py-1 rounded hover:bg-accent-700">
                    Configure
                  </button>
                )}
                {integration.status === 'coming_soon' && (
                  <button className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded cursor-not-allowed">
                    Coming Soon
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredIntegrations.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <Plug size={48} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No integrations found</h3>
          <p className="text-sm text-gray-500">Try adjusting your filters or search query</p>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Plug size={18} className="text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Integration Marketplace</p>
            <ul className="text-xs text-blue-700 mt-1 space-y-1">
              <li>• Pre-built integrations for payments, credit bureaus, KYC, SMS, accounting, CRM, and analytics</li>
              <li>• One-click installation with guided setup</li>
              <li>• Comprehensive documentation and API references</li>
              <li>• Community ratings and install counts</li>
              <li>• Regular updates and new integrations added</li>
              <li>• Custom integration development available for Enterprise tier</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
