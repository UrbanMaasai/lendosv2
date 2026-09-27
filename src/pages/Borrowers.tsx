import { useState } from 'react';
import { Users, Search, Filter, UserCheck, UserX, Clock, AlertTriangle, Shield, TrendingUp, Activity } from 'lucide-react';

const borrowers = [
  { id: 1, name: 'James Mwangi', phone: '+254712***847', idVerified: true, creditScore: 680, loans: 3, status: 'Active', registered: '2026-01-15', consent: true },
  { id: 2, name: 'Grace Wanjiku', phone: '+254723***291', idVerified: true, creditScore: 720, loans: 5, status: 'Active', registered: '2025-11-20', consent: true },
  { id: 3, name: 'Peter Ochieng', phone: '+254734***156', idVerified: true, creditScore: 590, loans: 1, status: 'Active', registered: '2026-03-10', consent: true },
  { id: 4, name: 'Mary Kamau', phone: '+254745***723', idVerified: false, creditScore: 0, loans: 0, status: 'Pending KYC', registered: '2026-06-01', consent: false },
  { id: 5, name: 'David Kiprop', phone: '+254756***412', idVerified: true, creditScore: 450, loans: 2, status: 'Overdue', registered: '2025-09-15', consent: true },
  { id: 6, name: 'Faith Njeri', phone: '+254767***834', idVerified: true, creditScore: 750, loans: 8, status: 'Active', registered: '2025-06-01', consent: true },
  { id: 7, name: 'Hassan Ali', phone: '+254778***567', idVerified: true, creditScore: 620, loans: 2, status: 'Active', registered: '2026-02-14', consent: true },
  { id: 8, name: 'Irene Akinyi', phone: '+254789***234', idVerified: true, creditScore: 0, loans: 0, status: 'Cooling-Off', registered: '2026-06-14', consent: true },
];

export default function Borrowers() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = borrowers.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status.toLowerCase().replace('-', ' ').includes(statusFilter);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Borrower Management</h1>
          <p className="text-sm text-gray-500">Onboarding, KYC, and consent management</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Borrowers', value: '12,847', icon: Users, color: 'bg-primary-50 text-primary-600' },
          { label: 'KYC Verified', value: '11,234', icon: UserCheck, color: 'bg-accent-50 text-accent-600' },
          { label: 'Pending KYC', value: '342', icon: Clock, color: 'bg-warning-50 text-warning-600' },
          { label: 'Consent Coverage', value: '98.7%', icon: UserCheck, color: 'bg-accent-50 text-accent-600' },
          { label: 'Rejected', value: '1,271', icon: UserX, color: 'bg-danger-50 text-danger-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow">
            <div className={`w-8 h-8 ${stat.color.split(' ')[0]} rounded-lg flex items-center justify-center mb-2`}>
              <stat.icon size={16} className={stat.color.split(' ')[1]} />
            </div>
            <p className="text-lg font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Borrower Segmentation */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Borrower Segmentation</h3>
        <div className="grid sm:grid-cols-4 gap-4">
          {[
            { segment: 'Prime', count: 4521, pct: 35, color: 'bg-accent-500', desc: 'Score 700+, low risk' },
            { segment: 'Near-Prime', count: 5139, pct: 40, color: 'bg-primary-500', desc: 'Score 500-699, moderate risk' },
            { segment: 'Sub-Prime', count: 2569, pct: 20, color: 'bg-warning-500', desc: 'Score 300-499, higher risk' },
            { segment: 'Thin-File', count: 618, pct: 5, color: 'bg-gray-400', desc: 'Limited credit history' },
          ].map((seg) => (
            <div key={seg.segment} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-900">{seg.segment}</span>
                <span className="text-xs text-gray-500">{seg.pct}%</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{seg.count.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">{seg.desc}</p>
              <div className="mt-2 w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${seg.color}`} style={{ width: `${seg.pct}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-gray-200 flex-1">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search borrowers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm outline-none w-full text-gray-700"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 bg-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending KYC</option>
            <option value="overdue">Overdue</option>
            <option value="cooling">Cooling-Off</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Borrower</th>
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">KYC</th>
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Credit Score</th>
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Loans</th>
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Consent</th>
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((borrower) => (
                <tr key={borrower.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-medium text-xs">{borrower.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{borrower.name}</p>
                        <p className="text-xs text-gray-500">{borrower.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {borrower.idVerified ? (
                      <span className="flex items-center gap-1 text-xs text-accent-600 font-medium">
                        <UserCheck size={12} /> Verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-warning-600 font-medium">
                        <Clock size={12} /> Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            borrower.creditScore >= 700 ? 'bg-accent-500' :
                            borrower.creditScore >= 500 ? 'bg-warning-500' :
                            borrower.creditScore > 0 ? 'bg-danger-500' : 'bg-gray-200'
                          }`}
                          style={{ width: `${Math.min(borrower.creditScore / 8, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">{borrower.creditScore || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{borrower.loans}</td>
                  <td className="px-6 py-4">
                    {borrower.consent ? (
                      <span className="text-xs text-accent-600 font-medium">✓ Granted</span>
                    ) : (
                      <span className="text-xs text-warning-600 font-medium">⚠ Pending</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      borrower.status === 'Active' ? 'bg-accent-50 text-accent-700' :
                      borrower.status === 'Pending KYC' ? 'bg-warning-50 text-warning-700' :
                      borrower.status === 'Overdue' ? 'bg-danger-50 text-danger-700' :
                      borrower.status === 'Cooling-Off' ? 'bg-primary-50 text-primary-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {borrower.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compliance Notice */}
      <div className="bg-warning-50 border border-warning-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle size={18} className="text-warning-600 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-warning-800">Consent Management Active</p>
          <p className="text-xs text-warning-700 mt-1">
            All borrowers must provide granular consent before data processing. Consent can be withdrawn at any time. 
            163 borrowers have pending consent renewal due to terms update (v2.4 → v2.5).
          </p>
        </div>
      </div>
    </div>
  );
}
