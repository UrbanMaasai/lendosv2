# LendingOS — Client-Side Backend Simulation

## Overview

LendingOS now includes a **full client-side backend simulation** that demonstrates the real data model, business logic, and compliance enforcement that would run on a Node.js backend. This simulation uses **localStorage** for persistent data storage and implements **hash-chained audit logs** for tamper-evident compliance tracking.

## Architecture

### Core Services

#### 1. **Data Layer** (`src/services/dataLayer.ts`)
- **Persistent storage** using localStorage
- **Multi-tenant isolation** — each tenant only sees their data
- **Hash-chained audit logs** — tamper-evident, 7-year retention simulation
- **Entity models**: Tenants, Borrowers, Products, Loans, Transactions, Audit Logs

**Key Features:**
- Row-level security simulation (tenant isolation)
- Immutable audit trail with hash chaining
- CRUD operations for all entities
- Unique ID generation
- Audit chain verification

#### 2. **Compliance Engine** (`src/services/complianceEngine.ts`)
Enforces all regulatory hard-blocks:

- **CL-003**: Max 3 contacts per borrower per day
- **CL-004**: Permitted hours (07:00-20:00)
- **CL-005**: No Sunday/holiday contacts
- **LS-005**: In Duplum Rule (2× principal cap)
- **KFS-001**: Key Facts Statement generation
- **COP-001**: Cooling-off period enforcement (24h)
- **CON-001**: Granular consent verification
- **SUI-001**: Affordability & suitability assessment

**Compliance checks are blocking** — transactions cannot proceed if compliance fails.

#### 3. **Loan Lifecycle** (`src/services/loanLifecycle.ts`)
Complete loan state machine:

```
Application → KYC Review → Decision → Approved → Cooling-Off → Disbursed → Active → Overdue → In Duplum → Repaid
```

**Features:**
- State transition validation
- Compliance enforcement at each stage
- Interest calculation (flat & reducing balance)
- Due date calculation
- In duplum tracking
- KFS auto-generation

#### 4. **M-Pesa Simulator** (`src/services/mpesaSimulator.ts`)
Simulates all M-Pesa transaction types:

- **B2C (Business to Customer)**: Disbursements
- **C2B (Customer to Business)**: Repayments via Paybill
- **STK Push**: Borrower-initiated payments

**Features:**
- Realistic success/failure rates (95-98%)
- Network delay simulation
- Receipt generation
- Transaction logging
- Callback simulation

#### 5. **Seed Data** (`src/services/seedData.ts`)
Initializes platform with:
- 3 tenants (PesaFlash, QuickCredit SACCO, Boda Finance)
- 3 loan products (Salary Advance, Micro Personal, SME Working Capital)
- 5 borrowers across tenants
- Initial audit log entries

## Multi-Tenant Isolation

**Super Admin (Platform Admin)**:
- Can see ALL tenants and their data
- Full visibility across the platform
- Can manage tenant configurations

**Tenant Admin**:
- Can ONLY see their own tenant's data
- Cannot access other tenants' borrowers, loans, or transactions
- Data privacy enforcement at the UI level

**Implementation:**
```typescript
// Super admin sees everything
const allLoans = dataLayer.getLoans(); // No tenant filter

// Tenant admin sees only their data
const tenantLoans = dataLayer.getLoans(tenantId); // Filtered by tenant
```

## Testing the Borrower Journey

### Access the Borrower Portal

Navigate to: `/#/borrower`

Or click "Test Borrower Journey" from:
- Landing page
- Dashboard sidebar

### Complete Journey Steps

1. **Welcome** — Introduction to PesaFlash
2. **Registration** — Enter phone, name, ID number
3. **KYC Verification** — Simulated Smile Identity verification (2s delay)
4. **Data Consent** — Grant credit check & CRB reporting consent
5. **Browse Products** — View available loan products
6. **Apply for Loan** — Select amount, view calculations
7. **Key Facts Statement** — Read and accept KFS (regulatory requirement)
8. **Cooling-Off Period** — 24-hour reflection period
9. **Disbursement** — M-Pesa B2C simulation
10. **Repayment** — Make payments via M-Pesa C2B/STK

### Test Scenarios

#### Scenario 1: Happy Path
1. Register with new phone number
2. Complete KYC (auto-verified)
3. Grant all consents
4. Apply for KES 10,000 loan
5. Accept KFS
6. Wait through cooling-off (or proceed immediately)
7. Receive disbursement
8. Make full repayment

#### Scenario 2: Compliance Block — In Duplum
1. Take a loan for KES 5,000
2. Repay KES 10,000 (2× principal)
3. Try to repay more → **BLOCKED** by in duplum rule
4. See compliance message: "In duplum reached"

