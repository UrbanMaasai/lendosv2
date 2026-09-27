import { useState } from 'react';
import { Calculator, Calendar, DollarSign, Download, CheckCircle2 } from 'lucide-react';

interface PaymentPlan {
  loanAmount: number;
  interestRate: number;
  tenureMonths: number;
  payments: Array<{
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
    dueDate: string;
  }>;
  totalPayment: number;
  totalInterest: number;
  monthlyPayment: number;
}

export default function PaymentPlanGenerator() {
  const [loanAmount, setLoanAmount] = useState(50000);
  const [interestRate, setInterestRate] = useState(12);
  const [tenureMonths, setTenureMonths] = useState(12);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [plan, setPlan] = useState<PaymentPlan | null>(null);

  const generatePlan = () => {
    const principal = loanAmount;
    const monthlyRate = interestRate / 100 / 12;
    const months = tenureMonths;

    // Calculate monthly payment using amortization formula
    const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
                          (Math.pow(1 + monthlyRate, months) - 1);

    const payments = [];
    let remainingBalance = principal;
    const start = new Date(startDate);

    for (let i = 1; i <= months; i++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      remainingBalance -= principalPayment;

      const dueDate = new Date(start);
      dueDate.setMonth(dueDate.getMonth() + i);

      payments.push({
        month: i,
        payment: Math.round(monthlyPayment),
        principal: Math.round(principalPayment),
        interest: Math.round(interestPayment),
        balance: Math.max(0, Math.round(remainingBalance)),
        dueDate: dueDate.toISOString().split('T')[0],
      });
    }

    const totalPayment = monthlyPayment * months;
    const totalInterest = totalPayment - principal;

    setPlan({
      loanAmount: principal,
      interestRate,
      tenureMonths: months,
      payments,
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
      monthlyPayment: Math.round(monthlyPayment),
    });
  };

  const exportPlan = () => {
    if (!plan) return;

    const csv = [
      'Month,Due Date,Payment,Principal,Interest,Balance',
      ...plan.payments.map(p =>
        `${p.month},${p.dueDate},${p.payment},${p.principal},${p.interest},${p.balance}`
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment-plan-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payment Plan Generator</h1>
        <p className="text-sm text-gray-500">Generate detailed amortization schedules for loans</p>
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
                min="5000"
                max="500000"
                step="5000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>KES 5,000</span>
                <span>KES 500,000</span>
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
                <span>Tenure (months)</span>
                <span className="text-primary-600 font-semibold">{tenureMonths} months</span>
              </label>
              <input
                type="range"
                min="3"
                max="60"
                step="1"
                value={tenureMonths}
                onChange={(e) => setTenureMonths(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>3 months</span>
                <span>60 months</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>

            <button
              onClick={generatePlan}
              className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-primary-700"
            >
              <Calculator size={18} />
              Generate Payment Plan
            </button>
          </div>
        </div>

        {/* Summary Panel */}
        <div className="space-y-4">
          {plan ? (
            <>
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl p-6 text-white">
                <h3 className="font-semibold mb-4">Payment Summary</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm opacity-90">Monthly Payment</span>
                    <span className="text-2xl font-bold">KES {plan.monthlyPayment.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-white/20">
                    <span className="text-sm opacity-90">Total Payment</span>
                    <span className="text-xl font-bold">KES {plan.totalPayment.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm opacity-90">Total Interest</span>
                    <span className="text-xl font-bold">KES {plan.totalInterest.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-white/20">
                    <span className="text-sm opacity-90">Interest as % of Principal</span>
                    <span className="text-xl font-bold">
                      {((plan.totalInterest / plan.loanAmount) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={exportPlan}
                className="w-full flex items-center justify-center gap-2 bg-accent-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-accent-700"
              >
                <Download size={18} />
                Export to CSV
              </button>
            </>
          ) : (
            <div className="bg-white rounded-xl p-12 border border-gray-100 text-center">
              <Calculator size={48} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Generate a Payment Plan</h3>
              <p className="text-sm text-gray-500">Enter loan parameters and click "Generate Payment Plan" to see the amortization schedule</p>
            </div>
          )}
        </div>
      </div>

      {/* Payment Schedule */}
      {plan && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Payment Schedule</h3>
            <span className="text-xs text-gray-500">{plan.payments.length} payments</span>
          </div>
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100 sticky top-0">
                <tr>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Month</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Due Date</th>
                  <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">Payment</th>
                  <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">Principal</th>
                  <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">Interest</th>
                  <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">Balance</th>
                </tr>
              </thead>
              <tbody>
                {plan.payments.map((payment) => (
                  <tr key={payment.month} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-sm text-gray-900">{payment.month}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{payment.dueDate}</td>
                    <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                      KES {payment.payment.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-accent-600">
                      KES {payment.principal.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-purple-600">
                      KES {payment.interest.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900">
                      KES {payment.balance.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Calendar size={18} className="text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Payment Plan Generator Features</p>
            <ul className="text-xs text-blue-700 mt-1 space-y-1">
              <li>• Generate detailed amortization schedules</li>
              <li>• Adjustable loan amount, interest rate, and tenure</li>
              <li>• Custom start date for payment schedule</li>
              <li>• Monthly breakdown of principal and interest</li>
              <li>• Export to CSV for record-keeping</li>
              <li>• Visual summary of total costs</li>
              <li>• Accurate calculations using standard amortization formula</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
