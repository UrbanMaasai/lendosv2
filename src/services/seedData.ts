// Seed data — initializes platform with sample tenants, products, and borrowers

import { dataLayer, Tenant, Borrower, LoanProduct } from './dataLayer';

export function seedPlatform(): void {
  // Check if already seeded
  if (dataLayer.getTenants().length > 0) {
    return;
  }

  console.log('🌱 Seeding LendingOS platform with sample data...');

  // Create tenants
  const tenants: Tenant[] = [
    {
      id: 'tenant_001',
      name: 'PesaFlash',
      subdomain: 'pesaflash',
      tier: 'Growth',
      status: 'Active',
      branding: {
        primaryColor: '#2563eb',
        secondaryColor: '#1e40af',
      },
      mpesaConfig: {
        paybill: '522533',
        shortcode: '600533',
        environment: 'production',
      },
      createdAt: '2026-01-15T00:00:00Z',
      users: ['admin_001', 'credit_001', 'collections_001'],
    },
    {
      id: 'tenant_002',
      name: 'QuickCredit SACCO',
      subdomain: 'quickcredit',
      tier: 'Starter',
      status: 'Active',
      branding: {
        primaryColor: '#16a34a',
        secondaryColor: '#15803d',
      },
      mpesaConfig: {
        paybill: '522534',
        shortcode: '600534',
        environment: 'production',
      },
      createdAt: '2026-02-20T00:00:00Z',
      users: ['admin_002', 'credit_002'],
    },
    {
      id: 'tenant_003',
      name: 'Boda Finance',
      subdomain: 'bodafin',
      tier: 'Free',
      status: 'Sandbox',
      branding: {
        primaryColor: '#f59e0b',
        secondaryColor: '#d97706',
      },
      mpesaConfig: {
        paybill: '522535',
        shortcode: '600535',
        environment: 'sandbox',
      },
      createdAt: '2026-06-01T00:00:00Z',
      users: ['admin_003'],
    },
  ];

  tenants.forEach(t => dataLayer.saveTenant(t));

  // Create products for PesaFlash
  const products: LoanProduct[] = [
    {
      id: 'prod_001',
      tenantId: 'tenant_001',
      name: 'Salary Advance',
      status: 'Active',
      config: {
        minAmount: 5000,
        maxAmount: 25000,
        apr: 36,
        tenureDays: 30,
        interestMethod: 'reducing',
        autoApproveThreshold: 5000,
        coolingOffHours: 24,
      },
      eligibility: {
        minAge: 22,
        maxAge: 55,
        minIncome: 20000,
        minCreditScore: 600,
      },
      createdAt: '2026-01-20T00:00:00Z',
      updatedAt: '2026-01-20T00:00:00Z',
    },
    {
      id: 'prod_002',
      tenantId: 'tenant_001',
      name: 'Micro Personal',
      status: 'Active',
      config: {
        minAmount: 1000,
        maxAmount: 50000,
        apr: 48,
        tenureDays: 60,
        interestMethod: 'flat',
        autoApproveThreshold: 3000,
        coolingOffHours: 24,
      },
      eligibility: {
        minAge: 21,
        maxAge: 60,
        minIncome: 12000,
        minCreditScore: 500,
      },
      createdAt: '2026-01-25T00:00:00Z',
      updatedAt: '2026-01-25T00:00:00Z',
    },
    {
      id: 'prod_003',
      tenantId: 'tenant_002',
      name: 'SME Working Capital',
      status: 'Active',
      config: {
        minAmount: 50000,
        maxAmount: 500000,
        apr: 28,
        tenureDays: 180,
        interestMethod: 'reducing',
        autoApproveThreshold: 0,
        coolingOffHours: 48,
      },
      eligibility: {
        minAge: 25,
        maxAge: 65,
        minIncome: 100000,
        minCreditScore: 650,
      },
      createdAt: '2026-02-25T00:00:00Z',
      updatedAt: '2026-02-25T00:00:00Z',
    },
  ];

  products.forEach(p => dataLayer.saveProduct(p));

  // Create borrowers for PesaFlash
  const borrowers: Borrower[] = [
    {
      id: 'brw_001',
      tenantId: 'tenant_001',
      phone: '+254712345678',
      name: 'James Mwangi',
      idNumber: '28456789',
      kycVerified: true,
      kycMethod: 'smile_identity',
      creditScore: 680,
      consent: {
        creditCheck: true,
        crbReporting: true,
        marketing: false,
        version: '2.5',
        timestamp: '2026-01-15T10:00:00Z',
        ipAddress: '105.23.45.67',
      },
      status: 'Active',
      registeredAt: '2026-01-15T00:00:00Z',
    },
    {
      id: 'brw_002',
      tenantId: 'tenant_001',
      phone: '+254723456789',
      name: 'Grace Wanjiku',
      idNumber: '29567890',
      kycVerified: true,
      kycMethod: 'smile_identity',
      creditScore: 720,
      consent: {
        creditCheck: true,
        crbReporting: true,
        marketing: true,
        version: '2.5',
        timestamp: '2026-01-20T00:00:00Z',
        ipAddress: '105.23.45.68',
      },
      status: 'Active',
      registeredAt: '2026-01-20T00:00:00Z',
    },
    {
      id: 'brw_003',
      tenantId: 'tenant_001',
      phone: '+254734567890',
      name: 'Peter Ochieng',
      idNumber: '30678901',
      kycVerified: true,
      kycMethod: 'manual',
      creditScore: 590,
      consent: {
        creditCheck: true,
        crbReporting: true,
        marketing: false,
        version: '2.5',
        timestamp: '2026-02-01T00:00:00Z',
        ipAddress: '105.23.45.69',
      },
      status: 'Active',
      registeredAt: '2026-02-01T00:00:00Z',
    },
    {
      id: 'brw_004',
      tenantId: 'tenant_001',
      phone: '+254745678901',
      name: 'Mary Kamau',
      idNumber: '31789012',
      kycVerified: false,
      kycMethod: null,
      creditScore: 0,
      consent: {
        creditCheck: false,
        crbReporting: false,
        marketing: false,
        version: '2.5',
        timestamp: '2026-03-01T00:00:00Z',
        ipAddress: '105.23.45.70',
      },
      status: 'Pending KYC',
      registeredAt: '2026-03-01T00:00:00Z',
    },
    {
      id: 'brw_005',
      tenantId: 'tenant_002',
      phone: '+254756789012',
      name: 'David Kiprop',
      idNumber: '32890123',
      kycVerified: true,
      kycMethod: 'smile_identity',
      creditScore: 650,
      consent: {
        creditCheck: true,
        crbReporting: true,
        marketing: false,
        version: '2.5',
        timestamp: '2026-02-25T00:00:00Z',
        ipAddress: '105.23.45.71',
      },
      status: 'Active',
      registeredAt: '2026-02-25T00:00:00Z',
    },
  ];

  borrowers.forEach(b => dataLayer.saveBorrower(b));

  // Add initial audit logs
  dataLayer.addAuditLog('tenant_001', 'system', 'PLATFORM_INIT', 'System', 'platform', 'LendingOS platform initialized with sample data');
  dataLayer.addAuditLog('tenant_001', 'admin_001', 'TENANT_CREATED', 'Tenant', 'tenant_001', 'PesaFlash tenant created');
  dataLayer.addAuditLog('tenant_001', 'admin_001', 'PRODUCT_CREATED', 'Product', 'prod_001', 'Salary Advance product created');
  dataLayer.addAuditLog('tenant_001', 'admin_001', 'PRODUCT_CREATED', 'Product', 'prod_002', 'Micro Personal product created');
  dataLayer.addAuditLog('tenant_002', 'admin_002', 'TENANT_CREATED', 'Tenant', 'tenant_002', 'QuickCredit SACCO tenant created');

  console.log('✅ Platform seeded successfully!');
  console.log(`   - ${tenants.length} tenants`);
  console.log(`   - ${products.length} products`);
  console.log(`   - ${borrowers.length} borrowers`);
}
