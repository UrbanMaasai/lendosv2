import { useState } from 'react';
import { Brain, TrendingUp, AlertTriangle, CheckCircle2, XCircle, Calculator } from 'lucide-react';

interface DecisionResult {
  approved: boolean;
  score: number;
  factors: Array<{
    name: string;
    weight: number;
    score: number;
    contribution: number;
  }>;
  crbCheck: {
    passed: boolean;
    score: number;
    facilities: number;
    recentEnquiries: number;
  };
  affordability: {
    passed: boolean;
    dti: number;
    income: number;
    obligations: number;
    disposable: number;
  };
  decision: string;
  reason: string;
}

export default function DecisionEngineVisualizer() {
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<DecisionResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const simulateDecision = () => {
    setIsCalculating(true);
    setShowResult(false);

    setTimeout(() => {
      // Simulate decision engine calculation
      const creditScore = Math.floor(Math.random() * 300) + 500; // 500-800
      const income = Math.floor(Math.random() * 50000) + 20000; // 20K-70K
      const existingObligations = Math.floor(Math.random() * 30000); // 0-30K
      const requestedAmount = Math.floor(Math.random() * 25000) + 5000; // 5K-30K

      // Calculate factors
      const factors = [
        {
          name: 'Credit History',
          weight: 0.35,
          score: Math.min(100, (creditScore / 8)),
          contribution: 0
        },
        {
          name: 'Income Level',
          weight: 0.25,
          score: Math.min(100, (income / 700)),
          contribution: 0
        },
        {
          name: 'Employment Stability',
          weight: 0.20,
          score: Math.random() * 60 + 40, // 40-100
          contribution: 0
        },
        {
          name: 'Debt-to-Income',
          weight: 0.15,
          score: Math.max(0, 100 - ((existingObligations + requestedAmount) / income) * 100),
          contribution: 0
        },
        {
          name: 'Payment History',
          weight: 0.05,
          score: Math.random() * 40 + 60, // 60-100
          contribution: 0
        }
      ];

      // Calculate contributions
      factors.forEach(f => {
        f.contribution = f.score * f.weight;
      });

      const totalScore = factors.reduce((sum, f) => sum + f.contribution, 0);

      // CRB Check
      const crbScore = creditScore;
      const facilities = Math.floor(Math.random() * 5);
      const recentEnquiries = Math.floor(Math.random() * 4);
      const crbPassed = crbScore > 550 && facilities < 4 && recentEnquiries < 3;

      // Affordability Check
      const dti = (existingObligations + requestedAmount) / income;
      const disposable = income - existingObligations - (income * 0.3); // 30% living expenses
      const affordabilityPassed = dti < 0.5 && disposable > requestedAmount * 0.3;

      // Final Decision
      const approved = totalScore > 65 && crbPassed && affordabilityPassed;

      let decision = '';
      let reason = '';

      if (!approved) {
        if (totalScore <= 65) {
          decision = 'Declined';
          reason = 'Credit score below threshold';
        } else if (!crbPassed) {
          decision = 'Declined';
          reason = 'CRB check failed - too many facilities or recent enquiries';
        } else if (!affordabilityPassed) {
          decision = 'Declined';
          reason = 'Affordability check failed - DTI too high or insufficient disposable income';
        }
      } else {
        if (totalScore > 80) {
          decision = 'Auto-Approved';
          reason = 'Excellent credit profile, all checks passed';
        } else {
          decision = 'Manual Review';
          reason = 'Borderline score - requires credit officer review';
        }
      }

      setResult({
        approved,
        score: Math.round(totalScore),
        factors,
        crbCheck: {
          passed: crbPassed,
          score: crbScore,
          facilities,
          recentEnquiries
        },
        affordability: {
          passed: affordabilityPassed,
          dti: Math.round(dti * 100),
          income,
          obligations: existingObligations,
          disposable
        },
        decision,
        reason
      });

      setIsCalculating(false);
      setShowResult(true);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Brain size={20} className="text-primary-600" />
            Decision Engine Visualizer
          </h3>
          <p className="text-sm text-gray-500 mt-1">Simulate loan decision with real-time scoring</p>
        </div>
        <button
          onClick={simulateDecision}
          disabled={isCalculating}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isCalculating ? 'Calculating...' : 'Run Decision'}
        </button>
      </div>

      {!showResult && !isCalculating && (
        <div className="text-center py-12 text-gray-400">
          <Brain size={48} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Click "Run Decision" to simulate a loan application decision</p>
        </div>
      )}

      {isCalculating && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-sm text-gray-600">Analyzing borrower profile...</p>
          <p className="text-xs text-gray-400 mt-1">Running credit checks and affordability assessment</p>
        </div>
      )}

      {showResult && result && (
        <div className="space-y-6">
          {/* Decision Header */}
          <div className={`p-4 rounded-lg border-2 ${
            result.approved 
              ? 'bg-green-50 border-green-200' 
              : result.decision === 'Manual Review'
              ? 'bg-yellow-50 border-yellow-200'
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {result.approved ? (
                    <CheckCircle2 size={24} className="text-green-600" />
                  ) : result.decision === 'Manual Review' ? (
                    <AlertTriangle size={24} className="text-yellow-600" />
                  ) : (
                    <XCircle size={24} className="text-red-600" />
                  )}
                  <h4 className={`text-xl font-bold ${
                    result.approved ? 'text-green-900' :
                    result.decision === 'Manual Review' ? 'text-yellow-900' :
                    'text-red-900'
                  }`}>
                    {result.decision}
                  </h4>
                </div>
                <p className={`text-sm ${
                  result.approved ? 'text-green-700' :
                  result.decision === 'Manual Review' ? 'text-yellow-700' :
                  'text-red-700'
                }`}>
                  {result.reason}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">{result.score}</p>
                <p className="text-xs text-gray-500">Credit Score</p>
              </div>
            </div>
          </div>

          {/* Score Breakdown */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp size={16} className="text-primary-600" />
              Score Breakdown
            </h4>
            <div className="space-y-2">
              {result.factors.map((factor, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700">{factor.name}</span>
                      <span className="text-xs text-gray-500">
                        Weight: {(factor.weight * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            factor.score > 70 ? 'bg-green-500' :
                            factor.score > 50 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${factor.score}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-gray-900 w-12 text-right">
                        {factor.score.toFixed(0)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CRB Check */}
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg border ${
              result.crbCheck.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {result.crbCheck.passed ? (
                  <CheckCircle2 size={16} className="text-green-600" />
                ) : (
                  <XCircle size={16} className="text-red-600" />
                )}
                <h5 className={`text-sm font-semibold ${
                  result.crbCheck.passed ? 'text-green-900' : 'text-red-900'
                }`}>
                  CRB Check
                </h5>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Score:</span>
                  <span className="font-medium">{result.crbCheck.score}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Facilities:</span>
                  <span className="font-medium">{result.crbCheck.facilities}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Recent Enquiries:</span>
                  <span className="font-medium">{result.crbCheck.recentEnquiries}</span>
                </div>
              </div>
            </div>

            {/* Affordability Check */}
            <div className={`p-4 rounded-lg border ${
              result.affordability.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {result.affordability.passed ? (
                  <CheckCircle2 size={16} className="text-green-600" />
                ) : (
                  <XCircle size={16} className="text-red-600" />
                )}
                <h5 className={`text-sm font-semibold ${
                  result.affordability.passed ? 'text-green-900' : 'text-red-900'
                }`}>
                  Affordability
                </h5>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">DTI Ratio:</span>
                  <span className="font-medium">{result.affordability.dti}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Income:</span>
                  <span className="font-medium">KES {result.affordability.income.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Obligations:</span>
                  <span className="font-medium">KES {result.affordability.obligations.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
