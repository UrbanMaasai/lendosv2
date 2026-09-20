import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Package, Users, FileText,
  PhoneCall, Shield, BarChart3, Plug, Menu, X, LogOut,
  Bell, Search, ChevronDown
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
  const navigate = useNavigate();

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

          <div className="pt-6 mt-6 border-t border-gray-100">
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
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500">
              <Menu size={20} />
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 w-64">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-sm outline-none w-full text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full"></span>
            </button>
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
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
