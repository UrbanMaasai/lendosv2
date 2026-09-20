import { useState } from 'react';
import { BarChart3, Download, TrendingUp, AlertTriangle, DollarSign, Calendar, Filter, Activity } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const parData = [
  { month: 'Jan', par30: 5.2, par60: 3.1, par90: 1.8 },
  { month: 'Feb', par30: 4.8, par60: 2.9, par90: 1.6 },
  { month: 'Mar', par30: 5.1, par60: 3.2, par90: 1.9 },
  { month: 'Apr', par30: 4.5, par60: 2.7, par90: 1.5 },
  { month: 'May', par30: 4.3, par60: 2.5, par90: 1.4 },
  { month: 'Jun', par30: 4.2, par60: 2.3, par90: 1.2 },
];

const vintageData = [
  { month: 'Jan', 'Jan-26': 2.1, 'Feb-26': 3.4, 'Mar-26': 4.2, 'Apr-26': 5.1, 'May-26': 5.8, 'Jun-26': 6.2 },
  { month: 'Feb', 'Jan-26': 1.8, 'Feb-26': 2.9, 'Mar-26': 3.6, 'Apr-26': 4.3, 'May-26': 4.8, 'Jun-26': 5.2 },
  { month: 'Mar', 'Jan-26': 1.5, 'Feb-26': 2.4, 'Mar-26': 3.1, 'Apr-26': 3.7, 'May-26': 4.1, 'Jun-26': 4.5 },
];

const revenueData = [
  { month: 'Jan', revenue: 4200000, costs: 2800000 },
  { month: 'Feb', revenue: 5100000, costs: 3200000 },
  { month: 'Mar', revenue: 5800000, costs: 3500000 },
  { month: 'Apr', revenue: 6400000, costs: 3800000 },
  { month: 'May', revenue: 7200000, costs: 4100000 },
  { month: 'Jun', revenue: 8100000, costs: 4500000 },
];

const rollRateData = [
  { from: 'Current → 1-30', rate: 12.3 },
  { from: '1-30 → 31-60', rate: 28.5 },
  { from: '31-60 → 61-90', rate: 35.2 },
  { from: '61-90 → 90+', rate: 42.8 },
];

const productPerformance = [
  { product: 'Salary Advance', loans: 2340, revenue: 18200000, par30: 3.2, approval: 68 },
  { product: 'Micro Personal', loans: 1205, revenue: 12400000, par30: 5.8, approval: 54 },
  { product: 'First-Time', loans: 312, revenue: 2100000, par30: 7.2, approval: 41 },
  { product: 'SME Working Capital', loans: 89, revenue: 8500000, par30: 2.1, approval: 72 },
];

