import { useState } from 'react';
import { GitBranch, Plus, Play, Pause, Edit2, Trash2, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: 'loan_application' | 'loan_approved' | 'loan_disbursed' | 'payment_received' | 'loan_overdue' | 'compliance_alert';
  status: 'active' | 'paused' | 'draft';
  steps: WorkflowStep[];
  executionCount: number;
  lastExecuted?: string;
  createdAt: string;
  updatedAt: string;
}

interface WorkflowStep {
  id: string;
  type: 'condition' | 'action' | 'notification' | 'approval' | 'delay';
  name: string;
  config: Record<string, any>;
  nextStepId?: string;
  onErrorStepId?: string;
}

export default function WorkflowAutomation() {
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: 'wf_001',
      name: 'Auto-Approve Small Loans',
      description: 'Automatically approve loans under KES 5,000 with good credit score',
      trigger: 'loan_application',
      status: 'active',
      steps: [
        {
          id: 'step_1',
          type: 'condition',
          name: 'Check Loan Amount',
          config: { field: 'amount', operator: 'less_than', value: 5000 },
          nextStepId: 'step_2',
        },
        {
          id: 'step_2',
          type: 'condition',
          name: 'Check Credit Score',
          config: { field: 'credit_score', operator: 'greater_than', value: 650 },
          nextStepId: 'step_3',
          onErrorStepId: 'step_5',
        },
        {
          id: 'step_3',
          type: 'action',
          name: 'Approve Loan',
          config: { action: 'approve_loan', autoDisburse: true },
          nextStepId: 'step_4',
        },
        {
          id: 'step_4',
          type: 'notification',
          name: 'Send Approval SMS',
          config: { template: 'loan_approved', channel: 'sms' },
        },
        {
          id: 'step_5',
          type: 'action',
          name: 'Route to Manual Review',
          config: { action: 'assign_to_queue', queue: 'manual_review' },
        },
      ],
      executionCount: 1247,
      lastExecuted: '2026-06-15T14:30:00Z',
      createdAt: '2026-01-15T00:00:00Z',
      updatedAt: '2026-06-10T00:00:00Z',
    },
    {
      id: 'wf_002',
      name: 'Overdue Loan Escalation',
      description: 'Automatically escalate overdue loans based on days past due',
      trigger: 'loan_overdue',
      status: 'active',
      steps: [
        {
          id: 'step_1',
          type: 'condition',
          name: 'Check Days Overdue',
          config: { field: 'days_overdue', operator: 'between', value: [1, 7] },
          nextStepId: 'step_2',
        },
        {
          id: 'step_2',
          type: 'notification',
          name: 'Send Reminder SMS',
          config: { template: 'overdue_1_7_days', channel: 'sms' },
          nextStepId: 'step_3',
        },
        {
          id: 'step_3',
          type: 'delay',
          name: 'Wait 3 Days',
          config: { duration: 3, unit: 'days' },
          nextStepId: 'step_4',
        },
        {
          id: 'step_4',
          type: 'condition',
          name: 'Check if Paid',
          config: { field: 'status', operator: 'equals', value: 'paid' },
          nextStepId: 'step_5',
          onErrorStepId: 'step_6',
        },
        {
          id: 'step_5',
          type: 'action',
          name: 'Mark as Resolved',
          config: { action: 'close_case' },
        },
        {
          id: 'step_6',
          type: 'action',
          name: 'Escalate to Collections',
          config: { action: 'assign_to_agent', agent: 'collections_team' },
        },
      ],
      executionCount: 856,
      lastExecuted: '2026-06-15T10:20:00Z',
      createdAt: '2026-02-01T00:00:00Z',
      updatedAt: '2026-06-05T00:00:00Z',
    },
    {
      id: 'wf_003',
      name: 'KYC Verification Flow',
      description: 'Automated KYC verification with Smile Identity integration',
      trigger: 'loan_application',
      status: 'active',
      steps: [
        {
          id: 'step_1',
          type: 'action',
          name: 'Submit to Smile Identity',
          config: { action: 'kyc_verification', provider: 'smile_identity' },
          nextStepId: 'step_2',
        },
        {
          id: 'step_2',
          type: 'delay',
          name: 'Wait for Result',
          config: { duration: 30, unit: 'seconds' },
          nextStepId: 'step_3',
        },
        {
          id: 'step_3',
          type: 'condition',
          name: 'Check Verification Status',
          config: { field: 'kyc_status', operator: 'equals', value: 'verified' },
          nextStepId: 'step_4',
          onErrorStepId: 'step_5',
        },
        {
          id: 'step_4',
          type: 'action',
          name: 'Update Borrower Status',
          config: { action: 'update_borrower', status: 'kyc_verified' },
        },
        {
          id: 'step_5',
          type: 'action',
          name: 'Route to Manual Review',
          config: { action: 'assign_to_queue', queue: 'kyc_manual_review' },
        },
      ],
      executionCount: 2847,
      lastExecuted: '2026-06-15T15:45:00Z',
      createdAt: '2026-01-20T00:00:00Z',
      updatedAt: '2026-06-12T00:00:00Z',
    },
    {
      id: 'wf_004',
      name: 'Compliance Alert Escalation',
      description: 'Automatically escalate compliance violations to compliance officer',
      trigger: 'compliance_alert',
      status: 'active',
      steps: [
        {
          id: 'step_1',
          type: 'condition',
          name: 'Check Severity',
          config: { field: 'severity', operator: 'equals', value: 'high' },
          nextStepId: 'step_2',
          onErrorStepId: 'step_3',
        },
        {
          id: 'step_2',
          type: 'notification',
          name: 'Alert Compliance Officer',
          config: { template: 'compliance_alert_high', channel: 'email', recipient: 'compliance_officer' },
          nextStepId: 'step_4',
        },
        {
          id: 'step_3',
          type: 'notification',
          name: 'Log Alert',
          config: { template: 'compliance_alert_low', channel: 'system' },
        },
        {
          id: 'step_4',
          type: 'action',
          name: 'Create Compliance Case',
          config: { action: 'create_case', type: 'compliance_violation' },
        },
      ],
      executionCount: 23,
      lastExecuted: '2026-06-14T16:30:00Z',
      createdAt: '2026-03-01T00:00:00Z',
      updatedAt: '2026-06-01T00:00:00Z',
    },
  ]);

  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleToggleStatus = (workflowId: string) => {
    const updated = workflows.map(w => {
      if (w.id === workflowId) {
        return { ...w, status: (w.status === 'active' ? 'paused' : 'active') as 'active' | 'paused' | 'draft' };
      }
      return w;
    });
    setWorkflows(updated);
  };

  const handleDelete = (workflowId: string) => {
    setWorkflows(workflows.filter(w => w.id !== workflowId));
  };

  const stats = {
    total: workflows.length,
    active: workflows.filter(w => w.status === 'active').length,
    paused: workflows.filter(w => w.status === 'paused').length,
    totalExecutions: workflows.reduce((sum, w) => sum + w.executionCount, 0),
  };

  const getTriggerLabel = (trigger: string) => {
    const labels: Record<string, string> = {
      loan_application: 'Loan Application',
      loan_approved: 'Loan Approved',
      loan_disbursed: 'Loan Disbursed',
      payment_received: 'Payment Received',
      loan_overdue: 'Loan Overdue',
      compliance_alert: 'Compliance Alert',
    };
    return labels[trigger] || trigger;
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'condition': return <AlertTriangle size={14} className="text-warning-600" />;
      case 'action': return <CheckCircle2 size={14} className="text-accent-600" />;
      case 'notification': return <Clock size={14} className="text-primary-600" />;
      case 'approval': return <CheckCircle2 size={14} className="text-purple-600" />;
      case 'delay': return <Clock size={14} className="text-gray-600" />;
      default: return <Clock size={14} className="text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workflow Automation</h1>
          <p className="text-sm text-gray-500">Build and manage automated workflows for loan processing</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700"
        >
          <Plus size={16} /> New Workflow
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <GitBranch size={16} className="text-primary-600" />
            <span className="text-xs text-gray-500">Total Workflows</span>
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
            <Pause size={16} className="text-gray-600" />
            <span className="text-xs text-gray-500">Paused</span>
          </div>
          <p className="text-2xl font-bold text-gray-600">{stats.paused}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Play size={16} className="text-purple-600" />
            <span className="text-xs text-gray-500">Total Executions</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">{stats.totalExecutions.toLocaleString()}</p>
        </div>
      </div>

      {/* Workflows List */}
      <div className="space-y-4">
        {workflows.map((workflow) => (
          <div key={workflow.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:border-primary-200 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900">{workflow.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    workflow.status === 'active' ? 'bg-accent-50 text-accent-700' :
                    workflow.status === 'paused' ? 'bg-gray-100 text-gray-700' :
                    'bg-warning-50 text-warning-700'
                  }`}>
                    {workflow.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{workflow.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>Trigger: <strong className="text-gray-700">{getTriggerLabel(workflow.trigger)}</strong></span>
                  <span>Steps: <strong className="text-gray-700">{workflow.steps.length}</strong></span>
                  <span>Executions: <strong className="text-gray-700">{workflow.executionCount.toLocaleString()}</strong></span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedWorkflow(workflow)}
                  className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                  title="View details"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleToggleStatus(workflow.id)}
                  className="p-2 text-gray-400 hover:text-warning-600 hover:bg-warning-50 rounded-lg"
                  title={workflow.status === 'active' ? 'Pause' : 'Activate'}
                >
                  {workflow.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <button
                  onClick={() => handleDelete(workflow.id)}
                  className="p-2 text-gray-400 hover:text-danger-600 hover:bg-danger-50 rounded-lg"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Workflow Steps Visualization */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {workflow.steps.map((step, idx) => (
                <div key={step.id} className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                    {getStepIcon(step.type)}
                    <span className="text-xs font-medium text-gray-700">{step.name}</span>
                  </div>
                  {idx < workflow.steps.length - 1 && (
                    <div className="text-gray-400">→</div>
                  )}
                </div>
              ))}
            </div>

            {workflow.lastExecuted && (
              <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                Last executed: {new Date(workflow.lastExecuted).toLocaleString()}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Workflow Detail Modal */}
      {selectedWorkflow && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedWorkflow(null)}>
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">{selectedWorkflow.name}</h3>
                <button onClick={() => setSelectedWorkflow(null)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">{selectedWorkflow.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Trigger: <strong>{getTriggerLabel(selectedWorkflow.trigger)}</strong></span>
                    <span>Status: <strong>{selectedWorkflow.status}</strong></span>
                    <span>Created: <strong>{new Date(selectedWorkflow.createdAt).toLocaleDateString()}</strong></span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Workflow Steps</h4>
                  <div className="space-y-3">
                    {selectedWorkflow.steps.map((step, idx) => (
                      <div key={step.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center border-2 border-gray-200">
                          <span className="text-xs font-bold text-gray-600">{idx + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {getStepIcon(step.type)}
                            <span className="text-sm font-medium text-gray-900">{step.name}</span>
                            <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">{step.type}</span>
                          </div>
                          <pre className="text-xs text-gray-600 bg-white p-2 rounded border border-gray-200 overflow-x-auto">
                            {JSON.stringify(step.config, null, 2)}
                          </pre>
                          {step.nextStepId && (
                            <p className="text-xs text-gray-500 mt-1">Next: {selectedWorkflow.steps.find(s => s.id === step.nextStepId)?.name}</p>
                          )}
                          {step.onErrorStepId && (
                            <p className="text-xs text-danger-600 mt-1">On Error: {selectedWorkflow.steps.find(s => s.id === step.onErrorStepId)?.name}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Total Executions</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedWorkflow.executionCount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Last Executed</p>
                    <p className="text-sm text-gray-900">
                      {selectedWorkflow.lastExecuted ? new Date(selectedWorkflow.lastExecuted).toLocaleString() : 'Never'}
                    </p>
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
          <GitBranch size={18} className="text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Workflow Automation Features</p>
            <ul className="text-xs text-blue-700 mt-1 space-y-1">
              <li>• Visual workflow builder with drag-and-drop steps</li>
              <li>• Multiple trigger types (loan events, payments, compliance alerts)</li>
              <li>• Conditional logic with branching paths</li>
              <li>• Actions: approve, reject, assign, notify, delay</li>
              <li>• Error handling with fallback paths</li>
              <li>• Execution tracking and audit trail</li>
              <li>• Pause/resume workflows without losing configuration</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
