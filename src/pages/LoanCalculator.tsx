import { useState } from 'react';
import { Calculator, DollarSign, Calendar, Percent, Info } from 'lucide-react';

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState(50000);
  const [interestRate, setInterestRate] = useState(12);
  const [loanTerm, setLoanTerm] = useState(12);
  const [calculationType, setCalculationType] = useState<'flat' | 'reducing'>('reducing');

  const calculateLoan = () => {
    const principal = loanAmount;
    const annualRate = interestRate / 100;
    const monthlyRate = annualRate / 12;
    const months = loanTerm;

    let monthlyPayment: number;
    let totalPayment: number;
    let totalInterest: number;
    let schedule: Array<{
      month: number;
      payment: number;
      principal: number;
      interest: number;
      balance: number;
    }> = [];

    if (calculationType === 'flat') {
      // Flat rate calculation
      totalInterest = principal * annualRate * (months / 12);
      totalPayment = principal + totalInterest;
      monthlyPayment = totalPayment / months;

      // Generate schedule
      let remainingBalance = principal;
      for (let i = 1; i <= months; i++) {
        const monthlyInterest = (principal * annualRate) / 12;
        const monthlyPrincipal = monthlyPayment - monthlyInterest;
        remainingBalance -= monthlyPrincipal;

        schedule.push({
          month: i,
          payment: monthlyPayment,
          principal: monthlyPrincipal,
          interest: monthlyInterest,
          balance: Math.max(0, remainingBalance),
        });
      }
    } else {
      // Reducing balance calculation
      monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                       (Math.pow(1 + monthlyRate, months) - 1);
      totalPayment = monthlyPayment * months;
      totalInterest = totalPayment - principal;

      // Generate amortization schedule
      let remainingBalance = principal;
      for (let i = 1; i <= months; i++) {
        const interestPayment = remainingBalance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        remainingBalance -= principalPayment;

        schedule.push({
          month: i,
          payment: monthlyPayment,
          principal: principalPayment,
          interest: interestPayment,
          balance: Math.max(0, remainingBalance),
        });
      }
    }

    return {
      monthlyPayment: Math.round(monthlyPayment),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
      schedule,
    };
  };

  const result = calculateLoan();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Loan Calculator</h1>
        <p className="text-sm text-gray-500">Calculate loan payments and view amortization schedule</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calculator size={18} className="text-primary-600" />
            Loan Parameters
          </h3>
          <div className="space-y-4">
            <div>
              <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                <span>Loan Amount (KES)</span>
                <span className="text-primary-600 font-semibold">KES {loanAmount.toLocaleString()}</span>
              </label>
              <input
                type="range"
                min="10000"
                max="1000000"
                step="5000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>KES 10,000</span>
                <span>KES 1,000,000</span>
              </div>
            </div>

            <div>
              <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                <span>Annual Interest Rate (%)</span>
                <span className="text-primary-600 font-semibold">{interestRate}%</span>
              </label>
              <input
                type="range"
                min="1"
                max="36"
                step="0.5"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1%</span>
                <span>36%</span>
              </div>
            </div>

            <div>
              <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                <span>Loan Term (months)</span>
                <span className="text-primary-600 font-semibold">{loanTerm} months</span>
              </label>
              <input
                type="range"
                min="3"
                max="60"
                step="1"
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>3 months</span>
                <span>60 months</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Calculation Method</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setCalculationType('flat')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    calculationType === 'flat'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Flat Rate
                </button>
                <button
                  onClick={() => setCalculationType('reducing')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    calculationType === 'reducing'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Reducing Balance
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {calculationType === 'flat' 
                  ? 'Interest calculated on original principal throughout loan term'
                  : 'Interest calculated on remaining balance (more common)'}
              </p>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl p-4 text-white">
              <DollarSign size={20} className="mb-2 opacity-80" />
              <p className="text-xs opacity-80 mb-1">Monthly Payment</p>
              <p className="text-2xl font-bold">KES {result.monthlyPayment.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
              <Calendar size={20} className="mb-2 opacity-80" />
              <p className="text-xs opacity-80 mb-1">Total Payment</p>
              <p className="text-2xl font-bold">KES {result.totalPayment.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
              <Percent size={20} className="mb-2 opacity-80" />
              <p className="text-xs opacity-80 mb-1">Total Interest</p>
              <p className="text-2xl font-bold">KES {result.totalInterest.toLocaleString()}</p>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Key Metrics</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-sm text-gray-600">Principal Amount</span>
                <span className="text-sm font-semibold text-gray-900">KES {loanAmount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-sm text-gray-600">Interest Rate (Annual)</span>
                <span className="text-sm font-semibold text-gray-900">{interestRate}%</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-sm text-gray-600">Loan Term</span>
                <span className="text-sm font-semibold text-gray-900">{loanTerm} months ({(loanTerm / 12).toFixed(1)} years)</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-sm text-gray-600">Total Interest Paid</span>
                <span className="text-sm font-semibold text-purple-600">KES {result.totalInterest.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Interest as % of Principal</span>
                <span className="text-sm font-semibold text-purple-600">
                  {((result.totalInterest / loanAmount) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Amortization Schedule */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Amortization Schedule</h3>
        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-50">
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Month</th>
                <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">Payment</th>
                <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">Principal</th>
                <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">Interest</th>
                <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">Balance</th>
              </tr>
            </thead>
            <tbody>
              {result.schedule.map((row) => (
                <tr key={row.month} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-sm text-gray-900">{row.month}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">KES {row.payment.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-right text-green-600">KES {row.principal.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-right text-purple-600">KES {row.interest.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">KES {row.balance.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Educational Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Info size={18} className="text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Understanding Loan Calculations</p>
            <p className="text-xs text-blue-700 mt-1">
              <strong>Flat Rate:</strong> Interest is calculated on the original principal amount throughout the loan term. 
              Total interest = Principal × Rate × Time.
              <br /><br />
              <strong>Reducing Balance:</strong> Interest is calculated on the remaining balance each month. 
              Early payments consist mostly of interest, while later payments are mostly principal. 
              This is the more common method and typically results in lower total interest.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
