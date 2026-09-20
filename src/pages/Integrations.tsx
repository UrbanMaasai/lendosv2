import { useState } from 'react';
import { Plug, CheckCircle2, AlertCircle, Clock, Wifi, WifiOff, RefreshCw, ExternalLink, Shield, Activity, Zap, TrendingUp } from 'lucide-react';

const integrations = [
  {
    id: 'mpesa',
    name: 'M-Pesa (Daraja API)',
    category: 'Payments',
    status: 'Connected',
    description: 'C2B (Paybill), B2C (Disbursement), STK Push',
    details: {
      'Environment': 'Production',
      'Paybill': '522533',
      'B2C Shortcode': '600533',
      'Last Transaction': '2 min ago',
      'Success Rate': '99.2%',
    },
    endpoints: [
      { name: 'C2B Confirmation', path: '/api/v1/integrations/mpesa/c2b/confirmation', status: 'active' },
      { name: 'B2C Result', path: '/api/v1/integrations/mpesa/b2c/result', status: 'active' },
      { name: 'STK Callback', path: '/api/v1/integrations/mpesa/stk/callback', status: 'active' },
    ],
    icon: '📱',
  },
  {
    id: 'sms',
    name: "Africa's Talking (SMS)",
    category: 'Communications',
    status: 'Connected',
    description: 'OTP, notifications, collections reminders',
    details: {
      'Sender ID': 'LendingOS',
      'Delivery Rate': '98.7%',
      'Avg Delivery Time': '2.3 seconds',
      'Messages Today': '4,521',
      'Cost per SMS': 'KES 0.40',
    },
    endpoints: [],
    icon: '💬',
  },
  {
    id: 'email',
    name: 'AWS SES (Email)',
    category: 'Communications',
    status: 'Connected',
    description: 'Transaction receipts, statements, notifications',
    details: {
      'Verified Domain': 'notify.lendingos.co.ke',
      'Daily Limit': '50,000',
      'Sent Today': '1,234',
      'Bounce Rate': '0.3%',
    },
    endpoints: [],
    icon: '📧',
  },
  {
    id: 'kyc',
    name: 'Smile Identity (KYC)',
    category: 'Verification',
    status: 'Connected',
    description: 'ID verification, selfie match, liveness detection',
    details: {
      'Verification Rate': '94.2%',
      'Avg Processing Time': '8 seconds',
      'Fallback': 'Manual Review Queue',
      'Documents Today': '234',
    },
    endpoints: [],
    icon: '🪪',
  },
  {
    id: 'crb',
    name: 'Metropol CRB',
    category: 'Credit',
    status: 'Connected',
    description: 'Credit report pull, score retrieval, negative listing',
    details: {
      'Reports Pulled Today': '187',
      'Avg Response Time': '1.2 seconds',
      'Score Range': '300-850',
      'Negative Listings': '23 this month',
    },
    endpoints: [],
    icon: '📊',
  },
  {
    id: 'crb2',
    name: 'TransUnion CRB',
    category: 'Credit',
    status: 'Connected',
    description: 'Secondary credit bureau, cross-reference',
    details: {
      'Reports Pulled Today': '187',
      'Avg Response Time': '1.8 seconds',
      'Score Range': '200-900',
    },
    endpoints: [],
    icon: '📈',
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks (Accounting)',
    category: 'Accounting',
    status: 'Pending',
    description: 'Daily journal entries, chart of accounts mapping',
    details: {
      'Status': 'Awaiting configuration',
      'Phase': 'Phase 3 (Q3 2027)',
    },
    endpoints: [],
    icon: '📒',
  },
  {
    id: 'api',
    name: 'REST API (Embedded Lending)',
    category: 'Developer',
    status: 'Active',
    description: 'Full API access for Growth+ tenants. Webhooks, rate limiting',
    details: {
      'API Version': 'v1.4.2',
      'Rate Limit': '1000 req/min',
      'Active Keys': '12',
      'Uptime': '99.97%',
    },
    endpoints: [
      { name: 'Borrower API', path: '/api/v1/borrowers', status: 'active' },
      { name: 'Loan API', path: '/api/v1/loans', status: 'active' },
      { name: 'Product API', path: '/api/v1/products', status: 'active' },
      { name: 'Webhooks', path: '/api/v1/webhooks', status: 'active' },
    ],
    icon: '🔌',
  },
];

