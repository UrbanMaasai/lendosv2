// Compliance engine — enforces all hard-blocks and regulatory requirements

import { dataLayer, Loan, Borrower, LoanProduct } from './dataLayer';

export interface ComplianceCheck {
  passed: boolean;
  code: string;
  rule: string;
  message: string;
  blocking: boolean;
}

export interface ComplianceResult {
  allPassed: boolean;
  checks: ComplianceCheck[];
  blocked: boolean;
  blockReason?: string;
}

class ComplianceEngine {
  // CL-003: Max 3 contacts per borrower per day
  checkContactLimit(borrowerId: string, tenantId: string): ComplianceCheck {
    const today = new Date().toISOString().split('T')[0];
    const logs = dataLayer.getAuditLogs(tenantId);
    const todayContacts = logs.filter(l => 
      l.action === 'COLLECTION_CONTACT' && 
      l.entityId === borrowerId && 
      l.timestamp.startsWith(today)
    );
    
    return {
      passed: todayContacts.length < 3,
      code: 'CL-003',
      rule: 'Max 3 contacts per borrower per day',
      message: todayContacts.length >= 3 
        ? `Contact limit reached (${todayContacts.length}/3). Auto-suppressed until next day.`
        : `Contacts today: ${todayContacts.length}/3`,
      blocking: todayContacts.length >= 3,
    };
  }

  // CL-004: Permitted hours check (07:00-20:00)
  checkPermittedHours(): ComplianceCheck {
    const hour = new Date().getHours();
    const permitted = hour >= 7 && hour < 20;
    
    return {
      passed: permitted,
      code: 'CL-004',
      rule: 'Permitted contact hours (07:00-20:00)',
      message: permitted 
        ? `Current time within permitted hours (${hour}:00)`
        : `Outside permitted hours (${hour}:00). Contact blocked.`,
      blocking: !permitted,
    };
  }

  // CL-005: No Sunday/holiday contacts
  checkPermittedDay(): ComplianceCheck {
    const day = new Date().getDay();
    const isSunday = day === 0;
    
    return {
      passed: !isSunday,
      code: 'CL-005',
      rule: 'No contact on Sundays or public holidays',
      message: isSunday 
        ? 'Sunday detected. Automated collections suppressed.'
        : 'Day is permitted for collections contact.',
      blocking: isSunday,
    };
  }

  // LS-005: In Duplum Rule — hard cap at 2× principal
  checkInDuplum(loan: Loan): ComplianceCheck {
    const cap = loan.principal * 2;
    const totalRecovered = loan.paid;
    const reached = totalRecovered >= cap;
    
    return {
      passed: !reached,
      code: 'LS-005',
      rule: 'In Duplum Rule — total recoverable capped at 2× principal',
      message: reached 
        ? `In duplum reached: KES ${totalRecovered.toLocaleString()} / KES ${cap.toLocaleString()} cap. Further charges blocked.`
        : `In duplum not reached: KES ${totalRecovered.toLocaleString()} / KES ${cap.toLocaleString()} cap`,
      blocking: reached,
    };
  }

  // KFS-001: Key Facts Statement must be generated
  checkKFSGenerated(loan: Loan): ComplianceCheck {
    return {
      passed: loan.kfsGenerated,
      code: 'KFS-001',
      rule: 'Key Facts Statement must be generated before disbursement',
      message: loan.kfsGenerated 
        ? `KFS generated (version ${loan.kfsVersion})`
        : 'KFS not yet generated — blocking disbursement',
      blocking: !loan.kfsGenerated,
    };
  }

  // COP-001: Cooling-off period enforcement
  checkCoolingOff(loan: Loan): ComplianceCheck {
    if (!loan.coolingOffUntil) {
      return {
        passed: true,
        code: 'COP-001',
        rule: 'Cooling-off period',
        message: 'No cooling-off period required',
        blocking: false,
      };
    }

    const now = new Date();
    const coolingOffEnd = new Date(loan.coolingOffUntil);
    const stillInCoolingOff = now < coolingOffEnd;

    const hoursLeft = Math.max(0, Math.ceil((coolingOffEnd.getTime() - now.getTime()) / (1000 * 60 * 60)));
    
    return {
      passed: !stillInCoolingOff,
      code: 'COP-001',
      rule: 'Cooling-off period enforcement',
      message: stillInCoolingOff 
        ? `Cooling-off active: ${hoursLeft} hours remaining. Borrower can cancel without penalty.`
        : 'Cooling-off period completed',
      blocking: stillInCoolingOff && loan.status === 'Cooling-Off',
    };
  }

