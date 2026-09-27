import { useState, useEffect } from 'react';
import { Building2, Shield, AlertTriangle, CheckCircle2, Lock, Eye, EyeOff } from 'lucide-react';
import { dataLayer, Tenant } from '../services/dataLayer';

interface TenantContext {
  currentTenant: Tenant | null;
  isSuperAdmin: boolean;
  switchTenant: (tenantId: string | null) => void;
}

export default function TenantContextSwitcher({ onTenantChange }: { onTenantChange: (tenantId: string | null) => void }) {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);
  const [isSuperAdminView, setIsSuperAdminView] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setTenants(dataLayer.getTenants());
  }, []);

  const handleSwitch = (tenantId: string | null) => {
    setSelectedTenantId(tenantId);
    setIsSuperAdminView(tenantId === null);
    setShowDropdown(false);
    onTenantChange(tenantId);
  };

  const selectedTenant = selectedTenantId ? tenants.find(t => t.id === selectedTenantId) : null;

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
          isSuperAdminView 
            ? 'bg-purple-50 border-purple-200 text-purple-700' 
            : 'bg-primary-50 border-primary-200 text-primary-700'
        }`}
      >
        {isSuperAdminView ? (
          <>
            <Shield size={16} />
            <span className="text-sm font-medium">Super Admin View</span>
          </>
        ) : (
          <>
            <Building2 size={16} />
            <span className="text-sm font-medium">{selectedTenant?.name}</span>
          </>
        )}
      </button>

      {showDropdown && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)}></div>
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-1">Switch Context</h3>
              <p className="text-xs text-gray-500">View data as a specific tenant or as super admin</p>
            </div>

            <div className="max-h-96 overflow-y-auto scrollbar-thin">
              {/* Super Admin Option */}
              <button
                onClick={() => handleSwitch(null)}
                className={`w-full flex items-center gap-3 p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                  isSuperAdminView ? 'bg-purple-50' : ''
                }`}
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Shield size={18} className="text-purple-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-gray-900">Super Admin</p>
                  <p className="text-xs text-gray-500">See all tenants and data</p>
                </div>
                {isSuperAdminView && <CheckCircle2 size={16} className="text-purple-600" />}
              </button>

              {/* Tenant Options */}
              {tenants.map((tenant) => (
                <button
                  key={tenant.id}
                  onClick={() => handleSwitch(tenant.id)}
                  className={`w-full flex items-center gap-3 p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                    selectedTenantId === tenant.id ? 'bg-primary-50' : ''
                  }`}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                    <span className="text-primary-700 font-bold text-sm">{tenant.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">{tenant.name}</p>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        tenant.status === 'Active' ? 'bg-accent-50 text-accent-700' :
                        tenant.status === 'Sandbox' ? 'bg-warning-50 text-warning-700' :
                        'bg-danger-50 text-danger-700'
                      }`}>
                        {tenant.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{tenant.tier} tier · {tenant.subdomain}.lendingos.co.ke</p>
                  </div>
                  {selectedTenantId === tenant.id && <CheckCircle2 size={16} className="text-primary-600" />}
                </button>
              ))}
            </div>

            <div className="p-3 bg-gray-50 border-t border-gray-100">
              <div className="flex items-start gap-2 text-xs text-gray-600">
                <Lock size={12} className="mt-0.5 flex-shrink-0" />
                <p>
                  <strong>Data Isolation:</strong> When viewing as a tenant, you'll only see that tenant's borrowers, loans, and transactions. 
                  Super admin view shows all data across tenants.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
