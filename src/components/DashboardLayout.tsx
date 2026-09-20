import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Package, Users, FileText,
  PhoneCall, Shield, BarChart3, Plug, Menu, X, LogOut,
  Bell, Search, ChevronDown, ChevronRight, CheckCircle2, AlertTriangle, Book,
  Wrench, TrendingUp, AlertOctagon, Webhook
} from 'lucide-react';
import NotificationCenter from './NotificationCenter';
import GlobalSearch from './GlobalSearch';
import TaskManager from './TaskManager';
import ThemeToggle from './ThemeToggle';
import TenantContextSwitcher from './TenantContextSwitcher';

const navItems = [
  { path: '/app', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { path: '/app/tenants', icon: Building2, label: 'Tenants' },
  { path: '/app/products', icon: Package, label: 'Products', children: [
    { path: '/app/products/changes', label: 'Change Approvals' }
  ]},
  { path: '/app/borrowers', icon: Users, label: 'Borrowers', children: [
    { path: '/app/borrowers/360', label: '360° View' }
  ]},
  { path: '/app/loans', icon: FileText, label: 'Loans', children: [
    { path: '/app/loans/bulk', label: 'Bulk Operations' }
  ]},
  { path: '/app/collections', icon: PhoneCall, label: 'Collections', children: [
    { path: '/app/collections/timeline', label: 'Timeline' },
    { path: '/app/collections/templates', label: 'Templates' }
  ]},
  { path: '/app/compliance', icon: Shield, label: 'Compliance', children: [
    { path: '/app/compliance/audit', label: 'Audit Logs' },
    { path: '/app/compliance/overrides', label: 'Overrides' },
    { path: '/app/compliance/regulatory', label: 'Regulatory Reports' },
    { path: '/app/compliance/complaints', label: 'Complaints' },
    { path: '/app/compliance/fraud', label: 'Fraud Detection' }
  ]},
  { path: '/app/reports', icon: BarChart3, label: 'Reports', children: [
    { path: '/app/reports/analytics', label: 'Portfolio Analytics' }
  ]},
  { path: '/app/integrations', icon: Plug, label: 'Integrations', children: [
    { path: '/app/integrations/mpesa', label: 'M-Pesa Monitor' },
    { path: '/app/integrations/webhooks', label: 'Webhooks' }
  ]},
  { path: '/app/tools', icon: Wrench, label: 'Tools', children: [
    { path: '/app/tools/credit-score', label: 'Credit Score Simulator' },
    { path: '/app/tools/loan-calculator', label: 'Loan Calculator' }
  ]},
];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Generate breadcrumbs from current path
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = [
    { label: 'Home', path: '/app' },
    ...pathSegments.map((segment, index) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      path: '/' + pathSegments.slice(0, index + 1).join('/'),
    })),
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="font-bold text-lg text-gray-900">LendingOS</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500">
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)] scrollbar-thin">
          {navItems.map((item) => (
            <div key={item.path}>
              <NavLink
                to={item.path}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon size={18} />
                {item.label}
              </NavLink>
              {item.children && location.pathname.startsWith(item.path) && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `block px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          isActive
                            ? 'bg-primary-50 text-primary-700'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                        }`
                      }
                    >
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="pt-6 mt-6 border-t border-gray-100 space-y-3">
            {/* System Status */}
            <div className="px-3 py-2">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>System Status</span>
                <span className="flex items-center gap-1 text-accent-600">
                  <span className="w-1.5 h-1.5 bg-accent-500 rounded-full"></span>
                  Operational
                </span>
              </div>
              <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-accent-500 rounded-full" style={{ width: '99.9%' }}></div>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Uptime: 99.97% · af-south-1</p>
            </div>

            {/* Borrower Portal Link */}
            <button
              onClick={() => navigate('/mobile')}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-primary-600 hover:bg-primary-50 w-full"
            >
              <Users size={18} />
              Mobile App Demo
            </button>

            <button
              onClick={() => navigate('/docs')}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-primary-600 hover:bg-primary-50 w-full"
            >
              <Book size={18} />
              API Documentation
            </button>

            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full"
            >
              <LogOut size={18} />
              Exit Platform
            </button>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Global Search Modal */}
        <GlobalSearch />

        {/* Top bar */}
        <header className="bg-white border-b border-gray-200">
          <div className="h-16 flex items-center justify-between px-4 lg:px-6">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500">
                <Menu size={20} />
              </button>
              <button 
                onClick={() => {
                  // Trigger global search via keyboard shortcut simulation
                  const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true });
                  window.dispatchEvent(event);
                }}
                className="hidden sm:flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 w-64 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <Search size={16} className="text-gray-400" />
                <span className="text-sm text-gray-400 flex-1 text-left">Search...</span>
                <kbd className="text-xs text-gray-400 bg-white px-1.5 py-0.5 rounded border border-gray-200">⌘K</kbd>
              </button>
              <TenantContextSwitcher onTenantChange={(tenantId) => {
                // Handle tenant context change
                console.log('Tenant context changed:', tenantId);
              }} />
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <NotificationCenter />
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">PA</span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">Platform Admin</p>
                  <p className="text-xs text-gray-500">Super Admin</p>
                </div>
                <ChevronDown size={14} className="text-gray-400" />
              </div>
            </div>
          </div>
          
          {/* Breadcrumbs */}
          {pathSegments.length > 0 && (
            <div className="px-4 lg:px-6 pb-3 flex items-center gap-1 text-sm overflow-x-auto">
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.path} className="flex items-center gap-1 flex-shrink-0">
                  {index > 0 && <ChevronRight size={14} className="text-gray-400" />}
                  <button
                    onClick={() => navigate(crumb.path)}
                    className={`hover:text-primary-600 transition-colors ${
                      index === breadcrumbs.length - 1 ? 'text-gray-900 font-medium' : 'text-gray-500'
                    }`}
                  >
                    {crumb.label}
                  </button>
                </div>
              ))}
            </div>
          )}
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
