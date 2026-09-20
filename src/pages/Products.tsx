import { useState } from 'react';
import { Package, Plus, Settings, Eye, Copy, CheckCircle2, AlertTriangle, TrendingUp, Users, DollarSign, Zap } from 'lucide-react';

const products = [
  {
    id: 1, name: 'Salary Advance', tenant: 'PesaFlash', status: 'Active',
    minAmount: 5000, maxAmount: 25000, apr: 36, tenure: '30 days',
    interestMethod: 'Reducing Balance', loans: 2340, approvalRate: 68,
  },
  {
    id: 2, name: 'Micro Personal', tenant: 'PesaFlash', status: 'Active',
    minAmount: 1000, maxAmount: 50000, apr: 48, tenure: '30-90 days',
    interestMethod: 'Flat Rate', loans: 1205, approvalRate: 54,
  },
  {
    id: 3, name: 'First-Time Borrower', tenant: 'QuickCredit SACCO', status: 'Active',
    minAmount: 1000, maxAmount: 15000, apr: 42, tenure: '14-30 days',
    interestMethod: 'Flat Rate', loans: 312, approvalRate: 41,
  },
  {
    id: 4, name: 'SME Working Capital', tenant: 'SME Lend Kenya', status: 'Active',
    minAmount: 50000, maxAmount: 500000, apr: 28, tenure: '90-180 days',
    interestMethod: 'Reducing Balance', loans: 89, approvalRate: 72,
  },
  {
    id: 5, name: 'Boda Loan', tenant: 'Boda Finance', status: 'Draft',
    minAmount: 5000, maxAmount: 30000, apr: 52, tenure: '30 days',
    interestMethod: 'Flat Rate', loans: 0, approvalRate: 0,
  },
];

export default function Products() {
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Builder</h1>
          <p className="text-sm text-gray-500">Configure loan products with compliance controls</p>
        </div>
        <button className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
          <Plus size={16} /> New Product
        </button>
      </div>

      {/* Product Performance Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Products', value: '5', icon: Package, color: 'bg-primary-50 text-primary-600' },
          { label: 'Total Active Loans', value: '3,946', icon: Users, color: 'bg-accent-50 text-accent-600' },
          { label: 'Avg Approval Rate', value: '58.3%', icon: CheckCircle2, color: 'bg-purple-50 text-purple-600' },
          { label: 'Monthly Revenue', value: 'KES 41.2M', icon: DollarSign, color: 'bg-warning-50 text-warning-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 border border-gray-100">
            <div className={`w-8 h-8 ${stat.color.split(' ')[0]} rounded-lg flex items-center justify-center mb-2`}>
              <stat.icon size={16} className={stat.color.split(' ')[1]} />
            </div>
            <p className="text-xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Templates */}
      <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-6 border border-primary-100">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900">Starter Templates</h3>
          <span className="text-xs bg-white text-primary-700 px-2 py-1 rounded-full font-medium">Quick Start</span>
        </div>
        <p className="text-sm text-gray-600 mb-4">Pre-built product configurations to get started quickly</p>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { name: 'Salary Advance', desc: 'Conservative, employed borrowers, scorecard + CRB', tag: 'Popular', metrics: '68% approval, 3.2% PAR' },
            { name: 'Micro Personal', desc: 'Balanced, broader retail, flexible eligibility', tag: 'Recommended', metrics: '54% approval, 5.8% PAR' },
            { name: 'First-Time / Thin-File', desc: 'Controlled, limited CRB history, alternative data', tag: 'New', metrics: '41% approval, 7.2% PAR' },
          ].map((template) => (
            <div key={template.name} className="bg-white rounded-lg p-4 border border-gray-100 hover:border-primary-200 cursor-pointer transition-all hover:shadow-md group">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm text-gray-900">{template.name}</span>
                <span className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full">{template.tag}</span>
              </div>
              <p className="text-xs text-gray-500 mb-2">{template.desc}</p>
              <p className="text-xs text-accent-600 font-medium">{template.metrics}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl p-5 border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all cursor-pointer"
            onClick={() => setSelectedProduct(product)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
                  <Package size={16} className="text-primary-600" />
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  product.status === 'Active' ? 'bg-accent-50 text-accent-700' : 'bg-warning-50 text-warning-700'
                }`}>
                  {product.status}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1 text-gray-400 hover:text-gray-600"><Eye size={14} /></button>
                <button className="p-1 text-gray-400 hover:text-gray-600"><Copy size={14} /></button>
                <button className="p-1 text-gray-400 hover:text-gray-600"><Settings size={14} /></button>
              </div>
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">{product.name}</h4>
            <p className="text-xs text-gray-500 mb-3">{product.tenant}</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-50 rounded p-2">
                <p className="text-gray-500">Amount Range</p>
                <p className="font-medium text-gray-900">KES {product.minAmount.toLocaleString()} - {product.maxAmount.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 rounded p-2">
                <p className="text-gray-500">APR</p>
                <p className="font-medium text-gray-900">{product.apr}%</p>
              </div>
              <div className="bg-gray-50 rounded p-2">
                <p className="text-gray-500">Tenure</p>
                <p className="font-medium text-gray-900">{product.tenure}</p>
              </div>
              <div className="bg-gray-50 rounded p-2">
                <p className="text-gray-500">Active Loans</p>
                <p className="font-medium text-gray-900">{product.loans.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setSelectedProduct(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">{selectedProduct.name}</h3>
              <button onClick={() => setSelectedProduct(null)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Interest Method</p>
                  <p className="text-sm font-medium">{selectedProduct.interestMethod}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Approval Rate</p>
                  <p className="text-sm font-medium">{selectedProduct.approvalRate}%</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Compliance Controls</h4>
                <div className="space-y-2">
                  {[
                    { label: 'In Duplum Enforcement', status: true },
                    { label: 'KFS Auto-Generation', status: true },
                    { label: 'Cooling-Off Period (24h)', status: true },
                    { label: 'Affordability Check', status: true },
                    { label: 'CRB Integration', status: true },
                  ].map((control) => (
                    <div key={control.label} className="flex items-center gap-2">
                      {control.status ? <CheckCircle2 size={14} className="text-accent-500" /> : <AlertTriangle size={14} className="text-warning-500" />}
                      <span className="text-sm text-gray-700">{control.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t pt-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Approval Pathway</h4>
                <p className="text-sm text-gray-600">Auto-approve ≤ KES 5,000 · Manual review &gt; KES 5,000</p>
                <p className="text-sm text-gray-600 mt-1">Dual approval required for product changes</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
