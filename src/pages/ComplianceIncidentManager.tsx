import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle2, Clock, Shield, Eye, Filter } from 'lucide-react';
import { dataLayer } from '../services/dataLayer';

interface ComplianceIncident {
  id: string;
  type: 'in_duplum_violation' | 'consent_violation' | 'contact_limit_exceeded' | 'hours_violation' | 'kfs_missing' | 'cooling_off_violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'dismissed';
  tenantId: string;
  tenantName: string;
  entityId: string;
  description: string;
  detectedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolution?: string;
}

export default function ComplianceIncidentManager() {
  const [incidents, setIncidents] = useState<ComplianceIncident[]>([]);
  const [filter, setFilter] = useState<'all' | 'open' | 'investigating' | 'resolved' | 'dismissed'>('all');
  const [selectedIncident, setSelectedIncident] = useState<ComplianceIncident | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('lendingos_compliance_incidents');
    if (stored) {
      setIncidents(JSON.parse(stored));
    } else {
      const seedIncidents: ComplianceIncident[] = [
        {
          id: 'INC-001',
          type: 'contact_limit_exceeded',
          severity: 'high',
          status: 'open',
          tenantId: 'tenant_001',
          tenantName: 'PesaFlash',
          entityId: 'brw_001',
          description: 'Borrower James Mwangi received 4 SMS messages in one day, exceeding the 3/day limit (CL-003)',
          detectedAt: '2026-06-14T10:30:00Z',
        },
        {
          id: 'INC-002',
          type: 'consent_violation',
          severity: 'critical',
          status: 'investigating',
          tenantId: 'tenant_001',
          tenantName: 'PesaFlash',
          entityId: 'brw_005',
          description: 'Marketing SMS sent to David Kiprop after consent was withdrawn on 2026-06-10',
          detectedAt: '2026-06-13T16:45:00Z',
        },
        {
          id: 'INC-003',
          type: 'in_duplum_violation',
          severity: 'medium',
          status: 'resolved',
          tenantId: 'tenant_001',
          tenantName: 'PesaFlash',
          entityId: 'LN-2026-0840',
          description: 'Loan attempted to charge additional interest after reaching in duplum limit',
          detectedAt: '2026-06-10T11:20:00Z',
          resolvedAt: '2026-06-11T15:30:00Z',
          resolvedBy: 'Compliance Officer',
          resolution: 'System correctly blocked additional charges. No borrower impact.',
        },
        {
          id: 'INC-004',
          type: 'hours_violation',
          severity: 'low',
          status: 'dismissed',
          tenantId: 'tenant_002',
          tenantName: 'QuickCredit SACCO',
          entityId: 'brw_010',
          description: 'Collection call attempted at 20:30 (outside permitted hours 07:00-20:00)',
          detectedAt: '2026-06-12T13:10:00Z',
          resolvedAt: '2026-06-12T14:00:00Z',
          resolvedBy: 'System',
          resolution: 'Call was automatically blocked by system. No violation occurred.',
        },
        {
          id: 'INC-005',
          type: 'kfs_missing',
          severity: 'high',
          status: 'open',
          tenantId: 'tenant_001',
          tenantName: 'PesaFlash',
          entityId: 'LN-2026-0850',
          description: 'Loan application proceeded without KFS generation (KFS-001 violation)',
          detectedAt: '2026-06-15T09:15:00Z',
        },
      ];
      setIncidents(seedIncidents);
      localStorage.setItem('lendingos_compliance_incidents', JSON.stringify(seedIncidents));
    }
  }, []);

  const filteredIncidents = incidents.filter(i => {
    if (filter === 'all') return true;
    return i.status === filter;
  });

  const stats = {
    total: incidents.length,
    open: incidents.filter(i => i.status === 'open').length,
    investigating: incidents.filter(i => i.status === 'investigating').length,
    resolved: incidents.filter(i => i.status === 'resolved').length,
    critical: incidents.filter(i => i.severity === 'critical').length,
    high: incidents.filter(i => i.severity === 'high').length,
  };

  const handleResolve = (incidentId: string, resolution: string) => {
    const updated = incidents.map(i => {
      if (i.id === incidentId) {
        return {
          ...i,
          status: 'resolved' as const,
          resolvedAt: new Date().toISOString(),
          resolvedBy: 'Admin User',
          resolution,
        };
      }
      return i;
    });
    setIncidents(updated);
    localStorage.setItem('lendingos_compliance_incidents', JSON.stringify(updated));
    setSelectedIncident(null);
  };

  const handleDismiss = (incidentId: string) => {
    const updated = incidents.map(i => {
      if (i.id === incidentId) {
        return {
          ...i,
          status: 'dismissed' as const,
          resolvedAt: new Date().toISOString(),
          resolvedBy: 'Admin User',
          resolution: 'Incident dismissed as false positive',
        };
      }
      return i;
    });
    setIncidents(updated);
    localStorage.setItem('lendingos_compliance_incidents', JSON.stringify(updated));
    setSelectedIncident(null);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-danger-500 text-white';
      case 'high': return 'bg-danger-100 text-danger-700';
      case 'medium': return 'bg-warning-100 text-warning-700';
      case 'low': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-danger-50 text-danger-700 border-danger-200';
      case 'investigating': return 'bg-warning-50 text-warning-700 border-warning-200';
      case 'resolved': return 'bg-accent-50 text-accent-700 border-accent-200';
      case 'dismissed': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'in_duplum_violation': 'In Duplum Violation',
      'consent_violation': 'Consent Violation',
      'contact_limit_exceeded': 'Contact Limit Exceeded',
      'hours_violation': 'Hours Violation',
      'kfs_missing': 'KFS Missing',
      'cooling_off_violation': 'Cooling-Off Violation',
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliance Incident Manager</h1>
          <p className="text-sm text-gray-500">Track and resolve compliance violations and incidents</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-primary-600" />
            <span className="text-xs text-gray-500">Total Incidents</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-danger-600" />
            <span className="text-xs text-gray-500">Open</span>
          </div>
          <p className="text-2xl font-bold text-danger-600">{stats.open}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-warning-600" />
            <span className="text-xs text-gray-500">Investigating</span>
          </div>
          <p className="text-2xl font-bold text-warning-600">{stats.investigating}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={16} className="text-accent-600" />
            <span className="text-xs text-gray-500">Resolved</span>
          </div>
          <p className="text-2xl font-bold text-accent-600">{stats.resolved}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-danger-600" />
            <span className="text-xs text-gray-500">Critical</span>
          </div>
          <p className="text-2xl font-bold text-danger-600">{stats.critical}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-orange-600" />
            <span className="text-xs text-gray-500">High</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">{stats.high}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(['all', 'open', 'investigating', 'resolved', 'dismissed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Incidents List */}
      <div className="space-y-3">
        {filteredIncidents.map((incident) => (
          <div
            key={incident.id}
            onClick={() => setSelectedIncident(incident)}
            className="bg-white rounded-xl p-5 border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono text-gray-500">{incident.id}</span>
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${getSeverityColor(incident.severity)}`}>
                    {incident.severity}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded border ${getStatusColor(incident.status)}`}>
                    {incident.status}
                  </span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">{getTypeLabel(incident.type)}</h4>
                <p className="text-sm text-gray-600">{incident.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500 pt-3 border-t border-gray-100">
              <span>Tenant: <strong className="text-gray-700">{incident.tenantName}</strong></span>
              <span>Entity: <strong className="text-gray-700 font-mono">{incident.entityId}</strong></span>
              <span>Detected: <strong className="text-gray-700">{new Date(incident.detectedAt).toLocaleDateString()}</strong></span>
              {incident.resolvedAt && (
                <span>Resolved: <strong className="text-gray-700">{new Date(incident.resolvedAt).toLocaleDateString()}</strong></span>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredIncidents.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <Shield size={48} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No incidents found</h3>
          <p className="text-sm text-gray-500">Try adjusting your filters</p>
        </div>
      )}

      {/* Detail Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedIncident(null)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Incident Details</h3>
                <button onClick={() => setSelectedIncident(null)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Incident ID</p>
                    <p className="text-sm font-mono">{selectedIncident.id}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Type</p>
                    <p className="text-sm">{getTypeLabel(selectedIncident.type)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Severity</p>
                    <span className={`text-xs px-2 py-1 rounded font-medium ${getSeverityColor(selectedIncident.severity)}`}>
                      {selectedIncident.severity}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Status</p>
                    <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(selectedIncident.status)}`}>
                      {selectedIncident.status}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Description</p>
                  <p className="text-sm text-gray-700">{selectedIncident.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Tenant</p>
                    <p className="text-sm">{selectedIncident.tenantName}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Entity ID</p>
                    <p className="text-sm font-mono">{selectedIncident.entityId}</p>
                  </div>
                </div>

                {selectedIncident.resolution && (
                  <div className="bg-accent-50 border border-accent-200 rounded-lg p-3">
                    <p className="text-xs text-accent-700 mb-1">Resolution</p>
                    <p className="text-sm text-accent-800">{selectedIncident.resolution}</p>
                    <p className="text-xs text-accent-600 mt-1">
                      Resolved by {selectedIncident.resolvedBy} on {new Date(selectedIncident.resolvedAt!).toLocaleString()}
                    </p>
                  </div>
                )}

                {(selectedIncident.status === 'open' || selectedIncident.status === 'investigating') && (
                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => {
                        const resolution = prompt('Enter resolution details:');
                        if (resolution) handleResolve(selectedIncident.id, resolution);
                      }}
                      className="flex-1 px-4 py-2 bg-accent-600 text-white rounded-lg text-sm font-medium hover:bg-accent-700"
                    >
                      Resolve Incident
                    </button>
                    <button
                      onClick={() => handleDismiss(selectedIncident.id)}
                      className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700"
                    >
                      Dismiss as False Positive
                    </button>
                  </div>
                )}
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
            <p className="text-sm font-medium text-blue-900">Compliance Incident Management</p>
            <ul className="text-xs text-blue-700 mt-1 space-y-1">
              <li>• Track all compliance violations in one place</li>
              <li>• Severity levels: Critical, High, Medium, Low</li>
              <li>• Status workflow: Open → Investigating → Resolved/Dismissed</li>
              <li>• Resolution documentation with audit trail</li>
              <li>• Auto-detection of common violations</li>
              <li>• Tenant-specific incident tracking</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
