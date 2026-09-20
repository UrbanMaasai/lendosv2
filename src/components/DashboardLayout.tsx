import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Package, Users, FileText,
  PhoneCall, Shield, BarChart3, Plug, Menu, X, LogOut,
  Bell, Search, ChevronDown, ChevronRight, CheckCircle2, AlertTriangle
} from 'lucide-react';

const navItems = [
  { path: '/app', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { path: '/app/tenants', icon: Building2, label: 'Tenants' },
  { path: '/app/products', icon: Package, label: 'Products' },
  { path: '/app/borrowers', icon: Users, label: 'Borrowers' },
  { path: '/app/loans', icon: FileText, label: 'Loans' },
  { path: '/app/collections', icon: PhoneCall, label: 'Collections' },
  { path: '/app/compliance', icon: Shield, label: 'Compliance' },
  { path: '/app/reports', icon: BarChart3, label: 'Reports' },
  { path: '/app/integrations', icon: Plug, label: 'Integrations' },
];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
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

  const notifications = [
    { id: 1, type: 'success', message: 'Loan LN-2026-0847 disbursed successfully', time: '2 min ago' },
    { id: 2, type: 'warning', message: 'PAR 30 approaching threshold (4.2%)', time: '15 min ago' },
    { id: 3, type: 'info', message: 'New tenant Boda Finance onboarded', time: '1 hour ago' },
    { id: 4, type: 'success', message: 'Compliance audit completed - all checks passed', time: '2 hours ago' },
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
            <NavLink
              key={item.path}
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
              onClick={() => navigate('/borrower')}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-primary-600 hover:bg-primary-50 w-full"
            >
              <Users size={18} />
              Test Borrower Journey
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
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200">
          <div className="h-16 flex items-center justify-between px-4 lg:px-6">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500">
                <Menu size={20} />
              </button>
              <div className="hidden sm:flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 w-64">
                <Search size={16} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search loans, borrowers, tenants..."
                  className="bg-transparent text-sm outline-none w-full text-gray-700 placeholder-gray-400"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <button 
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  <Bell size={18} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full animate-pulse"></span>
                </button>
                
                {/* Notification Panel */}
                {notifOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)}></div>
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        <span className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full">4 new</span>
                      </div>
                      <div className="max-h-80 overflow-y-auto scrollbar-thin">
                        {notifications.map((notif) => (
                          <div key={notif.id} className="p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer">
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                notif.type === 'success' ? 'bg-accent-500' :
                                notif.type === 'warning' ? 'bg-warning-500' :
                                'bg-primary-500'
                              }`}></div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900">{notif.message}</p>
                                <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 border-t border-gray-100">
                        <button className="w-full text-sm text-primary-600 hover:text-primary-700 font-medium">
                          View all notifications
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
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
