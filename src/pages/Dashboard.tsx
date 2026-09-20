import { useState, useEffect } from 'react';
import {
  TrendingUp, TrendingDown, Users, FileText, AlertTriangle,
  DollarSign, Clock, CheckCircle2, ArrowUpRight, Activity,
  Zap, Shield, PhoneCall, Bell
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { dataLayer } from '../services/dataLayer';

const disbursementData = [
  { month: 'Jul', amount: 12500000 },
  { month: 'Aug', amount: 18200000 },
  { month: 'Sep', amount: 22100000 },
  { month: 'Oct', amount: 28500000 },
  { month: 'Nov', amount: 35200000 },
  { month: 'Dec', amount: 42800000 },
];

const portfolioData = [
  { name: 'Current', value: 72, color: '#22c55e' },
  { name: '1-30 DPD', value: 15, color: '#f59e0b' },
  { name: '31-60 DPD', value: 8, color: '#f97316' },
  { name: '61-90 DPD', value: 3, color: '#ef4444' },
  { name: '90+ DPD', value: 2, color: '#991b1b' },
];

const repaymentData = [
  { day: 'Mon', collected: 4200000, expected: 4500000 },
  { day: 'Tue', collected: 3800000, expected: 4200000 },
  { day: 'Wed', collected: 5100000, expected: 4800000 },
  { day: 'Thu', collected: 4600000, expected: 5000000 },
  { day: 'Fri', collected: 5800000, expected: 5500000 },
  { day: 'Sat', collected: 2100000, expected: 2000000 },
  { day: 'Sun', collected: 800000, expected: 1000000 },
];

const recentLoans = [
  { id: 'LN-2026-0847', borrower: 'James Mwangi', amount: 15000, status: 'Active', product: 'Salary Advance' },
  { id: 'LN-2026-0846', borrower: 'Grace Wanjiku', amount: 8500, status: 'Pending Review', product: 'Micro Personal' },
  { id: 'LN-2026-0845', borrower: 'Peter Ochieng', amount: 25000, status: 'Disbursed', product: 'Salary Advance' },
  { id: 'LN-2026-0844', borrower: 'Mary Kamau', amount: 5000, status: 'Repaid', product: 'First-Time' },
  { id: 'LN-2026-0843', borrower: 'David Kiprop', amount: 12000, status: 'Overdue', product: 'Micro Personal' },
];

const kpis = [
  { label: 'Active Loans', value: '3,847', change: '+12.5%', up: true, icon: FileText, sparkline: [20, 25, 23, 28, 32, 35, 38] },
  { label: 'Portfolio Value', value: 'KES 142.8M', change: '+8.3%', up: true, icon: DollarSign, sparkline: [100, 110, 115, 120, 130, 138, 142] },
  { label: 'PAR 30', value: '4.2%', change: '-0.8%', up: true, icon: AlertTriangle, sparkline: [5.5, 5.2, 4.8, 4.5, 4.3, 4.2, 4.2] },
  { label: 'Disbursements Today', value: 'KES 2.4M', change: '+15.2%', up: true, icon: TrendingUp, sparkline: [1.2, 1.5, 1.8, 2.0, 2.2, 2.3, 2.4] },
];

const liveActivities = [
  { id: 1, type: 'disbursement', message: 'KES 15,000 disbursed to James Mwangi', time: '2 min ago', icon: DollarSign, color: 'text-accent-600 bg-accent-50' },
  { id: 2, type: 'repayment', message: 'KES 8,500 received from Grace Wanjiku', time: '5 min ago', icon: CheckCircle2, color: 'text-primary-600 bg-primary-50' },
  { id: 3, type: 'application', message: 'New loan application from Peter Ochieng', time: '12 min ago', icon: FileText, color: 'text-purple-600 bg-purple-50' },
  { id: 4, type: 'compliance', message: 'In duplum check passed for LN-2026-0847', time: '15 min ago', icon: Shield, color: 'text-accent-600 bg-accent-50' },
  { id: 5, type: 'collection', message: 'PTP logged for David Kiprop (Jun 20)', time: '23 min ago', icon: PhoneCall, color: 'text-warning-600 bg-warning-50' },
];

const quickActions = [
  { label: 'New Loan', icon: FileText, action: 'Create new loan application' },
  { label: 'Disburse', icon: DollarSign, action: 'Process disbursement' },
  { label: 'View Reports', icon: TrendingUp, action: 'Generate reports' },
  { label: 'Compliance', icon: Shield, action: 'Check compliance status' },
];

export default function Dashboard() {
  const [liveData, setLiveData] = useState({
    totalLoans: 0,
    portfolioValue: 0,
    activeBorrowers: 0,
    auditLogs: 0,
    chainVerified: true,
  });

  useEffect(() => {
    // Load live data from data layer
    const loans = dataLayer.getLoans();
    const borrowers = dataLayer.getBorrowers();
    const logs = dataLayer.getAuditLogs();
    
    const activeLoans = loans.filter(l => ['Active', 'Disbursed', 'Overdue', 'In Duplum'].includes(l.status));
    const portfolioValue = activeLoans.reduce((sum, l) => sum + l.remaining, 0);
    
    setLiveData({
      totalLoans: activeLoans.length,
      portfolioValue,
      activeBorrowers: borrowers.filter(b => b.status === 'Active').length,
      auditLogs: logs.length,
      chainVerified: dataLayer.verifyAuditChain(),
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Dashboard</h1>
          <p className="text-sm text-gray-500">Real-time overview across all tenants</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock size={14} />
          <span>Live data · {liveData.auditLogs} audit entries</span>
          {liveData.chainVerified && (
            <span className="flex items-center gap-1 text-xs text-accent-600 bg-accent-50 px-2 py-0.5 rounded-full">
              <CheckCircle2 size={10} /> Chain verified
            </span>
          )}
        </div>
      </div>

      {/* KPI Cards with Sparklines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-md transition-all hover:border-primary-200 group cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                <kpi.icon size={18} className="text-primary-600" />
              </div>
              <span className={`flex items-center gap-1 text-xs font-medium ${kpi.up ? 'text-accent-600' : 'text-danger-600'}`}>
                {kpi.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {kpi.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
            <p className="text-sm text-gray-500 mt-1">{kpi.label}</p>
            {/* Sparkline */}
            <div className="mt-3 h-8">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={kpi.sparkline.map((v, i) => ({ value: v, index: i }))}>
                  <Line type="monotone" dataKey="value" stroke={kpi.up ? '#22c55e' : '#ef4444'} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-5 border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.label}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all group"
              title={action.action}
            >
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                <action.icon size={20} className="text-gray-600 group-hover:text-primary-600 transition-colors" />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-primary-700">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Disbursement Trend */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-900">Disbursement Trend</h3>
              <p className="text-sm text-gray-500">Monthly disbursement volume</p>
            </div>
            <span className="text-xs bg-accent-50 text-accent-700 px-2 py-1 rounded-full font-medium">+34% MoM</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={disbursementData}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
              <Tooltip formatter={(value: number) => [`KES ${(value / 1000000).toFixed(1)}M`, 'Disbursed']} />
              <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} fill="url(#colorAmount)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Portfolio Health */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-1">Portfolio Health</h3>
          <p className="text-sm text-gray-500 mb-4">Loan status distribution</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={portfolioData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={2}>
                {portfolioData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`${value}%`, '']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {portfolioData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-medium text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Activity Feed */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></div>
            <h3 className="font-semibold text-gray-900">Live Activity</h3>
          </div>
          <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">View All</button>
        </div>
        <div className="space-y-3">
          {liveActivities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`w-8 h-8 ${activity.color.split(' ')[1]} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <activity.icon size={14} className={activity.color.split(' ')[0]} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Second Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Repayment Collection */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-900">Repayment Collection</h3>
              <p className="text-sm text-gray-500">This week's collection performance</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={repaymentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
              <Tooltip formatter={(value: number) => [`KES ${(value / 1000000).toFixed(2)}M`]} />
              <Bar dataKey="expected" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Expected" />
              <Bar dataKey="collected" fill="#22c55e" radius={[4, 4, 0, 0]} name="Collected" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Loans */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Recent Loans</h3>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              View All <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="space-y-3">
            {recentLoans.map((loan) => (
              <div key={loan.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <Users size={14} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{loan.borrower}</p>
                    <p className="text-xs text-gray-500">{loan.id} · {loan.product}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">KES {loan.amount.toLocaleString()}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    loan.status === 'Active' ? 'bg-accent-50 text-accent-700' :
                    loan.status === 'Disbursed' ? 'bg-primary-50 text-primary-700' :
                    loan.status === 'Repaid' ? 'bg-gray-100 text-gray-600' :
                    loan.status === 'Overdue' ? 'bg-danger-50 text-danger-700' :
                    'bg-warning-50 text-warning-700'
                  }`}>
                    {loan.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compliance Status */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">Compliance Status</h3>
            <p className="text-sm text-gray-500">Platform-wide compliance monitoring</p>
          </div>
          <span className="text-xs bg-accent-50 text-accent-700 px-3 py-1 rounded-full font-medium flex items-center gap-1">
            <CheckCircle2 size={12} /> All Clear
          </span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'In Duplum Checks', value: '100%', desc: 'All loans within 2× cap' },
            { label: 'Consent Coverage', value: '98.7%', desc: 'Borrowers with valid consent' },
            { label: 'KFS Generation', value: '100%', desc: 'All active loans have KFS' },
            { label: 'Audit Log Integrity', value: 'Verified', desc: 'Hash chain intact (7yr)' },
          ].map((item) => (
            <div key={item.label} className="bg-gray-50 rounded-lg p-4">
              <p className="text-lg font-bold text-gray-900">{item.value}</p>
              <p className="text-sm font-medium text-gray-700">{item.label}</p>
              <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
