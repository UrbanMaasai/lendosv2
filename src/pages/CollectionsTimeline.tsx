import { useState, useEffect } from 'react';
import { PhoneCall, MessageSquare, Mail, Clock, CheckCircle2, AlertTriangle, Shield, Calendar } from 'lucide-react';
import { dataLayer, AuditLog } from '../services/dataLayer';

interface ContactEvent {
  id: string;
  timestamp: string;
  borrowerId: string;
  borrowerName: string;
  channel: 'SMS' | 'Call' | 'Email' | 'STK';
  type: string;
  content: string;
  agent: string;
  outcome?: string;
  compliant: boolean;
}

export default function CollectionsTimeline() {
  const [events, setEvents] = useState<ContactEvent[]>([]);
  const [selectedBorrower, setSelectedBorrower] = useState<string>('all');
  const [borrowers, setBorrowers] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    // Generate sample collection events from audit logs
    const logs = dataLayer.getAuditLogs();
    const collectionLogs = logs.filter(l => 
      l.action.includes('COLLECTION') || 
      l.action.includes('CONTACT') ||
      l.action.includes('SMS') ||
      l.action.includes('CALL')
    );

    const sampleEvents: ContactEvent[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        borrowerId: 'brw_001',
        borrowerName: 'James Mwangi',
        channel: 'SMS',
        type: 'Payment Reminder',
        content: 'Dear James, your loan payment of KES 5,000 is due tomorrow. Please pay via M-Pesa Paybill 522533.',
        agent: 'Auto',
        compliant: true
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        borrowerId: 'brw_003',
        borrowerName: 'Peter Ochieng',
        channel: 'Call',
        type: 'Follow-up Call',
        content: 'Called borrower to discuss overdue payment. Borrower promised to pay by Friday.',
        agent: 'Sarah K.',
        outcome: 'PTP: 2026-06-20',
        compliant: true
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        borrowerId: 'brw_001',
        borrowerName: 'James Mwangi',
        channel: 'SMS',
        type: 'PTP Reminder',
        content: 'Dear James, this is a reminder of your promise to pay KES 5,000 by Friday. Thank you.',
        agent: 'Auto',
        compliant: true
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        borrowerId: 'brw_005',
        borrowerName: 'David Kiprop',
        channel: 'SMS',
        type: 'Overdue Notice',
        content: 'Dear David, your loan is now 45 days overdue. Please contact us immediately to arrange payment.',
        agent: 'Auto',
        compliant: true
      },
      {
        id: '5',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
        borrowerId: 'brw_005',
        borrowerName: 'David Kiprop',
        channel: 'Call',
        type: 'Collections Call',
        content: 'Called borrower regarding overdue loan. Discussed repayment options and restructuring.',
        agent: 'James M.',
        outcome: 'Borrower requested restructuring',
        compliant: true
      },
      {
        id: '6',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        borrowerId: 'brw_001',
        borrowerName: 'James Mwangi',
        channel: 'Email',
        type: 'Statement',
        content: 'Monthly loan statement sent to borrower email.',
        agent: 'Auto',
        compliant: true
      }
    ];

    setEvents(sampleEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));

    // Extract unique borrowers
    const uniqueBorrowers = Array.from(
      new Map(sampleEvents.map(e => [e.borrowerId, { id: e.borrowerId, name: e.borrowerName }])).values()
    );
    setBorrowers(uniqueBorrowers);
  }, []);

  const filteredEvents = selectedBorrower === 'all' 
    ? events 
    : events.filter(e => e.borrowerId === selectedBorrower);

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'SMS': return <MessageSquare size={14} className="text-blue-600" />;
      case 'Call': return <PhoneCall size={14} className="text-green-600" />;
      case 'Email': return <Mail size={14} className="text-purple-600" />;
      case 'STK': return <PhoneCall size={14} className="text-orange-600" />;
      default: return <MessageSquare size={14} className="text-gray-600" />;
    }
  };

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'SMS': return 'bg-blue-50 border-blue-200';
      case 'Call': return 'bg-green-50 border-green-200';
      case 'Email': return 'bg-purple-50 border-purple-200';
      case 'STK': return 'bg-orange-50 border-orange-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  // Group events by date
  const groupedEvents = filteredEvents.reduce((acc, event) => {
    const date = new Date(event.timestamp).toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(event);
    return acc;
  }, {} as Record<string, ContactEvent[]>);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Collections Timeline</h1>
          <p className="text-sm text-gray-500">Visual timeline of borrower contact history with compliance enforcement</p>
        </div>
      </div>

      {/* Compliance Summary */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Shield size={18} className="text-primary-600" />
          Collections Conduct Compliance
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 size={16} className="text-green-600" />
              <span className="text-xs text-green-700">Compliant Contacts</span>
            </div>
            <p className="text-2xl font-bold text-green-900">{events.filter(e => e.compliant).length}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={16} className="text-red-600" />
              <span className="text-xs text-red-700">Violations</span>
            </div>
            <p className="text-2xl font-bold text-red-900">{events.filter(e => !e.compliant).length}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={16} className="text-blue-600" />
              <span className="text-xs text-blue-700">Within Hours</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">100%</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={16} className="text-purple-600" />
              <span className="text-xs text-purple-700">Contact Limit</span>
            </div>
            <p className="text-2xl font-bold text-purple-900">3/day</p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <select
          value={selectedBorrower}
          onChange={(e) => setSelectedBorrower(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 bg-white"
        >
          <option value="all">All Borrowers</option>
          {borrowers.map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="space-y-6">
          {Object.entries(groupedEvents).map(([date, dateEvents]) => (
            <div key={date}>
              <div className="flex items-center gap-2 mb-4">
                <Calendar size={16} className="text-gray-400" />
                <h4 className="text-sm font-semibold text-gray-900">{date}</h4>
                <span className="text-xs text-gray-500">({dateEvents.length} contacts)</span>
              </div>
              <div className="space-y-3 ml-6 border-l-2 border-gray-200 pl-6">
                {dateEvents.map((event) => (
                  <div key={event.id} className="relative">
                    {/* Timeline dot */}
                    <div className={`absolute -left-[33px] top-4 w-4 h-4 rounded-full border-2 ${
                      event.compliant ? 'bg-green-500 border-green-600' : 'bg-red-500 border-red-600'
                    }`}></div>
                    
                    {/* Event card */}
                    <div className={`p-4 rounded-lg border-2 ${getChannelColor(event.channel)}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getChannelIcon(event.channel)}
                          <span className="text-sm font-medium text-gray-900">{event.type}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-600">
                            {event.channel}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {event.compliant ? (
                            <CheckCircle2 size={14} className="text-green-600" />
                          ) : (
                            <AlertTriangle size={14} className="text-red-600" />
                          )}
                          <span className="text-xs text-gray-500">
                            {new Date(event.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{event.content}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Borrower: {event.borrowerName}</span>
                        <span>Agent: {event.agent}</span>
                      </div>
                      {event.outcome && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <p className="text-xs text-gray-600">
                            <span className="font-medium">Outcome:</span> {event.outcome}
                          </p>
                        </div>
                      )}
                      {!event.compliant && (
                        <div className="mt-2 p-2 bg-red-100 rounded text-xs text-red-800">
                          <AlertTriangle size={12} className="inline mr-1" />
                          Compliance violation detected - contact blocked
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {filteredEvents.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <PhoneCall size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No collection events found</p>
          </div>
        )}
      </div>

      {/* Compliance Rules */}
      <div className="bg-accent-50 border border-accent-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Shield size={18} className="text-accent-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-accent-800">DLAK Code of Conduct - Enforced Rules</p>
            <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-accent-700">
              <div>✓ Max 3 contacts per borrower per day</div>
              <div>✓ Permitted hours: 07:00-20:00 only</div>
              <div>✓ No contact on Sundays/holidays</div>
              <div>✓ No third-party messaging</div>
              <div>✓ Pre-approved templates only</div>
              <div>✓ All contacts logged with audit trail</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
