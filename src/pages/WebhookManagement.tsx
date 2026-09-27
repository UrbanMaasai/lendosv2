import { useState } from 'react';
import { Webhook, Plus, Edit2, Trash2, TestTube, CheckCircle2, XCircle, Clock, Copy } from 'lucide-react';

interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive';
  secret: string;
  createdAt: string;
  lastTriggered?: string;
  successRate: number;
  totalDeliveries: number;
  failedDeliveries: number;
}

interface WebhookDelivery {
  id: string;
  webhookId: string;
  event: string;
  status: 'success' | 'failed' | 'pending';
  statusCode?: number;
  payload: any;
  response?: string;
  timestamp: string;
  duration: number;
}

export default function WebhookManagement() {
  const [endpoints, setEndpoints] = useState<WebhookEndpoint[]>([
    {
      id: 'wh_001',
      url: 'https://api.pesaflash.co.ke/webhooks/loans',
      events: ['loan.created', 'loan.approved', 'loan.disbursed', 'loan.repaid'],
      status: 'active',
      secret: 'whsec_abc123def456',
      createdAt: '2026-01-15T10:00:00Z',
      lastTriggered: '2026-06-15T14:30:00Z',
      successRate: 98.5,
      totalDeliveries: 1247,
      failedDeliveries: 19,
    },
    {
      id: 'wh_002',
      url: 'https://api.pesaflash.co.ke/webhooks/payments',
      events: ['payment.received', 'payment.failed'],
      status: 'active',
      secret: 'whsec_xyz789ghi012',
      createdAt: '2026-02-20T09:00:00Z',
      lastTriggered: '2026-06-15T15:45:00Z',
      successRate: 99.2,
      totalDeliveries: 2847,
      failedDeliveries: 23,
    },
    {
      id: 'wh_003',
      url: 'https://api.pesaflash.co.ke/webhooks/borrowers',
      events: ['borrower.registered', 'borrower.kyc_verified'],
      status: 'inactive',
      secret: 'whsec_mno345pqr678',
      createdAt: '2026-03-10T11:00:00Z',
      successRate: 95.8,
      totalDeliveries: 456,
      failedDeliveries: 19,
    },
  ]);

  const [deliveries, setDeliveries] = useState<WebhookDelivery[]>([
    {
      id: 'del_001',
      webhookId: 'wh_001',
      event: 'loan.disbursed',
      status: 'success',
      statusCode: 200,
      payload: { loan_id: 'LN-2026-0847', amount: 15000, borrower_id: 'brw_001' },
      response: 'OK',
      timestamp: '2026-06-15T14:30:00Z',
      duration: 245,
    },
    {
      id: 'del_002',
      webhookId: 'wh_002',
      event: 'payment.received',
      status: 'success',
      statusCode: 200,
      payload: { loan_id: 'LN-2026-0843', amount: 5000, receipt: 'MPESA123' },
      response: 'OK',
      timestamp: '2026-06-15T15:45:00Z',
      duration: 189,
    },
    {
      id: 'del_003',
      webhookId: 'wh_001',
      event: 'loan.approved',
      status: 'failed',
      statusCode: 500,
      payload: { loan_id: 'LN-2026-0848', amount: 8500, borrower_id: 'brw_002' },
      response: 'Internal Server Error',
      timestamp: '2026-06-15T13:20:00Z',
      duration: 5023,
    },
    {
      id: 'del_004',
      webhookId: 'wh_002',
      event: 'payment.received',
      status: 'pending',
      payload: { loan_id: 'LN-2026-0849', amount: 12000, receipt: 'MPESA456' },
      timestamp: '2026-06-15T16:00:00Z',
      duration: 0,
    },
  ]);

  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEndpoint, setNewEndpoint] = useState({
    url: '',
    events: [] as string[],
    secret: '',
  });

  const availableEvents = [
    'loan.created',
    'loan.approved',
    'loan.disbursed',
    'loan.repaid',
    'payment.received',
    'payment.failed',
    'borrower.registered',
    'borrower.kyc_verified',
    'compliance.blocked',
  ];

  const filteredDeliveries = selectedEndpoint
    ? deliveries.filter(d => d.webhookId === selectedEndpoint)
    : deliveries;

  const handleCreateEndpoint = () => {
    const endpoint: WebhookEndpoint = {
      id: `wh_${Date.now()}`,
      url: newEndpoint.url,
      events: newEndpoint.events,
      status: 'active',
      secret: newEndpoint.secret || `whsec_${Math.random().toString(36).substring(7)}`,
      createdAt: new Date().toISOString(),
      successRate: 100,
      totalDeliveries: 0,
      failedDeliveries: 0,
    };
    setEndpoints([...endpoints, endpoint]);
    setShowCreateModal(false);
    setNewEndpoint({ url: '', events: [], secret: '' });
  };

  const handleDeleteEndpoint = (id: string) => {
    setEndpoints(endpoints.filter(e => e.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setEndpoints(endpoints.map(e => 
      e.id === id ? { ...e, status: e.status === 'active' ? 'inactive' : 'active' } : e
    ));
  };

  const handleTestWebhook = (id: string) => {
    const endpoint = endpoints.find(e => e.id === id);
    if (!endpoint) return;

    const testDelivery: WebhookDelivery = {
      id: `del_${Date.now()}`,
      webhookId: id,
      event: endpoint.events[0] || 'test.event',
      status: 'pending',
      payload: { test: true, timestamp: new Date().toISOString() },
      timestamp: new Date().toISOString(),
      duration: 0,
    };

    setDeliveries([testDelivery, ...deliveries]);

    // Simulate delivery
    setTimeout(() => {
      setDeliveries(deliveries.map(d => 
        d.id === testDelivery.id 
          ? { ...d, status: 'success', statusCode: 200, response: 'OK', duration: 234 }
          : d
      ));
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Webhook Management</h1>
          <p className="text-sm text-gray-500">Configure and monitor webhook endpoints for real-time event notifications</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
        >
          <Plus size={16} />
          Add Endpoint
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Webhook size={16} className="text-primary-600" />
            <span className="text-xs text-gray-500">Total Endpoints</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{endpoints.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={16} className="text-green-600" />
            <span className="text-xs text-gray-500">Active</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{endpoints.filter(e => e.status === 'active').length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-blue-600" />
            <span className="text-xs text-gray-500">Total Deliveries</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{endpoints.reduce((sum, e) => sum + e.totalDeliveries, 0).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={16} className="text-green-600" />
            <span className="text-xs text-gray-500">Avg Success Rate</span>
          </div>
          <p className="text-2xl font-bold text-green-600">
            {(endpoints.reduce((sum, e) => sum + e.successRate, 0) / endpoints.length).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Endpoints List */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Webhook Endpoints</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {endpoints.map((endpoint) => (
            <div key={endpoint.id} className="p-4 hover:bg-gray-50/50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-gray-500">{endpoint.id}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      endpoint.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {endpoint.status}
                    </span>
                  </div>
                  <p className="text-sm font-mono text-gray-900 mb-2">{endpoint.url}</p>
                  <div className="flex flex-wrap gap-1">
                    {endpoint.events.map((event) => (
                      <span key={event} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
                        {event}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTestWebhook(endpoint.id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Test webhook"
                  >
                    <TestTube size={16} />
                  </button>
                  <button
                    onClick={() => handleToggleStatus(endpoint.id)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    title={endpoint.status === 'active' ? 'Deactivate' : 'Activate'}
                  >
                    {endpoint.status === 'active' ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
                  </button>
                  <button
                    onClick={() => handleDeleteEndpoint(endpoint.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Delete endpoint"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 text-xs">
                <div>
                  <p className="text-gray-500 mb-1">Success Rate</p>
                  <p className="font-semibold text-gray-900">{endpoint.successRate}%</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Total Deliveries</p>
                  <p className="font-semibold text-gray-900">{endpoint.totalDeliveries.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Failed</p>
                  <p className="font-semibold text-red-600">{endpoint.failedDeliveries}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Last Triggered</p>
                  <p className="font-semibold text-gray-900">
                    {endpoint.lastTriggered ? new Date(endpoint.lastTriggered).toLocaleDateString() : 'Never'}
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Secret:</span>
                  <code className="text-xs font-mono text-gray-700 bg-gray-50 px-2 py-1 rounded">
                    {endpoint.secret.substring(0, 10)}...
                  </code>
                  <button
                    onClick={() => copyToClipboard(endpoint.secret)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                    title="Copy secret"
                  >
                    <Copy size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Deliveries */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Recent Deliveries</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">ID</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Event</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Status</th>
                <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">Status Code</th>
                <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">Duration</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeliveries.map((delivery) => (
                <tr key={delivery.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono text-gray-600">{delivery.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono text-blue-600">{delivery.event}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      delivery.status === 'success' ? 'bg-green-50 text-green-700' :
                      delivery.status === 'failed' ? 'bg-red-50 text-red-700' :
                      'bg-yellow-50 text-yellow-700'
                    }`}>
                      {delivery.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-xs text-gray-700">
                      {delivery.statusCode || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-xs text-gray-700">
                      {delivery.duration > 0 ? `${delivery.duration}ms` : '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-600">
                      {new Date(delivery.timestamp).toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Create Webhook Endpoint</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Endpoint URL</label>
                  <input
                    type="url"
                    value={newEndpoint.url}
                    onChange={(e) => setNewEndpoint({ ...newEndpoint, url: e.target.value })}
                    placeholder="https://your-app.com/webhooks"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Events</label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableEvents.map((event) => (
                      <label key={event} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                        <input
                          type="checkbox"
                          checked={newEndpoint.events.includes(event)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewEndpoint({ ...newEndpoint, events: [...newEndpoint.events, event] });
                            } else {
                              setNewEndpoint({ ...newEndpoint, events: newEndpoint.events.filter(e => e !== event) });
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-xs text-gray-700">{event}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Secret (optional)</label>
                  <input
                    type="text"
                    value={newEndpoint.secret}
                    onChange={(e) => setNewEndpoint({ ...newEndpoint, secret: e.target.value })}
                    placeholder="Auto-generated if empty"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleCreateEndpoint}
                    disabled={!newEndpoint.url || newEndpoint.events.length === 0}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50"
                  >
                    Create Endpoint
                  </button>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Webhook size={18} className="text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Webhook Best Practices</p>
            <ul className="text-xs text-blue-700 mt-1 space-y-1">
              <li>• Always verify webhook signatures using the secret key</li>
              <li>• Respond with 2xx status codes within 5 seconds</li>
              <li>• Implement retry logic for failed deliveries (exponential backoff)</li>
              <li>• Use HTTPS for all webhook endpoints</li>
              <li>• Monitor delivery success rates and set up alerts for failures</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
