import { HashRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Landing from './pages/Landing';
import Pricing from './pages/Pricing';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Tenants from './pages/Tenants';
import Products from './pages/Products';
import Borrowers from './pages/Borrowers';
import Loans from './pages/Loans';
import Collections from './pages/Collections';
import Compliance from './pages/Compliance';
import Reports from './pages/Reports';
import Integrations from './pages/Integrations';
import BorrowerPortal from './pages/BorrowerPortal';
import MobileBorrowerApp from './pages/MobileBorrowerApp';
import APIDocumentation from './pages/APIDocumentation';
import AuditLogExplorer from './pages/AuditLogExplorer';
import Borrower360View from './pages/Borrower360View';
import MPesaMonitor from './pages/MPesaMonitor';
import CollectionsTimeline from './pages/CollectionsTimeline';
import OverrideTracker from './pages/OverrideTracker';
import RegulatoryReporting from './pages/RegulatoryReporting';
import ComplaintsManagement from './pages/ComplaintsManagement';
import CommunicationTemplates from './pages/CommunicationTemplates';
import ProductChangeApproval from './pages/ProductChangeApproval';
import BulkLoanOperations from './pages/BulkLoanOperations';
import CreditScoreSimulator from './pages/CreditScoreSimulator';
import LoanCalculator from './pages/LoanCalculator';
import FraudDetectionDashboard from './pages/FraudDetectionDashboard';
import PortfolioAnalytics from './pages/PortfolioAnalytics';
import WebhookManagement from './pages/WebhookManagement';
import { seedPlatform } from './services/seedData';

function App() {
  useEffect(() => {
    // Initialize platform with sample data
    seedPlatform();
  }, []);

  return (
    <HashRouter>
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
          <Route path="reports" element={<Reports />} />
          <Route path="reports/analytics" element={<PortfolioAnalytics />} />
          <Route path="integrations" element={<Integrations />} />
          <Route path="integrations/mpesa" element={<MPesaMonitor />} />
          <Route path="integrations/webhooks" element={<WebhookManagement />} />
          <Route path="tools" element={<div />} />
          <Route path="tools/credit-score" element={<CreditScoreSimulator />} />
          <Route path="tools/loan-calculator" element={<LoanCalculator />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
