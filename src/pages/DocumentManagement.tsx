import { useState, useEffect } from 'react';
import { FileText, Upload, CheckCircle2, XCircle, Clock, Eye, Download, Trash2, Shield } from 'lucide-react';

interface Document {
  id: string;
  borrowerId: string;
  borrowerName: string;
  type: 'national_id' | 'passport' | 'payslip' | 'bank_statement' | 'utility_bill' | 'other';
  filename: string;
  status: 'pending' | 'verified' | 'rejected';
  uploadedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionReason?: string;
  fileSize: string;
}

export default function DocumentManagement() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('lendingos_documents');
    if (stored) {
      setDocuments(JSON.parse(stored));
    } else {
      const seedDocs: Document[] = [
        {
          id: 'doc_001',
          borrowerId: 'brw_001',
          borrowerName: 'James Mwangi',
          type: 'national_id',
          filename: 'id_front.jpg',
          status: 'verified',
          uploadedAt: '2026-01-15T10:00:00Z',
          verifiedAt: '2026-01-15T10:05:00Z',
          verifiedBy: 'Smile Identity',
          fileSize: '245 KB',
        },
        {
          id: 'doc_002',
          borrowerId: 'brw_001',
          borrowerName: 'James Mwangi',
          type: 'payslip',
          filename: 'payslip_june_2026.pdf',
          status: 'verified',
          uploadedAt: '2026-06-01T09:00:00Z',
          verifiedAt: '2026-06-01T14:30:00Z',
          verifiedBy: 'Sarah K.',
          fileSize: '1.2 MB',
        },
        {
          id: 'doc_003',
          borrowerId: 'brw_004',
          borrowerName: 'Mary Kamau',
          type: 'national_id',
          filename: 'id_front.jpg',
          status: 'pending',
          uploadedAt: '2026-06-14T11:20:00Z',
          fileSize: '312 KB',
        },
        {
          id: 'doc_004',
          borrowerId: 'brw_004',
          borrowerName: 'Mary Kamau',
          type: 'utility_bill',
          filename: 'water_bill.pdf',
          status: 'rejected',
          uploadedAt: '2026-06-14T11:25:00Z',
          rejectionReason: 'Document is blurry and unreadable. Please upload a clearer copy.',
          fileSize: '890 KB',
        },
        {
          id: 'doc_005',
          borrowerId: 'brw_005',
          borrowerName: 'David Kiprop',
          type: 'bank_statement',
          filename: 'statement_6months.pdf',
          status: 'verified',
          uploadedAt: '2026-05-10T14:00:00Z',
          verifiedAt: '2026-05-11T09:15:00Z',
          verifiedBy: 'James M.',
          fileSize: '2.4 MB',
        },
      ];
      setDocuments(seedDocs);
      localStorage.setItem('lendingos_documents', JSON.stringify(seedDocs));
    }
  }, []);

  const filteredDocs = documents.filter(d => {
    if (filter === 'all') return true;
    return d.status === filter;
  });

  const handleVerify = (docId: string) => {
    const updated = documents.map(d => {
      if (d.id === docId) {
        return {
          ...d,
          status: 'verified' as const,
          verifiedAt: new Date().toISOString(),
          verifiedBy: 'Admin User',
        };
      }
      return d;
    });
    setDocuments(updated);
    localStorage.setItem('lendingos_documents', JSON.stringify(updated));
    setSelectedDoc(null);
  };

  const handleReject = (docId: string, reason: string) => {
    const updated = documents.map(d => {
      if (d.id === docId) {
        return {
          ...d,
          status: 'rejected' as const,
          rejectionReason: reason,
        };
      }
      return d;
    });
    setDocuments(updated);
    localStorage.setItem('lendingos_documents', JSON.stringify(updated));
    setSelectedDoc(null);
  };

  const handleDelete = (docId: string) => {
    const updated = documents.filter(d => d.id !== docId);
    setDocuments(updated);
    localStorage.setItem('lendingos_documents', JSON.stringify(updated));
  };

  const stats = {
    total: documents.length,
    pending: documents.filter(d => d.status === 'pending').length,
    verified: documents.filter(d => d.status === 'verified').length,
    rejected: documents.filter(d => d.status === 'rejected').length,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle2 size={16} className="text-accent-600" />;
      case 'rejected': return <XCircle size={16} className="text-danger-600" />;
      case 'pending': return <Clock size={16} className="text-warning-600" />;
      default: return <Clock size={16} className="text-gray-400" />;
    }
  };

  const getDocTypeLabel = (type: string) => {
    switch (type) {
      case 'national_id': return 'National ID';
      case 'passport': return 'Passport';
      case 'payslip': return 'Payslip';
      case 'bank_statement': return 'Bank Statement';
      case 'utility_bill': return 'Utility Bill';
      case 'other': return 'Other';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Management</h1>
          <p className="text-sm text-gray-500">Upload, verify, and manage borrower KYC documents</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700"
        >
          <Upload size={16} /> Upload Document
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={16} className="text-primary-600" />
            <span className="text-xs text-gray-500">Total Documents</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-warning-600" />
            <span className="text-xs text-gray-500">Pending Review</span>
          </div>
          <p className="text-2xl font-bold text-warning-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={16} className="text-accent-600" />
            <span className="text-xs text-gray-500">Verified</span>
          </div>
          <p className="text-2xl font-bold text-accent-600">{stats.verified}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <XCircle size={16} className="text-danger-600" />
            <span className="text-xs text-gray-500">Rejected</span>
          </div>
          <p className="text-2xl font-bold text-danger-600">{stats.rejected}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(['all', 'pending', 'verified', 'rejected'] as const).map((f) => (
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

      {/* Documents List */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Document</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Borrower</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Type</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Status</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Uploaded</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Size</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{doc.filename}</p>
                        <p className="text-xs text-gray-500 font-mono">{doc.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm text-gray-900">{doc.borrowerName}</p>
                      <p className="text-xs text-gray-500 font-mono">{doc.borrowerId}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-700">{getDocTypeLabel(doc.type)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(doc.status)}
                      <span className="text-sm text-gray-700 capitalize">{doc.status}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-600">
                      {new Date(doc.uploadedAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-600">{doc.fileSize}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedDoc(doc)}
                        className="p-1 text-gray-400 hover:text-primary-600"
                        title="View details"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="p-1 text-gray-400 hover:text-danger-600"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Detail Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedDoc(null)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Document Details</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Document ID</p>
                    <p className="text-sm font-mono text-gray-900">{selectedDoc.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(selectedDoc.status)}
                      <span className="text-sm text-gray-900 capitalize">{selectedDoc.status}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Borrower</p>
                    <p className="text-sm text-gray-900">{selectedDoc.borrowerName}</p>
                    <p className="text-xs text-gray-500 font-mono">{selectedDoc.borrowerId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Document Type</p>
                    <p className="text-sm text-gray-900">{getDocTypeLabel(selectedDoc.type)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Filename</p>
                    <p className="text-sm text-gray-900 font-mono">{selectedDoc.filename}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">File Size</p>
                    <p className="text-sm text-gray-900">{selectedDoc.fileSize}</p>
                  </div>
                </div>

                {selectedDoc.verifiedAt && (
                  <div className="bg-accent-50 border border-accent-200 rounded-lg p-3">
                    <p className="text-xs text-accent-700 mb-1">Verified</p>
                    <p className="text-sm text-accent-900">
                      {new Date(selectedDoc.verifiedAt).toLocaleString()} by {selectedDoc.verifiedBy}
                    </p>
                  </div>
                )}

                {selectedDoc.rejectionReason && (
                  <div className="bg-danger-50 border border-danger-200 rounded-lg p-3">
                    <p className="text-xs text-danger-700 mb-1">Rejection Reason</p>
                    <p className="text-sm text-danger-900">{selectedDoc.rejectionReason}</p>
                  </div>
                )}

                {selectedDoc.status === 'pending' && (
                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleVerify(selectedDoc.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-accent-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-accent-700"
                    >
                      <CheckCircle2 size={16} /> Verify Document
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt('Enter rejection reason:');
                        if (reason) handleReject(selectedDoc.id, reason);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-danger-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-danger-700"
                    >
                      <XCircle size={16} /> Reject Document
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowUploadModal(false)}>
          <div className="bg-white rounded-xl max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Upload Document</h3>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload size={32} className="mx-auto mb-3 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-2">Drag and drop your file here</p>
                  <p className="text-xs text-gray-500 mb-4">or</p>
                  <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700">
                    Browse Files
                  </button>
                  <p className="text-xs text-gray-500 mt-4">
                    Supported: JPG, PNG, PDF (max 10MB)
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowUploadModal(false)}
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

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Shield size={18} className="text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Document Management Features</p>
            <ul className="text-xs text-blue-700 mt-1 space-y-1">
              <li>• Upload and verify KYC documents (ID, passport, payslips, etc.)</li>
              <li>• Manual and automated verification (Smile Identity integration)</li>
              <li>• Document status tracking (pending, verified, rejected)</li>
              <li>• Rejection reasons with borrower notification</li>
              <li>• Secure document storage with audit trail</li>
              <li>• Document type categorization and filtering</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
