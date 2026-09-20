import { useState, useEffect } from 'react';
import { FileText, Search, Filter, Download, Eye, AlertTriangle, CheckCircle2, Clock, DollarSign, TrendingUp, Activity, Zap } from 'lucide-react';
import { dataLayer, Loan } from '../services/dataLayer';

interface LoanDisplay {
  id: string;
  borrower: string;
  product: string;
  principal: number;
  interest: number;
  totalDue: number;
  paid: number;
  remaining: number;
  status: string;
  dueDate: string;
  disbursed: string;
  inDuplum: boolean;
}

const seedLoans: LoanDisplay[] = [
  { id: 'LN-2026-0847', borrower: 'James Mwangi', product: 'Salary Advance', principal: 15000, interest: 1350, totalDue: 16350, paid: 8175, remaining: 8175, status: 'Active', dueDate: '2026-07-15', disbursed: '2026-06-15', inDuplum: false },
  { id: 'LN-2026-0846', borrower: 'Grace Wanjiku', product: 'Micro Personal', principal: 8500, interest: 1020, totalDue: 9520, paid: 0, remaining: 9520, status: 'Pending Review', dueDate: '2026-07-20', disbursed: '-', inDuplum: false },
  { id: 'LN-2026-0845', borrower: 'Peter Ochieng', product: 'Salary Advance', principal: 25000, interest: 2250, totalDue: 27250, paid: 27250, remaining: 0, status: 'Repaid', dueDate: '2026-06-30', disbursed: '2026-05-30', inDuplum: false },
  { id: 'LN-2026-0844', borrower: 'Mary Kamau', product: 'First-Time', principal: 5000, interest: 350, totalDue: 5350, paid: 5350, remaining: 0, status: 'Repaid', dueDate: '2026-06-10', disbursed: '2026-05-10', inDuplum: false },
  { id: 'LN-2026-0843', borrower: 'David Kiprop', product: 'Micro Personal', principal: 12000, interest: 1440, totalDue: 13440, paid: 4000, remaining: 9440, status: 'Overdue', dueDate: '2026-06-01', disbursed: '2026-05-01', inDuplum: false },
  { id: 'LN-2026-0840', borrower: 'Samuel Otieno', product: 'Salary Advance', principal: 20000, interest: 36000, totalDue: 40000, paid: 40000, remaining: 0, status: 'In Duplum', dueDate: '2026-03-15', disbursed: '2025-09-15', inDuplum: true },
  { id: 'LN-2026-0839', borrower: 'Irene Akinyi', product: 'First-Time', principal: 10000, interest: 700, totalDue: 10700, paid: 0, remaining: 10700, status: 'Cooling-Off', dueDate: '-', disbursed: '-', inDuplum: false },
];

