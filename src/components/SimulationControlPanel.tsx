import { useState } from 'react';
import { Zap, AlertTriangle, CheckCircle2, XCircle, RefreshCw, Play, Pause } from 'lucide-react';
import { dataLayer } from '../services/dataLayer';
import { loanLifecycle } from '../services/loanLifecycle';
import { mpesaSimulator } from '../services/mpesaSimulator';

export default function SimulationControlPanel() {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<Array<{ type: string; message: string; timestamp: string }>>([]);
  const [scenario, setScenario] = useState<string>('');

  const addLog = (type: 'success' | 'error' | 'info', message: string) => {
    setLogs(prev => [...prev, { type, message, timestamp: new Date().toLocaleTimeString() }]);
  };

  const simulateHappyPath = async () => {
    setScenario('Happy Path - Complete Loan Journey');
    setIsRunning(true);
    setLogs([]);

    try {
      // Get test data
      const tenants = dataLayer.getTenants();
      const tenant = tenants[0];
      const borrowers = dataLayer.getBorrowers(tenant.id);
      const borrower = borrowers.find(b => b.kycVerified && b.status === 'Active');
      const products = dataLayer.getProducts(tenant.id);
      const product = products.find(p => p.status === 'Active');

      if (!borrower || !product) {
        addLog('error', 'No test data available');
        setIsRunning(false);
        return;
      }

      addLog('info', `Starting simulation for ${borrower.name}`);
      await new Promise(r => setTimeout(r, 500));

      // Step 1: Apply for loan
      addLog('info', 'Step 1: Creating loan application...');
      const applyResult = loanLifecycle.apply(tenant.id, borrower.id, product.id, 15000, 'admin');
      if (!applyResult.success || !applyResult.loan) {
        addLog('error', `Application failed: ${applyResult.error}`);
        setIsRunning(false);
        return;
      }
      addLog('success', `Loan created: ${applyResult.loan.id}`);
      await new Promise(r => setTimeout(r, 500));

      // Step 2: Approve loan
      addLog('info', 'Step 2: Approving loan...');
      const approveResult = loanLifecycle.decide(applyResult.loan.id, true, 'admin');
      if (!approveResult.success) {
        addLog('error', `Approval failed: ${approveResult.error}`);
        setIsRunning(false);
        return;
      }
      addLog('success', 'Loan approved');
      await new Promise(r => setTimeout(r, 500));

      // Step 3: Start cooling-off
      addLog('info', 'Step 3: Starting cooling-off period...');
      const coolingResult = loanLifecycle.startCoolingOff(applyResult.loan.id, 'admin');
      if (!coolingResult.success) {
        addLog('error', `Cooling-off failed: ${coolingResult.error}`);
        setIsRunning(false);
        return;
      }
      addLog('success', 'Cooling-off period started');
      await new Promise(r => setTimeout(r, 500));

      // Step 4: Disburse
      addLog('info', 'Step 4: Disbursing loan via M-Pesa...');
      const disburseResult = loanLifecycle.disburse(applyResult.loan.id, 'admin');
      if (!disburseResult.success || !disburseResult.loan) {
        addLog('error', `Disbursement failed: ${disburseResult.error}`);
        setIsRunning(false);
        return;
      }
      addLog('success', `Loan disbursed: KES ${disburseResult.loan.principal.toLocaleString()}`);
      await new Promise(r => setTimeout(r, 500));

      // Step 5: Simulate M-Pesa transaction
      addLog('info', 'Step 5: Simulating M-Pesa B2C transaction...');
      const mpesaResult = await mpesaSimulator.disburse(tenant.id, applyResult.loan.id, 15000, borrower.phone);
      if (mpesaResult.success) {
        addLog('success', `M-Pesa transaction successful: ${mpesaResult.receipt}`);
      } else {
        addLog('error', `M-Pesa transaction failed: ${mpesaResult.error}`);
      }
      await new Promise(r => setTimeout(r, 500));

      // Step 6: Make repayment
      addLog('info', 'Step 6: Processing repayment...');
      const repayResult = loanLifecycle.receivePayment(applyResult.loan.id, 5000, 'admin');
      if (repayResult.success && repayResult.loan) {
        addLog('success', `Payment received: KES 5,000`);
        addLog('info', `Remaining balance: KES ${repayResult.loan.remaining.toLocaleString()}`);
      } else {
        addLog('error', `Payment failed: ${repayResult.error}`);
      }

      addLog('success', '✓ Happy path simulation completed successfully!');
    } catch (error) {
      addLog('error', `Simulation error: ${error}`);
    }

    setIsRunning(false);
  };

  const simulateInDuplum = async () => {
    setScenario('In Duplum Rule - 2x Principal Cap');
    setIsRunning(true);
    setLogs([]);

    try {
      const tenants = dataLayer.getTenants();
      const tenant = tenants[0];
      const borrowers = dataLayer.getBorrowers(tenant.id);
      const borrower = borrowers.find(b => b.kycVerified && b.status === 'Active');
      const products = dataLayer.getProducts(tenant.id);
      const product = products.find(p => p.status === 'Active');

      if (!borrower || !product) {
        addLog('error', 'No test data available');
        setIsRunning(false);
        return;
      }

      addLog('info', 'Creating loan for KES 10,000...');
      const applyResult = loanLifecycle.apply(tenant.id, borrower.id, product.id, 10000, 'admin');
      if (!applyResult.success || !applyResult.loan) {
        addLog('error', 'Application failed');
        setIsRunning(false);
        return;
      }
      await new Promise(r => setTimeout(r, 300));

      addLog('info', 'Approving and disbursing...');
      loanLifecycle.decide(applyResult.loan.id, true, 'admin');
      loanLifecycle.startCoolingOff(applyResult.loan.id, 'admin');
      loanLifecycle.disburse(applyResult.loan.id, 'admin');
      await new Promise(r => setTimeout(r, 300));

      addLog('info', 'Making payments to reach in duplum limit...');
      
      // First payment
      addLog('info', 'Payment 1: KES 10,000');
      loanLifecycle.receivePayment(applyResult.loan.id, 10000, 'admin');
      await new Promise(r => setTimeout(r, 300));

      // Second payment (should trigger in duplum)
      addLog('info', 'Payment 2: KES 10,000 (total: KES 20,000 = 2x principal)');
      const repayResult = loanLifecycle.receivePayment(applyResult.loan.id, 10000, 'admin');
      
      if (repayResult.loan?.inDuplumReached) {
        addLog('success', '✓ In duplum rule triggered! Loan status: In Duplum');
        addLog('info', 'Further charges are now blocked');
        
        // Try to make another payment
        addLog('info', 'Attempting payment 3: KES 5,000...');
        const blockedResult = loanLifecycle.receivePayment(applyResult.loan.id, 5000, 'admin');
        if (blockedResult.complianceBlocked) {
          addLog('error', `✓ Payment blocked: ${blockedResult.complianceMessage}`);
        }
      }

      addLog('success', '✓ In duplum simulation completed!');
    } catch (error) {
      addLog('error', `Simulation error: ${error}`);
    }

    setIsRunning(false);
  };

  const simulateMpesaFailure = async () => {
    setScenario('M-Pesa Transaction Failure');
    setIsRunning(true);
    setLogs([]);

    try {
      addLog('info', 'Simulating M-Pesa B2C disbursement...');
      await new Promise(r => setTimeout(r, 500));

      // Run multiple times to potentially hit failure
      let successCount = 0;
      let failCount = 0;

      for (let i = 0; i < 5; i++) {
        addLog('info', `Attempt ${i + 1}/5...`);
        const result = await mpesaSimulator.disburse('tenant_001', 'test_loan', 10000, '+254712345678');
        
        if (result.success) {
          addLog('success', `✓ Success: ${result.receipt}`);
          successCount++;
        } else {
          addLog('error', `✗ Failed: ${result.error}`);
          failCount++;
        }
        
        await new Promise(r => setTimeout(r, 300));
      }

      addLog('info', `Results: ${successCount} successful, ${failCount} failed`);
      addLog('success', '✓ M-Pesa failure simulation completed!');
    } catch (error) {
      addLog('error', `Simulation error: ${error}`);
    }

    setIsRunning(false);
  };

  const clearLogs = () => {
    setLogs([]);
    setScenario('');
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Zap size={20} className="text-yellow-600" />
            Simulation Control Panel
          </h3>
          <p className="text-sm text-gray-500 mt-1">Test scenarios and edge cases</p>
        </div>
        {logs.length > 0 && (
          <button
            onClick={clearLogs}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Clear Logs
          </button>
        )}
      </div>

      {/* Scenario Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <button
          onClick={simulateHappyPath}
          disabled={isRunning}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Play size={16} />
          <span className="text-sm font-medium">Happy Path</span>
        </button>

        <button
          onClick={simulateInDuplum}
          disabled={isRunning}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-50 border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <AlertTriangle size={16} />
          <span className="text-sm font-medium">In Duplum Rule</span>
        </button>

        <button
          onClick={simulateMpesaFailure}
          disabled={isRunning}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <XCircle size={16} />
          <span className="text-sm font-medium">M-Pesa Failure</span>
        </button>
      </div>

      {/* Scenario Title */}
      {scenario && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-900">{scenario}</p>
        </div>
      )}

      {/* Logs */}
      <div className="bg-gray-900 rounded-lg p-4 min-h-[300px] max-h-[400px] overflow-y-auto scrollbar-thin">
        {logs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Zap size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">Select a scenario to run simulation</p>
          </div>
        ) : (
          <div className="space-y-2 font-mono text-xs">
            {logs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-gray-500 flex-shrink-0">[{log.timestamp}]</span>
                {log.type === 'success' && <CheckCircle2 size={12} className="text-green-400 mt-0.5 flex-shrink-0" />}
                {log.type === 'error' && <XCircle size={12} className="text-red-400 mt-0.5 flex-shrink-0" />}
                {log.type === 'info' && <RefreshCw size={12} className="text-blue-400 mt-0.5 flex-shrink-0" />}
                <span className={`${
                  log.type === 'success' ? 'text-green-400' :
                  log.type === 'error' ? 'text-red-400' :
                  'text-blue-400'
                }`}>
                  {log.message}
                </span>
              </div>
            ))}
            {isRunning && (
              <div className="flex items-center gap-2 text-yellow-400">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-yellow-400"></div>
                <span>Processing...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
