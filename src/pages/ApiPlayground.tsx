import { useState } from 'react';
import { Code, Send, Copy, CheckCircle2, Play, Clock } from 'lucide-react';

interface ApiRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  headers: Record<string, string>;
  body?: string;
}

interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: any;
  duration: number;
}

export default function ApiPlayground() {
  const [request, setRequest] = useState<ApiRequest>({
    method: 'GET',
    endpoint: '/v1/loans',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'X-Tenant-ID': 'tenant_001',
      'Content-Type': 'application/json',
    },
    body: '',
  });

  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const mockResponses: Record<string, any> = {
    'GET /v1/loans': {
      status: 200,
      statusText: 'OK',
      headers: {
        'content-type': 'application/json',
        'x-ratelimit-limit': '1000',
        'x-ratelimit-remaining': '999',
      },
      body: {
        data: [
          {
            id: 'LN-2026-0847',
            status: 'ACTIVE',
            borrower_id: 'brw_001',
            product_id: 'prod_001',
            principal: 15000,
            interest: 450,
            total_due: 15450,
            paid: 7725,
            remaining: 7725,
            due_date: '2026-07-15',
            created_at: '2026-06-15T14:30:00Z',
          },
          {
            id: 'LN-2026-0846',
            status: 'PENDING_REVIEW',
            borrower_id: 'brw_002',
            product_id: 'prod_002',
            principal: 8500,
            interest: 340,
            total_due: 8840,
            paid: 0,
            remaining: 8840,
            due_date: '2026-07-20',
            created_at: '2026-06-14T10:20:00Z',
          },
        ],
        pagination: {
          page: 1,
          per_page: 20,
          total: 3847,
          total_pages: 193,
        },
      },
      duration: 234,
    },
    'POST /v1/loans': {
      status: 201,
      statusText: 'Created',
      headers: {
        'content-type': 'application/json',
        'location': '/v1/loans/LN-2026-0848',
      },
      body: {
        id: 'LN-2026-0848',
        status: 'PENDING_DECISION',
        borrower_id: 'brw_003',
        product_id: 'prod_001',
        principal: 12000,
        interest: 360,
        total_due: 12360,
        due_date: '2026-07-15',
        kfs_url: '/v1/loans/LN-2026-0848/kfs',
        cooling_off_until: '2026-06-16T14:30:00Z',
        created_at: new Date().toISOString(),
      },
      duration: 189,
    },
    'GET /v1/borrowers': {
      status: 200,
      statusText: 'OK',
      headers: {
        'content-type': 'application/json',
      },
      body: {
        data: [
          {
            id: 'brw_001',
            name: 'James Mwangi',
            phone: '+254712345678',
            kyc_verified: true,
            credit_score: 680,
            status: 'ACTIVE',
            created_at: '2026-01-15T00:00:00Z',
          },
        ],
        pagination: {
          page: 1,
          per_page: 20,
          total: 12847,
        },
      },
      duration: 156,
    },
  };

  const handleSendRequest = async () => {
    setLoading(true);
    setResponse(null);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const key = `${request.method} ${request.endpoint}`;
    const mockResponse = mockResponses[key] || {
      status: 404,
      statusText: 'Not Found',
      headers: { 'content-type': 'application/json' },
      body: { error: { type: 'not_found', message: 'Endpoint not found' } },
      duration: 45,
    };

    setResponse(mockResponse);
    setLoading(false);
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-accent-600 bg-accent-50';
    if (status >= 400 && status < 500) return 'text-warning-600 bg-warning-50';
    if (status >= 500) return 'text-danger-600 bg-danger-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">API Playground</h1>
        <p className="text-sm text-gray-500">Interactive API testing environment with live responses</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Request Panel */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Send size={18} className="text-primary-600" />
            Request
          </h3>
          <div className="space-y-4">
            <div className="flex gap-2">
              <select
                value={request.method}
                onChange={(e) => setRequest({ ...request, method: e.target.value as any })}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono font-bold"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>
              <input
                type="text"
                value={request.endpoint}
                onChange={(e) => setRequest({ ...request, endpoint: e.target.value })}
                placeholder="/v1/loans"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Headers</label>
              <div className="space-y-2">
                {Object.entries(request.headers).map(([key, value], idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={key}
                      onChange={(e) => {
                        const newHeaders = { ...request.headers };
                        delete newHeaders[key];
                        newHeaders[e.target.value] = value;
                        setRequest({ ...request, headers: newHeaders });
                      }}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs font-mono"
                      placeholder="Header name"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => {
                        const newHeaders = { ...request.headers };
                        newHeaders[key] = e.target.value;
                        setRequest({ ...request, headers: newHeaders });
                      }}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs font-mono"
                      placeholder="Header value"
                    />
                  </div>
                ))}
              </div>
            </div>

            {(request.method === 'POST' || request.method === 'PUT' || request.method === 'PATCH') && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Request Body</label>
                <textarea
                  value={request.body}
                  onChange={(e) => setRequest({ ...request, body: e.target.value })}
                  placeholder='{"borrower_id": "brw_001", "amount": 15000}'
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-mono"
                />
              </div>
            )}

            <button
              onClick={handleSendRequest}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? <Clock size={16} className="animate-spin" /> : <Play size={16} />}
              {loading ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </div>

        {/* Response Panel */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Code size={18} className="text-accent-600" />
            Response
          </h3>
          {response ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-lg text-sm font-bold ${getStatusColor(response.status)}`}>
                    {response.status} {response.statusText}
                  </span>
                  <span className="text-xs text-gray-500">{response.duration}ms</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Response Headers</label>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(response.headers, null, 2), 'headers')}
                    className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
                  >
                    {copiedField === 'headers' ? <CheckCircle2 size={12} /> : <Copy size={12} />}
                    {copiedField === 'headers' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs font-mono overflow-x-auto">
                  {JSON.stringify(response.headers, null, 2)}
                </pre>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Response Body</label>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(response.body, null, 2), 'body')}
                    className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
                  >
                    {copiedField === 'body' ? <CheckCircle2 size={12} /> : <Copy size={12} />}
                    {copiedField === 'body' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs font-mono overflow-x-auto max-h-96 overflow-y-auto">
                  {JSON.stringify(response.body, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Code size={48} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Send a request to see the response</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Examples */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Examples</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { method: 'GET', endpoint: '/v1/loans', label: 'List Loans' },
            { method: 'POST', endpoint: '/v1/loans', label: 'Create Loan' },
            { method: 'GET', endpoint: '/v1/borrowers', label: 'List Borrowers' },
            { method: 'GET', endpoint: '/v1/products', label: 'List Products' },
            { method: 'GET', endpoint: '/v1/transactions', label: 'List Transactions' },
            { method: 'GET', endpoint: '/v1/audit-logs', label: 'List Audit Logs' },
          ].map((example, idx) => (
            <button
              key={idx}
              onClick={() => setRequest({ ...request, method: example.method as any, endpoint: example.endpoint })}
              className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 text-left transition-colors"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                  example.method === 'GET' ? 'bg-blue-50 text-blue-700' :
                  example.method === 'POST' ? 'bg-green-50 text-green-700' :
                  'bg-yellow-50 text-yellow-700'
                }`}>
                  {example.method}
                </span>
                <span className="text-xs text-gray-600 font-mono">{example.endpoint}</span>
              </div>
              <p className="text-sm text-gray-900">{example.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Code size={18} className="text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">API Playground Features</p>
            <ul className="text-xs text-blue-700 mt-1 space-y-1">
              <li>• Test API endpoints with custom headers and body</li>
              <li>• View response headers, status codes, and body</li>
              <li>• Copy responses to clipboard for debugging</li>
              <li>• Quick examples for common operations</li>
              <li>• Real-time request/response timing</li>
              <li>• Mock responses for development and testing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