#### Scenario 3: Consent Withdrawal
1. Register and grant consent
2. Go to borrower dashboard
3. Note: Consent can be withdrawn (not implemented in UI yet, but data model supports it)

#### Scenario 4: Affordability Check
1. Register with low credit score (< 500)
2. Try to apply for large loan
3. **BLOCKED** by affordability check (DTI > 50%)

#### Scenario 5: Collections Conduct
1. Create an overdue loan
2. Try to contact borrower > 3 times in one day
3. **BLOCKED** by CL-003 (contact limit)
4. Try to contact outside 07:00-20:00
5. **BLOCKED** by CL-004 (permitted hours)

## Data Persistence

All data is stored in **localStorage** with the prefix `lendingos_`:

- `lendingos_tenants` — Tenant configurations
- `lendingos_borrowers` — Borrower profiles
- `lendingos_products` — Loan product configurations
- `lendingos_loans` — Loan records
- `lendingos_transactions` — M-Pesa transactions
- `lendingos_audit_logs` — Tamper-evident audit trail

### Clear All Data

To reset the platform:
```javascript
localStorage.clear();
location.reload();
```

## Audit Log Hash Chain

Each audit log entry includes:
- `previousHash` — Hash of the previous entry
- `hash` — Hash of current entry (computed from previousHash + action + entityId + details + timestamp)

**Verification:**
```typescript
const isValid = dataLayer.verifyAuditChain(); // Returns true if chain is intact
```

If any entry is tampered with, the chain breaks and verification fails.

## API Simulation

The services simulate backend API calls:

```typescript
// Apply for loan
const result = loanLifecycle.apply(tenantId, borrowerId, productId, amount, userId);

// Disburse loan
const result = loanLifecycle.disburse(loanId, userId);

// Receive payment
const result = loanLifecycle.receivePayment(loanId, amount, userId);

// M-Pesa disbursement
const result = await mpesaSimulator.disburse(tenantId, loanId, amount, phoneNumber);
```

## Compliance Enforcement Examples

### Pre-Disbursement Check
```typescript
const complianceResult = complianceEngine.preDisbursementCheck(loan);

if (complianceResult.blocked) {
  console.log('Cannot disburse:', complianceResult.blockReason);
  // Block reasons:
  // - KFS not generated
  // - Cooling-off period active
  // - Consent not granted
  // - In duplum reached
}
```

### Pre-Collection Check
```typescript
const complianceResult = complianceEngine.preCollectionCheck(borrowerId, tenantId);

if (complianceResult.blocked) {
  console.log('Cannot contact borrower:', complianceResult.blockReason);
  // Block reasons:
  // - Contact limit reached (3/day)
  // - Outside permitted hours
  // - Sunday/holiday
}
```

## Real-World Backend Mapping

This client-side simulation maps directly to the Node.js backend architecture:

| Client-Side Service | Backend Equivalent |
|---------------------|-------------------|
| `dataLayer.ts` | Prisma ORM + PostgreSQL |
| `complianceEngine.ts` | Compliance middleware + rules engine |
| `loanLifecycle.ts` | Loan service + state machine |
| `mpesaSimulator.ts` | M-Pesa Daraja API integration |
| `seedData.ts` | Database migrations + seeders |

## Next Steps for Production

1. **Replace localStorage with PostgreSQL** — Use Prisma ORM
2. **Implement real M-Pesa integration** — Daraja API (not simulator)
3. **Add authentication** — JWT tokens, MFA
4. **Implement real KYC** — Smile Identity API
5. **Add CRB integration** — Metropol, TransUnion APIs
6. **Deploy to AWS** — af-south-1 (Cape Town) region
7. **Add monitoring** — OpenTelemetry, CloudWatch
8. **Implement row-level security** — PostgreSQL RLS policies

## Testing Checklist

- [ ] Register new borrower
- [ ] Complete KYC verification
- [ ] Grant data consent
- [ ] Apply for loan
- [ ] Accept KFS
- [ ] Wait through cooling-off
- [ ] Receive disbursement
- [ ] Make partial repayment
- [ ] Make full repayment
- [ ] Verify audit log chain
- [ ] Test in duplum block
- [ ] Test affordability check
- [ ] Test collections conduct rules
- [ ] Verify tenant isolation
- [ ] Clear data and re-seed

## Support

For questions about the backend simulation or borrower journey testing, refer to:
- `src/services/` — All service implementations
- `src/pages/BorrowerPortal.tsx` — Complete borrower journey UI
- `src/pages/Dashboard.tsx` — Super admin dashboard with live data

---

**Built with:** React, TypeScript, Tailwind CSS, localStorage, Hash-chained audit logs

**Compliance:** DLAK Code of Conduct, CBK Regulations, Data Protection Act 2019, In Duplum Rule
