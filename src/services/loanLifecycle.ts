// Loan lifecycle management — state machine with compliance enforcement

import { dataLayer, Loan, Borrower, LoanProduct, MPesaTransaction } from './dataLayer';
import { complianceEngine } from './complianceEngine';

export type LoanAction = 
  | 'APPLY'
  | 'SUBMIT_KYC'
  | 'DECIDE'
  | 'APPROVE'
  | 'REJECT'
  | 'START_COOLING_OFF'
  | 'COMPLETE_COOLING_OFF'
  | 'CANCEL_DURING_COOLING'
  | 'DISBURSE'
  | 'RECEIVE_PAYMENT'
  | 'MARK_OVERDUE'
  | 'REACH_IN_DUPLUM'
  | 'MARK_REPAID'
  | 'RESTRUCTURE';

export interface LoanActionResult {
  success: boolean;
  loan?: Loan;
  error?: string;
  complianceBlocked?: boolean;
  complianceMessage?: string;
  transaction?: MPesaTransaction;
}

class LoanLifecycle {
  // Valid state transitions
  private transitions: Record<string, LoanAction[]> = {
    'Application': ['SUBMIT_KYC', 'REJECT'],
    'KYC Review': ['DECIDE', 'REJECT'],
    'Decision': ['APPROVE', 'REJECT'],
    'Approved': ['START_COOLING_OFF', 'DISBURSE'],
    'Cooling-Off': ['COMPLETE_COOLING_OFF', 'CANCEL_DURING_COOLING', 'DISBURSE'],
    'Disbursed': ['RECEIVE_PAYMENT', 'MARK_OVERDUE', 'REACH_IN_DUPLUM'],
    'Active': ['RECEIVE_PAYMENT', 'MARK_OVERDUE', 'REACH_IN_DUPLUM', 'RESTRUCTURE'],
    'Overdue': ['RECEIVE_PAYMENT', 'REACH_IN_DUPLUM', 'RESTRUCTURE'],
    'In Duplum': ['RECEIVE_PAYMENT', 'MARK_REPAID'],
    'Repaid': [],
    'Defaulted': [],
  };

