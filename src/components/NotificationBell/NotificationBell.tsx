import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { useNotifications } from '../../hooks/useNotifications';

import css from './NotificationBell.module.css';

const NOTIFICATION_LABELS: Record<string, string> = {
  order_created: '🆕 New order',
  order_started: '▶️ Order started',
  item_rejected: '⚠️ Item rejected',
  order_completed: '✅ Order completed',
};

function NotificationBell() {
  const navigate = useNavigate();

  const { notifications, unreadCount, markAsRead, markAllAsRead, clearRead } =
    useNotifications();

  const hasRead = notifications.some(n => n.isRead);

  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notificationId: string) => {
    markAsRead(notificationId);
    setIsOpen(false);
    navigate('/');
  };

  return (
    <div className={css.wrapper} ref={wrapperRef}>
      <button className={css.bell} onClick={() => setIsOpen(prev => !prev)}>
        <Bell size={20} strokeWidth={1.5} />
        {unreadCount > 0 && (
          <span className={css.badge}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className={css.dropdown}>
          <div className={css.dropdownHeader}>
            <span>Notifications</span>
            <div className={css.headerActions}>
              {unreadCount > 0 && (
                <button
                  className={css.markAllBtn}
                  onClick={() => markAllAsRead()}
                >
                  Mark all as read
                </button>
              )}
              {hasRead && (
                <button className={css.clearBtn} onClick={() => clearRead()}>
                  Clear read
                </button>
              )}
            </div>
          </div>

          <div className={css.list}>
            {notifications.length === 0 && (
              <div className={css.empty}>No notifications yet</div>
            )}
            {notifications.map(n => (
              <button
                key={n._id}
                className={`${css.item} ${n.isRead ? css.itemRead : ''}`}
                onClick={() => handleNotificationClick(n._id)}
              >
                <span className={css.itemType}>
                  {NOTIFICATION_LABELS[n.type] ?? n.type}
                </span>
                <span className={css.itemMessage}>{n.message}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
