import { useState } from 'react';
import { TrendingUp, Users, CheckCircle2, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, FunnelChart, Funnel, LabelList } from 'recharts';

export default function CustomerJourneyAnalytics() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  // Funnel data
  const funnelData = [
    { stage: 'Landing Page', value: 10000, fill: '#3b82f6' },
    { stage: 'Registration Started', value: 6500, fill: '#6366f1' },
    { stage: 'Registration Completed', value: 5200, fill: '#8b5cf6' },
    { stage: 'KYC Submitted', value: 4800, fill: '#a855f7' },
    { stage: 'KYC Verified', value: 4200, fill: '#d946ef' },
    { stage: 'First Loan Application', value: 3500, fill: '#ec4899' },
    { stage: 'Loan Approved', value: 2100, fill: '#f43f5e' },
    { stage: 'Loan Disbursed', value: 1950, fill: '#ef4444' },
  ];

  // Conversion rates
  const conversionRates = [
    { from: 'Landing → Registration', rate: 65, dropoff: 35 },
    { from: 'Registration → KYC', rate: 92, dropoff: 8 },
    { from: 'KYC → Verified', rate: 88, dropoff: 12 },
    { from: 'Verified → Application', rate: 83, dropoff: 17 },
    { from: 'Application → Approved', rate: 60, dropoff: 40 },
    { from: 'Approved → Disbursed', rate: 93, dropoff: 7 },
  ];

  // Drop-off reasons
  const dropoffReasons = [
    { stage: 'Registration', reason: 'Complex form', count: 450, percentage: 35 },
    { stage: 'Registration', reason: 'No phone verification', count: 380, percentage: 29 },
    { stage: 'Registration', reason: 'Privacy concerns', count: 270, percentage: 21 },
    { stage: 'KYC', reason: 'Document quality issues', count: 320, percentage: 67 },
    { stage: 'KYC', reason: 'ID mismatch', count: 120, percentage: 25 },
    { stage: 'Application', reason: 'Loan amount too high', count: 580, percentage: 41 },
    { stage: 'Application', reason: 'Interest rate concerns', count: 420, percentage: 30 },
    { stage: 'Application', reason: 'Eligibility not met', count: 280, percentage: 20 },
  ];

  // Time series data
  const timeSeriesData = [
    { date: 'Jun 1', registrations: 180, applications: 120, approvals: 72 },
    { date: 'Jun 5', registrations: 195, applications: 135, approvals: 81 },
    { date: 'Jun 10', registrations: 210, applications: 145, approvals: 87 },
    { date: 'Jun 15', registrations: 225, applications: 160, approvals: 96 },
    { date: 'Jun 20', registrations: 240, applications: 175, approvals: 105 },
    { date: 'Jun 25', registrations: 255, applications: 185, approvals: 111 },
  ];

  // Device breakdown
  const deviceData = [
    { device: 'Mobile', registrations: 3200, applications: 2100, conversion: 65.6 },
    { device: 'Desktop', registrations: 1500, applications: 1050, conversion: 70.0 },
    { device: 'Tablet', registrations: 500, applications: 350, conversion: 70.0 },
  ];

  const stats = {
    totalVisitors: 10000,
    totalRegistrations: 5200,
    totalApplications: 3500,
    totalDisbursed: 1950,
    overallConversion: 19.5,
    avgTimeToDisbursement: 2.3,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Journey Analytics</h1>
          <p className="text-sm text-gray-500">Analyze conversion funnels and identify drop-off points</p>
        </div>
        <div className="flex gap-2">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                timeRange === range
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} className="text-primary-600" />
            <span className="text-xs text-gray-500">Total Visitors</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalVisitors.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} className="text-blue-600" />
            <span className="text-xs text-gray-500">Registrations</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{stats.totalRegistrations.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-purple-600" />
            <span className="text-xs text-gray-500">Applications</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">{stats.totalApplications.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={16} className="text-accent-600" />
            <span className="text-xs text-gray-500">Disbursed</span>
          </div>
          <p className="text-2xl font-bold text-accent-600">{stats.totalDisbursed.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-green-600" />
            <span className="text-xs text-gray-500">Conversion Rate</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.overallConversion}%</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-orange-600" />
            <span className="text-xs text-gray-500">Avg Time (days)</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">{stats.avgTimeToDisbursement}</p>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Conversion Funnel</h3>
        <div className="space-y-3">
          {funnelData.map((stage, idx) => {
            const width = (stage.value / funnelData[0].value) * 100;
            const conversionRate = idx > 0 
              ? ((stage.value / funnelData[idx - 1].value) * 100).toFixed(1)
              : '100';
            
            return (
              <div key={stage.stage} className="relative">
                <div className="flex items-center gap-4">
                  <div className="w-48 text-sm text-gray-700 text-right">{stage.stage}</div>
                  <div className="flex-1 relative">
                    <div
                      className="h-12 rounded-lg flex items-center justify-between px-4 transition-all"
                      style={{ 
                        width: `${width}%`,
                        backgroundColor: stage.fill,
                        minWidth: '120px'
                      }}
                    >
                      <span className="text-white font-semibold text-sm">
                        {stage.value.toLocaleString()}
                      </span>
                      <span className="text-white/80 text-xs">
                        {conversionRate}%
                      </span>
                    </div>
                  </div>
                </div>
                {idx < funnelData.length - 1 && (
                  <div className="absolute left-64 top-12 text-xs text-gray-500">
                    ↓ {((funnelData[idx + 1].value / stage.value) * 100).toFixed(1)}% continue
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Conversion Rates by Stage */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Stage-by-Stage Conversion Rates</h3>
        <div className="space-y-3">
          {conversionRates.map((conv, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className="w-56 text-sm text-gray-700">{conv.from}</div>
              <div className="flex-1 flex items-center gap-3">
                <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-end px-3"
                    style={{ width: `${conv.rate}%` }}
                  >
                    <span className="text-white text-xs font-semibold">{conv.rate}%</span>
                  </div>
                </div>
                <div className="w-20 text-right">
                  <span className="text-xs text-danger-600 font-medium">
                    -{conv.dropoff}% drop
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Drop-off Analysis */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-warning-600" />
            Top Drop-off Reasons
          </h3>
          <div className="space-y-3">
            {dropoffReasons.slice(0, 6).map((reason, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{reason.reason}</p>
                  <p className="text-xs text-gray-500">{reason.stage} stage</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{reason.count}</p>
                  <p className="text-xs text-gray-500">{reason.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Device Breakdown</h3>
          <div className="space-y-4">
            {deviceData.map((device) => (
              <div key={device.device} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{device.device}</h4>
                  <span className="text-sm font-bold text-primary-600">
                    {device.conversion}% conversion
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Registrations</p>
                    <p className="font-semibold text-gray-900">{device.registrations.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Applications</p>
                    <p className="font-semibold text-gray-900">{device.applications.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Time Series */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Journey Metrics Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <Tooltip contentStyle={{ fontSize: '12px' }} />
            <Line type="monotone" dataKey="registrations" stroke="#3b82f6" strokeWidth={2} name="Registrations" />
            <Line type="monotone" dataKey="applications" stroke="#8b5cf6" strokeWidth={2} name="Applications" />
            <Line type="monotone" dataKey="approvals" stroke="#10b981" strokeWidth={2} name="Approvals" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <TrendingUp size={18} className="text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Journey Insights & Recommendations</p>
            <ul className="text-xs text-blue-700 mt-1 space-y-1">
              <li>• Registration completion rate (65%) could be improved by simplifying the form</li>
              <li>• KYC verification has 88% success rate - document quality is the main issue</li>
              <li>• 40% drop-off at loan approval stage suggests eligibility criteria may be too strict</li>
              <li>• Mobile users have lower conversion (65.6%) vs desktop (70%) - optimize mobile UX</li>
              <li>• Average time to disbursement (2.3 days) is within target but can be improved</li>
              <li>• Consider A/B testing registration flow to reduce drop-off</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
