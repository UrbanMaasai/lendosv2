import { useEffect, useState } from 'react';
import { Shield, CheckCircle2, AlertTriangle, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { dataLayer } from '../services/dataLayer';

interface ComplianceMetric {
  name: string;
  code: string;
  score: number;
  total: number;
  status: 'pass' | 'warning' | 'fail';
  trend: 'up' | 'down' | 'stable';
}

interface TenantScorecard {
  tenantId: string;
  tenantName: string;
  overallScore: number;
  metrics: ComplianceMetric[];
  lastUpdated: string;
}

export default function ComplianceScorecard() {
  const [scorecards, setScorecards] = useState<TenantScorecard[]>([]);

  useEffect(() => {
    // Generate compliance scorecards for each tenant
    const tenants = dataLayer.getTenants();
    const logs = dataLayer.getAuditLogs();
    
    const cards: TenantScorecard[] = tenants.map(tenant => {
      const tenantLogs = logs.filter(l => l.tenantId === tenant.id);
      
      // Calculate metrics based on audit logs
      const inDuplumChecks = tenantLogs.filter(l => l.action.includes('IN_DUPLUM')).length;
      const consentGrants = tenantLogs.filter(l => l.action.includes('CONSENT')).length;
      const collectionContacts = tenantLogs.filter(l => l.action.includes('COLLECTION')).length;
      const kfsGenerations = tenantLogs.filter(l => l.action.includes('KFS')).length;
      
      const metrics: ComplianceMetric[] = [
        {
          name: 'In Duplum Enforcement',
          code: 'LS-005',
          score: inDuplumChecks,
          total: Math.max(inDuplumChecks, 100),
          status: 'pass',
          trend: 'stable',
        },
        {
          name: 'Consent Coverage',
          code: 'CON-001',
          score: consentGrants,
          total: Math.max(consentGrants + 5, 100),
          status: consentGrants > 90 ? 'pass' : 'warning',
          trend: 'up',
        },
        {
          name: 'Collections Conduct',
          code: 'CL-003 to CL-010',
          score: collectionContacts,
          total: Math.max(collectionContacts, 50),
          status: 'pass',
          trend: 'stable',
        },
        {
          name: 'KFS Generation',
          code: 'KFS-001',
          score: kfsGenerations,
          total: Math.max(kfsGenerations, 50),
          status: kfsGenerations > 40 ? 'pass' : 'warning',
          trend: 'up',
        },
        {
          name: 'Cooling-Off Compliance',
          code: 'COP-001',
          score: 95,
          total: 100,
          status: 'pass',
          trend: 'stable',
        },
        {
          name: 'Contact Hours',
          code: 'CL-004',
          score: 100,
          total: 100,
          status: 'pass',
          trend: 'stable',
        },
      ];

      const overallScore = Math.round(
        metrics.reduce((sum, m) => sum + (m.score / m.total) * 100, 0) / metrics.length
      );

      return {
        tenantId: tenant.id,
        tenantName: tenant.name,
        overallScore,
        metrics,
        lastUpdated: new Date().toISOString(),
      };
    });

    setScorecards(cards);
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-accent-600';
    if (score >= 70) return 'text-warning-600';
    return 'text-danger-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-accent-50 border-accent-200';
    if (score >= 70) return 'bg-warning-50 border-warning-200';
    return 'bg-danger-50 border-danger-200';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Compliance Scorecards</h2>
            <p className="text-sm text-gray-500">Real-time compliance health per tenant</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-accent-600 bg-accent-50 px-3 py-1.5 rounded-full">
            <Shield size={14} />
            <span>All Tenants Compliant</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scorecards.map((card) => (
            <div key={card.tenantId} className={`rounded-xl border-2 p-5 ${getScoreBg(card.overallScore)}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{card.tenantName}</h3>
                  <p className="text-xs text-gray-500">
                    Updated {new Date(card.lastUpdated).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-3xl font-bold ${getScoreColor(card.overallScore)}`}>
                    {card.overallScore}%
                  </p>
                  <p className="text-xs text-gray-500">Overall Score</p>
                </div>
              </div>

              <div className="space-y-2">
                {card.metrics.map((metric) => (
                  <div key={metric.code} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {metric.status === 'pass' ? (
                        <CheckCircle2 size={14} className="text-accent-500 flex-shrink-0" />
                      ) : metric.status === 'warning' ? (
                        <AlertTriangle size={14} className="text-warning-500 flex-shrink-0" />
                      ) : (
                        <AlertCircle size={14} className="text-danger-500 flex-shrink-0" />
                      )}
                      <span className="text-xs text-gray-700 truncate">{metric.name}</span>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className="text-xs font-medium text-gray-900">
                        {Math.round((metric.score / metric.total) * 100)}%
                      </span>
                      {metric.trend === 'up' && <TrendingUp size={12} className="text-accent-500" />}
                      {metric.trend === 'down' && <TrendingDown size={12} className="text-danger-500" />}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      card.overallScore >= 90 ? 'bg-accent-500' :
                      card.overallScore >= 70 ? 'bg-warning-500' :
                      'bg-danger-500'
                    }`}
                    style={{ width: `${card.overallScore}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
