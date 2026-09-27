import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Users, Calendar, MapPin } from 'lucide-react';

export default function PortfolioAnalytics() {
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | '6m' | '1y'>('6m');

  // Vintage analysis data
  const vintageData = [
    { month: 'Jan', cohort1: 2.1, cohort2: 1.8, cohort3: 2.5, cohort4: 1.9 },
    { month: 'Feb', cohort1: 3.5, cohort2: 3.2, cohort3: 4.1, cohort4: 3.8 },
    { month: 'Mar', cohort1: 4.8, cohort2: 4.5, cohort3: 5.2, cohort4: 4.9 },
    { month: 'Apr', cohort1: 5.9, cohort2: 5.6, cohort3: 6.3, cohort4: 5.8 },
    { month: 'May', cohort1: 6.7, cohort2: 6.4, cohort3: 7.1, cohort4: 6.5 },
    { month: 'Jun', cohort1: 7.2, cohort2: 6.9, cohort3: 7.6, cohort4: 7.0 },
  ];

  // Geographic distribution
  const geographicData = [
    { county: 'Nairobi', loans: 1250, amount: 45000000, par30: 3.2 },
    { county: 'Mombasa', loans: 680, amount: 24000000, par30: 4.1 },
    { county: 'Kisumu', loans: 420, amount: 15000000, par30: 3.8 },
    { county: 'Nakuru', loans: 380, amount: 13500000, par30: 3.5 },
    { county: 'Eldoret', loans: 290, amount: 10200000, par30: 4.3 },
    { county: 'Thika', loans: 245, amount: 8700000, par30: 3.9 },
    { county: 'Nyeri', loans: 198, amount: 7000000, par30: 3.1 },
    { county: 'Machakos', loans: 167, amount: 5900000, par30: 4.5 },
  ];

  // Product performance
  const productData = [
    { name: 'Salary Advance', loans: 1850, amount: 65000000, par30: 3.2, approval: 68, avgTicket: 35135 },
    { name: 'Micro Personal', loans: 1240, amount: 42000000, par30: 5.8, approval: 54, avgTicket: 33871 },
    { name: 'SME Working Capital', loans: 320, amount: 28000000, par30: 2.1, approval: 72, avgTicket: 87500 },
    { name: 'Emergency Loan', loans: 490, amount: 7500000, par30: 7.2, approval: 41, avgTicket: 15306 },
  ];

  // Monthly trends
  const monthlyTrends = [
    { month: 'Jan', disbursements: 45000000, repayments: 42000000, newBorrowers: 245 },
    { month: 'Feb', disbursements: 52000000, repayments: 48000000, newBorrowers: 287 },
    { month: 'Mar', disbursements: 58000000, repayments: 54000000, newBorrowers: 312 },
    { month: 'Apr', disbursements: 61000000, repayments: 57000000, newBorrowers: 298 },
    { month: 'May', disbursements: 67000000, repayments: 63000000, newBorrowers: 334 },
    { month: 'Jun', disbursements: 72000000, repayments: 68000000, newBorrowers: 356 },
  ];

  // Risk distribution
  const riskData = [
    { name: 'Low Risk', value: 45, color: '#10b981' },
    { name: 'Medium Risk', value: 32, color: '#3b82f6' },
    { name: 'High Risk', value: 18, color: '#f59e0b' },
    { name: 'Very High Risk', value: 5, color: '#ef4444' },
  ];

  // Summary stats
  const stats = {
    totalPortfolio: 142800000,
    activeLoans: 3900,
    avgLoanSize: 36615,
    par30: 4.2,
    par60: 2.3,
    par90: 1.2,
    collectionRate: 94.5,
    approvalRate: 62,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Portfolio Analytics</h1>
          <p className="text-sm text-gray-500">Advanced portfolio insights and performance metrics</p>
        </div>
        <div className="flex gap-2">
          {(['30d', '90d', '6m', '1y'] as const).map((range) => (
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={16} className="text-primary-600" />
            <span className="text-xs text-gray-500">Total Portfolio</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">KES {(stats.totalPortfolio / 1000000).toFixed(1)}M</p>
          <p className="text-xs text-green-600 mt-1">+12.5% vs last period</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} className="text-blue-600" />
            <span className="text-xs text-gray-500">Active Loans</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.activeLoans.toLocaleString()}</p>
          <p className="text-xs text-green-600 mt-1">+8.3% vs last period</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={16} className="text-red-600" />
            <span className="text-xs text-gray-500">PAR 30</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.par30}%</p>
          <p className="text-xs text-green-600 mt-1">-0.8% vs last period</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-green-600" />
            <span className="text-xs text-gray-500">Collection Rate</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.collectionRate}%</p>
          <p className="text-xs text-green-600 mt-1">+2.1% vs last period</p>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Monthly Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={monthlyTrends}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
            <Tooltip 
              formatter={(value: number) => [`KES ${(value / 1000000).toFixed(2)}M`, '']}
              contentStyle={{ fontSize: '12px' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Area type="monotone" dataKey="disbursements" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Disbursements" />
            <Area type="monotone" dataKey="repayments" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Repayments" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Vintage Analysis */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Vintage Analysis (Default Rate by Cohort)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={vintageData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} tickFormatter={(value) => `${value}%`} />
            <Tooltip 
              formatter={(value: number) => [`${value.toFixed(1)}%`, '']}
              contentStyle={{ fontSize: '12px' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Line type="monotone" dataKey="cohort1" stroke="#3b82f6" strokeWidth={2} name="Jan 2026" />
            <Line type="monotone" dataKey="cohort2" stroke="#10b981" strokeWidth={2} name="Feb 2026" />
            <Line type="monotone" dataKey="cohort3" stroke="#f59e0b" strokeWidth={2} name="Mar 2026" />
            <Line type="monotone" dataKey="cohort4" stroke="#8b5cf6" strokeWidth={2} name="Apr 2026" />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-500 mt-2">
          Shows default rate progression for each origination month. Lower curves indicate better performing cohorts.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Geographic Distribution */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin size={18} className="text-primary-600" />
            Geographic Distribution
          </h3>
          <div className="space-y-3">
            {geographicData.map((county) => (
              <div key={county.county} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{county.county}</p>
                  <p className="text-xs text-gray-500">{county.loans} loans · KES {(county.amount / 1000000).toFixed(1)}M</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${
                    county.par30 > 4 ? 'text-red-600' : county.par30 > 3.5 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {county.par30}% PAR30
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={riskData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {riskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`${value}%`, '']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {riskData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-xs text-gray-700">{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product Performance */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Product Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Product</th>
                <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">Active Loans</th>
                <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">Portfolio Value</th>
                <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">Avg Ticket</th>
                <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">PAR 30</th>
                <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">Approval Rate</th>
              </tr>
            </thead>
            <tbody>
              {productData.map((product) => (
                <tr key={product.name} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-gray-900">{product.name}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm text-gray-700">{product.loans.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm text-gray-700">KES {(product.amount / 1000000).toFixed(1)}M</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm text-gray-700">KES {product.avgTicket.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-sm font-medium ${
                      product.par30 > 5 ? 'text-red-600' : product.par30 > 3 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {product.par30}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm text-gray-700">{product.approval}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <TrendingUp size={18} className="text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Portfolio Insights</p>
            <ul className="text-xs text-blue-700 mt-1 space-y-1">
              <li>• Portfolio grew 12.5% in the last 6 months, outpacing market average of 8.2%</li>
              <li>• PAR30 improved by 0.8% due to enhanced collections strategy</li>
              <li>• SME Working Capital shows lowest risk (2.1% PAR30) with highest approval rate (72%)</li>
              <li>• Nairobi accounts for 42% of portfolio with strong performance (3.2% PAR30)</li>
              <li>• Vintage analysis shows improving cohort performance over time</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
