import { useState, useEffect } from 'react';
import { Activity, CheckCircle2, AlertTriangle, XCircle, Clock, Server, Database, Wifi, Cpu, HardDrive } from 'lucide-react';

interface SystemMetric {
  id: string;
  name: string;
  category: 'server' | 'database' | 'network' | 'application';
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  value: number;
  unit: string;
  threshold: { warning: number; critical: number };
  lastChecked: string;
  uptime?: number;
}

interface Incident {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  startedAt: string;
  resolvedAt?: string;
  description: string;
  impact: string;
}

export default function SystemHealthDashboard() {
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'server' | 'database' | 'network' | 'application'>('all');

  useEffect(() => {
    // Simulate real-time metrics
    const seedMetrics: SystemMetric[] = [
      {
        id: 'metric_001',
        name: 'CPU Usage',
        category: 'server',
        status: 'healthy',
        value: 45,
        unit: '%',
        threshold: { warning: 70, critical: 90 },
        lastChecked: new Date().toISOString(),
        uptime: 99.98,
      },
      {
        id: 'metric_002',
        name: 'Memory Usage',
        category: 'server',
        status: 'healthy',
        value: 62,
        unit: '%',
        threshold: { warning: 80, critical: 95 },
        lastChecked: new Date().toISOString(),
        uptime: 99.98,
      },
      {
        id: 'metric_003',
        name: 'Disk Usage',
        category: 'server',
        status: 'warning',
        value: 78,
        unit: '%',
        threshold: { warning: 75, critical: 90 },
        lastChecked: new Date().toISOString(),
        uptime: 99.98,
      },
      {
        id: 'metric_004',
        name: 'Database Connections',
        category: 'database',
        status: 'healthy',
        value: 127,
        unit: 'active',
        threshold: { warning: 200, critical: 250 },
        lastChecked: new Date().toISOString(),
        uptime: 99.99,
      },
      {
        id: 'metric_005',
        name: 'Query Response Time',
        category: 'database',
        status: 'healthy',
        value: 45,
        unit: 'ms',
        threshold: { warning: 100, critical: 500 },
        lastChecked: new Date().toISOString(),
        uptime: 99.99,
      },
      {
        id: 'metric_006',
        name: 'Network Latency',
        category: 'network',
        status: 'healthy',
        value: 12,
        unit: 'ms',
        threshold: { warning: 50, critical: 100 },
        lastChecked: new Date().toISOString(),
        uptime: 99.95,
      },
      {
        id: 'metric_007',
        name: 'API Response Time',
        category: 'application',
        status: 'healthy',
        value: 234,
        unit: 'ms',
        threshold: { warning: 500, critical: 1000 },
        lastChecked: new Date().toISOString(),
        uptime: 99.97,
      },
      {
        id: 'metric_008',
        name: 'Error Rate',
        category: 'application',
        status: 'healthy',
        value: 0.12,
        unit: '%',
        threshold: { warning: 1, critical: 5 },
        lastChecked: new Date().toISOString(),
        uptime: 99.97,
      },
    ];
    setMetrics(seedMetrics);

    const seedIncidents: Incident[] = [
      {
        id: 'INC-001',
        title: 'Elevated API Response Times',
        severity: 'medium',
        status: 'resolved',
        startedAt: '2026-06-14T10:30:00Z',
        resolvedAt: '2026-06-14T11:45:00Z',
        description: 'API response times increased to 800ms average due to database connection pool exhaustion.',
        impact: 'Affected 15% of API requests during the incident window.',
      },
      {
        id: 'INC-002',
        title: 'M-Pesa Integration Timeout',
        severity: 'high',
        status: 'resolved',
        startedAt: '2026-06-10T14:20:00Z',
        resolvedAt: '2026-06-10T15:10:00Z',
        description: 'M-Pesa Daraja API experiencing timeouts due to Safaricom maintenance.',
        impact: 'Disbursements delayed by 30-60 minutes. Automatic retry succeeded for 95% of transactions.',
      },
    ];
    setIncidents(seedIncidents);
  }, []);

  const filteredMetrics = selectedCategory === 'all' 
    ? metrics 
    : metrics.filter(m => m.category === selectedCategory);

  const stats = {
    total: metrics.length,
    healthy: metrics.filter(m => m.status === 'healthy').length,
    warning: metrics.filter(m => m.status === 'warning').length,
    critical: metrics.filter(m => m.status === 'critical').length,
    overallUptime: (metrics.reduce((sum, m) => sum + (m.uptime || 0), 0) / metrics.length).toFixed(2),
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle2 size={20} className="text-accent-600" />;
      case 'warning': return <AlertTriangle size={20} className="text-warning-600" />;
      case 'critical': return <XCircle size={20} className="text-danger-600" />;
      default: return <Clock size={20} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-accent-50 border-accent-200';
      case 'warning': return 'bg-warning-50 border-warning-200';
      case 'critical': return 'bg-danger-50 border-danger-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'server': return <Server size={16} className="text-primary-600" />;
      case 'database': return <Database size={16} className="text-purple-600" />;
      case 'network': return <Wifi size={16} className="text-blue-600" />;
      case 'application': return <Cpu size={16} className="text-orange-600" />;
      default: return <Activity size={16} className="text-gray-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-danger-500 text-white';
      case 'high': return 'bg-danger-100 text-danger-700';
      case 'medium': return 'bg-warning-100 text-warning-700';
      case 'low': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Health Dashboard</h1>
          <p className="text-sm text-gray-500">Real-time monitoring of platform infrastructure and services</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-accent-50 border border-accent-200 rounded-lg">
            <span className="text-xs font-medium text-accent-700">
              Overall Uptime: {stats.overallUptime}%
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={16} className="text-primary-600" />
            <span className="text-xs text-gray-500">Total Metrics</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={16} className="text-accent-600" />
            <span className="text-xs text-gray-500">Healthy</span>
          </div>
          <p className="text-2xl font-bold text-accent-600">{stats.healthy}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-warning-600" />
            <span className="text-xs text-gray-500">Warning</span>
          </div>
          <p className="text-2xl font-bold text-warning-600">{stats.warning}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <XCircle size={16} className="text-danger-600" />
            <span className="text-xs text-gray-500">Critical</span>
          </div>
          <p className="text-2xl font-bold text-danger-600">{stats.critical}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-purple-600" />
            <span className="text-xs text-gray-500">Avg Uptime</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">{stats.overallUptime}%</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2">
        {(['all', 'server', 'database', 'network', 'application'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === cat
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Metrics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMetrics.map((metric) => (
          <div key={metric.id} className={`rounded-xl p-4 border-2 ${getStatusColor(metric.status)}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {getCategoryIcon(metric.category)}
                <h3 className="font-semibold text-gray-900">{metric.name}</h3>
              </div>
              {getStatusIcon(metric.status)}
            </div>
            <div className="mb-3">
              <p className="text-3xl font-bold text-gray-900">
                {metric.value}
                <span className="text-sm text-gray-500 ml-1">{metric.unit}</span>
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Warning Threshold</span>
                <span className="text-warning-600 font-medium">{metric.threshold.warning}{metric.unit}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Critical Threshold</span>
                <span className="text-danger-600 font-medium">{metric.threshold.critical}{metric.unit}</span>
              </div>
              {metric.uptime && (
                <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-200">
                  <span className="text-gray-600">Uptime</span>
                  <span className="text-accent-600 font-medium">{metric.uptime}%</span>
                </div>
              )}
              <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                Last checked: {new Date(metric.lastChecked).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Incidents */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Recent Incidents</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {incidents.map((incident) => (
            <div key={incident.id} className="p-4 hover:bg-gray-50/50">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-gray-500">{incident.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${getSeverityColor(incident.severity)}`}>
                      {incident.severity}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      incident.status === 'resolved' ? 'bg-accent-50 text-accent-700' :
                      incident.status === 'investigating' ? 'bg-warning-50 text-warning-700' :
                      'bg-primary-50 text-primary-700'
                    }`}>
                      {incident.status}
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-900">{incident.title}</h4>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">{incident.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Started: {new Date(incident.startedAt).toLocaleString()}</span>
                {incident.resolvedAt && (
                  <span>Resolved: {new Date(incident.resolvedAt).toLocaleString()}</span>
                )}
              </div>
              {incident.impact && (
                <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-700">
                  <strong>Impact:</strong> {incident.impact}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Activity size={18} className="text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">System Monitoring</p>
            <ul className="text-xs text-blue-700 mt-1 space-y-1">
              <li>• Real-time monitoring of server, database, network, and application metrics</li>
              <li>• Automatic alerting when thresholds are exceeded</li>
              <li>• Incident tracking with severity levels and status updates</li>
              <li>• Uptime tracking across all system components</li>
              <li>• Historical data available for trend analysis</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
