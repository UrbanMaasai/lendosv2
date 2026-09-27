import { useState, useEffect } from 'react';
import { AlertTriangle, Shield, Eye, TrendingUp, Users, FileText, Clock } from 'lucide-react';
import { dataLayer } from '../services/dataLayer';

interface FraudIndicator {
  id: string;
  type: 'multiple_applications' | 'identity_mismatch' | 'unusual_pattern' | 'velocity_check' | 'device_fingerprint';
  severity: 'low' | 'medium' | 'high' | 'critical';
  borrowerId: string;
  borrowerName: string;
  description: string;
  detectedAt: string;
  status: 'pending' | 'investigating' | 'resolved' | 'false_positive';
  riskScore: number;
}

export default function FraudDetectionDashboard() {
  const [indicators, setIndicators] = useState<FraudIndicator[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'investigating' | 'resolved'>('all');
  const [selectedIndicator, setSelectedIndicator] = useState<FraudIndicator | null>(null);

  useEffect(() => {
    // Generate sample fraud indicators
    const sampleIndicators: FraudIndicator[] = [
      {
        id: 'FRAUD-001',
        type: 'multiple_applications',
        severity: 'high',
        borrowerId: 'brw_015',
        borrowerName: 'John Doe',
        description: '5 loan applications submitted within 2 hours from different devices',
        detectedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        status: 'pending',
        riskScore: 85,
      },
      {
        id: 'FRAUD-002',
        type: 'identity_mismatch',
        severity: 'critical',
        borrowerId: 'brw_023',
        borrowerName: 'Jane Smith',
        description: 'ID number does not match CRB records. Possible identity theft.',
        detectedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        status: 'investigating',
        riskScore: 95,
      },
      {
        id: 'FRAUD-003',
        type: 'unusual_pattern',
        severity: 'medium',
        borrowerId: 'brw_031',
        borrowerName: 'Mike Johnson',
        description: 'Borrower repaid 3 loans early then applied for maximum amount',
        detectedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        status: 'pending',
        riskScore: 65,
      },
      {
        id: 'FRAUD-004',
        type: 'velocity_check',
        severity: 'high',
        borrowerId: 'brw_042',
        borrowerName: 'Sarah Williams',
        description: '10 login attempts in 5 minutes from different IP addresses',
        detectedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
        status: 'investigating',
        riskScore: 78,
      },
      {
        id: 'FRAUD-005',
        type: 'device_fingerprint',
        severity: 'medium',
        borrowerId: 'brw_056',
        borrowerName: 'David Brown',
        description: 'Same device used for 8 different borrower accounts',
        detectedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        status: 'resolved',
        riskScore: 72,
      },
      {
        id: 'FRAUD-006',
        type: 'multiple_applications',
        severity: 'low',
        borrowerId: 'brw_067',
        borrowerName: 'Emily Davis',
        description: '2 applications submitted within 24 hours',
        detectedAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
        status: 'false_positive',
        riskScore: 35,
      },
    ];

    setIndicators(sampleIndicators);
  }, []);

  const filteredIndicators = indicators.filter(i => {
    if (filter === 'all') return true;
    return i.status === filter;
  });

  const stats = {
    total: indicators.length,
    pending: indicators.filter(i => i.status === 'pending').length,
    investigating: indicators.filter(i => i.status === 'investigating').length,
    resolved: indicators.filter(i => i.status === 'resolved').length,
    critical: indicators.filter(i => i.severity === 'critical').length,
    high: indicators.filter(i => i.severity === 'high').length,
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'investigating': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'resolved': return 'bg-green-50 text-green-700 border-green-200';
      case 'false_positive': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'multiple_applications': return <FileText size={16} className="text-purple-600" />;
      case 'identity_mismatch': return <Users size={16} className="text-red-600" />;
      case 'unusual_pattern': return <TrendingUp size={16} className="text-orange-600" />;
      case 'velocity_check': return <Clock size={16} className="text-blue-600" />;
      case 'device_fingerprint': return <Shield size={16} className="text-indigo-600" />;
      default: return <AlertTriangle size={16} className="text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fraud Detection Dashboard</h1>
          <p className="text-sm text-gray-500">Monitor suspicious activities and fraud indicators</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg">
            <span className="text-xs font-medium text-red-700">{stats.critical} Critical</span>
          </div>
          <div className="px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-lg">
            <span className="text-xs font-medium text-orange-700">{stats.high} High Risk</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-gray-600" />
            <span className="text-xs text-gray-500">Total Alerts</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-yellow-600" />
            <span className="text-xs text-gray-500">Pending</span>
          </div>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Eye size={16} className="text-orange-600" />
            <span className="text-xs text-gray-500">Investigating</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">{stats.investigating}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={16} className="text-green-600" />
            <span className="text-xs text-gray-500">Resolved</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-red-600" />
            <span className="text-xs text-gray-500">Critical</span>
          </div>
          <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-orange-600" />
            <span className="text-xs text-gray-500">High Risk</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">{stats.high}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'pending', 'investigating', 'resolved'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Indicators List */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">ID</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Type</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Borrower</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Severity</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Risk Score</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Status</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Detected</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filteredIndicators.map((indicator) => (
                <tr key={indicator.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono text-gray-600">{indicator.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(indicator.type)}
                      <span className="text-xs text-gray-700 capitalize">
                        {indicator.type.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{indicator.borrowerName}</p>
                      <p className="text-xs text-gray-500">{indicator.borrowerId}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(indicator.severity)}`}>
                      {indicator.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            indicator.riskScore >= 80 ? 'bg-red-500' :
                            indicator.riskScore >= 60 ? 'bg-orange-500' :
                            indicator.riskScore >= 40 ? 'bg-yellow-500' :
                            'bg-blue-500'
                          }`}
                          style={{ width: `${indicator.riskScore}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-gray-700">{indicator.riskScore}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(indicator.status)}`}>
                      {indicator.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-600">
                      {new Date(indicator.detectedAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedIndicator(indicator)}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedIndicator && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{selectedIndicator.id}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedIndicator.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedIndicator(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Eye size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Borrower</p>
                    <p className="text-sm font-medium text-gray-900">{selectedIndicator.borrowerName}</p>
                    <p className="text-xs text-gray-500">{selectedIndicator.borrowerId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Severity</p>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(selectedIndicator.severity)}`}>
                      {selectedIndicator.severity.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Risk Score</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            selectedIndicator.riskScore >= 80 ? 'bg-red-500' :
                            selectedIndicator.riskScore >= 60 ? 'bg-orange-500' :
                            selectedIndicator.riskScore >= 40 ? 'bg-yellow-500' :
                            'bg-blue-500'
                          }`}
                          style={{ width: `${selectedIndicator.riskScore}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{selectedIndicator.riskScore}/100</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(selectedIndicator.status)}`}>
                      {selectedIndicator.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Description</p>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {selectedIndicator.description}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Detected At</p>
                  <p className="text-sm text-gray-700">
                    {new Date(selectedIndicator.detectedAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <button className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700">
                    Mark as Investigating
                  </button>
                  <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
                    Resolve
                  </button>
                  <button className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700">
                    False Positive
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
          <Shield size={18} className="text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Fraud Detection Rules</p>
            <p className="text-xs text-blue-700 mt-1">
              The system monitors multiple fraud indicators including: multiple applications from same device/IP, 
              identity mismatches with CRB records, unusual borrowing patterns, velocity checks (rapid login/application attempts), 
              and device fingerprinting across multiple accounts. All alerts are logged in the audit trail.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