export default function Integrations() {
  const [selected, setSelected] = useState<typeof integrations[0] | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Integrations Hub</h1>
          <p className="text-sm text-gray-500">M-Pesa, CRB, KYC, and third-party service connections</p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-accent-50 text-accent-700 px-3 py-1.5 rounded-full">
          <CheckCircle2 size={14} /> 6/8 integrations active
        </div>
      </div>

      {/* Connection Status Monitor */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity size={18} className="text-primary-600" />
            <h3 className="font-semibold text-gray-900">Connection Status Monitor</h3>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></div>
            <span className="text-accent-600 font-medium">All Systems Operational</span>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'M-Pesa C2B', latency: '45ms', uptime: '99.8%', status: 'healthy', icon: '📱' },
            { name: 'M-Pesa B2C', latency: '52ms', uptime: '99.6%', status: 'healthy', icon: '💸' },
            { name: 'CRB Metropol', latency: '1.2s', uptime: '99.9%', status: 'healthy', icon: '📊' },
            { name: 'SMS Gateway', latency: '2.3s', uptime: '98.7%', status: 'warning', icon: '💬' },
          ].map((conn) => (
            <div key={conn.name} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{conn.icon}</span>
                <div className={`w-2 h-2 rounded-full ${
                  conn.status === 'healthy' ? 'bg-accent-500' : 'bg-warning-500'
                }`}></div>
              </div>
              <p className="text-sm font-medium text-gray-900">{conn.name}</p>
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <span>Latency: {conn.latency}</span>
                <span>Uptime: {conn.uptime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Integration Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((integration) => (
          <div
            key={integration.id}
            onClick={() => setSelected(integration)}
            className="bg-white rounded-xl p-5 border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{integration.icon}</span>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">{integration.name}</h4>
                  <p className="text-xs text-gray-500">{integration.category}</p>
                </div>
              </div>
              <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                integration.status === 'Connected' || integration.status === 'Active'
                  ? 'bg-accent-50 text-accent-700'
                  : integration.status === 'Pending'
                  ? 'bg-warning-50 text-warning-700'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {integration.status === 'Connected' || integration.status === 'Active' ? (
                  <Wifi size={10} />
                ) : integration.status === 'Pending' ? (
                  <Clock size={10} />
                ) : (
                  <WifiOff size={10} />
                )}
                {integration.status}
              </span>
            </div>
            <p className="text-xs text-gray-600">{integration.description}</p>
            {integration.details && (
              <div className="mt-3 pt-3 border-t border-gray-50">
                <div className="grid grid-cols-2 gap-1">
                  {Object.entries(integration.details).slice(0, 2).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-[10px] text-gray-400">{key}</p>
                      <p className="text-xs font-medium text-gray-700">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* M-Pesa Detail Section */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">📱</span>
          <div>
            <h3 className="font-semibold text-gray-900">M-Pesa Daraja API Configuration</h3>
            <p className="text-sm text-gray-500">Direct integration — no aggregator</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-accent-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 size={16} className="text-accent-600" />
              <span className="text-sm font-medium text-accent-800">C2B (Repayments)</span>
            </div>
            <p className="text-xs text-accent-700">Paybill: 522533 · Auto-reconciliation via Account Reference</p>
            <p className="text-xs text-accent-600 mt-1">Last payment: 2 min ago</p>
          </div>
          <div className="bg-primary-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 size={16} className="text-primary-600" />
              <span className="text-sm font-medium text-primary-800">B2C (Disbursements)</span>
            </div>
            <p className="text-xs text-primary-700">Shortcode: 600533 · &lt;5 min disbursement SLA</p>
            <p className="text-xs text-primary-600 mt-1">Success rate: 99.2%</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 size={16} className="text-purple-600" />
              <span className="text-sm font-medium text-purple-800">STK Push</span>
            </div>
            <p className="text-xs text-purple-700">Borrower-initiated repayment via phone PIN</p>
            <p className="text-xs text-purple-600 mt-1">Active for Growth+ tenants</p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Webhook Endpoints</h4>
          <div className="space-y-2">
            {[
              { name: 'C2B Confirmation', path: '/api/v1/integrations/mpesa/c2b/confirmation', method: 'POST' },
              { name: 'B2C Result', path: '/api/v1/integrations/mpesa/b2c/result', method: 'POST' },
              { name: 'STK Push Callback', path: '/api/v1/integrations/mpesa/stk/callback', method: 'POST' },
              { name: 'STK Query', path: '/api/v1/integrations/mpesa/stk/query', method: 'POST' },
            ].map((endpoint) => (
              <div key={endpoint.path} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded">{endpoint.method}</span>
                  <span className="text-sm text-gray-700">{endpoint.name}</span>
                </div>
                <code className="text-xs text-gray-500 font-mono">{endpoint.path}</code>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4 mt-4">
          <div className="flex items-start gap-3">
            <Shield size={16} className="text-primary-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">Security</p>
              <p className="text-xs text-gray-600 mt-1">
                Webhook endpoints secured with Safaricom signature validation. Production credentials stored in AWS Secrets Manager. 
                All transactions logged with 7-year retention in af-south-1 (Cape Town) region.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* API Documentation */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">REST API (v1.4.2)</h3>
            <p className="text-sm text-gray-400">Available for Growth+ tenants</p>
          </div>
          <button className="flex items-center gap-2 text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors">
            <ExternalLink size={14} /> API Docs
          </button>
        </div>
        <div className="bg-black/30 rounded-lg p-4 font-mono text-xs overflow-x-auto">
          <pre>{`# Example: Create a loan application
curl -X POST https://api.lendingos.co.ke/v1/loans \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "X-Tenant-ID: tenant_abc123" \\
  -H "Content-Type: application/json" \\
  -d '{
    "borrower_id": "brw_8x7k2m",
    "product_id": "prod_salary_advance",
    "amount": 15000,
    "consent_version": "2.5"
  }'

# Response: 201 Created
{
  "loan_id": "LN-2026-0848",
  "status": "PENDING_DECISION",
  "kfs_url": "/api/v1/loans/LN-2026-0848/kfs",
  "cooling_off_until": "2026-06-16T14:30:00Z"
}`}</pre>
        </div>
      </div>
    </div>
  );
}
