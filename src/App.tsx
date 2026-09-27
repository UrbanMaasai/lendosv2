import { HashRouter, Routes, Route } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import Landing from './pages/Landing';
import Pricing from './pages/Pricing';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import { seedPlatform } from './services/seedData';

// Lazy load all other pages for code splitting
const Tenants = lazy(() => import('./pages/Tenants'));
const Products = lazy(() => import('./pages/Products'));
const Borrowers = lazy(() => import('./pages/Borrowers'));
const Loans = lazy(() => import('./pages/Loans'));
const Collections = lazy(() => import('./pages/Collections'));
const Compliance = lazy(() => import('./pages/Compliance'));
const Reports = lazy(() => import('./pages/Reports'));
const Integrations = lazy(() => import('./pages/Integrations'));
const BorrowerPortal = lazy(() => import('./pages/BorrowerPortal'));
const MobileBorrowerApp = lazy(() => import('./pages/MobileBorrowerApp'));
const APIDocumentation = lazy(() => import('./pages/APIDocumentation'));
const AuditLogExplorer = lazy(() => import('./pages/AuditLogExplorer'));
const Borrower360View = lazy(() => import('./pages/Borrower360View'));
const MPesaMonitor = lazy(() => import('./pages/MPesaMonitor'));
const CollectionsTimeline = lazy(() => import('./pages/CollectionsTimeline'));
const OverrideTracker = lazy(() => import('./pages/OverrideTracker'));
const RegulatoryReporting = lazy(() => import('./pages/RegulatoryReporting'));
const ComplaintsManagement = lazy(() => import('./pages/ComplaintsManagement'));
const CommunicationTemplates = lazy(() => import('./pages/CommunicationTemplates'));
const ProductChangeApproval = lazy(() => import('./pages/ProductChangeApproval'));
const BulkLoanOperations = lazy(() => import('./pages/BulkLoanOperations'));
const CreditScoreSimulator = lazy(() => import('./pages/CreditScoreSimulator'));
const LoanCalculator = lazy(() => import('./pages/LoanCalculator'));
const FraudDetectionDashboard = lazy(() => import('./pages/FraudDetectionDashboard'));
const PortfolioAnalytics = lazy(() => import('./pages/PortfolioAnalytics'));
const WebhookManagement = lazy(() => import('./pages/WebhookManagement'));
const DataExportSuite = lazy(() => import('./pages/DataExportSuite'));
const UserManagement = lazy(() => import('./pages/UserManagement'));
const SystemHealthDashboard = lazy(() => import('./pages/SystemHealthDashboard'));
const ApiPlayground = lazy(() => import('./pages/ApiPlayground'));
const DocumentManagement = lazy(() => import('./pages/DocumentManagement'));
const NotificationPreferences = lazy(() => import('./pages/NotificationPreferences'));
const ScheduledReports = lazy(() => import('./pages/ScheduledReports'));
const CustomerJourneyAnalytics = lazy(() => import('./pages/CustomerJourneyAnalytics'));
const IntegrationMarketplace = lazy(() => import('./pages/IntegrationMarketplace'));
const WorkflowAutomation = lazy(() => import('./pages/WorkflowAutomation'));
const RegulatoryCalendar = lazy(() => import('./pages/RegulatoryCalendar'));
const GeographicAnalytics = lazy(() => import('./pages/GeographicAnalytics'));
const PerformanceBenchmarking = lazy(() => import('./pages/PerformanceBenchmarking'));
const PortfolioStressTesting = lazy(() => import('./pages/PortfolioStressTesting'));
const EarlyWarningSystem = lazy(() => import('./pages/EarlyWarningSystem'));
const AuditTrailVisualization = lazy(() => import('./pages/AuditTrailVisualization'));
const ComplianceIncidentManager = lazy(() => import('./pages/ComplianceIncidentManager'));
const TenantHealthDashboard = lazy(() => import('./pages/TenantHealthDashboard'));
const PaymentPlanGenerator = lazy(() => import('./pages/PaymentPlanGenerator'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
      <p className="text-sm text-gray-500">Loading...</p>
    </div>
  </div>
);

function App() {
  useEffect(() => {
    // Initialize platform with sample data
    seedPlatform();
  }, []);

  return (
    <HashRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/borrower" element={<BorrowerPortal />} />
          <Route path="/mobile" element={<MobileBorrowerApp />} />
          <Route path="/docs" element={<APIDocumentation />} />
          <Route path="/app" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="tenants" element={<Tenants />} />
            <Route path="products" element={<Products />} />
            <Route path="products/changes" element={<ProductChangeApproval />} />
            <Route path="borrowers" element={<Borrowers />} />
            <Route path="borrowers/360" element={<Borrower360View />} />
            <Route path="loans" element={<Loans />} />
            <Route path="loans/bulk" element={<BulkLoanOperations />} />
            <Route path="collections" element={<Collections />} />
            <Route path="collections/timeline" element={<CollectionsTimeline />} />
            <Route path="collections/templates" element={<CommunicationTemplates />} />
            <Route path="compliance" element={<Compliance />} />
            <Route path="compliance/audit" element={<AuditLogExplorer />} />
            <Route path="compliance/overrides" element={<OverrideTracker />} />
            <Route path="compliance/regulatory" element={<RegulatoryReporting />} />
            <Route path="compliance/complaints" element={<ComplaintsManagement />} />
            <Route path="compliance/fraud" element={<FraudDetectionDashboard />} />
            <Route path="compliance/incidents" element={<ComplianceIncidentManager />} />
            <Route path="reports" element={<Reports />} />
            <Route path="reports/analytics" element={<PortfolioAnalytics />} />
            <Route path="integrations" element={<Integrations />} />
            <Route path="integrations/mpesa" element={<MPesaMonitor />} />
            <Route path="integrations/webhooks" element={<WebhookManagement />} />
            <Route path="tools" element={<div />} />
            <Route path="tools/credit-score" element={<CreditScoreSimulator />} />
            <Route path="tools/loan-calculator" element={<LoanCalculator />} />
            <Route path="tools/payment-plan" element={<PaymentPlanGenerator />} />
            <Route path="operations" element={<div />} />
            <Route path="operations/exports" element={<DataExportSuite />} />
            <Route path="operations/documents" element={<DocumentManagement />} />
            <Route path="operations/users" element={<UserManagement />} />
            <Route path="operations/notifications" element={<NotificationPreferences />} />
            <Route path="operations/scheduled-reports" element={<ScheduledReports />} />
            <Route path="analytics" element={<div />} />
            <Route path="analytics/journey" element={<CustomerJourneyAnalytics />} />
            <Route path="analytics/system-health" element={<SystemHealthDashboard />} />
            <Route path="analytics/geographic" element={<GeographicAnalytics />} />
            <Route path="analytics/benchmarking" element={<PerformanceBenchmarking />} />
            <Route path="analytics/stress-testing" element={<PortfolioStressTesting />} />
            <Route path="analytics/early-warning" element={<EarlyWarningSystem />} />
            <Route path="analytics/audit-trail" element={<AuditTrailVisualization />} />
            <Route path="analytics/tenant-health" element={<TenantHealthDashboard />} />
            <Route path="developer" element={<div />} />
            <Route path="developer/api-playground" element={<ApiPlayground />} />
            <Route path="developer/marketplace" element={<IntegrationMarketplace />} />
            <Route path="automation" element={<div />} />
            <Route path="automation/workflows" element={<WorkflowAutomation />} />
            <Route path="automation/calendar" element={<RegulatoryCalendar />} />
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  );
}

export default App;
