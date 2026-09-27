// M-Pesa transaction simulation — C2B, B2C, STK Push

import { dataLayer, MPesaTransaction } from './dataLayer';

export interface MPesaResult {
  success: boolean;
  transaction?: MPesaTransaction;
  error?: string;
  receipt?: string;
}

class MPesaSimulator {
  // Simulate B2C disbursement (Business to Customer)
  async disburse(
    tenantId: string,
    loanId: string,
    amount: number,
    phoneNumber: string
  ): Promise<MPesaResult> {
    // Simulate network delay
    await this.delay(1500);

    // 95% success rate simulation
    const success = Math.random() > 0.05;

    if (!success) {
      const transaction: MPesaTransaction = {
        id: dataLayer.generateId('TXN'),
        tenantId,
        loanId,
        type: 'B2C',
        amount,
        reference: loanId,
        status: 'Failed',
        createdAt: new Date().toISOString(),
      };
      dataLayer.saveTransaction(transaction);

      return {
        success: false,
        transaction,
        error: 'Insufficient funds in B2C account or network timeout',
      };
    }

    const transaction: MPesaTransaction = {
      id: dataLayer.generateId('TXN'),
      tenantId,
      loanId,
      type: 'B2C',
      amount,
      reference: loanId,
      status: 'Success',
      mpesaReceipt: `Q${this.generateReceipt()}`,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };

    dataLayer.saveTransaction(transaction);

    dataLayer.addAuditLog(
      tenantId,
      'system',
      'MPESA_B2C_SUCCESS',
      'Transaction',
      transaction.id,
      `Disbursed KES ${amount.toLocaleString()} to ${phoneNumber}. Receipt: ${transaction.mpesaReceipt}`
    );

    return {
      success: true,
      transaction,
      receipt: transaction.mpesaReceipt,
    };
  }

  // Simulate C2B repayment (Customer to Business)
  async receivePayment(
    tenantId: string,
    loanId: string,
    amount: number,
    paybill: string,
    accountRef: string
  ): Promise<MPesaResult> {
    // Simulate network delay
    await this.delay(1000);

    // 98% success rate for C2B
    const success = Math.random() > 0.02;

    if (!success) {
      const transaction: MPesaTransaction = {
        id: dataLayer.generateId('TXN'),
        tenantId,
        loanId,
        type: 'C2B',
        amount,
        reference: accountRef,
        status: 'Failed',
        createdAt: new Date().toISOString(),
      };
      dataLayer.saveTransaction(transaction);

      return {
        success: false,
        transaction,
        error: 'Payment failed - insufficient funds or incorrect PIN',
      };
    }

    const transaction: MPesaTransaction = {
      id: dataLayer.generateId('TXN'),
      tenantId,
      loanId,
      type: 'C2B',
      amount,
      reference: accountRef,
      status: 'Success',
      mpesaReceipt: `P${this.generateReceipt()}`,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };

    dataLayer.saveTransaction(transaction);

    dataLayer.addAuditLog(
      tenantId,
      'system',
      'MPESA_C2B_SUCCESS',
      'Transaction',
      transaction.id,
      `Received KES ${amount.toLocaleString()} via Paybill ${paybill}, Account: ${accountRef}. Receipt: ${transaction.mpesaReceipt}`
    );

    return {
      success: true,
      transaction,
      receipt: transaction.mpesaReceipt,
    };
  }

  // Simulate STK Push
  async stkPush(
    tenantId: string,
    loanId: string,
    amount: number,
    phoneNumber: string
  ): Promise<{ success: boolean; checkoutRequestId?: string; error?: string }> {
    // Simulate STK push initiation
    await this.delay(500);

    const checkoutRequestId = `ws_CO_${Date.now()}`;

    // Simulate user entering PIN (80% will complete)
    const userCompletes = Math.random() > 0.2;

    if (!userCompletes) {
      return {
        success: false,
        error: 'STK push cancelled by user or timed out',
      };
    }

    // Simulate payment processing
    await this.delay(2000);

    const transaction: MPesaTransaction = {
      id: dataLayer.generateId('TXN'),
      tenantId,
      loanId,
      type: 'STK',
      amount,
      reference: loanId,
      status: 'Success',
      mpesaReceipt: `S${this.generateReceipt()}`,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };

    dataLayer.saveTransaction(transaction);

    dataLayer.addAuditLog(
      tenantId,
      'system',
      'MPESA_STK_SUCCESS',
      'Transaction',
      transaction.id,
      `STK Push payment: KES ${amount.toLocaleString()} from ${phoneNumber}. Receipt: ${transaction.mpesaReceipt}`
    );

    return {
      success: true,
      checkoutRequestId,
    };
  }

  // Query transaction status
  async queryTransaction(transactionId: string): Promise<MPesaTransaction | null> {
    await this.delay(300);
    const transactions = dataLayer.getTransactions();
    return transactions.find(t => t.id === transactionId) || null;
  }

  // Get transaction history for a loan
  getLoanTransactions(loanId: string, tenantId: string): MPesaTransaction[] {
    return dataLayer.getTransactions(tenantId).filter(t => t.loanId === loanId);
  }

  // Helper methods
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateReceipt(): string {
    return Math.random().toString(36).substr(2, 10).toUpperCase();
  }
}

export const mpesaSimulator = new MPesaSimulator();
