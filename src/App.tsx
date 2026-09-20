import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/app" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="tenants" element={<Tenants />} />
          <Route path="products" element={<Products />} />
          <Route path="borrowers" element={<Borrowers />} />
          <Route path="loans" element={<Loans />} />
          <Route path="collections" element={<Collections />} />
          <Route path="compliance" element={<Compliance />} />
          <Route path="reports" element={<Reports />} />
          <Route path="integrations" element={<Integrations />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
