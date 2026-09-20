import { useState } from 'react';
import { Calendar, CheckCircle2, Clock, ArrowRight, Rocket, Target } from 'lucide-react';

interface Milestone {
  id: string;
  phase: string;
  days: string;
  title: string;
  description: string;
  tasks: string[];
  completed: boolean;
  completedDate?: string;
}

export default function TenantOnboardingWizard() {
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: 'M1',
      phase: 'Foundation',
      days: 'Days 1-3',
      title: 'Tenant Live & Branded on Staging',
      description: 'Set up tenant environment, configure branding, and establish admin users',
      tasks: [
        'Provision tenant subdomain and isolated environment',
        'Create admin users and enable MFA',
        'Upload branding assets (logo, colors, favicon)',
        'Conduct kick-off workshop',
        'Finalize first product(s) and approval thresholds',
        'Initiate M-Pesa, CRB, KYC credential processes'
      ],
      completed: true,
      completedDate: '2026-01-18'
    },
    {
      id: 'M2',
      phase: 'Configuration',
      days: 'Days 4-7',
      title: 'First Product Decisioning End-to-End',
      description: 'Build first loan product and test decisioning on staging',
      tasks: [
        'Build first loan product in Product Builder',
        'Configure scorecard variables and decision matrix',
        'Review consent language and KFS templates',
        'Create test borrower accounts',
        'Test end-to-end decisioning flow'
      ],
      completed: true,
      completedDate: '2026-01-25'
    },
    {
      id: 'M3',
      phase: 'Integrations',
      days: 'Days 8-12',
      title: 'Core Integrations Green',
      description: 'Connect M-Pesa, KYC, CRB, and SMS integrations',
      tasks: [
        'Connect M-Pesa sandbox and test disbursement/repayment',
        'Link KYC provider or enable manual review path',
        'Complete CRB sandbox pull and score mapping',
        'Test SMS gateway for OTP and notifications',
        'Verify decision engine and audit log'
      ],
      completed: true,
      completedDate: '2026-02-05'
    },
    {
      id: 'M4',
      phase: 'UAT',
      days: 'Days 13-18',
      title: 'Full Journey UAT Signed Off',
      description: 'Complete user acceptance testing with sign-off from Credit, Compliance, Operations',
      tasks: [
        'Test happy path: register → KYC → apply → KFS → decision → disburse → repay',
        'Test edge cases: declines, manual review, overrides, PTP, consent withdrawal',
        'Exercise collections queue and conduct rules',
        'Performance check on mobile devices / 3G',
        'Obtain written sign-off from Credit, Compliance, Operations'
      ],
      completed: false
    },
    {
      id: 'M5',
      phase: 'Production Pilot',
      days: 'Days 19-23',
      title: 'Production Pilot Complete',
      description: 'Activate production credentials and run internal pilot',
      tasks: [
        'Activate production credentials (M-Pesa live, CRB live)',
        'Enable monitoring, alerts, daily reconciliation',
        'Disburse and repay internal/staff pilot loans (target ≥20)',
        'Review audit sample for completeness',
        'Validate all integrations in production'
      ],
      completed: false
    },
    {
      id: 'M6',
      phase: 'Soft Launch',
      days: 'Days 24-28',
      title: 'Soft Launch Live',
      description: 'Controlled public launch with daily monitoring',
      tasks: [
        'Open to controlled public or semi-public cohort',
        'Monitor conversion, drop-offs, payment success, support tickets',
        'Make rapid configuration adjustments as needed',
        'Gather user feedback',
        'Prepare for public launch'
      ],
      completed: false
    },
    {
      id: 'M7',
      phase: 'Public Launch',
      days: 'Days 29-30',
      title: 'Public Launch Ready',
      description: 'Final go-live with full public access',
      tasks: [
        'Conduct final go/no-go review',
        'Release public links, QR codes, marketing assets',
        'Activate 14-day hyper-care support rota',
        'Monitor closely for first 2 weeks',
        'Celebrate launch! 🎉'
      ],
      completed: false
    }
  ]);

  const toggleMilestone = (id: string) => {
    setMilestones(milestones.map(m => {
      if (m.id === id) {
        return {
          ...m,
          completed: !m.completed,
          completedDate: !m.completed ? new Date().toISOString().split('T')[0] : undefined
        };
      }
      return m;
    }));
  };

  const completedCount = milestones.filter(m => m.completed).length;
  const progress = (completedCount / milestones.length) * 100;

  const currentPhase = milestones.find(m => !m.completed)?.phase || 'Complete';
  const currentDays = milestones.find(m => !m.completed)?.days || 'Day 30';

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Rocket size={20} className="text-primary-600" />
            30-Day Tenant Onboarding
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {currentPhase} · {currentDays}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">{completedCount}/{milestones.length}</p>
          <p className="text-xs text-gray-500">Milestones Complete</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span>Day 1</span>
          <span>Day 30</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>Foundation</span>
          <span>Configuration</span>
          <span>Integrations</span>
          <span>UAT</span>
          <span>Pilot</span>
          <span>Launch</span>
        </div>
      </div>

      {/* Milestones Timeline */}
      <div className="space-y-4">
        {milestones.map((milestone, idx) => (
          <div
            key={milestone.id}
            className={`relative pl-8 pb-4 ${
              idx < milestones.length - 1 ? 'border-l-2 border-gray-200 ml-4' : 'ml-4'
            }`}
          >
            {/* Milestone Marker */}
            <div className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center -translate-x-1/2 ${
              milestone.completed
                ? 'bg-accent-500'
                : 'bg-gray-300'
            }`}>
              {milestone.completed ? (
                <CheckCircle2 size={18} className="text-white" />
              ) : (
                <Clock size={18} className="text-white" />
              )}
            </div>

            {/* Milestone Content */}
            <div className={`p-4 rounded-lg border ${
              milestone.completed
                ? 'bg-green-50 border-green-200'
                : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-gray-500">{milestone.id}</span>
                    <span className="text-xs text-gray-500">·</span>
                    <span className="text-xs text-gray-500">{milestone.days}</span>
                    {milestone.completed && milestone.completedDate && (
                      <>
                        <span className="text-xs text-gray-500">·</span>
                        <span className="text-xs text-green-600">
                          Completed {milestone.completedDate}
                        </span>
                      </>
                    )}
                  </div>
                  <h4 className={`text-sm font-semibold ${
                    milestone.completed ? 'text-green-900' : 'text-gray-900'
                  }`}>
                    {milestone.title}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">{milestone.description}</p>
                </div>
                <button
                  onClick={() => toggleMilestone(milestone.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    milestone.completed
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {milestone.completed ? '✓ Complete' : 'Mark Complete'}
                </button>
              </div>

              {/* Tasks */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs font-medium text-gray-700 mb-2">Tasks:</p>
                <ul className="space-y-1">
                  {milestone.tasks.map((task, taskIdx) => (
                    <li key={taskIdx} className="flex items-start gap-2 text-xs text-gray-600">
                      <span className="text-gray-400 mt-0.5">•</span>
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Completion Message */}
      {completedCount === milestones.length && (
        <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg border border-primary-200 text-center">
          <Target size={32} className="mx-auto mb-2 text-primary-600" />
          <h4 className="text-lg font-bold text-gray-900 mb-1">🎉 Onboarding Complete!</h4>
          <p className="text-sm text-gray-600">
            Tenant is now live and ready for public launch
          </p>
        </div>
      )}
    </div>
  );
}
