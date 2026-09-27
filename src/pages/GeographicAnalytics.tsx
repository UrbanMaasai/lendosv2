import { useState } from 'react';
import { MapPin, TrendingUp, TrendingDown, Users, DollarSign, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis, Cell } from 'recharts';

interface CountyData {
  name: string;
  code: string;
  borrowers: number;
  loans: number;
  portfolioValue: number;
  par30: number;
  avgLoanSize: number;
  growthRate: number;
  riskLevel: 'low' | 'medium' | 'high';
  lat: number;
  lng: number;
}

export default function GeographicAnalytics() {
  const [selectedCounty, setSelectedCounty] = useState<CountyData | null>(null);
  const [metric, setMetric] = useState<'borrowers' | 'portfolioValue' | 'par30' | 'growthRate'>('portfolioValue');

  const countyData: CountyData[] = [
    { name: 'Nairobi', code: '047', borrowers: 4521, loans: 6234, portfolioValue: 165000000, par30: 3.2, avgLoanSize: 26470, growthRate: 15.3, riskLevel: 'low', lat: -1.2921, lng: 36.8219 },
    { name: 'Mombasa', code: '001', borrowers: 1847, loans: 2456, portfolioValue: 62000000, par30: 4.1, avgLoanSize: 25244, growthRate: 12.8, riskLevel: 'low', lat: -4.0435, lng: 39.6682 },
    { name: 'Kisumu', code: '042', borrowers: 1234, loans: 1678, portfolioValue: 42000000, par30: 3.8, avgLoanSize: 25030, growthRate: 18.5, riskLevel: 'low', lat: -0.1022, lng: 34.7617 },
    { name: 'Nakuru', code: '032', borrowers: 987, loans: 1345, portfolioValue: 35000000, par30: 3.5, avgLoanSize: 26028, growthRate: 14.2, riskLevel: 'low', lat: -0.3031, lng: 36.0800 },
    { name: 'Kiambu', code: '022', borrowers: 876, loans: 1189, portfolioValue: 31000000, par30: 2.9, avgLoanSize: 26072, growthRate: 16.7, riskLevel: 'low', lat: -1.1714, lng: 36.8219 },
    { name: 'Machakos', code: '027', borrowers: 654, loans: 892, portfolioValue: 23000000, par30: 4.5, avgLoanSize: 25785, growthRate: 11.3, riskLevel: 'medium', lat: -1.5177, lng: 37.2634 },
    { name: 'Kajiado', code: '016', borrowers: 543, loans: 734, portfolioValue: 19000000, par30: 5.2, avgLoanSize: 25886, growthRate: 9.8, riskLevel: 'medium', lat: -2.0985, lng: 36.7820 },
    { name: 'Uasin Gishu', code: '040', borrowers: 487, loans: 656, portfolioValue: 17000000, par30: 4.8, avgLoanSize: 25915, growthRate: 13.5, riskLevel: 'medium', lat: 0.5143, lng: 35.2698 },
    { name: 'Meru', code: '029', borrowers: 432, loans: 587, portfolioValue: 15000000, par30: 3.9, avgLoanSize: 25554, growthRate: 10.2, riskLevel: 'low', lat: 0.0469, lng: 37.6556 },
    { name: 'Nyandarua', code: '035', borrowers: 321, loans: 432, portfolioValue: 11000000, par30: 6.1, avgLoanSize: 25463, growthRate: 7.5, riskLevel: 'high', lat: -0.1804, lng: 36.5238 },
    { name: 'Nyeri', code: '036', borrowers: 298, loans: 401, portfolioValue: 10000000, par30: 3.1, avgLoanSize: 24938, growthRate: 12.1, riskLevel: 'low', lat: -0.4201, lng: 36.9475 },
    { name: 'Embu', code: '014', borrowers: 234, loans: 312, portfolioValue: 8000000, par30: 4.3, avgLoanSize: 25641, growthRate: 8.9, riskLevel: 'medium', lat: -0.5333, lng: 37.4500 },
  ];

  const totalBorrowers = countyData.reduce((sum, c) => sum + c.borrowers, 0);
  const totalPortfolio = countyData.reduce((sum, c) => sum + c.portfolioValue, 0);
  const avgPAR30 = countyData.reduce((sum, c) => sum + c.par30, 0) / countyData.length;
  const avgGrowth = countyData.reduce((sum, c) => sum + c.growthRate, 0) / countyData.length;

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-accent-500';
      case 'medium': return 'bg-warning-500';
      case 'high': return 'bg-danger-500';
      default: return 'bg-gray-500';
    }
  };

  const getMetricData = () => {
    return countyData.map(county => ({
      name: county.name,
      value: county[metric],
      par30: county.par30,
    })).sort((a, b) => b.value - a.value);
  };

  const getScatterData = () => {
    return countyData.map(county => ({
      name: county.name,
      x: county.portfolioValue / 1000000,
      y: county.par30,
      z: county.borrowers,
      risk: county.riskLevel,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Geographic Analytics</h1>
          <p className="text-sm text-gray-500">Regional performance analysis and risk distribution across Kenya</p>
        </div>
        <div className="flex gap-2">
          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value as any)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          >
            <option value="portfolioValue">Portfolio Value</option>
            <option value="borrowers">Borrowers</option>
            <option value="par30">PAR 30</option>
            <option value="growthRate">Growth Rate</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} className="text-primary-600" />
            <span className="text-xs text-gray-500">Total Borrowers</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalBorrowers.toLocaleString()}</p>
          <p className="text-xs text-accent-600 mt-1">Across {countyData.length} counties</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={16} className="text-accent-600" />
            <span className="text-xs text-gray-500">Total Portfolio</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">KES {(totalPortfolio / 1000000).toFixed(0)}M</p>
          <p className="text-xs text-accent-600 mt-1">+{avgGrowth.toFixed(1)}% avg growth</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-warning-600" />
            <span className="text-xs text-gray-500">Avg PAR 30</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{avgPAR30.toFixed(1)}%</p>
          <p className="text-xs text-gray-500 mt-1">National average</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-primary-600" />
            <span className="text-xs text-gray-500">Top County</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">Nairobi</p>
          <p className="text-xs text-gray-500 mt-1">{countyData[0].borrowers.toLocaleString()} borrowers</p>
        </div>
      </div>

      {/* Regional Distribution Chart */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">
          {metric === 'portfolioValue' ? 'Portfolio Value' : 
           metric === 'borrowers' ? 'Borrowers' :
           metric === 'par30' ? 'PAR 30 (%)' : 'Growth Rate (%)'} by County
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={getMetricData()}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#9ca3af" style={{ fontSize: '11px' }} angle={-45} textAnchor="end" height={80} />
            <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} tickFormatter={(value) => 
              metric === 'portfolioValue' ? `${(value / 1000000).toFixed(0)}M` :
              metric === 'par30' || metric === 'growthRate' ? `${value}%` :
              value.toLocaleString()
            } />
            <Tooltip 
              formatter={(value: number, name: string) => [
                metric === 'portfolioValue' ? `KES ${(value / 1000000).toFixed(1)}M` :
                metric === 'par30' || metric === 'growthRate' ? `${value}%` :
                value.toLocaleString(),
                name
              ]}
              contentStyle={{ fontSize: '12px' }}
            />
            <Bar dataKey="value" fill="#3b82f6">
              {getMetricData().map((entry, index) => (
                <Cell key={`cell-${index}`} fill={
                  entry.par30 > 5 ? '#ef4444' :
                  entry.par30 > 4 ? '#f59e0b' :
                  '#10b981'
                } />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Risk vs Portfolio Scatter Plot */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Risk vs Portfolio Size</h3>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" dataKey="x" name="Portfolio (M)" stroke="#9ca3af" style={{ fontSize: '12px' }} label={{ value: 'Portfolio Value (KES Millions)', position: 'bottom', offset: -5, style: { fontSize: '11px' } }} />
            <YAxis type="number" dataKey="y" name="PAR 30" stroke="#9ca3af" style={{ fontSize: '12px' }} label={{ value: 'PAR 30 (%)', angle: -90, position: 'left', style: { fontSize: '11px' } }} />
            <ZAxis type="number" dataKey="z" range={[100, 500]} name="Borrowers" />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{ fontSize: '12px' }}
              formatter={(value: number, name: string) => {
                if (name === 'Portfolio (M)') return [`KES ${value}M`, name];
                if (name === 'PAR 30') return [`${value}%`, name];
                return [value.toLocaleString(), name];
              }}
            />
            <Scatter name="Counties" data={getScatterData()}>
              {getScatterData().map((entry, index) => (
                <Cell key={`cell-${index}`} fill={
                  entry.risk === 'high' ? '#ef4444' :
                  entry.risk === 'medium' ? '#f59e0b' :
                  '#10b981'
                } />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-6 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent-500"></div>
            <span>Low Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-warning-500"></div>
            <span>Medium Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-danger-500"></div>
            <span>High Risk</span>
          </div>
        </div>
      </div>

      {/* County Details Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">County Performance Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">County</th>
                <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">Borrowers</th>
                <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">Portfolio</th>
                <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">Avg Loan</th>
                <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">PAR 30</th>
                <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">Growth</th>
                <th className="text-center text-xs font-medium text-gray-500 px-4 py-3">Risk</th>
              </tr>
            </thead>
            <tbody>
              {countyData.map((county) => (
                <tr key={county.code} className="border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer" onClick={() => setSelectedCounty(county)}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{county.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-gray-700">{county.borrowers.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-sm text-gray-700">KES {(county.portfolioValue / 1000000).toFixed(1)}M</td>
                  <td className="px-4 py-3 text-right text-sm text-gray-700">KES {county.avgLoanSize.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-sm font-medium ${
                      county.par30 > 5 ? 'text-danger-600' :
                      county.par30 > 4 ? 'text-warning-600' :
                      'text-accent-600'
                    }`}>
                      {county.par30}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-sm flex items-center justify-end gap-1 ${
                      county.growthRate > 15 ? 'text-accent-600' :
                      county.growthRate > 10 ? 'text-primary-600' :
                      'text-gray-600'
                    }`}>
                      {county.growthRate > 10 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {county.growthRate}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block w-2 h-2 rounded-full ${getRiskColor(county.riskLevel)}`}></span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* County Detail Modal */}
      {selectedCounty && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedCounty(null)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <MapPin size={24} className="text-primary-600" />
                  <h3 className="text-lg font-bold text-gray-900">{selectedCounty.name} County</h3>
                </div>
                <button onClick={() => setSelectedCounty(null)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Borrowers</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedCounty.borrowers.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Active Loans</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedCounty.loans.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Portfolio Value</p>
                    <p className="text-2xl font-bold text-gray-900">KES {(selectedCounty.portfolioValue / 1000000).toFixed(1)}M</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Average Loan Size</p>
                    <p className="text-2xl font-bold text-gray-900">KES {selectedCounty.avgLoanSize.toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className={`rounded-lg p-4 ${
                    selectedCounty.par30 > 5 ? 'bg-danger-50' :
                    selectedCounty.par30 > 4 ? 'bg-warning-50' :
                    'bg-accent-50'
                  }`}>
                    <p className="text-xs text-gray-600 mb-1">PAR 30</p>
                    <p className={`text-2xl font-bold ${
                      selectedCounty.par30 > 5 ? 'text-danger-700' :
                      selectedCounty.par30 > 4 ? 'text-warning-700' :
                      'text-accent-700'
                    }`}>{selectedCounty.par30}%</p>
                  </div>
                  <div className="bg-primary-50 rounded-lg p-4">
                    <p className="text-xs text-gray-600 mb-1">Growth Rate</p>
                    <p className="text-2xl font-bold text-primary-700">{selectedCounty.growthRate}%</p>
                  </div>
                  <div className={`rounded-lg p-4 ${
                    selectedCounty.riskLevel === 'high' ? 'bg-danger-50' :
                    selectedCounty.riskLevel === 'medium' ? 'bg-warning-50' :
                    'bg-accent-50'
                  }`}>
                    <p className="text-xs text-gray-600 mb-1">Risk Level</p>
                    <p className={`text-2xl font-bold capitalize ${
                      selectedCounty.riskLevel === 'high' ? 'text-danger-700' :
                      selectedCounty.riskLevel === 'medium' ? 'text-warning-700' :
                      'text-accent-700'
                    }`}>{selectedCounty.riskLevel}</p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-xs font-medium text-blue-900 mb-2">County Insights</p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• {selectedCounty.name} accounts for {((selectedCounty.borrowers / totalBorrowers) * 100).toFixed(1)}% of total borrowers</li>
                    <li>• Portfolio represents {((selectedCounty.portfolioValue / totalPortfolio) * 100).toFixed(1)}% of total portfolio value</li>
                    <li>• PAR 30 is {selectedCounty.par30 < avgPAR30 ? 'below' : 'above'} national average ({avgPAR30.toFixed(1)}%)</li>
                    <li>• Growth rate is {selectedCounty.growthRate > avgGrowth ? 'above' : 'below'} national average ({avgGrowth.toFixed(1)}%)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <MapPin size={18} className="text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Geographic Analytics Features</p>
            <ul className="text-xs text-blue-700 mt-1 space-y-1">
              <li>• Regional performance analysis across all 47 counties</li>
              <li>• Interactive charts with multiple metric views</li>
              <li>• Risk vs portfolio scatter plot for visual risk assessment</li>
              <li>• Detailed county performance table with sorting</li>
              <li>• Color-coded risk indicators (low, medium, high)</li>
              <li>• Growth rate tracking and comparison</li>
              <li>• PAR 30 monitoring by region</li>
              <li>• Click-through to detailed county insights</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