  // Apply for a loan
  apply(
    tenantId: string,
    borrowerId: string,
    productId: string,
    amount: number,
    userId: string
  ): LoanActionResult {
    const borrower = dataLayer.getBorrower(borrowerId);
    const product = dataLayer.getProduct(productId);

    if (!borrower || !product) {
      return { success: false, error: 'Borrower or product not found' };
    }

    if (!borrower.kycVerified) {
      return { success: false, error: 'Borrower KYC not verified' };
    }

    if (amount < product.config.minAmount || amount > product.config.maxAmount) {
      return { 
        success: false, 
        error: `Amount must be between KES ${product.config.minAmount.toLocaleString()} and KES ${product.config.maxAmount.toLocaleString()}` 
      };
    }

    // Calculate interest
    const interest = product.config.interestMethod === 'flat'
      ? amount * (product.config.apr / 100) * (product.config.tenureDays / 365)
      : this.calculateReducingBalanceInterest(amount, product.config.apr, product.config.tenureDays);

    const totalDue = amount + interest;

    const loan: Loan = {
      id: dataLayer.generateId('LN'),
      tenantId,
      borrowerId,
      productId,
      principal: amount,
      interest: Math.round(interest),
      fees: 0,
      totalDue: Math.round(totalDue),
      paid: 0,
      remaining: Math.round(totalDue),
      status: 'Application',
      dueDate: this.calculateDueDate(product.config.tenureDays),
      kfsGenerated: false,
      kfsVersion: '2.5',
      inDuplumReached: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dataLayer.saveLoan(loan);
    dataLayer.addAuditLog(
      tenantId,
      userId,
      'LOAN_APPLICATION',
      'Loan',
      loan.id,
      `Application for KES ${amount.toLocaleString()} - Product: ${product.name}`
    );

    return { success: true, loan };
  }

  // Submit KYC
  submitKYC(loanId: string, userId: string): LoanActionResult {
    const loan = dataLayer.getLoan(loanId);
    if (!loan) return { success: false, error: 'Loan not found' };

    if (!this.canTransition(loan.status, 'SUBMIT_KYC')) {
      return { success: false, error: `Cannot submit KYC from status: ${loan.status}` };
    }

    loan.status = 'KYC Review';
    loan.updatedAt = new Date().toISOString();
    dataLayer.saveLoan(loan);

    dataLayer.addAuditLog(
      loan.tenantId,
      userId,
      'KYC_SUBMITTED',
      'Loan',
      loan.id,
      'KYC documents submitted for review'
    );

    return { success: true, loan };
  }

  // Make decision
  decide(loanId: string, approved: boolean, userId: string): LoanActionResult {
    const loan = dataLayer.getLoan(loanId);
    if (!loan) return { success: false, error: 'Loan not found' };

    if (!this.canTransition(loan.status, 'DECIDE')) {
      return { success: false, error: `Cannot make decision from status: ${loan.status}` };
    }

    const borrower = dataLayer.getBorrower(loan.borrowerId);
    const product = dataLayer.getProduct(loan.productId);

    if (!borrower || !product) {
      return { success: false, error: 'Borrower or product not found' };
    }

    if (approved) {
      // Run affordability check
      const affordabilityCheck = complianceEngine.checkAffordability(borrower, loan.principal, product);
      if (!affordabilityCheck.passed) {
        return { 
          success: false, 
          error: 'Affordability check failed',
          complianceBlocked: true,
          complianceMessage: affordabilityCheck.message,
        };
      }

      loan.status = 'Approved';
      dataLayer.addAuditLog(
        loan.tenantId,
        userId,
        'LOAN_APPROVED',
        'Loan',
        loan.id,
        `Approved for KES ${loan.principal.toLocaleString()}`
      );
    } else {
      loan.status = 'Application'; // Reset to allow reapplication
      dataLayer.addAuditLog(
        loan.tenantId,
        userId,
        'LOAN_REJECTED',
        'Loan',
        loan.id,
        'Application rejected'
      );
    }

    loan.updatedAt = new Date().toISOString();
    dataLayer.saveLoan(loan);

    return { success: true, loan };
  }

  // Start cooling-off period
  startCoolingOff(loanId: string, userId: string): LoanActionResult {
    const loan = dataLayer.getLoan(loanId);
    if (!loan) return { success: false, error: 'Loan not found' };

    const product = dataLayer.getProduct(loan.productId);
    if (!product) return { success: false, error: 'Product not found' };

    if (!this.canTransition(loan.status, 'START_COOLING_OFF')) {
      return { success: false, error: `Cannot start cooling-off from status: ${loan.status}` };
    }

    const coolingOffHours = product.config.coolingOffHours;
    const coolingOffUntil = new Date(Date.now() + coolingOffHours * 60 * 60 * 1000).toISOString();

    loan.status = 'Cooling-Off';
    loan.coolingOffUntil = coolingOffUntil;
    loan.updatedAt = new Date().toISOString();
    dataLayer.saveLoan(loan);

    dataLayer.addAuditLog(
      loan.tenantId,
      userId,
      'COOLING_OFF_STARTED',
      'Loan',
      loan.id,
      `Cooling-off period: ${coolingOffHours} hours until ${coolingOffUntil}`
    );

    return { success: true, loan };
  }

  // Disburse loan
  disburse(loanId: string, userId: string): LoanActionResult {
    const loan = dataLayer.getLoan(loanId);
    if (!loan) return { success: false, error: 'Loan not found' };

    if (!this.canTransition(loan.status, 'DISBURSE')) {
      return { success: false, error: `Cannot disburse from status: ${loan.status}` };
    }

    // Generate KFS if not done
    if (!loan.kfsGenerated) {
      loan.kfsGenerated = true;
      dataLayer.addAuditLog(
        loan.tenantId,
        userId,
        'KFS_GENERATED',
        'Loan',
        loan.id,
        `Key Facts Statement generated (version ${loan.kfsVersion})`
      );
    }

    // Run pre-disbursement compliance check
    const complianceResult = complianceEngine.preDisbursementCheck(loan);
    if (complianceResult.blocked) {
      return {
        success: false,
        error: 'Compliance check failed',
        complianceBlocked: true,
        complianceMessage: complianceResult.blockReason,
      };
    }

    // Simulate M-Pesa B2C disbursement
    const transaction: MPesaTransaction = {
      id: dataLayer.generateId('TXN'),
      tenantId: loan.tenantId,
      loanId: loan.id,
      type: 'B2C',
      amount: loan.principal,
      reference: loan.id,
      status: 'Success',
      mpesaReceipt: `MPESA_${Date.now()}`,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };

    dataLayer.saveTransaction(transaction);

    loan.status = 'Disbursed';
    loan.disbursedAt = new Date().toISOString();
    loan.updatedAt = new Date().toISOString();
    dataLayer.saveLoan(loan);

    dataLayer.addAuditLog(
      loan.tenantId,
      userId,
      'LOAN_DISBURSED',
      'Loan',
      loan.id,
      `Disbursed KES ${loan.principal.toLocaleString()} via M-Pesa B2C. Receipt: ${transaction.mpesaReceipt}`
    );

    // Auto-transition to Active
    setTimeout(() => {
      loan.status = 'Active';
      loan.updatedAt = new Date().toISOString();
      dataLayer.saveLoan(loan);
    }, 1000);

    return { success: true, loan, transaction };
  }

  // Receive payment
  receivePayment(loanId: string, amount: number, userId: string): LoanActionResult {
    const loan = dataLayer.getLoan(loanId);
    if (!loan) return { success: false, error: 'Loan not found' };

    if (!this.canTransition(loan.status, 'RECEIVE_PAYMENT')) {
      return { success: false, error: `Cannot receive payment in status: ${loan.status}` };
    }

    // Check in duplum before accepting payment
    const inDuplumCheck = complianceEngine.checkInDuplum(loan);
    if (inDuplumCheck.blocking) {
      return {
        success: false,
        error: 'In duplum reached',
        complianceBlocked: true,
        complianceMessage: inDuplumCheck.message,
      };
    }

    // Simulate M-Pesa C2B payment
    const transaction: MPesaTransaction = {
      id: dataLayer.generateId('TXN'),
      tenantId: loan.tenantId,
      loanId: loan.id,
      type: 'C2B',
      amount,
      reference: loan.id,
      status: 'Success',
      mpesaReceipt: `MPESA_${Date.now()}`,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };

    dataLayer.saveTransaction(transaction);

    loan.paid += amount;
    loan.remaining = Math.max(0, loan.totalDue - loan.paid);
    loan.updatedAt = new Date().toISOString();

    // Check if in duplum reached after payment
    if (loan.paid >= loan.principal * 2) {
      loan.inDuplumReached = true;
      loan.inDuplumDate = new Date().toISOString();
      loan.status = 'In Duplum';
      dataLayer.addAuditLog(
        loan.tenantId,
        userId,
        'IN_DUPLUM_TRIGGERED',
        'Loan',
        loan.id,
        `In duplum reached: KES ${loan.paid.toLocaleString()} / KES ${(loan.principal * 2).toLocaleString()} cap`
      );
    } else if (loan.remaining === 0) {
      loan.status = 'Repaid';
      loan.repaidAt = new Date().toISOString();
      dataLayer.addAuditLog(
        loan.tenantId,
        userId,
        'LOAN_REPAID',
        'Loan',
        loan.id,
        `Loan fully repaid: KES ${loan.paid.toLocaleString()}`
      );
    }

    dataLayer.saveLoan(loan);

    dataLayer.addAuditLog(
      loan.tenantId,
      userId,
      'PAYMENT_RECEIVED',
      'Loan',
      loan.id,
      `Payment received: KES ${amount.toLocaleString()} via M-Pesa C2B. Receipt: ${transaction.mpesaReceipt}`
    );

    return { success: true, loan, transaction };
  }

  // Helper methods
  private canTransition(currentStatus: string, action: LoanAction): boolean {
    const validActions = this.transitions[currentStatus] || [];
    return validActions.includes(action);
  }

  private calculateReducingBalanceInterest(principal: number, apr: number, tenureDays: number): number {
    const monthlyRate = apr / 100 / 12;
    const months = tenureDays / 30;
    let totalInterest = 0;
    let remainingPrincipal = principal;

    for (let i = 0; i < months; i++) {
      const interest = remainingPrincipal * monthlyRate;
      totalInterest += interest;
      remainingPrincipal -= principal / months;
    }

    return totalInterest;
  }

  private calculateDueDate(tenureDays: number): string {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + tenureDays);
    return dueDate.toISOString().split('T')[0];
  }
}

export const loanLifecycle = new LoanLifecycle();
