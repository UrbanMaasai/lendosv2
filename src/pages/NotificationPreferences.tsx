import { useState, useEffect } from 'react';
import { Bell, Mail, MessageSquare, Phone, Save, CheckCircle2 } from 'lucide-react';

interface NotificationPreference {
  id: string;
  userId: string;
  userName: string;
  email: string;
  channels: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  events: {
    loan_approved: boolean;
    loan_disbursed: boolean;
    loan_overdue: boolean;
    payment_received: boolean;
    compliance_alert: boolean;
    system_maintenance: boolean;
    new_feature: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  updatedAt: string;
}

export default function NotificationPreferences() {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [selectedUser, setSelectedUser] = useState<NotificationPreference | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('lendingos_notification_prefs');
    if (stored) {
      setPreferences(JSON.parse(stored));
    } else {
      const seedPrefs: NotificationPreference[] = [
        {
          id: 'pref_001',
          userId: 'usr_001',
          userName: 'Platform Admin',
          email: 'admin@lendingos.co.ke',
          channels: {
            email: true,
            sms: false,
            push: true,
          },
          events: {
            loan_approved: true,
            loan_disbursed: true,
            loan_overdue: true,
            payment_received: true,
            compliance_alert: true,
            system_maintenance: true,
            new_feature: false,
          },
          quietHours: {
            enabled: false,
            start: '22:00',
            end: '07:00',
          },
          updatedAt: '2026-06-15T10:00:00Z',
        },
        {
          id: 'pref_002',
          userId: 'usr_002',
          userName: 'John Kamau',
          email: 'john@pesaflash.co.ke',
          channels: {
            email: true,
            sms: true,
            push: true,
          },
          events: {
            loan_approved: true,
            loan_disbursed: true,
            loan_overdue: true,
            payment_received: true,
            compliance_alert: true,
            system_maintenance: false,
            new_feature: false,
          },
          quietHours: {
            enabled: true,
            start: '20:00',
            end: '08:00',
          },
          updatedAt: '2026-06-14T14:30:00Z',
        },
        {
          id: 'pref_003',
          userId: 'usr_003',
          userName: 'Sarah Wanjiku',
          email: 'sarah@pesaflash.co.ke',
          channels: {
            email: true,
            sms: false,
            push: true,
          },
          events: {
            loan_approved: true,
            loan_disbursed: false,
            loan_overdue: false,
            payment_received: true,
            compliance_alert: true,
            system_maintenance: false,
            new_feature: true,
          },
          quietHours: {
            enabled: false,
            start: '22:00',
            end: '07:00',
          },
          updatedAt: '2026-06-13T09:15:00Z',
        },
      ];
      setPreferences(seedPrefs);
      localStorage.setItem('lendingos_notification_prefs', JSON.stringify(seedPrefs));
    }
  }, []);

  const handleSave = () => {
    if (!selectedUser) return;

    const updated = preferences.map(p => 
      p.id === selectedUser.id ? selectedUser : p
    );
    setPreferences(updated);
    localStorage.setItem('lendingos_notification_prefs', JSON.stringify(updated));

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateChannel = (channel: keyof NotificationPreference['channels'], value: boolean) => {
    if (!selectedUser) return;
    setSelectedUser({
      ...selectedUser,
      channels: { ...selectedUser.channels, [channel]: value },
    });
  };

  const updateEvent = (event: keyof NotificationPreference['events'], value: boolean) => {
    if (!selectedUser) return;
    setSelectedUser({
      ...selectedUser,
      events: { ...selectedUser.events, [event]: value },
    });
  };

  const updateQuietHours = (field: keyof NotificationPreference['quietHours'], value: any) => {
    if (!selectedUser) return;
    setSelectedUser({
      ...selectedUser,
      quietHours: { ...selectedUser.quietHours, [field]: value },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notification Preferences</h1>
        <p className="text-sm text-gray-500">Configure notification channels, events, and quiet hours</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Users List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Users</h3>
            <div className="space-y-2">
              {preferences.map((pref) => (
                <button
                  key={pref.id}
                  onClick={() => setSelectedUser(pref)}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    selectedUser?.id === pref.id
                      ? 'bg-primary-50 border-2 border-primary-300'
                      : 'bg-gray-50 border-2 border-transparent hover:border-gray-200'
                  }`}
                >
                  <p className="text-sm font-medium text-gray-900">{pref.userName}</p>
                  <p className="text-xs text-gray-500">{pref.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {pref.channels.email && <Mail size={12} className="text-primary-600" />}
                    {pref.channels.sms && <MessageSquare size={12} className="text-accent-600" />}
                    {pref.channels.push && <Bell size={12} className="text-purple-600" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preferences Panel */}
        <div className="lg:col-span-2">
          {selectedUser ? (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedUser.userName}</h3>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                </div>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700"
                >
                  {saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
                  {saved ? 'Saved' : 'Save Changes'}
                </button>
              </div>

              {/* Channels */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Notification Channels</h4>
                <div className="grid grid-cols-3 gap-3">
                  <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedUser.channels.email}
                      onChange={(e) => updateChannel('email', e.target.checked)}
                      className="rounded"
                    />
                    <Mail size={16} className="text-primary-600" />
                    <span className="text-sm text-gray-700">Email</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedUser.channels.sms}
                      onChange={(e) => updateChannel('sms', e.target.checked)}
                      className="rounded"
                    />
                    <MessageSquare size={16} className="text-accent-600" />
                    <span className="text-sm text-gray-700">SMS</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedUser.channels.push}
                      onChange={(e) => updateChannel('push', e.target.checked)}
                      className="rounded"
                    />
                    <Bell size={16} className="text-purple-600" />
                    <span className="text-sm text-gray-700">Push</span>
                  </label>
                </div>
              </div>

              {/* Events */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Notification Events</h4>
                <div className="space-y-2">
                  {Object.entries(selectedUser.events).map(([event, enabled]) => (
                    <label key={event} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                      <div>
                        <p className="text-sm text-gray-900 capitalize">
                          {event.replace(/_/g, ' ')}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => updateEvent(event as any, e.target.checked)}
                        className="rounded"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Quiet Hours */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Quiet Hours</h4>
                <label className="flex items-center gap-2 mb-3">
                  <input
                    type="checkbox"
                    checked={selectedUser.quietHours.enabled}
                    onChange={(e) => updateQuietHours('enabled', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Enable quiet hours</span>
                </label>
                {selectedUser.quietHours.enabled && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Start Time</label>
                      <input
                        type="time"
                        value={selectedUser.quietHours.start}
                        onChange={(e) => updateQuietHours('start', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">End Time</label>
                      <input
                        type="time"
                        value={selectedUser.quietHours.end}
                        onChange={(e) => updateQuietHours('end', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
              <Bell size={48} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a User</h3>
              <p className="text-sm text-gray-500">Choose a user from the list to configure their notification preferences</p>
            </div>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Bell size={18} className="text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Notification Preferences</p>
            <ul className="text-xs text-blue-700 mt-1 space-y-1">
              <li>• Configure notification channels (Email, SMS, Push)</li>
              <li>• Select which events trigger notifications</li>
              <li>• Set quiet hours to pause notifications</li>
              <li>• Preferences are saved per user</li>
              <li>• Changes take effect immediately</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
