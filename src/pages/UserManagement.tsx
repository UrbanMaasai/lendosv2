import { useState, useEffect } from 'react';
import { Users, Shield, Plus, Edit2, Trash2, CheckCircle2, XCircle } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'tenant_admin' | 'credit_officer' | 'collections_agent' | 'compliance_officer';
  tenantId?: string;
  tenantName?: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: string;
  createdAt: string;
  permissions: string[];
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'credit_officer' as User['role'],
    tenantId: '',
  });

  useEffect(() => {
    const storedUsers = localStorage.getItem('lendingos_users');
    const storedRoles = localStorage.getItem('lendingos_roles');
    
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      const seedUsers: User[] = [
        {
          id: 'usr_001',
          name: 'Platform Admin',
          email: 'admin@lendingos.co.ke',
          role: 'super_admin',
          status: 'active',
          lastLogin: '2026-06-15T14:30:00Z',
          createdAt: '2026-01-01T00:00:00Z',
          permissions: ['*'],
        },
        {
          id: 'usr_002',
          name: 'John Kamau',
          email: 'john@pesaflash.co.ke',
          role: 'tenant_admin',
          tenantId: 'tenant_001',
          tenantName: 'PesaFlash',
          status: 'active',
          lastLogin: '2026-06-15T10:20:00Z',
          createdAt: '2026-01-15T00:00:00Z',
          permissions: ['tenants.read', 'borrowers.*', 'loans.*', 'reports.read'],
        },
        {
          id: 'usr_003',
          name: 'Sarah Wanjiku',
          email: 'sarah@pesaflash.co.ke',
          role: 'credit_officer',
          tenantId: 'tenant_001',
          tenantName: 'PesaFlash',
          status: 'active',
          lastLogin: '2026-06-15T09:15:00Z',
          createdAt: '2026-02-01T00:00:00Z',
          permissions: ['borrowers.read', 'loans.read', 'loans.approve', 'loans.reject'],
        },
        {
          id: 'usr_004',
          name: 'James Ochieng',
          email: 'james@pesaflash.co.ke',
          role: 'collections_agent',
          tenantId: 'tenant_001',
          tenantName: 'PesaFlash',
          status: 'active',
          lastLogin: '2026-06-14T16:45:00Z',
          createdAt: '2026-02-10T00:00:00Z',
          permissions: ['borrowers.read', 'loans.read', 'collections.*'],
        },
        {
          id: 'usr_005',
          name: 'Mary Njeri',
          email: 'mary@quickcredit.co.ke',
          role: 'compliance_officer',
          tenantId: 'tenant_002',
          tenantName: 'QuickCredit SACCO',
          status: 'active',
          lastLogin: '2026-06-15T11:30:00Z',
          createdAt: '2026-02-20T00:00:00Z',
          permissions: ['compliance.*', 'audit_logs.read', 'reports.read'],
        },
      ];
      setUsers(seedUsers);
      localStorage.setItem('lendingos_users', JSON.stringify(seedUsers));
    }

    if (storedRoles) {
      setRoles(JSON.parse(storedRoles));
    } else {
      const seedRoles: Role[] = [
        {
          id: 'role_001',
          name: 'Super Admin',
          description: 'Full platform access across all tenants',
          permissions: ['*'],
          userCount: 1,
        },
        {
          id: 'role_002',
          name: 'Tenant Admin',
          description: 'Full access within assigned tenant',
          permissions: ['tenants.read', 'borrowers.*', 'loans.*', 'products.*', 'reports.read'],
          userCount: 1,
        },
        {
          id: 'role_003',
          name: 'Credit Officer',
          description: 'Manage loan applications and decisions',
          permissions: ['borrowers.read', 'loans.read', 'loans.approve', 'loans.reject'],
          userCount: 1,
        },
        {
          id: 'role_004',
          name: 'Collections Agent',
          description: 'Manage collections and borrower communications',
          permissions: ['borrowers.read', 'loans.read', 'collections.*'],
          userCount: 1,
        },
        {
          id: 'role_005',
          name: 'Compliance Officer',
          description: 'Monitor compliance and audit logs',
          permissions: ['compliance.*', 'audit_logs.read', 'reports.read'],
          userCount: 1,
        },
      ];
      setRoles(seedRoles);
      localStorage.setItem('lendingos_roles', JSON.stringify(seedRoles));
    }
  }, []);

  const handleCreateUser = () => {
    const user: User = {
      id: `usr_${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      tenantId: newUser.tenantId || undefined,
      tenantName: newUser.tenantId ? 'PesaFlash' : undefined,
      status: 'active',
      createdAt: new Date().toISOString(),
      permissions: roles.find(r => r.name.toLowerCase().replace(' ', '_') === newUser.role)?.permissions || [],
    };

    const updatedUsers = [user, ...users];
    setUsers(updatedUsers);
    localStorage.setItem('lendingos_users', JSON.stringify(updatedUsers));

    setShowCreateModal(false);
    setNewUser({ name: '', email: '', role: 'credit_officer', tenantId: '' });
  };

  const handleToggleStatus = (userId: string) => {
    const updated = users.map(u => {
      if (u.id === userId) {
        return { ...u, status: (u.status === 'active' ? 'inactive' : 'active') as 'active' | 'inactive' };
      }
      return u;
    });
    setUsers(updated);
    localStorage.setItem('lendingos_users', JSON.stringify(updated));
  };

  const handleDeleteUser = (userId: string) => {
    const updated = users.filter(u => u.id !== userId);
    setUsers(updated);
    localStorage.setItem('lendingos_users', JSON.stringify(updated));
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    superAdmins: users.filter(u => u.role === 'super_admin').length,
    tenantAdmins: users.filter(u => u.role === 'tenant_admin').length,
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'tenant_admin': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'credit_officer': return 'bg-green-50 text-green-700 border-green-200';
      case 'collections_agent': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'compliance_officer': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management & RBAC</h1>
          <p className="text-sm text-gray-500">Manage users, roles, and permissions with role-based access control</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700"
        >
          <Plus size={16} /> Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} className="text-primary-600" />
            <span className="text-xs text-gray-500">Total Users</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={16} className="text-accent-600" />
            <span className="text-xs text-gray-500">Active</span>
          </div>
          <p className="text-2xl font-bold text-accent-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <XCircle size={16} className="text-gray-600" />
            <span className="text-xs text-gray-500">Inactive</span>
          </div>
          <p className="text-2xl font-bold text-gray-600">{stats.inactive}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={16} className="text-purple-600" />
            <span className="text-xs text-gray-500">Super Admins</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">{stats.superAdmins}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={16} className="text-blue-600" />
            <span className="text-xs text-gray-500">Tenant Admins</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{stats.tenantAdmins}</p>
        </div>
      </div>

      {/* Roles Overview */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Roles & Permissions</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((role) => (
            <div key={role.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{role.name}</h4>
                <span className="text-xs text-gray-500">{role.userCount} users</span>
              </div>
              <p className="text-xs text-gray-600 mb-3">{role.description}</p>
              <div className="flex flex-wrap gap-1">
                {role.permissions.slice(0, 3).map((perm) => (
                  <span key={perm} className="text-xs bg-white px-2 py-0.5 rounded border border-gray-200">
                    {perm}
                  </span>
                ))}
                {role.permissions.length > 3 && (
                  <span className="text-xs text-gray-500">+{role.permissions.length - 3} more</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Users</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">User</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Role</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Tenant</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Status</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Last Login</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded border ${getRoleColor(user.role)}`}>
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-700">{user.tenantName || 'Platform'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded ${
                      user.status === 'active' ? 'bg-accent-50 text-accent-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-600">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="p-1 text-gray-400 hover:text-primary-600"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        className="p-1 text-gray-400 hover:text-warning-600"
                      >
                        {user.status === 'active' ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
                      </button>
                      {user.role !== 'super_admin' && (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1 text-gray-400 hover:text-danger-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Add New User</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Name</label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Email</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  >
                    <option value="tenant_admin">Tenant Admin</option>
                    <option value="credit_officer">Credit Officer</option>
                    <option value="collections_agent">Collections Agent</option>
                    <option value="compliance_officer">Compliance Officer</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleCreateUser}
                    disabled={!newUser.name || !newUser.email}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50"
                  >
                    Create User
                  </button>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedUser(null)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">User Details</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Name</p>
                    <p className="text-sm font-medium text-gray-900">{selectedUser.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <p className="text-sm text-gray-900">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Role</p>
                    <span className={`text-xs px-2 py-1 rounded border ${getRoleColor(selectedUser.role)}`}>
                      {selectedUser.role.replace('_', ' ')}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      selectedUser.status === 'active' ? 'bg-accent-50 text-accent-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {selectedUser.status}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2">Permissions</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.permissions.map((perm) => (
                      <span key={perm} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Shield size={18} className="text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Role-Based Access Control (RBAC)</p>
            <ul className="text-xs text-blue-700 mt-1 space-y-1">
              <li>• Users are assigned roles with specific permissions</li>
              <li>• Tenant admins can only access their tenant's data</li>
              <li>• Super admins have full platform access</li>
              <li>• All user actions are logged in audit trail</li>
              <li>• Permissions follow principle of least privilege</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
