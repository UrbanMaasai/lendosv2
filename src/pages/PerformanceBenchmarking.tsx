import { useState } from 'react';
import { TrendingUp, Award, Target, BarChart3, AlertTriangle } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface BenchmarkMetric {
  category: string;
  tenant: number;
  industry: number;
  topQuartile: number;
  unit: string;
  higher: boolean;
}

interface TenantPerformance {
  id: string;
  name: string;
  tier: string;
  metrics: {
    portfolioGrowth: number;
    par30: number;
    collectionRate: number;
    approvalRate: number;
    avgLoanSize: number;
    customerSatisfaction: number;
    operationalEfficiency: number;
    complianceScore: number;
  };
  rank: number;
  percentile: number;
}

export default function PerformanceBenchmarking() {
  const [selectedTenant, setSelectedTenant] = useState<string>('tenant_001');
  const [comparisonGroup, setComparisonGroup] = useState<'all' | 'tier' | 'size'>('all');

  const tenants: TenantPerformance[] = [
    {
      id: 'tenant_001',
      name: 'PesaFlash',
      tier: 'Growth',
      metrics: {
        portfolioGrowth: 15.3,
        par30: 3.2,
        collectionRate: 94.5,
        approvalRate: 68,
        avgLoanSize: 26470,
        customerSatisfaction: 4.5,
        operationalEfficiency: 87,
        complianceScore: 98,
      },
      rank: 3,
      percentile: 85,
    },
    {
      id: 'tenant_002',
      name: 'QuickCredit SACCO',
      tier: 'Starter',
      metrics: {
        portfolioGrowth: 12.8,
        par30: 4.1,
        collectionRate: 91.2,
        approvalRate: 62,
        avgLoanSize: 25244,
        customerSatisfaction: 4.2,
        operationalEfficiency: 82,
        complianceScore: 95,
      },
      rank: 8,
      percentile: 65,
    },
    {
      id: 'tenant_003',
      name: 'M-Kopo Finance',
      tier: 'Enterprise',
      metrics: {
        portfolioGrowth: 18.5,
        par30: 2.9,
        collectionRate: 96.8,
        approvalRate: 72,
        avgLoanSize: 28500,
        customerSatisfaction: 4.7,
        operationalEfficiency: 92,
        complianceScore: 99,
      },
      rank: 1,
      percentile: 98,
    },
    {
      id: 'tenant_004',
      name: 'SME Lend Kenya',
      tier: 'Growth',
      metrics: {
        portfolioGrowth: 14.2,
        par30: 3.5,
        collectionRate: 93.1,
        approvalRate: 65,
        avgLoanSize: 26028,
        customerSatisfaction: 4.3,
        operationalEfficiency: 85,
        complianceScore: 97,
      },
      rank: 5,
      percentile: 75,
    },
    {
      id: 'tenant_005',
      name: 'Chama Loans',
      tier: 'Starter',
      metrics: {
        portfolioGrowth: 11.3,
        par30: 4.5,
        collectionRate: 89.7,
        approvalRate: 58,
        avgLoanSize: 25785,
        customerSatisfaction: 4.0,
        operationalEfficiency: 78,
        complianceScore: 93,
      },
      rank: 12,
      percentile: 45,
    },
  ];

  const industryBenchmarks: BenchmarkMetric[] = [
    { category: 'Portfolio Growth', tenant: 15.3, industry: 12.5, topQuartile: 18.0, unit: '%', higher: true },
    { category: 'PAR 30', tenant: 3.2, industry: 4.5, topQuartile: 2.8, unit: '%', higher: false },
    { category: 'Collection Rate', tenant: 94.5, industry: 91.0, topQuartile: 96.5, unit: '%', higher: true },
    { category: 'Approval Rate', tenant: 68, industry: 62, topQuartile: 75, unit: '%', higher: true },
    { category: 'Avg Loan Size', tenant: 26.5, industry: 24.0, topQuartile: 30.0, unit: 'K', higher: true },
    { category: 'Customer Satisfaction', tenant: 4.5, industry: 4.1, topQuartile: 4.7, unit: '/5', higher: true },
    { category: 'Operational Efficiency', tenant: 87, industry: 80, topQuartile: 92, unit: '%', higher: true },
    { category: 'Compliance Score', tenant: 98, industry: 94, topQuartile: 99, unit: '%', higher: true },
  ];

  const currentTenant = tenants.find(t => t.id === selectedTenant) || tenants[0];

  const radarData = [
    { metric: 'Growth', value: currentTenant.metrics.portfolioGrowth, benchmark: 12.5, fullMark: 20 },
    { metric: 'Quality', value: 10 - currentTenant.metrics.par30, benchmark: 5.5, fullMark: 10 },
    { metric: 'Collection', value: currentTenant.metrics.collectionRate, benchmark: 91, fullMark: 100 },
    { metric: 'Approval', value: currentTenant.metrics.approvalRate, benchmark: 62, fullMark: 100 },
    { metric: 'Satisfaction', value: currentTenant.metrics.customerSatisfaction * 20, benchmark: 82, fullMark: 100 },
    { metric: 'Efficiency', value: currentTenant.metrics.operationalEfficiency, benchmark: 80, fullMark: 100 },
    { metric: 'Compliance', value: currentTenant.metrics.complianceScore, benchmark: 94, fullMark: 100 },
  ];

  const comparisonData = industryBenchmarks.map(b => ({
    name: b.category,
    You: b.tenant,
    Industry: b.industry,
    'Top Quartile': b.topQuartile,
  }));

  const getPerformanceColor = (value: number, benchmark: number, higher: boolean) => {
    if (higher) {
      return value > benchmark ? 'text-accent-600' : value < benchmark * 0.9 ? 'text-danger-600' : 'text-warning-600';
    } else {
      return value < benchmark ? 'text-accent-600' : value > benchmark * 1.1 ? 'text-danger-600' : 'text-warning-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Performance Benchmarking</h1>
          <p className="text-sm text-gray-500">Compare your performance against industry standards and top performers</p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedTenant}
            onChange={(e) => setSelectedTenant(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          >
            {tenants.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <select
            value={comparisonGroup}
            onChange={(e) => setComparisonGroup(e.target.value as any)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          >
            <option value="all">All Tenants</option>
            <option value="tier">Same Tier</option>
            <option value="size">Similar Size</option>
          </select>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-6 border border-primary-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{currentTenant.name}</h3>
            <p className="text-sm text-gray-600">{currentTenant.tier} Tier</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <Award size={24} className="text-primary-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">#{currentTenant.rank}</p>
                <p className="text-xs text-gray-500">Rank</p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-600 mb-1">Percentile</p>
            <p className="text-2xl font-bold text-primary-600">{currentTenant.percentile}th</p>
            <p className="text-xs text-gray-500">Top {100 - currentTenant.percentile}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Portfolio Growth</p>
            <p className="text-2xl font-bold text-accent-600">{currentTenant.metrics.portfolioGrowth}%</p>
            <p className="text-xs text-gray-500">vs 12.5% industry</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">PAR 30</p>
            <p className={`text-2xl font-bold ${getPerformanceColor(currentTenant.metrics.par30, 4.5, false)}`}>
              {currentTenant.metrics.par30}%
            </p>
            <p className="text-xs text-gray-500">vs 4.5% industry</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Collection Rate</p>
            <p className={`text-2xl font-bold ${getPerformanceColor(currentTenant.metrics.collectionRate, 91, true)}`}>
              {currentTenant.metrics.collectionRate}%
            </p>
            <p className="text-xs text-gray-500">vs 91% industry</p>
          </div>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Performance Radar</h3>
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="metric" stroke="#6b7280" style={{ fontSize: '12px' }} />
            <PolarRadiusAxis stroke="#9ca3af" style={{ fontSize: '10px' }} />
            <Radar name="You" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
            <Radar name="Industry Avg" dataKey="benchmark" stroke="#9ca3af" fill="#9ca3af" fillOpacity={0.3} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Tooltip contentStyle={{ fontSize: '12px' }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Benchmark Comparison */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Benchmark Comparison</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#9ca3af" style={{ fontSize: '11px' }} angle={-45} textAnchor="end" height={80} />
            <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <Tooltip contentStyle={{ fontSize: '12px' }} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="You" fill="#3b82f6" />
            <Bar dataKey="Industry" fill="#9ca3af" />
            <Bar dataKey="Top Quartile" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Metrics */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Detailed Performance Metrics</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Metric</th>
                <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">Your Performance</th>
                <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">Industry Avg</th>
                <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">Top Quartile</th>
                <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">Variance</th>
                <th className="text-center text-xs font-medium text-gray-500 px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {industryBenchmarks.map((metric, idx) => {
                const variance = metric.tenant - metric.industry;
                const variancePercent = (variance / metric.industry) * 100;
                const isGood = metric.higher ? variance > 0 : variance < 0;
                
                return (
                  <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-gray-900">{metric.category}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-sm font-bold ${getPerformanceColor(metric.tenant, metric.industry, metric.higher)}`}>
                        {metric.tenant}{metric.unit}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-600">{metric.industry}{metric.unit}</td>
                    <td className="px-4 py-3 text-right text-sm text-gray-600">{metric.topQuartile}{metric.unit}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-sm ${isGood ? 'text-accent-600' : 'text-danger-600'}`}>
                        {variance > 0 ? '+' : ''}{variance.toFixed(1)}{metric.unit}
                        <span className="text-xs ml-1">({variancePercent > 0 ? '+' : ''}{variancePercent.toFixed(1)}%)</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {isGood ? (
                        <span className="inline-flex items-center gap-1 text-xs text-accent-600">
                          <TrendingUp size={12} /> Above
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-danger-600">
                          <AlertTriangle size={12} /> Below
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Tenant Leaderboard</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {tenants.sort((a, b) => a.rank - b.rank).map((tenant, idx) => (
            <div key={tenant.id} className="p-4 hover:bg-gray-50/50 flex items-center gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-primary-100 text-primary-700 font-bold">
                {idx + 1}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{tenant.name}</p>
                <p className="text-xs text-gray-500">{tenant.tier} Tier</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">{tenant.percentile}th</p>
                <p className="text-xs text-gray-500">Percentile</p>
              </div>
              {idx === 0 && <Award size={20} className="text-yellow-500" />}
            </div>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Target size={18} className="text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Performance Benchmarking Features</p>
            <ul className="text-xs text-blue-700 mt-1 space-y-1">
              <li>• Compare performance against industry averages and top quartile</li>
              <li>• Visual radar chart showing performance across 7 key dimensions</li>
              <li>• Detailed metric-by-metric comparison with variance analysis</li>
              <li>• Tenant leaderboard with ranking and percentile</li>
              <li>• Color-coded performance indicators (above/below benchmark)</li>
              <li>• Filter by comparison group (all tenants, same tier, similar size)</li>
              <li>• Real-time performance tracking and trend analysis</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
