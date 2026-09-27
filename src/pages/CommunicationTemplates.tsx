import { useState, useEffect } from 'react';
import { MessageSquare, Mail, Phone, Edit2, CheckCircle2, AlertTriangle, Shield, Copy } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  channel: 'SMS' | 'Email' | 'Voice';
  category: 'Payment Reminder' | 'Overdue Notice' | 'PTP Reminder' | 'Welcome' | 'Disbursement' | 'Repayment Confirmation' | 'Collections' | 'Consent';
  content: string;
  variables: string[];
  status: 'Active' | 'Draft' | 'Archived';
  complianceApproved: boolean;
  lastUsed?: string;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function CommunicationTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [channelFilter, setChannelFilter] = useState<'all' | 'SMS' | 'Email' | 'Voice'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [previewData, setPreviewData] = useState({
    borrowerName: 'James Mwangi',
    loanAmount: '15,000',
    dueDate: '2026-07-15',
    loanId: 'LN-2026-0847',
    paybill: '522533',
  });

  useEffect(() => {
    const stored = localStorage.getItem('lendingos_templates');
    if (stored) {
      setTemplates(JSON.parse(stored));
    } else {
      const seedTemplates: Template[] = [
        {
          id: 'TPL-001',
          name: 'Payment Reminder - 3 Days Before',
          channel: 'SMS',
          category: 'Payment Reminder',
          content: 'Dear {borrowerName}, your loan payment of KES {loanAmount} is due on {dueDate}. Please pay via M-Pesa Paybill {paybill}, Account: {loanId}. Thank you.',
          variables: ['borrowerName', 'loanAmount', 'dueDate', 'paybill', 'loanId'],
          status: 'Active',
          complianceApproved: true,
          usageCount: 1247,
          createdAt: '2026-01-15T00:00:00Z',
          updatedAt: '2026-01-15T00:00:00Z',
        },
        {
          id: 'TPL-002',
          name: 'Payment Reminder - 1 Day Before',
          channel: 'SMS',
          category: 'Payment Reminder',
          content: 'Reminder: Your loan payment of KES {loanAmount} is due tomorrow ({dueDate}). Pay via M-Pesa Paybill {paybill}, Account: {loanId}.',
          variables: ['borrowerName', 'loanAmount', 'dueDate', 'paybill', 'loanId'],
          status: 'Active',
          complianceApproved: true,
          usageCount: 1189,
          createdAt: '2026-01-15T00:00:00Z',
          updatedAt: '2026-01-15T00:00:00Z',
        },
        {
          id: 'TPL-003',
          name: 'Overdue Notice - 1-7 Days',
          channel: 'SMS',
          category: 'Overdue Notice',
          content: 'Dear {borrowerName}, your loan payment of KES {loanAmount} was due on {dueDate} and is now overdue. Please pay immediately via M-Pesa Paybill {paybill}, Account: {loanId} to avoid additional charges.',
          variables: ['borrowerName', 'loanAmount', 'dueDate', 'paybill', 'loanId'],
          status: 'Active',
          complianceApproved: true,
          usageCount: 856,
          createdAt: '2026-01-15T00:00:00Z',
          updatedAt: '2026-01-15T00:00:00Z',
        },
        {
          id: 'TPL-004',
          name: 'Overdue Notice - 8-30 Days',
          channel: 'SMS',
          category: 'Overdue Notice',
          content: 'Dear {borrowerName}, your loan {loanId} is now significantly overdue. Please contact us immediately to discuss repayment options. Call: 0700-000-000.',
          variables: ['borrowerName', 'loanId'],
          status: 'Active',
          complianceApproved: true,
          usageCount: 423,
          createdAt: '2026-01-15T00:00:00Z',
          updatedAt: '2026-01-15T00:00:00Z',
        },
        {
          id: 'TPL-005',
          name: 'PTP Reminder',
          channel: 'SMS',
          category: 'PTP Reminder',
          content: 'Dear {borrowerName}, this is a reminder of your promise to pay KES {loanAmount} by {dueDate}. Thank you for your commitment.',
          variables: ['borrowerName', 'loanAmount', 'dueDate'],
          status: 'Active',
          complianceApproved: true,
          usageCount: 312,
          createdAt: '2026-01-15T00:00:00Z',
          updatedAt: '2026-01-15T00:00:00Z',
        },
        {
          id: 'TPL-006',
          name: 'Welcome Message',
          channel: 'SMS',
          category: 'Welcome',
          content: 'Welcome to PesaFlash, {borrowerName}! Your account has been successfully created. You can now apply for loans up to KES 50,000. Reply HELP for assistance.',
          variables: ['borrowerName'],
          status: 'Active',
          complianceApproved: true,
          usageCount: 2847,
          createdAt: '2026-01-15T00:00:00Z',
          updatedAt: '2026-01-15T00:00:00Z',
        },
        {
          id: 'TPL-007',
          name: 'Disbursement Confirmation',
          channel: 'SMS',
          category: 'Disbursement',
          content: 'Your loan of KES {loanAmount} has been disbursed to your M-Pesa account. Loan ID: {loanId}. Due date: {dueDate}. Total repayment: KES {loanAmount}.',
          variables: ['borrowerName', 'loanAmount', 'loanId', 'dueDate'],
          status: 'Active',
          complianceApproved: true,
          usageCount: 1923,
          createdAt: '2026-01-15T00:00:00Z',
          updatedAt: '2026-01-15T00:00:00Z',
        },
        {
          id: 'TPL-008',
          name: 'Repayment Confirmation',
          channel: 'SMS',
          category: 'Repayment Confirmation',
          content: 'Payment of KES {loanAmount} received for loan {loanId}. Thank you! Remaining balance: KES {loanAmount}.',
          variables: ['borrowerName', 'loanAmount', 'loanId'],
          status: 'Active',
          complianceApproved: true,
          usageCount: 3456,
          createdAt: '2026-01-15T00:00:00Z',
          updatedAt: '2026-01-15T00:00:00Z',
        },
        {
          id: 'TPL-009',
          name: 'Consent Withdrawal Confirmation',
          channel: 'Email',
          category: 'Consent',
          content: 'Dear {borrowerName},\n\nWe confirm that your consent for {consentType} has been withdrawn as requested. This change is effective immediately.\n\nIf you have any questions, please contact us.\n\nBest regards,\nPesaFlash Compliance Team',
          variables: ['borrowerName', 'consentType'],
          status: 'Active',
          complianceApproved: true,
          usageCount: 89,
          createdAt: '2026-01-15T00:00:00Z',
          updatedAt: '2026-01-15T00:00:00Z',
        },
      ];
      setTemplates(seedTemplates);
      localStorage.setItem('lendingos_templates', JSON.stringify(seedTemplates));
    }
  }, []);

  const filteredTemplates = templates.filter(t => {
    const matchesChannel = channelFilter === 'all' || t.channel === channelFilter;
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
    return matchesChannel && matchesCategory;
  });

  const stats = {
    total: templates.length,
    active: templates.filter(t => t.status === 'Active').length,
    sms: templates.filter(t => t.channel === 'SMS').length,
    email: templates.filter(t => t.channel === 'Email').length,
    voice: templates.filter(t => t.channel === 'Voice').length,
    totalUsage: templates.reduce((sum, t) => sum + t.usageCount, 0),
  };

  const renderPreview = (content: string) => {
    return content
      .replace(/\{borrowerName\}/g, previewData.borrowerName)
      .replace(/\{loanAmount\}/g, previewData.loanAmount)
      .replace(/\{dueDate\}/g, previewData.dueDate)
      .replace(/\{loanId\}/g, previewData.loanId)
      .replace(/\{paybill\}/g, previewData.paybill);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Communication Templates</h1>
          <p className="text-sm text-gray-500">Pre-approved templates for all borrower communications (CL-008 compliance)</p>
        </div>
      </div>

      {/* Compliance Notice */}
      <div className="bg-accent-50 border border-accent-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Shield size={18} className="text-accent-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-accent-800">DLAK Code of Conduct - CL-008</p>
            <p className="text-xs text-accent-700 mt-1">
              No threats or obscene language — only pre-approved SMS templates allowed. No free-text in collections communications.
              All templates must be compliance-approved before use.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare size={16} className="text-primary-600" />
            <span className="text-xs text-gray-500">Total Templates</span>
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
            <Phone size={16} className="text-blue-600" />
            <span className="text-xs text-gray-500">SMS</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{stats.sms}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Mail size={16} className="text-purple-600" />
            <span className="text-xs text-gray-500">Email</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">{stats.email}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Phone size={16} className="text-green-600" />
            <span className="text-xs text-gray-500">Voice</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.voice}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare size={16} className="text-primary-600" />
            <span className="text-xs text-gray-500">Total Usage</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalUsage.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={channelFilter}
          onChange={(e) => setChannelFilter(e.target.value as any)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 bg-white"
        >
          <option value="all">All Channels</option>
          <option value="SMS">SMS</option>
          <option value="Email">Email</option>
          <option value="Voice">Voice</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 bg-white"
        >
          <option value="all">All Categories</option>
          <option value="Payment Reminder">Payment Reminder</option>
          <option value="Overdue Notice">Overdue Notice</option>
          <option value="PTP Reminder">PTP Reminder</option>
          <option value="Welcome">Welcome</option>
          <option value="Disbursement">Disbursement</option>
          <option value="Repayment Confirmation">Repayment Confirmation</option>
          <option value="Collections">Collections</option>
          <option value="Consent">Consent</option>
        </select>
      </div>

      {/* Templates Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            onClick={() => setSelectedTemplate(template)}
            className="bg-white rounded-xl p-5 border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-gray-500">{template.id}</span>
                  {template.complianceApproved && (
                    <span className="text-xs bg-accent-50 text-accent-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 size={10} /> Approved
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900">{template.name}</h3>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${
                template.channel === 'SMS' ? 'bg-blue-50 text-blue-700' :
                template.channel === 'Email' ? 'bg-purple-50 text-purple-700' :
                'bg-green-50 text-green-700'
              }`}>
                {template.channel}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.content}</p>
            <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">{template.category}</span>
              <span>{template.usageCount.toLocaleString()} uses</span>
            </div>
          </div>
        ))}
      </div>

      {/* Template Detail Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setSelectedTemplate(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">{selectedTemplate.name}</h3>
              <button onClick={() => setSelectedTemplate(null)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Template ID</p>
                  <p className="text-sm font-mono">{selectedTemplate.id}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Channel</p>
                  <p className="text-sm">{selectedTemplate.channel}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Category</p>
                  <p className="text-sm">{selectedTemplate.category}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Usage Count</p>
                  <p className="text-sm">{selectedTemplate.usageCount.toLocaleString()}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Template Content</p>
                <p className="text-sm text-gray-700 font-mono whitespace-pre-wrap">{selectedTemplate.content}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Variables</p>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.variables.map((v) => (
                    <span key={v} className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded font-mono">
                      {`{${v}}`}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
                <p className="text-xs text-primary-700 mb-2 font-medium">Preview with Sample Data</p>
                <p className="text-sm text-primary-900 whitespace-pre-wrap">{renderPreview(selectedTemplate.content)}</p>
              </div>
              {selectedTemplate.complianceApproved && (
                <div className="bg-accent-50 border border-accent-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-accent-600" />
                    <p className="text-xs text-accent-700">
                      This template has been compliance-approved and meets DLAK Code of Conduct requirements.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
