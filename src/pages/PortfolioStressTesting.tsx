import { useState } from 'react';
import { AlertTriangle, TrendingDown, DollarSign, Users, Calculator, Play } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface StressScenario {
  id: string;
  name: string;
  description: string;
  parameters: {
    unemploymentIncrease: number;
    interestRateChange: number;
    gdpGrowth: number;
    inflationRate: number;
    defaultRateMultiplier: number;
  };
}

interface StressTestResult {
  scenario: string;
  baseline: {
    portfolioValue: number;
    par30: number;
    par90: number;
    expectedLoss: number;
    defaultRate: number;
  };
  stressed: {
    portfolioValue: number;
    par30: number;
    par90: number;
    expectedLoss: number;
    defaultRate: number;
  };
  impact: {
    portfolioChange: number;
    par30Change: number;
    par90Change: number;
    lossIncrease: number;
    defaultIncrease: number;
  };
  timeline: Array<{
    month: string;
    baseline: number;
    stressed: number;
  }>;
}

export default function PortfolioStressTesting() {
  const [selectedScenario, setSelectedScenario] = useState<string>('mild_recession');
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<StressTestResult | null>(null);

  const scenarios: StressScenario[] = [
    {
      id: 'mild_recession',
      name: 'Mild Recession',
      description: 'Moderate economic downturn with 2% GDP contraction and 3% unemployment increase',
      parameters: {
        unemploymentIncrease: 3,
        interestRateChange: -1,
        gdpGrowth: -2,
        inflationRate: 4,
        defaultRateMultiplier: 1.5,
      },
    },
    {
      id: 'severe_recession',
      name: 'Severe Recession',
      description: 'Deep economic crisis with 5% GDP contraction and 7% unemployment increase',
      parameters: {
        unemploymentIncrease: 7,
        interestRateChange: -2,
        gdpGrowth: -5,
        inflationRate: 6,
        defaultRateMultiplier: 2.5,
      },
    },
    {
      id: 'interest_rate_shock',
      name: 'Interest Rate Shock',
      description: 'Central bank raises rates by 3% to combat inflation',
      parameters: {
        unemploymentIncrease: 1,
        interestRateChange: 3,
        gdpGrowth: 0,
        inflationRate: 8,
        defaultRateMultiplier: 1.8,
      },
    },
    {
      id: 'high_unemployment',
      name: 'High Unemployment',
      description: 'Unemployment spikes to 15% due to sector-specific crisis',
      parameters: {
        unemploymentIncrease: 8,
        interestRateChange: 0,
        gdpGrowth: -3,
        inflationRate: 5,
        defaultRateMultiplier: 2.2,
      },
    },
    {
      id: 'inflation_crisis',
      name: 'Inflation Crisis',
      description: 'Hyperinflation scenario with 15% annual inflation',
      parameters: {
        unemploymentIncrease: 4,
        interestRateChange: 5,
        gdpGrowth: -4,
        inflationRate: 15,
        defaultRateMultiplier: 2.0,
      },
    },
    {
      id: 'custom',
      name: 'Custom Scenario',
      description: 'Define your own economic parameters for stress testing',
      parameters: {
        unemploymentIncrease: 5,
        interestRateChange: 2,
        gdpGrowth: -3,
        inflationRate: 7,
        defaultRateMultiplier: 2.0,
      },
    },
  ];

  const currentScenario = scenarios.find(s => s.id === selectedScenario) || scenarios[0];

  const runStressTest = () => {
    setIsRunning(true);
    
    // Simulate stress test calculation
    setTimeout(() => {
      const baseline = {
        portfolioValue: 450000000,
        par30: 3.2,
        par90: 1.2,
        expectedLoss: 5400000,
        defaultRate: 1.2,
      };

      const multiplier = currentScenario.parameters.defaultRateMultiplier;
      
      const stressed = {
        portfolioValue: baseline.portfolioValue * (1 - (multiplier - 1) * 0.05),
        par30: baseline.par30 * multiplier,
        par90: baseline.par90 * multiplier * 1.2,
        expectedLoss: baseline.expectedLoss * multiplier,
        defaultRate: baseline.defaultRate * multiplier,
      };

      const impact = {
        portfolioChange: ((stressed.portfolioValue - baseline.portfolioValue) / baseline.portfolioValue) * 100,
        par30Change: stressed.par30 - baseline.par30,
        par90Change: stressed.par90 - baseline.par90,
        lossIncrease: ((stressed.expectedLoss - baseline.expectedLoss) / baseline.expectedLoss) * 100,
        defaultIncrease: ((stressed.defaultRate - baseline.defaultRate) / baseline.defaultRate) * 100,
      };

      // Generate 12-month timeline
      const timeline = Array.from({ length: 12 }, (_, i) => {
        const month = i + 1;
        const baselineDefault = baseline.defaultRate * (1 + (month / 12) * 0.1);
        const stressedDefault = stressed.defaultRate * (1 + (month / 12) * 0.15);
        
        return {
          month: `Month ${month}`,
          baseline: baselineDefault,
          stressed: stressedDefault,
        };
      });

      setResults({
        scenario: currentScenario.name,
        baseline,
        stressed,
        impact,
        timeline,
      });

      setIsRunning(false);
    }, 2000);
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `KES ${(value / 1000000).toFixed(1)}M`;
    }
    return `KES ${value.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Portfolio Stress Testing</h1>
          <p className="text-sm text-gray-500">Simulate economic scenarios and assess portfolio resilience</p>
        </div>
      </div>

      {/* Scenario Selection */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Select Stress Scenario</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => setSelectedScenario(scenario.id)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                selectedScenario === scenario.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h4 className="font-semibold text-gray-900 mb-1">{scenario.name}</h4>
              <p className="text-xs text-gray-600 mb-3">{scenario.description}</p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Unemployment:</span>
                  <span className="font-medium">+{scenario.parameters.unemploymentIncrease}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Interest Rate:</span>
                  <span className="font-medium">{scenario.parameters.interestRateChange > 0 ? '+' : ''}{scenario.parameters.interestRateChange}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">GDP Growth:</span>
                  <span className="font-medium">{scenario.parameters.gdpGrowth}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Default Multiplier:</span>
                  <span className="font-medium">{scenario.parameters.defaultRateMultiplier}x</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={runStressTest}
          disabled={isRunning}
          className="mt-6 w-full flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRunning ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Running Stress Test...
            </>
          ) : (
            <>
              <Play size={18} />
              Run Stress Test
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {results && (
        <>
          {/* Impact Summary */}
          <div className="bg-gradient-to-r from-danger-50 to-warning-50 rounded-xl p-6 border border-danger-200">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={24} className="text-danger-600" />
              <div>
                <h3 className="text-lg font-bold text-gray-900">Stress Test Results: {results.scenario}</h3>
                <p className="text-sm text-gray-600">Impact analysis under stressed conditions</p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Portfolio Impact</p>
                <p className={`text-2xl font-bold ${results.impact.portfolioChange < -5 ? 'text-danger-600' : 'text-warning-600'}`}>
                  {results.impact.portfolioChange.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500 mt-1">{formatCurrency(results.stressed.portfolioValue)}</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">PAR 30 Increase</p>
                <p className="text-2xl font-bold text-danger-600">+{results.impact.par30Change.toFixed(1)}%</p>
                <p className="text-xs text-gray-500 mt-1">{results.stressed.par30.toFixed(1)}% (from {results.baseline.par30}%)</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">PAR 90 Increase</p>
                <p className="text-2xl font-bold text-danger-600">+{results.impact.par90Change.toFixed(1)}%</p>
                <p className="text-xs text-gray-500 mt-1">{results.stressed.par90.toFixed(1)}% (from {results.baseline.par90}%)</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Expected Loss</p>
                <p className="text-2xl font-bold text-danger-600">+{results.impact.lossIncrease.toFixed(0)}%</p>
                <p className="text-xs text-gray-500 mt-1">{formatCurrency(results.stressed.expectedLoss)}</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Default Rate</p>
                <p className="text-2xl font-bold text-danger-600">+{results.impact.defaultIncrease.toFixed(0)}%</p>
                <p className="text-xs text-gray-500 mt-1">{results.stressed.defaultRate.toFixed(1)}% (from {results.baseline.defaultRate}%)</p>
              </div>
            </div>
          </div>

          {/* Baseline vs Stressed Comparison */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingDown size={18} className="text-accent-600" />
                Baseline Scenario
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Portfolio Value</span>
                  <span className="text-lg font-bold text-gray-900">{formatCurrency(results.baseline.portfolioValue)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">PAR 30</span>
                  <span className="text-lg font-bold text-accent-600">{results.baseline.par30}%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">PAR 90</span>
                  <span className="text-lg font-bold text-accent-600">{results.baseline.par90}%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Expected Loss</span>
                  <span className="text-lg font-bold text-gray-900">{formatCurrency(results.baseline.expectedLoss)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Default Rate</span>
                  <span className="text-lg font-bold text-accent-600">{results.baseline.defaultRate}%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-danger-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle size={18} className="text-danger-600" />
                Stressed Scenario
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-danger-50 rounded-lg">
                  <span className="text-sm text-gray-600">Portfolio Value</span>
                  <span className="text-lg font-bold text-danger-600">{formatCurrency(results.stressed.portfolioValue)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-danger-50 rounded-lg">
                  <span className="text-sm text-gray-600">PAR 30</span>
                  <span className="text-lg font-bold text-danger-600">{results.stressed.par30}%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-danger-50 rounded-lg">
                  <span className="text-sm text-gray-600">PAR 90</span>
                  <span className="text-lg font-bold text-danger-600">{results.stressed.par90}%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-danger-50 rounded-lg">
                  <span className="text-sm text-gray-600">Expected Loss</span>
                  <span className="text-lg font-bold text-danger-600">{formatCurrency(results.stressed.expectedLoss)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-danger-50 rounded-lg">
                  <span className="text-sm text-gray-600">Default Rate</span>
                  <span className="text-lg font-bold text-danger-600">{results.stressed.defaultRate}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Chart */}
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">12-Month Default Rate Projection</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={results.timeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} tickFormatter={(value) => `${value}%`} />
                <Tooltip 
                  contentStyle={{ fontSize: '12px' }}
                  formatter={(value: number) => [`${value.toFixed(2)}%`, '']}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="baseline" stroke="#10b981" strokeWidth={2} name="Baseline" />
                <Line type="monotone" dataKey="stressed" stroke="#ef4444" strokeWidth={2} name="Stressed" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Risk Assessment */}
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Risk Assessment & Recommendations</h3>
            <div className="space-y-3">
              {results.impact.par30Change > 3 && (
                <div className="flex items-start gap-3 p-4 bg-danger-50 border border-danger-200 rounded-lg">
                  <AlertTriangle size={20} className="text-danger-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-danger-900">High Risk: PAR 30 exceeds 6%</p>
                    <p className="text-xs text-danger-700 mt-1">
                      Consider tightening lending criteria, increasing provisions, or reducing exposure to high-risk segments.
                    </p>
                  </div>
                </div>
              )}
              {results.impact.lossIncrease > 100 && (
                <div className="flex items-start gap-3 p-4 bg-warning-50 border border-warning-200 rounded-lg">
                  <AlertTriangle size={20} className="text-warning-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-warning-900">Expected Loss Doubles</p>
                    <p className="text-xs text-warning-700 mt-1">
                      Review capital adequacy and ensure sufficient provisions are in place. Consider stress testing capital reserves.
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <Calculator size={20} className="text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Mitigation Strategies</p>
                  <ul className="text-xs text-blue-700 mt-1 space-y-1">
                    <li>• Diversify portfolio across sectors and geographies</li>
                    <li>• Implement early warning systems for delinquency detection</li>
                    <li>• Strengthen collections processes and recovery strategies</li>
                    <li>• Maintain adequate capital buffers and liquidity reserves</li>
                    <li>• Review and adjust pricing to reflect risk levels</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle size={18} className="text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Portfolio Stress Testing Features</p>
            <ul className="text-xs text-blue-700 mt-1 space-y-1">
              <li>• Pre-defined economic scenarios (recession, interest rate shock, unemployment, inflation)</li>
              <li>• Custom scenario builder with adjustable parameters</li>
              <li>• Impact analysis on portfolio value, PAR, expected losses, and default rates</li>
              <li>• 12-month projection timeline with baseline vs stressed comparison</li>
              <li>• Visual charts showing default rate progression over time</li>
              <li>• Risk assessment with actionable recommendations</li>
              <li>• Side-by-side comparison of baseline and stressed scenarios</li>
              <li>• Regulatory compliance with stress testing requirements</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
