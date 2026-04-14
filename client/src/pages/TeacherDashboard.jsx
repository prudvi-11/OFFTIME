import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Badge from '../components/Badge';
import { Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import TeacherLeaveChart from '../components/TeacherLeaveChart';

const TeacherDashboard = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await axios.get('/leave');
        setLeaves(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaves();
  }, []);

  const stats = {
    total: leaves.length,
    approved: leaves.filter(l => l.status === 'Approved').length,
    pending: leaves.filter(l => l.status === 'Pending').length,
    rejected: leaves.filter(l => l.status === 'Rejected').length,
  };

  const recentLeaves = leaves.slice(0, 5);

  return (
    <Sidebar>
      <h1 className="page-title animate-fade-in">Overview</h1>

      <div className="grid-cols-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="glass-panel stat-card">
          <Calendar size={24} color="var(--primary)" />
          <div className="value">{stats.total}</div>
          <div className="label">Total Leaves Applied</div>
        </div>
        <div className="glass-panel stat-card">
          <Clock size={24} color="var(--warning)" />
          <div className="value">{stats.pending}</div>
          <div className="label">Pending Approval</div>
        </div>
        <div className="glass-panel stat-card">
          <CheckCircle size={24} color="var(--success)" />
          <div className="value">{stats.approved}</div>
          <div className="label">Approved Leaves</div>
        </div>
        <div className="glass-panel stat-card">
          <XCircle size={24} color="var(--danger)" />
          <div className="value">{stats.rejected}</div>
          <div className="label">Rejected Leaves</div>
        </div>
      </div>

      <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', animationDelay: '0.2s' }}>
        
        {/* Left Side: Recent Requests Table */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Recent Requests</h2>
          {loading ? (
          <div className="spinner" style={{ margin: '2rem auto' }}></div>
        ) : recentLeaves.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No leave requests found.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Dates</th>
                  <th>Days</th>
                  <th>Supervising Admin</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentLeaves.map(leave => (
                  <tr key={leave.id}>
                    <td style={{ fontWeight: 500 }}>{leave.leave_type}</td>
                    <td>{new Date(leave.start_date).toLocaleDateString()} - {new Date(leave.end_date).toLocaleDateString()}</td>
                    <td>{leave.total_days}</td>
                    <td>{leave.admin_name || `Admin ID: ${leave.admin_id}`}</td>
                    <td><Badge status={leave.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </div>

        {/* Right Side: Visual Graphical Statistics */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Leave Statistics</h2>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TeacherLeaveChart stats={stats} />
          </div>
        </div>

      </div>
    </Sidebar>
  );
};

export default TeacherDashboard;
