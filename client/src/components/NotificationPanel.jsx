import { useState, useEffect, useRef } from 'react';
import { Bell, User, LogOut, AlertTriangle, X } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NotificationPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { notifications, addInitialNotifications, markAsRead } = useSocket();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch initial notifications
    const fetchNotifications = async () => {
      try {
        const res = await axios.get('/notifications');
        addInitialNotifications(res.data);
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      }
    };
    if (user) {
       fetchNotifications();
    }

    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [user]);

  const handleOpen = async () => {
    setIsOpen(!isOpen);
    setShowLogoutConfirm(false); // reset on reopen
    if (!isOpen && unreadCount > 0) {
      try {
        await axios.post('/notifications/mark-read');
        markAsRead();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  return (
    <>
      <button 
        className="btn btn-outline" 
        style={{ padding: '0.6rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'center', position: 'relative', borderRadius: '30px' }}
        onClick={handleOpen}
      >
        <User size={18} />
        <span style={{ fontWeight: 500 }}>{user?.name?.split(' ')[0] || 'Account'}</span>
        {unreadCount > 0 && (
          <span style={{
            background: 'var(--danger)', color: 'white',
            borderRadius: '50%', width: '18px', height: '18px',
            fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginLeft: '4px'
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', 
          zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'
        }}>
          <div className="glass-panel animate-fade-in" style={{
            width: '100%', maxWidth: '450px', background: 'var(--bg-surface)', 
            borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column',
            maxHeight: '85vh', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
          }}>
            
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)' }}>Account & Activities</h3>
              <button className="btn" onClick={() => setIsOpen(false)} style={{ padding: '0.5rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)' }}>
                <X size={20} />
              </button>
            </div>

            {/* Activities Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', minHeight: '200px' }}>
              <h4 style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Recent Activity</h4>
              {notifications.length === 0 ? (
                <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <Bell size={32} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
                  No new activities
                </div>
              ) : (
                notifications.map(notif => (
                  <div key={notif.id} className={`notification-item ${notif.status === 'unread' ? 'unread' : ''}`} style={{ marginBottom: '0.75rem' }}>
                    <p style={{ margin: '0 0 0.25rem 0' }}>{notif.message}</p>
                    <small style={{ color: 'var(--purple)', display: 'block' }}>
                      {new Date(notif.timestamp).toLocaleString()}
                    </small>
                  </div>
                ))
              )}
            </div>

            {/* Logout Footer Section */}
            <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)' }}>
              {!showLogoutConfirm ? (
                <button 
                  onClick={() => setShowLogoutConfirm(true)} 
                  className="btn btn-outline" 
                  style={{ width: '100%', borderColor: 'rgba(239, 68, 68, 0.4)', color: 'var(--danger)' }}
                >
                  <LogOut size={18} />
                  Sign Out of {user?.name}
                </button>
              ) : (
                <div className="animate-fade-in" style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--warning)', marginBottom: '1rem' }}>
                    <AlertTriangle size={18} />
                    <span style={{ fontWeight: 500 }}>Are you sure you want to log out?</span>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                      onClick={() => setShowLogoutConfirm(false)} 
                      className="btn btn-outline" 
                      style={{ flex: 1 }}
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleLogout} 
                      className="btn btn-primary" 
                      style={{ flex: 1, background: 'var(--danger)', color: 'white', border: 'none' }}
                    >
                      Yes, Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default NotificationPanel;