export default function Loans() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [allLoans, setAllLoans] = useState<LoanDisplay[]>(seedLoans);

  useEffect(() => {
    // Load loans from data layer (super admin sees all tenants)
    const dbLoans = dataLayer.getLoans();
    const mapped: LoanDisplay[] = dbLoans.map((l: Loan) => {
      const borrower = dataLayer.getBorrower(l.borrowerId);
      const product = dataLayer.getProduct(l.productId);
      return {
        id: l.id,
        borrower: borrower?.name || 'Unknown',
        product: product?.name || 'Unknown',
        principal: l.principal,
        interest: l.interest,
        totalDue: l.totalDue,
        paid: l.paid,
        remaining: l.remaining,
        status: l.status,
        dueDate: l.dueDate,
        disbursed: l.disbursedAt?.split('T')[0] || '-',
        inDuplum: l.inDuplumReached,
      };
    });
    if (mapped.length > 0) {
      setAllLoans([...mapped, ...seedLoans]);
    }
  }, []);

  const filtered = allLoans.filter((l: LoanDisplay) => {
    const matchesSearch = l.borrower.toLowerCase().includes(search.toLowerCase()) || l.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || l.status.toLowerCase().replace('-', ' ').includes(statusFilter);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Loan Servicing</h1>
          <p className="text-sm text-gray-500">Manage disbursements, repayments, and loan lifecycle</p>
        </div>
        <button className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
          <Download size={16} /> Export
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Loans', value: '3,847', sub: 'KES 142.8M outstanding', icon: FileText },
          { label: 'Disbursed Today', value: 'KES 2.4M', sub: '47 loans', icon: DollarSign },
          { label: 'In Duplum Reached', value: '23', sub: 'Further charges blocked', icon: AlertTriangle },
          { label: 'Pending Review', value: '156', sub: 'Avg wait: 2.3 hours', icon: Clock },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <stat.icon size={18} className="text-primary-600" />
            </div>
            <p className="text-xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Loan Lifecycle */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Loan Lifecycle Pipeline</h3>
        <div className="flex flex-wrap items-center gap-2">
          {[
            { stage: 'Application', count: 234, color: 'bg-gray-100 text-gray-700' },
            { stage: 'KYC Review', count: 89, color: 'bg-warning-50 text-warning-700' },
            { stage: 'Decision', count: 156, color: 'bg-primary-50 text-primary-700' },
            { stage: 'Cooling-Off', count: 42, color: 'bg-purple-50 text-purple-700' },
            { stage: 'Approved', count: 67, color: 'bg-accent-50 text-accent-700' },
            { stage: 'Disbursed', count: 47, color: 'bg-accent-100 text-accent-800' },
            { stage: 'Active', count: 3847, color: 'bg-primary-100 text-primary-800' },
          ].map((stage, index) => (
            <div key={stage.stage} className="flex items-center gap-2">
              <div className={`${stage.color} px-3 py-2 rounded-lg text-center min-w-[80px]`}>
                <p className="text-lg font-bold">{stage.count.toLocaleString()}</p>
                <p className="text-xs font-medium">{stage.stage}</p>
              </div>
              {index < 6 && (
                <div className="text-gray-300 text-xl">→</div>
              )}
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
            placeholder="Search by loan ID or borrower..."
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
            <option value="overdue">Overdue</option>
            <option value="repaid">Repaid</option>
            <option value="pending">Pending Review</option>
            <option value="cooling">Cooling-Off</option>
            <option value="duplum">In Duplum</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Loan ID</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Borrower</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Principal</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Progress</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Due Date</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Status</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((loan) => (
                <tr key={loan.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-sm font-mono text-primary-600">{loan.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{loan.borrower}</p>
                      <p className="text-xs text-gray-500">{loan.product}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">KES {loan.principal.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Total: KES {loan.totalDue.toLocaleString()}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-24">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>{Math.round((loan.paid / loan.totalDue) * 100)}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            loan.status === 'Repaid' ? 'bg-accent-500' :
                            loan.status === 'Overdue' ? 'bg-danger-500' :
                            'bg-primary-500'
                          }`}
                          style={{ width: `${(loan.paid / loan.totalDue) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{loan.dueDate}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${
                      loan.status === 'Active' ? 'bg-accent-50 text-accent-700' :
                      loan.status === 'Repaid' ? 'bg-gray-100 text-gray-600' :
                      loan.status === 'Overdue' ? 'bg-danger-50 text-danger-700' :
                      loan.status === 'Pending Review' ? 'bg-warning-50 text-warning-700' :
                      loan.status === 'Cooling-Off' ? 'bg-primary-50 text-primary-700' :
                      loan.status === 'In Duplum' ? 'bg-purple-50 text-purple-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {loan.inDuplum && <AlertTriangle size={10} />}
                      {loan.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* In Duplum Notice */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle size={18} className="text-purple-600 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-purple-800">In Duplum Rule Active</p>
          <p className="text-xs text-purple-700 mt-1">
            23 loans have reached the in duplum limit (2× principal). All further interest, fees, and penalties are automatically blocked. 
            Weekly compliance report generated.
          </p>
        </div>
      </div>
    </div>
  );
}
