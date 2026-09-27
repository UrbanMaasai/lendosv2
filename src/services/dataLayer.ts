// Core data layer with localStorage persistence and hash-chained audit logs

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  tier: 'Free' | 'Starter' | 'Growth' | 'Enterprise';
  status: 'Active' | 'Sandbox' | 'Suspended';
  branding: {
    logo?: string;
    primaryColor: string;
    secondaryColor: string;
  };
  mpesaConfig: {
    paybill: string;
    shortcode: string;
    environment: 'sandbox' | 'production';
  };
  createdAt: string;
  users: string[];
}

export interface Borrower {
  id: string;
  tenantId: string;
  phone: string;
  name: string;
  idNumber: string;
  kycVerified: boolean;
  kycMethod: 'smile_identity' | 'manual' | null;
  creditScore: number;
  consent: {
    creditCheck: boolean;
    crbReporting: boolean;
    marketing: boolean;
    version: string;
    timestamp: string;
    ipAddress: string;
  };
  status: 'Pending KYC' | 'Active' | 'Cooling-Off' | 'Overdue' | 'Suspended';
  registeredAt: string;
  lastLoginAt?: string;
}

export interface LoanProduct {
  id: string;
  tenantId: string;
  name: string;
  status: 'Draft' | 'Active' | 'Suspended';
  config: {
    minAmount: number;
    maxAmount: number;
    apr: number;
    tenureDays: number;
    interestMethod: 'flat' | 'reducing';
    autoApproveThreshold: number;
    coolingOffHours: number;
  };
  eligibility: {
    minAge: number;
    maxAge: number;
    minIncome: number;
    minCreditScore: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Loan {
  id: string;
  tenantId: string;
  borrowerId: string;
  productId: string;
  principal: number;
  interest: number;
  fees: number;
  totalDue: number;
  paid: number;
  remaining: number;
  status: 'Application' | 'KYC Review' | 'Decision' | 'Cooling-Off' | 'Approved' | 'Disbursed' | 'Active' | 'Overdue' | 'Repaid' | 'In Duplum' | 'Defaulted';
  dueDate: string;
  disbursedAt?: string;
  repaidAt?: string;
  coolingOffUntil?: string;
  kfsGenerated: boolean;
  kfsVersion: string;
  inDuplumReached: boolean;
  inDuplumDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MPesaTransaction {
  id: string;
  tenantId: string;
  loanId: string;
  type: 'C2B' | 'B2C' | 'STK';
  amount: number;
  reference: string;
  status: 'Pending' | 'Success' | 'Failed';
  mpesaReceipt?: string;
  createdAt: string;
  completedAt?: string;
}

export interface AuditLog {
  id: string;
  tenantId: string;
  timestamp: string;
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  previousHash: string;
  hash: string;
}

// Hash function for audit log chaining
function simpleHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

class DataLayer {
  private storagePrefix = 'lendingos_';

  // Generic storage methods
  private get<T>(key: string): T[] {
    const data = localStorage.getItem(this.storagePrefix + key);
    return data ? JSON.parse(data) : [];
  }

  private set<T>(key: string, data: T[]): void {
    localStorage.setItem(this.storagePrefix + key, JSON.stringify(data));
  }

  // Tenants
  getTenants(): Tenant[] {
    return this.get<Tenant>('tenants');
  }

  getTenant(id: string): Tenant | undefined {
    return this.getTenants().find(t => t.id === id);
  }

  saveTenant(tenant: Tenant): void {
    const tenants = this.getTenants();
    const index = tenants.findIndex(t => t.id === tenant.id);
    if (index >= 0) {
      tenants[index] = tenant;
    } else {
      tenants.push(tenant);
    }
    this.set('tenants', tenants);
  }

  // Borrowers
  getBorrowers(tenantId?: string): Borrower[] {
    const borrowers = this.get<Borrower>('borrowers');
    return tenantId ? borrowers.filter(b => b.tenantId === tenantId) : borrowers;
  }

  getBorrower(id: string): Borrower | undefined {
    return this.getBorrowers().find(b => b.id === id);
  }

  getBorrowerByPhone(phone: string, tenantId: string): Borrower | undefined {
    return this.getBorrowers(tenantId).find(b => b.phone === phone);
  }

  saveBorrower(borrower: Borrower): void {
    const borrowers = this.getBorrowers();
    const index = borrowers.findIndex(b => b.id === borrower.id);
    if (index >= 0) {
      borrowers[index] = borrower;
    } else {
      borrowers.push(borrower);
    }
    this.set('borrowers', borrowers);
  }

  // Products
  getProducts(tenantId?: string): LoanProduct[] {
    const products = this.get<LoanProduct>('products');
    return tenantId ? products.filter(p => p.tenantId === tenantId) : products;
  }

  getProduct(id: string): LoanProduct | undefined {
    return this.getProducts().find(p => p.id === id);
  }

  saveProduct(product: LoanProduct): void {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      products.push(product);
    }
    this.set('products', products);
  }

  // Loans
  getLoans(tenantId?: string): Loan[] {
    const loans = this.get<Loan>('loans');
    return tenantId ? loans.filter(l => l.tenantId === tenantId) : loans;
  }

  getLoan(id: string): Loan | undefined {
    return this.getLoans().find(l => l.id === id);
  }

  saveLoan(loan: Loan): void {
    const loans = this.getLoans();
    const index = loans.findIndex(l => l.id === loan.id);
    if (index >= 0) {
      loans[index] = loan;
    } else {
      loans.push(loan);
    }
    this.set('loans', loans);
  }

  // M-Pesa Transactions
  getTransactions(tenantId?: string): MPesaTransaction[] {
    const transactions = this.get<MPesaTransaction>('transactions');
    return tenantId ? transactions.filter(t => t.tenantId === tenantId) : transactions;
  }

  saveTransaction(transaction: MPesaTransaction): void {
    const transactions = this.getTransactions();
    const index = transactions.findIndex(t => t.id === transaction.id);
    if (index >= 0) {
      transactions[index] = transaction;
    } else {
      transactions.push(transaction);
    }
    this.set('transactions', transactions);
  }

  // Audit Logs
  getAuditLogs(tenantId?: string): AuditLog[] {
    const logs = this.get<AuditLog>('audit_logs');
    return tenantId ? logs.filter(l => l.tenantId === tenantId) : logs;
  }

  addAuditLog(
    tenantId: string,
    userId: string,
    action: string,
    entity: string,
    entityId: string,
    details: string
  ): void {
    const logs = this.getAuditLogs();
    const previousHash = logs.length > 0 ? logs[logs.length - 1].hash : '00000000';
    
    const logEntry: AuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tenantId,
      timestamp: new Date().toISOString(),
      userId,
      action,
      entity,
      entityId,
      details,
      previousHash,
      hash: simpleHash(previousHash + action + entityId + details + Date.now()),
    };

    logs.push(logEntry);
    this.set('audit_logs', logs);
  }

  verifyAuditChain(tenantId?: string): boolean {
    const logs = this.getAuditLogs(tenantId);
    for (let i = 1; i < logs.length; i++) {
      if (logs[i].previousHash !== logs[i - 1].hash) {
        return false;
      }
    }
    return true;
  }

  // Generate unique IDs
  generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Clear all data (for testing)
  clearAll(): void {
    const keys = ['tenants', 'borrowers', 'products', 'loans', 'transactions', 'audit_logs'];
    keys.forEach(key => localStorage.removeItem(this.storagePrefix + key));
  }
}

export const dataLayer = new DataLayer();
