import { useState, useEffect } from 'react';
import { Bell, X, CheckCircle2, AlertTriangle, AlertCircle, Info, Clock } from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  entityId?: string;
  entityType?: string;
}

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    // Load notifications from localStorage
    const stored = localStorage.getItem('lendingos_notifications');
    if (stored) {
      setNotifications(JSON.parse(stored));
    } else {
      // Seed with sample notifications
      const seedNotifications: Notification[] = [
        {
          id: '1',
          type: 'warning',
          title: 'Compliance Alert',
          message: 'Tenant PesaFlash approaching contact limit for borrower brw_001',
          timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          read: false,
          entityId: 'brw_001',
          entityType: 'Borrower',
        },
        {
          id: '2',
          type: 'success',
          title: 'Loan Approved',
          message: 'Loan LN-2026-0847 approved for KES 15,000',
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          read: false,
          entityId: 'LN-2026-0847',
          entityType: 'Loan',
        },
        {
          id: '3',
          type: 'info',
          title: 'New Borrower Registered',
          message: 'Mary Kamau completed registration and KYC',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          read: true,
          entityId: 'brw_004',
          entityType: 'Borrower',
        },
        {
          id: '4',
          type: 'error',
          title: 'In Duplum Reached',
          message: 'Loan LN-2026-0840 reached 2× principal cap',
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          read: true,
          entityId: 'LN-2026-0840',
          entityType: 'Loan',
        },
      ];
      setNotifications(seedNotifications);
      localStorage.setItem('lendingos_notifications', JSON.stringify(seedNotifications));
    }
  }, []);

  const saveNotifications = (notifs: Notification[]) => {
    setNotifications(notifs);
    localStorage.setItem('lendingos_notifications', JSON.stringify(notifs));
  };

  const markAsRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    saveNotifications(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  const deleteNotification = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    saveNotifications(updated);
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = filter === 'unread' ? notifications.filter(n => !n.read) : notifications;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 size={18} className="text-accent-600" />;
      case 'warning': return <AlertTriangle size={18} className="text-warning-600" />;
      case 'error': return <AlertCircle size={18} className="text-danger-600" />;
      default: return <Info size={18} className="text-primary-600" />;
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-danger-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={18} />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    filter === 'all' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    filter === 'unread' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="ml-auto text-xs text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto scrollbar-thin">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell size={32} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No notifications</p>
                </div>
              ) : (
                filteredNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notif.read ? 'bg-primary-50/30' : ''
                    }`}
                    onClick={() => markAsRead(notif.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">{getIcon(notif.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notif.id);
                            }}
                            className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mt-0.5">{notif.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock size={12} className="text-gray-400" />
                          <span className="text-xs text-gray-500">{getTimeAgo(notif.timestamp)}</span>
                          {notif.entityType && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                              {notif.entityType}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 border-t border-gray-100 bg-gray-50">
              <button className="w-full text-sm text-primary-600 hover:text-primary-700 font-medium">
                View all notifications
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
