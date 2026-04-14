import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Badge from '../components/Badge';
import TeacherLeaveChart from '../components/TeacherLeaveChart';
import { Calendar, CheckCircle, Clock, XCircle, Search, User } from 'lucide-react';

const AdminTeacherStats = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [leaves, setLeaves] = useState([]);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [loadingData, setLoadingData] = useState(false);

  // Fetch list of teachers
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await axios.get('/auth/teachers');
        setTeachers(res.data);
      } catch (err) {
        console.error('Failed to fetch teachers:', err);
      } finally {
        setLoadingTeachers(false);
      }
    };
    fetchTeachers();
  }, []);

  // Fetch stats when a teacher is selected
  useEffect(() => {
    if (!selectedTeacherId) {
      setLeaves([]);
      return;
    }
    const fetchLeaves = async () => {
      setLoadingData(true);
      try {
        const res = await axios.get(`/leave/teacher/${selectedTeacherId}`);
        setLeaves(res.data);
      } catch (err) {
        console.error('Failed to fetch teacher leaves:', err);
      } finally {
        setLoadingData(false);
      }
    };
    fetchLeaves();
  }, [selectedTeacherId]);

  const stats = {
    total: leaves.length,
    approved: leaves.filter(l => l.status === 'Approved').length,
    pending: leaves.filter(l => l.status === 'Pending').length,
    rejected: leaves.filter(l => l.status === 'Rejected').length,
  };

  const selectedTeacherName = teachers.find(t => t.id.toString() === selectedTeacherId)?.name;

  return (
    <Sidebar>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="page-title animate-fade-in" style={{ margin: 0 }}>Teacher Statistics</h1>
        
        {/* Search / Selector */}
        <div className="glass-panel animate-fade-in" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem', width: '350px' }}>
          <Search size={20} color="var(--text-secondary)" />
          <select 
            className="form-control" 
            style={{ border: 'none', background: 'transparent', padding: 0 }}
            value={selectedTeacherId}
            onChange={(e) => setSelectedTeacherId(e.target.value)}
            disabled={loadingTeachers}
          >
            <option value="">Select a Teacher...</option>
            {teachers.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
      </div>

      {!selectedTeacherId ? (
        <div className="glass-panel animate-fade-in" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <User size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
          <h3>Select a teacher to view their statistics</h3>
        </div>
      ) : loadingData ? (
        <div className="spinner" style={{ margin: '4rem auto' }}></div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid-cols-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="glass-panel stat-card">
              <Calendar size={24} color="var(--primary)" />
              <div className="value">{stats.total}</div>
              <div className="label">Total Leaves</div>
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
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>{selectedTeacherName}'s Leave History</h2>
              {leaves.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No leave requests found for this teacher.</p>
              ) : (
                <div style={{ overflowX: 'auto', maxHeight: '400px', overflowY: 'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Dates</th>
                        <th>Days</th>
                        <th>Status</th>
                        <th>Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaves.map(leave => (
                        <tr key={leave.id}>
                          <td style={{ fontWeight: 500 }}>{leave.leave_type}</td>
                          <td>{new Date(leave.start_date).toLocaleDateString()} - {new Date(leave.end_date).toLocaleDateString()}</td>
                          <td>{leave.total_days}</td>
                          <td><Badge status={leave.status} /></td>
                          <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={leave.reason}>
                            {leave.reason}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Right Side: Visual Graphical Statistics */}
            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Graphical Overview</h2>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TeacherLeaveChart stats={stats} />
              </div>
            </div>

          </div>
        </>
      )}
    </Sidebar>
  );
};

export default AdminTeacherStats;