  // CON-001: Consent verification
  checkConsent(borrower: Borrower, requiredConsents: string[]): ComplianceCheck {
    const missingConsents: string[] = [];
    
    if (requiredConsents.includes('creditCheck') && !borrower.consent.creditCheck) {
      missingConsents.push('Credit Check');
    }
    if (requiredConsents.includes('crbReporting') && !borrower.consent.crbReporting) {
      missingConsents.push('CRB Reporting');
    }

    return {
      passed: missingConsents.length === 0,
      code: 'CON-001',
      rule: 'Granular consent verification',
      message: missingConsents.length > 0 
        ? `Missing consent: ${missingConsents.join(', ')}`
        : 'All required consents granted',
      blocking: missingConsents.length > 0,
    };
  }

  // SUI-001: Affordability check (DTI)
  checkAffordability(borrower: Borrower, loanAmount: number, product: LoanProduct): ComplianceCheck {
    // Simulated income based on credit score
    const estimatedIncome = borrower.creditScore > 0 
      ? 15000 + (borrower.creditScore * 50) 
      : 0;
    
    const existingLoans = dataLayer.getLoans(borrower.tenantId)
      .filter(l => l.borrowerId === borrower.id && l.status === 'Active')
      .reduce((sum, l) => sum + l.remaining, 0);
    
    const dti = estimatedIncome > 0 ? (existingLoans + loanAmount) / estimatedIncome : 999;
    const maxDTI = 0.5; // 50% DTI threshold
    
    return {
      passed: dti <= maxDTI && estimatedIncome >= product.eligibility.minIncome,
      code: 'SUI-001',
      rule: 'Affordability & Suitability Assessment',
      message: dti > maxDTI 
        ? `DTI too high: ${(dti * 100).toFixed(0)}% (max ${maxDTI * 100}%)`
        : estimatedIncome < product.eligibility.minIncome
        ? `Income below minimum: KES ${estimatedIncome.toLocaleString()} < KES ${product.eligibility.minIncome.toLocaleString()}`
        : `DTI acceptable: ${(dti * 100).toFixed(0)}%`,
      blocking: dti > maxDTI || estimatedIncome < product.eligibility.minIncome,
    };
  }

  // Full pre-disbursement compliance check
  preDisbursementCheck(loan: Loan): ComplianceResult {
    const borrower = dataLayer.getBorrower(loan.borrowerId);
    const product = dataLayer.getProduct(loan.productId);
    
    if (!borrower || !product) {
      return { allPassed: false, checks: [], blocked: true, blockReason: 'Borrower or product not found' };
    }

    const checks: ComplianceCheck[] = [
      this.checkKFSGenerated(loan),
      this.checkCoolingOff(loan),
      this.checkConsent(borrower, ['creditCheck', 'crbReporting']),
      this.checkInDuplum(loan),
    ];

    const blocked = checks.some(c => c.blocking);
    const blockReason = blocked 
      ? checks.find(c => c.blocking)?.message 
      : undefined;

    return {
      allPassed: !blocked,
      checks,
      blocked,
      blockReason,
    };
  }

  // Pre-collection contact check
  preCollectionCheck(borrowerId: string, tenantId: string): ComplianceResult {
    const checks: ComplianceCheck[] = [
      this.checkContactLimit(borrowerId, tenantId),
      this.checkPermittedHours(),
      this.checkPermittedDay(),
    ];

    const blocked = checks.some(c => c.blocking);
    const blockReason = blocked 
      ? checks.find(c => c.blocking)?.message 
      : undefined;

    return {
      allPassed: !blocked,
      checks,
      blocked,
      blockReason,
    };
  }
}

export const complianceEngine = new ComplianceEngine();
