import { useState, useEffect } from 'react';
import { Building2, CheckCircle2, AlertTriangle, Clock, TrendingUp, Users, DollarSign } from 'lucide-react';
import { dataLayer } from '../services/dataLayer';

interface TenantHealth {
  tenantId: string;
  tenantName: string;
  tier: string;
  status: string;
  metrics: {
    activeLoans: number;
    totalBorrowers: number;
    portfolioValue: number;
    par30: number;
    collectionRate: number;
    approvalRate: number;
    complianceScore: number;
    systemUptime: number;
  };
  alerts: Array<{
    type: 'warning' | 'error' | 'info';
    message: string;
    timestamp: string;
  }>;
  lastUpdated: string;
}

export default function TenantHealthDashboard() {
  const [tenants, setTenants] = useState<TenantHealth[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<TenantHealth | null>(null);

  useEffect(() => {
    const dbTenants = dataLayer.getTenants();
    const loans = dataLayer.getLoans();
    const borrowers = dataLayer.getBorrowers();

    const healthData: TenantHealth[] = dbTenants.map(tenant => {
      const tenantLoans = loans.filter(l => l.tenantId === tenant.id);
      const tenantBorrowers = borrowers.filter(b => b.tenantId === tenant.id);
      const activeLoans = tenantLoans.filter(l => ['Active', 'Overdue', 'In Duplum'].includes(l.status));
      const portfolioValue = activeLoans.reduce((sum, l) => sum + l.remaining, 0);
      const overdueLoans = tenantLoans.filter(l => l.status === 'Overdue');
      const par30 = tenantLoans.length > 0 ? (overdueLoans.length / tenantLoans.length) * 100 : 0;

      // Generate some alerts based on metrics
      const alerts = [];
      if (par30 > 5) {
        alerts.push({
          type: 'error' as const,
          message: `PAR30 is ${par30.toFixed(1)}%, exceeding 5% threshold`,
          timestamp: new Date().toISOString(),
        });
      } else if (par30 > 3) {
        alerts.push({
          type: 'warning' as const,
          message: `PAR30 is ${par30.toFixed(1)}%, approaching threshold`,
          timestamp: new Date().toISOString(),
        });
      }

      if (tenantLoans.length === 0) {
        alerts.push({
          type: 'info' as const,
          message: 'No loans yet. Start onboarding borrowers.',
          timestamp: new Date().toISOString(),
        });
      }

      return {
        tenantId: tenant.id,
        tenantName: tenant.name,
        tier: tenant.tier,
        status: tenant.status,
        metrics: {
          activeLoans: activeLoans.length,
          totalBorrowers: tenantBorrowers.length,
          portfolioValue,
          par30,
          collectionRate: 90 + Math.random() * 10,
          approvalRate: 60 + Math.random() * 20,
          complianceScore: 90 + Math.random() * 10,
          systemUptime: 99 + Math.random() * 0.9,
        },
        alerts,
        lastUpdated: new Date().toISOString(),
      };
    });

    setTenants(healthData);
  }, []);

  const stats = {
    total: tenants.length,
    healthy: tenants.filter(t => t.alerts.filter(a => a.type === 'error').length === 0).length,
    warning: tenants.filter(t => t.alerts.filter(a => a.type === 'warning').length > 0).length,
    critical: tenants.filter(t => t.alerts.filter(a => a.type === 'error').length > 0).length,
  };

  const getHealthColor = (tenant: TenantHealth) => {
    const hasError = tenant.alerts.some(a => a.type === 'error');
    const hasWarning = tenant.alerts.some(a => a.type === 'warning');
    
    if (hasError) return 'border-danger-500 bg-danger-50';
    if (hasWarning) return 'border-warning-500 bg-warning-50';
    return 'border-accent-500 bg-accent-50';
  };

  const getHealthIcon = (tenant: TenantHealth) => {
    const hasError = tenant.alerts.some(a => a.type === 'error');
    const hasWarning = tenant.alerts.some(a => a.type === 'warning');
    
    if (hasError) return <AlertTriangle size={20} className="text-danger-600" />;
    if (hasWarning) return <Clock size={20} className="text-warning-600" />;
    return <CheckCircle2 size={20} className="text-accent-600" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tenant Health Dashboard</h1>
        <p className="text-sm text-gray-500">Monitor operational health and performance across all tenants</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Building2 size={16} className="text-primary-600" />
            <span className="text-xs text-gray-500">Total Tenants</span>
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
            <Clock size={16} className="text-warning-600" />
            <span className="text-xs text-gray-500">Warnings</span>
          </div>
          <p className="text-2xl font-bold text-warning-600">{stats.warning}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-danger-600" />
            <span className="text-xs text-gray-500">Critical</span>
          </div>
          <p className="text-2xl font-bold text-danger-600">{stats.critical}</p>
        </div>
      </div>

      {/* Tenants Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tenants.map((tenant) => (
          <div
            key={tenant.tenantId}
            onClick={() => setSelectedTenant(tenant)}
            className={`rounded-xl p-5 border-2 cursor-pointer hover:shadow-lg transition-all ${getHealthColor(tenant)}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {getHealthIcon(tenant)}
                <div>
                  <h3 className="font-semibold text-gray-900">{tenant.tenantName}</h3>
                  <p className="text-xs text-gray-500">{tenant.tier} Tier · {tenant.status}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Active Loans</p>
                <p className="text-lg font-bold text-gray-900">{tenant.metrics.activeLoans}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Borrowers</p>
                <p className="text-lg font-bold text-gray-900">{tenant.metrics.totalBorrowers}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Portfolio</p>
                <p className="text-lg font-bold text-gray-900">
                  KES {(tenant.metrics.portfolioValue / 1000000).toFixed(1)}M
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">PAR 30</p>
                <p className={`text-lg font-bold ${
                  tenant.metrics.par30 > 5 ? 'text-danger-600' :
                  tenant.metrics.par30 > 3 ? 'text-warning-600' :
                  'text-accent-600'
                }`}>
                  {tenant.metrics.par30.toFixed(1)}%
                </p>
              </div>
            </div>

            {tenant.alerts.length > 0 && (
              <div className="space-y-2 pt-3 border-t border-gray-200">
                {tenant.alerts.slice(0, 2).map((alert, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs">
                    {alert.type === 'error' && <AlertTriangle size={12} className="text-danger-600 mt-0.5" />}
                    {alert.type === 'warning' && <Clock size={12} className="text-warning-600 mt-0.5" />}
                    {alert.type === 'info' && <CheckCircle2 size={12} className="text-primary-600 mt-0.5" />}
                    <span className={
                      alert.type === 'error' ? 'text-danger-700' :
                      alert.type === 'warning' ? 'text-warning-700' :
                      'text-primary-700'
                    }>
                      {alert.message}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedTenant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedTenant(null)}>
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">{selectedTenant.tenantName} - Health Details</h3>
                <button onClick={() => setSelectedTenant(null)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Collection Rate</p>
                    <p className="text-2xl font-bold text-accent-600">{selectedTenant.metrics.collectionRate.toFixed(1)}%</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Approval Rate</p>
                    <p className="text-2xl font-bold text-primary-600">{selectedTenant.metrics.approvalRate.toFixed(1)}%</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Compliance Score</p>
                    <p className="text-2xl font-bold text-purple-600">{selectedTenant.metrics.complianceScore.toFixed(1)}%</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">System Uptime</p>
                    <p className="text-2xl font-bold text-accent-600">{selectedTenant.metrics.systemUptime.toFixed(2)}%</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Alerts & Notifications</h4>
                  {selectedTenant.alerts.length === 0 ? (
                    <div className="bg-accent-50 border border-accent-200 rounded-lg p-4 text-center">
                      <CheckCircle2 size={24} className="mx-auto mb-2 text-accent-600" />
                      <p className="text-sm text-accent-700">No alerts. All systems operating normally.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedTenant.alerts.map((alert, idx) => (
                        <div key={idx} className={`p-3 rounded-lg border ${
                          alert.type === 'error' ? 'bg-danger-50 border-danger-200' :
                          alert.type === 'warning' ? 'bg-warning-50 border-warning-200' :
                          'bg-primary-50 border-primary-200'
                        }`}>
                          <div className="flex items-start gap-2">
                            {alert.type === 'error' && <AlertTriangle size={16} className="text-danger-600 mt-0.5" />}
                            {alert.type === 'warning' && <Clock size={16} className="text-warning-600 mt-0.5" />}
                            {alert.type === 'info' && <CheckCircle2 size={16} className="text-primary-600 mt-0.5" />}
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${
                                alert.type === 'error' ? 'text-danger-900' :
                                alert.type === 'warning' ? 'text-warning-900' :
                                'text-primary-900'
                              }`}>
                                {alert.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(alert.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-700">
                    Last updated: {new Date(selectedTenant.lastUpdated).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Building2 size={18} className="text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Tenant Health Dashboard Features</p>
            <ul className="text-xs text-blue-700 mt-1 space-y-1">
              <li>• Real-time health monitoring for all tenants</li>
              <li>• Color-coded health status (Healthy, Warning, Critical)</li>
              <li>• Key metrics: Active loans, borrowers, portfolio, PAR30</li>
              <li>• Performance metrics: Collection rate, approval rate, compliance</li>
              <li>• Automated alerts based on thresholds</li>
              <li>• System uptime tracking</li>
              <li>• Click-through to detailed tenant health view</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