export default function Reports() {
  const [tab, setTab] = useState<'portfolio' | 'vintage' | 'profitability' | 'regulatory'>('portfolio');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-sm text-gray-500">Portfolio performance, risk metrics, and regulatory reporting</p>
        </div>
        <button className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
          <Download size={16} /> Export Report
        </button>
      </div>

      {/* Date Range & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-gray-200">
          <Calendar size={16} className="text-gray-400" />
          <select className="bg-transparent text-sm outline-none text-gray-700">
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>Last 6 months</option>
            <option>Year to date</option>
            <option>Custom range</option>
          </select>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-gray-200">
          <Filter size={16} className="text-gray-400" />
          <select className="bg-transparent text-sm outline-none text-gray-700">
            <option>All Tenants</option>
            <option>PesaFlash</option>
            <option>QuickCredit SACCO</option>
            <option>M-Kopo Finance</option>
          </select>
        </div>
        <div className="flex-1"></div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs bg-accent-50 text-accent-700 px-2 py-1 rounded-full">
            <Activity size={10} /> Live Data
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 w-fit overflow-x-auto">
        {([
          { key: 'portfolio', label: 'PAR Analysis' },
          { key: 'vintage', label: 'Vintage Curves' },
          { key: 'profitability', label: 'Profitability' },
          { key: 'regulatory', label: 'Regulatory' },
        ] as const).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${tab === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'portfolio' && (
        <div className="space-y-6">
          {/* PAR Trend */}
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-1">Portfolio-at-Risk Trend</h3>
            <p className="text-sm text-gray-500 mb-4">PAR 30, 60, 90 over last 6 months</p>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={parData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" unit="%" />
                <Tooltip formatter={(value: number) => [`${value}%`]} />
                <Legend />
                <Line type="monotone" dataKey="par30" stroke="#f59e0b" strokeWidth={2} name="PAR 30" dot={false} />
                <Line type="monotone" dataKey="par60" stroke="#f97316" strokeWidth={2} name="PAR 60" dot={false} />
                <Line type="monotone" dataKey="par90" stroke="#ef4444" strokeWidth={2} name="PAR 90" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Roll Rate */}
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-1">Roll Rate Analysis</h3>
            <p className="text-sm text-gray-500 mb-4">Migration between delinquency buckets</p>
            <div className="grid sm:grid-cols-4 gap-4">
              {rollRateData.map((item) => (
                <div key={item.from} className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">{item.rate}%</p>
                  <p className="text-xs text-gray-500 mt-1">{item.from}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Product Performance */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Product Performance</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Product</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Active Loans</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Revenue</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">PAR 30</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Approval Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {productPerformance.map((p) => (
                    <tr key={p.product} className="border-b border-gray-50">
                      <td className="px-6 py-3 text-sm font-medium text-gray-900">{p.product}</td>
                      <td className="px-6 py-3 text-sm text-gray-700">{p.loans.toLocaleString()}</td>
                      <td className="px-6 py-3 text-sm text-gray-700">KES {(p.revenue / 1000000).toFixed(1)}M</td>
                      <td className="px-6 py-3">
                        <span className={`text-sm font-medium ${p.par30 > 5 ? 'text-danger-600' : 'text-accent-600'}`}>
                          {p.par30}%
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-700">{p.approval}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'vintage' && (
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-1">Vintage Curves (Cohort Analysis)</h3>
          <p className="text-sm text-gray-500 mb-4">Default rates by origination month</p>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={vintageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" unit="%" />
              <Tooltip formatter={(value: number) => [`${value}%`]} />
              <Legend />
              <Area type="monotone" dataKey="Jan-26" stroke="#3b82f6" fill="#3b82f620" strokeWidth={2} />
              <Area type="monotone" dataKey="Feb-26" stroke="#22c55e" fill="#22c55e20" strokeWidth={2} />
              <Area type="monotone" dataKey="Mar-26" stroke="#f59e0b" fill="#f59e0b20" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {tab === 'profitability' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-1">Revenue vs Costs</h3>
            <p className="text-sm text-gray-500 mb-4">Monthly profitability trend</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
                <Tooltip formatter={(value: number) => [`KES ${(value / 1000000).toFixed(1)}M`]} />
                <Legend />
                <Bar dataKey="revenue" fill="#22c55e" radius={[4, 4, 0, 0]} name="Revenue" />
                <Bar dataKey="costs" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Costs" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: 'Net Interest Margin', value: '18.4%', trend: '+1.2%' },
              { label: 'Cost-to-Income Ratio', value: '55.6%', trend: '-2.3%' },
              { label: 'Return on Portfolio', value: '12.8%', trend: '+0.8%' },
            ].map((metric) => (
              <div key={metric.label} className="bg-white rounded-xl p-5 border border-gray-100">
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                <p className="text-sm text-gray-500">{metric.label}</p>
                <p className="text-xs text-accent-600 mt-1">{metric.trend} vs last month</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'regulatory' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Regulatory Reports</h3>
            <div className="space-y-3">
              {[
                { name: 'CBK Monthly Return', due: 'Last day of month', status: 'Ready', format: 'CBK Template A' },
                { name: 'ODPC Data Processing Report', due: 'Quarterly', status: 'Ready', format: 'ODPC Form DP-1' },
                { name: 'DLAK Code of Conduct Self-Assessment', due: 'Quarterly', status: 'In Progress', format: 'DLAK Template' },
                { name: 'CRB Negative Listing Report', due: 'Monthly', status: 'Ready', format: 'CRB Standard' },
                { name: 'In Duplum Compliance Certificate', due: 'Monthly', status: 'Ready', format: 'Auto-generated' },
              ].map((report) => (
                <div key={report.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{report.name}</p>
                    <p className="text-xs text-gray-500">Due: {report.due} · Format: {report.format}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      report.status === 'Ready' ? 'bg-accent-50 text-accent-700' : 'bg-warning-50 text-warning-700'
                    }`}>
                      {report.status}
                    </span>
                    <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
