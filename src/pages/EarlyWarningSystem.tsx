import { useState, useEffect } from 'react';
import { AlertTriangle, TrendingUp, Users, DollarSign, Activity, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { dataLayer } from '../services/dataLayer';

interface RiskScore {
  borrowerId: string;
  borrowerName: string;
  phone: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  factors: {
    name: string;
    score: number;
    weight: number;
    impact: 'positive' | 'negative' | 'neutral';
  }[];
  recommendation: string;
  predictedDefaultProb: number;
  daysSinceLastPayment?: number;
  activeLoans: number;
  totalOutstanding: number;
}

export default function EarlyWarningSystem() {
  const [riskScores, setRiskScores] = useState<RiskScore[]>([]);
  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const [selectedBorrower, setSelectedBorrower] = useState<RiskScore | null>(null);

  useEffect(() => {
    // Generate risk scores based on borrower data
    const borrowers = dataLayer.getBorrowers();
    const loans = dataLayer.getLoans();

    const scores: RiskScore[] = borrowers.map(borrower => {
      const borrowerLoans = loans.filter(l => l.borrowerId === borrower.id);
      const activeLoans = borrowerLoans.filter(l => ['Active', 'Overdue', 'In Duplum'].includes(l.status));
      const overdueLoans = borrowerLoans.filter(l => l.status === 'Overdue');
      const totalOutstanding = activeLoans.reduce((sum, l) => sum + l.remaining, 0);

      // Calculate risk factors
      const factors = [];

      // Credit Score Factor (30% weight)
      const creditScoreFactor = {
        name: 'Credit Score',
        score: borrower.creditScore > 0 ? Math.min(100, (borrower.creditScore / 8.5)) : 50,
        weight: 0.30,
        impact: (borrower.creditScore > 650 ? 'positive' : borrower.creditScore > 500 ? 'neutral' : 'negative') as 'positive' | 'negative' | 'neutral',
      };
      factors.push(creditScoreFactor);

      // Payment History Factor (25% weight)
      const onTimePayments = borrowerLoans.filter(l => l.status === 'Repaid').length;
      const totalLoans = borrowerLoans.length;
      const paymentHistoryScore = totalLoans > 0 ? (onTimePayments / totalLoans) * 100 : 70;
      factors.push({
        name: 'Payment History',
        score: paymentHistoryScore,
        weight: 0.25,
        impact: (paymentHistoryScore > 80 ? 'positive' : paymentHistoryScore > 60 ? 'neutral' : 'negative') as 'positive' | 'negative' | 'neutral',
      });

      // Debt Burden Factor (20% weight)
      const estimatedIncome = borrower.creditScore > 0 ? 15000 + (borrower.creditScore * 50) : 30000;
      const debtBurden = totalOutstanding / estimatedIncome;
      const debtBurdenScore = Math.max(0, 100 - (debtBurden * 100));
      factors.push({
        name: 'Debt Burden',
        score: debtBurdenScore,
        weight: 0.20,
        impact: (debtBurdenScore > 70 ? 'positive' : debtBurdenScore > 40 ? 'neutral' : 'negative') as 'positive' | 'negative' | 'neutral',
      });

      // Overdue Loans Factor (15% weight)
      const overdueScore = overdueLoans.length === 0 ? 100 : Math.max(0, 100 - (overdueLoans.length * 30));
      factors.push({
        name: 'Overdue Status',
        score: overdueScore,
        weight: 0.15,
        impact: (overdueScore > 70 ? 'positive' : overdueScore > 40 ? 'neutral' : 'negative') as 'positive' | 'negative' | 'neutral',
      });

      // Loan Utilization Factor (10% weight)
      const utilizationScore = activeLoans.length <= 2 ? 90 : activeLoans.length <= 4 ? 60 : 30;
      factors.push({
        name: 'Loan Utilization',
        score: utilizationScore,
        weight: 0.10,
        impact: (utilizationScore > 70 ? 'positive' : utilizationScore > 40 ? 'neutral' : 'negative') as 'positive' | 'negative' | 'neutral',
      });

      // Calculate overall risk score
      const riskScore = factors.reduce((sum, f) => sum + (f.score * f.weight), 0);

      // Determine risk level
      let riskLevel: 'low' | 'medium' | 'high' | 'critical';
      if (riskScore >= 75) riskLevel = 'low';
      else if (riskScore >= 60) riskLevel = 'medium';
      else if (riskScore >= 40) riskLevel = 'high';
      else riskLevel = 'critical';

      // Predicted default probability (inverse of risk score)
      const predictedDefaultProb = Math.max(0, Math.min(100, 100 - riskScore));

      // Recommendation
      let recommendation = '';
      if (riskLevel === 'critical') {
        recommendation = 'Immediate intervention required. Consider restructuring or collections escalation.';
      } else if (riskLevel === 'high') {
        recommendation = 'Monitor closely. Send proactive reminder and offer restructuring options.';
      } else if (riskLevel === 'medium') {
        recommendation = 'Standard monitoring. Send payment reminders as scheduled.';
      } else {
        recommendation = 'Low risk. Continue standard monitoring.';
      }

      return {
        borrowerId: borrower.id,
        borrowerName: borrower.name,
        phone: borrower.phone,
        riskScore: Math.round(riskScore),
        riskLevel,
        factors,
        recommendation,
        predictedDefaultProb: Math.round(predictedDefaultProb),
        activeLoans: activeLoans.length,
        totalOutstanding,
      };
    });

    // Sort by risk score (lowest first = highest risk)
    scores.sort((a, b) => a.riskScore - b.riskScore);
    setRiskScores(scores);
  }, []);

  const filteredScores = filter === 'all' 
    ? riskScores 
    : riskScores.filter(r => r.riskLevel === filter);

  const stats = {
    total: riskScores.length,
    critical: riskScores.filter(r => r.riskLevel === 'critical').length,
    high: riskScores.filter(r => r.riskLevel === 'high').length,
    medium: riskScores.filter(r => r.riskLevel === 'medium').length,
    low: riskScores.filter(r => r.riskLevel === 'low').length,
    avgRiskScore: riskScores.length > 0 ? Math.round(riskScores.reduce((sum, r) => sum + r.riskScore, 0) / riskScores.length) : 0,
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-danger-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-warning-500';
      case 'low': return 'bg-accent-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskBg = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-danger-50 border-danger-200';
      case 'high': return 'bg-orange-50 border-orange-200';
      case 'medium': return 'bg-warning-50 border-warning-200';
      case 'low': return 'bg-accent-50 border-accent-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Early Warning System</h1>
          <p className="text-sm text-gray-500">Predictive risk scoring to identify borrowers at risk of default</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} className="text-primary-600" />
            <span className="text-xs text-gray-500">Total Borrowers</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-danger-600" />
            <span className="text-xs text-gray-500">Critical Risk</span>
          </div>
          <p className="text-2xl font-bold text-danger-600">{stats.critical}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-orange-600" />
            <span className="text-xs text-gray-500">High Risk</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">{stats.high}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={16} className="text-warning-600" />
            <span className="text-xs text-gray-500">Medium Risk</span>
          </div>
          <p className="text-2xl font-bold text-warning-600">{stats.medium}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-accent-600" />
            <span className="text-xs text-gray-500">Low Risk</span>
          </div>
          <p className="text-2xl font-bold text-accent-600">{stats.low}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Target size={16} className="text-purple-600" />
            <span className="text-xs text-gray-500">Avg Risk Score</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">{stats.avgRiskScore}</p>
        </div>
      </div>

      {/* Risk Distribution Chart */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Risk Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={[
            { name: 'Critical', count: stats.critical, fill: '#ef4444' },
            { name: 'High', count: stats.high, fill: '#f97316' },
            { name: 'Medium', count: stats.medium, fill: '#f59e0b' },
            { name: 'Low', count: stats.low, fill: '#22c55e' },
          ]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <Tooltip contentStyle={{ fontSize: '12px' }} />
            <Bar dataKey="count" fill="#3b82f6">
              {[
                { fill: '#ef4444' },
                { fill: '#f97316' },
                { fill: '#f59e0b' },
                { fill: '#22c55e' },
              ].map((entry, index) => (
                <Bar key={index} dataKey="count" fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(['all', 'critical', 'high', 'medium', 'low'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Risk Scores List */}
      <div className="space-y-3">
        {filteredScores.map((risk) => (
          <div
            key={risk.borrowerId}
            onClick={() => setSelectedBorrower(risk)}
            className={`rounded-xl p-4 border-2 cursor-pointer hover:shadow-md transition-all ${getRiskBg(risk.riskLevel)}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900">{risk.borrowerName}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full text-white ${getRiskColor(risk.riskLevel)}`}>
                    {risk.riskLevel.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{risk.phone}</p>
              </div>
              <div className="text-right">
                <p className={`text-3xl font-bold ${
                  risk.riskLevel === 'critical' ? 'text-danger-600' :
                  risk.riskLevel === 'high' ? 'text-orange-600' :
                  risk.riskLevel === 'medium' ? 'text-warning-600' :
                  'text-accent-600'
                }`}>
                  {risk.riskScore}
                </p>
                <p className="text-xs text-gray-500">Risk Score</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3 text-xs mb-3">
              <div>
                <p className="text-gray-500">Default Probability</p>
                <p className="font-bold text-gray-900">{risk.predictedDefaultProb}%</p>
              </div>
              <div>
                <p className="text-gray-500">Active Loans</p>
                <p className="font-bold text-gray-900">{risk.activeLoans}</p>
              </div>
              <div>
                <p className="text-gray-500">Outstanding</p>
                <p className="font-bold text-gray-900">KES {risk.totalOutstanding.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Recommendation</p>
                <p className="font-medium text-gray-700 line-clamp-1">{risk.recommendation}</p>
              </div>
            </div>

            <div className="flex gap-2">
              {risk.factors.slice(0, 3).map((factor, idx) => (
                <div key={idx} className="flex-1 bg-white rounded p-2">
                  <p className="text-[10px] text-gray-500">{factor.name}</p>
                  <div className="flex items-center gap-1">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          factor.impact === 'positive' ? 'bg-accent-500' :
                          factor.impact === 'neutral' ? 'bg-primary-500' :
                          'bg-danger-500'
                        }`}
                        style={{ width: `${factor.score}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] font-bold">{Math.round(factor.score)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredScores.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <Users size={48} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No borrowers found</h3>
          <p className="text-sm text-gray-500">Try adjusting your filters</p>
        </div>
      )}

      {/* Detail Modal */}
      {selectedBorrower && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedBorrower(null)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">{selectedBorrower.borrowerName}</h3>
                <button onClick={() => setSelectedBorrower(null)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
              </div>

              <div className="space-y-4">
                <div className={`p-4 rounded-lg border-2 ${getRiskBg(selectedBorrower.riskLevel)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Overall Risk Score</span>
                    <span className={`text-3xl font-bold ${
                      selectedBorrower.riskLevel === 'critical' ? 'text-danger-600' :
                      selectedBorrower.riskLevel === 'high' ? 'text-orange-600' :
                      selectedBorrower.riskLevel === 'medium' ? 'text-warning-600' :
                      'text-accent-600'
                    }`}>
                      {selectedBorrower.riskScore}/100
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{selectedBorrower.recommendation}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Risk Factors Breakdown</h4>
                  <div className="space-y-2">
                    {selectedBorrower.factors.map((factor, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">{factor.name}</span>
                          <span className="text-xs text-gray-500">Weight: {(factor.weight * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                factor.impact === 'positive' ? 'bg-accent-500' :
                                factor.impact === 'neutral' ? 'bg-primary-500' :
                                'bg-danger-500'
                              }`}
                              style={{ width: `${factor.score}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold text-gray-900 w-10 text-right">
                            {Math.round(factor.score)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Predicted Default Probability</p>
                    <p className="text-2xl font-bold text-danger-600">{selectedBorrower.predictedDefaultProb}%</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Total Outstanding</p>
                    <p className="text-2xl font-bold text-gray-900">KES {selectedBorrower.totalOutstanding.toLocaleString()}</p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Target size={14} className="text-blue-600 mt-0.5" />
                    <div className="text-xs text-blue-700">
                      <p className="font-medium mb-1">Recommended Action</p>
                      <p>{selectedBorrower.recommendation}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle size={18} className="text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Early Warning System Features</p>
            <ul className="text-xs text-blue-700 mt-1 space-y-1">
              <li>• Predictive risk scoring using 5 weighted factors</li>
              <li>• Real-time risk assessment based on borrower data</li>
              <li>• Color-coded risk levels (Critical, High, Medium, Low)</li>
              <li>• Default probability prediction</li>
              <li>• Actionable recommendations for each risk level</li>
              <li>• Detailed factor breakdown for transparency</li>
              <li>• Filter by risk level for targeted intervention</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
