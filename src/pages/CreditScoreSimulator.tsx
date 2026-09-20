import { useState } from 'react';
import { TrendingUp, TrendingDown, Calculator, Info, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function CreditScoreSimulator() {
  const [inputs, setInputs] = useState({
    paymentHistory: 85,
    creditUtilization: 35,
    creditAge: 5,
    creditMix: 3,
    newCredit: 1,
    totalDebt: 150000,
    monthlyIncome: 80000,
    employmentYears: 3,
  });

  const [showBreakdown, setShowBreakdown] = useState(false);

  const calculateScore = () => {
    // Payment History (35%)
    const paymentScore = Math.min(100, inputs.paymentHistory);
    
    // Credit Utilization (30%)
    const utilizationScore = Math.max(0, 100 - (inputs.creditUtilization * 2));
    
    // Credit Age (15%)
    const ageScore = Math.min(100, inputs.creditAge * 10);
    
    // Credit Mix (10%)
    const mixScore = Math.min(100, inputs.creditMix * 20);
    
    // New Credit (10%)
    const newCreditScore = Math.max(0, 100 - (inputs.newCredit * 25));
    
    // Weighted calculation
    const weightedScore = 
      (paymentScore * 0.35) +
      (utilizationScore * 0.30) +
      (ageScore * 0.15) +
      (mixScore * 0.10) +
      (newCreditScore * 0.10);
    
    // DTI adjustment
    const dti = inputs.totalDebt / (inputs.monthlyIncome * 12);
    const dtiAdjustment = dti > 0.5 ? -50 : dti > 0.3 ? -20 : 0;
    
    // Employment stability
    const employmentBonus = inputs.employmentYears >= 5 ? 20 : inputs.employmentYears >= 2 ? 10 : 0;
    
    const finalScore = Math.max(300, Math.min(850, Math.round(weightedScore * 5.5 + 300 + dtiAdjustment + employmentBonus)));
    
    return {
      score: finalScore,
      factors: [
        { name: 'Payment History', weight: 35, score: paymentScore, impact: paymentScore > 80 ? 'positive' : paymentScore > 60 ? 'neutral' : 'negative' },
        { name: 'Credit Utilization', weight: 30, score: utilizationScore, impact: utilizationScore > 70 ? 'positive' : utilizationScore > 40 ? 'neutral' : 'negative' },
        { name: 'Credit Age', weight: 15, score: ageScore, impact: ageScore > 70 ? 'positive' : ageScore > 40 ? 'neutral' : 'negative' },
        { name: 'Credit Mix', weight: 10, score: mixScore, impact: mixScore > 60 ? 'positive' : mixScore > 30 ? 'neutral' : 'negative' },
        { name: 'New Credit', weight: 10, score: newCreditScore, impact: newCreditScore > 70 ? 'positive' : newCreditScore > 40 ? 'neutral' : 'negative' },
      ],
      dti: Math.round(dti * 100),
      dtiAdjustment,
      employmentBonus,
    };
  };

  const result = calculateScore();

  const getScoreColor = (score: number) => {
    if (score >= 750) return 'text-green-600';
    if (score >= 650) return 'text-blue-600';
    if (score >= 550) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 750) return 'Excellent';
    if (score >= 650) return 'Good';
    if (score >= 550) return 'Fair';
    return 'Poor';
  };

  const getScoreBg = (score: number) => {
    if (score >= 750) return 'from-green-500 to-green-600';
    if (score >= 650) return 'from-blue-500 to-blue-600';
    if (score >= 550) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Credit Score Simulator</h1>
        <p className="text-sm text-gray-500">Interactive tool demonstrating credit score calculation methodology</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calculator size={18} className="text-primary-600" />
            Input Parameters
          </h3>
          <div className="space-y-4">
            <div>
              <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                <span>Payment History (%)</span>
                <span className="text-primary-600">{inputs.paymentHistory}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={inputs.paymentHistory}
                onChange={(e) => setInputs({ ...inputs, paymentHistory: Number(e.target.value) })}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">Percentage of on-time payments</p>
            </div>

            <div>
              <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                <span>Credit Utilization (%)</span>
                <span className="text-primary-600">{inputs.creditUtilization}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={inputs.creditUtilization}
                onChange={(e) => setInputs({ ...inputs, creditUtilization: Number(e.target.value) })}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">Credit used vs. available (lower is better)</p>
            </div>

            <div>
              <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                <span>Credit Age (years)</span>
                <span className="text-primary-600">{inputs.creditAge} years</span>
              </label>
              <input
                type="range"
                min="0"
                max="20"
                value={inputs.creditAge}
                onChange={(e) => setInputs({ ...inputs, creditAge: Number(e.target.value) })}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">Average age of credit accounts</p>
            </div>

            <div>
              <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                <span>Credit Mix (types)</span>
                <span className="text-primary-600">{inputs.creditMix} types</span>
              </label>
              <input
                type="range"
                min="0"
                max="5"
                value={inputs.creditMix}
                onChange={(e) => setInputs({ ...inputs, creditMix: Number(e.target.value) })}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">Variety of credit types (cards, loans, etc.)</p>
            </div>

            <div>
              <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                <span>New Credit (accounts)</span>
                <span className="text-primary-600">{inputs.newCredit} accounts</span>
              </label>
              <input
                type="range"
                min="0"
                max="5"
                value={inputs.newCredit}
                onChange={(e) => setInputs({ ...inputs, newCredit: Number(e.target.value) })}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">Recently opened accounts (fewer is better)</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Total Debt (KES)</label>
                <input
                  type="number"
                  value={inputs.totalDebt}
                  onChange={(e) => setInputs({ ...inputs, totalDebt: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Monthly Income (KES)</label>
                <input
                  type="number"
                  value={inputs.monthlyIncome}
                  onChange={(e) => setInputs({ ...inputs, monthlyIncome: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                <span>Employment (years)</span>
                <span className="text-primary-600">{inputs.employmentYears} years</span>
              </label>
              <input
                type="range"
                min="0"
                max="20"
                value={inputs.employmentYears}
                onChange={(e) => setInputs({ ...inputs, employmentYears: Number(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {/* Score Display */}
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <div className="text-center mb-6">
              <div className={`inline-block px-8 py-6 rounded-2xl bg-gradient-to-br ${getScoreBg(result.score)} text-white mb-4`}>
                <p className="text-5xl font-bold">{result.score}</p>
                <p className="text-sm opacity-90 mt-1">{getScoreLabel(result.score)}</p>
              </div>
              <p className="text-sm text-gray-600">Credit Score Range: 300 - 850</p>
            </div>

            {/* DTI and Employment */}
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-3 rounded-lg ${result.dti > 50 ? 'bg-red-50' : result.dti > 30 ? 'bg-yellow-50' : 'bg-green-50'}`}>
                <p className="text-xs text-gray-600 mb-1">Debt-to-Income</p>
                <p className={`text-2xl font-bold ${result.dti > 50 ? 'text-red-600' : result.dti > 30 ? 'text-yellow-600' : 'text-green-600'}`}>
                  {result.dti}%
                </p>
                {result.dtiAdjustment !== 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    {result.dtiAdjustment > 0 ? '+' : ''}{result.dtiAdjustment} points
                  </p>
                )}
              </div>
              <div className={`p-3 rounded-lg ${result.employmentBonus > 0 ? 'bg-green-50' : 'bg-gray-50'}`}>
                <p className="text-xs text-gray-600 mb-1">Employment Stability</p>
                <p className={`text-2xl font-bold ${result.employmentBonus > 0 ? 'text-green-600' : 'text-gray-600'}`}>
                  +{result.employmentBonus}
                </p>
                <p className="text-xs text-gray-500 mt-1">bonus points</p>
              </div>
            </div>
          </div>

          {/* Factor Breakdown */}
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="w-full flex items-center justify-between mb-4"
            >
              <h3 className="font-semibold text-gray-900">Score Breakdown</h3>
              <TrendingUp size={18} className={`transform transition-transform ${showBreakdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showBreakdown && (
              <div className="space-y-3">
                {result.factors.map((factor, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {factor.impact === 'positive' && <CheckCircle2 size={14} className="text-green-600" />}
                        {factor.impact === 'neutral' && <Info size={14} className="text-blue-600" />}
                        {factor.impact === 'negative' && <AlertTriangle size={14} className="text-red-600" />}
                        <span className="text-sm text-gray-700">{factor.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">Weight: {factor.weight}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            factor.impact === 'positive' ? 'bg-green-500' :
                            factor.impact === 'neutral' ? 'bg-blue-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${factor.score}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-gray-900 w-10 text-right">
                        {Math.round(factor.score)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Educational Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Info size={18} className="text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">How Credit Scores Work</p>
            <p className="text-xs text-blue-700 mt-1">
              Credit scores are calculated using multiple factors weighted by importance. Payment history is the most important factor (35%), 
              followed by credit utilization (30%). This simulator demonstrates the methodology used by CRBs in Kenya. 
              Actual scores may vary based on additional factors and CRB-specific algorithms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
