import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Send, History, LogOut, Bell } from 'lucide-react';
import NotificationPanel from './NotificationPanel';
import Logo from './Logo';

const Sidebar = ({ children }) => {
  const { user } = useAuth();

  const navLinks = user?.role === 'teacher' ? [
    { name: 'Dashboard', path: '/teacher/dashboard', icon: LayoutDashboard },
    { name: 'Apply Leave', path: '/teacher/apply', icon: Send },
    { name: 'Leave History', path: '/teacher/history', icon: History },
  ] : [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Teacher Stats', path: '/admin/stats', icon: History },
  ];

  return (
    <div className="app-container">
      <aside className="sidebar glass-panel" style={{ borderRadius: 0, borderTop: 'none', borderBottom: 'none', borderLeft: 'none' }}>
        <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1.5rem', paddingRight: '1rem' }}>
            <Logo size="small" />
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{user?.name}</p>
          <div style={{ display: 'inline-block', marginTop: '0.5rem', fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', textTransform: 'uppercase' }}>
            {user?.role}
          </div>
        </div>

        <nav style={{ flex: 1 }}>
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <link.icon size={20} />
              {link.name}
            </NavLink>
          ))}
        </nav>

      </aside>

      <main className="main-content">
        <header style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
          <NotificationPanel />
        </header>
        {children}
      </main>
    </div>
  );
};

export default Sidebar;
