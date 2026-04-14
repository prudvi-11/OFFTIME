import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Badge from '../components/Badge';
import { Check, X, MessageSquare, Search } from 'lucide-react';

const AdminDashboard = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState('All'); // All, Pending, Approved, Rejected, Withdrawn
  const [searchTerm, setSearchTerm] = useState('');
  const [actionComment, setActionComment] = useState({});

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

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleAction = async (id, type) => {
    const comment = actionComment[id] || '';
    if (!window.confirm(`Are you sure you want to ${type} this request?`)) return;

    try {
      await axios.post(`/leave/${id}/${type}`, { comment });
      fetchLeaves();
    } catch (err) {
      alert(err.response?.data?.message || `Error ${type}ing leave`);
    }
  };

  const filteredLeaves = leaves.filter((l) => {
    const matchStatus = filterMode === 'All' || l.status === filterMode;
    const matchSearch =
      (l.teacher_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.leave_type || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <Sidebar>
      <div
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}
        className="animate-fade-in"
      >
        <h1 className="page-title" style={{ marginBottom: 0 }}>
          Admin Dashboard
        </h1>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', top: '10px', left: '10px', color: 'var(--text-secondary)' }} />
            <input
              type="text"
              placeholder="Search teachers..."
              className="form-control"
              style={{ paddingLeft: '2.25rem', width: '250px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="form-control"
            style={{ width: '150px' }}
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value)}
          >
            <option value="All">All Requests</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Withdrawn">Withdrawn</option>
          </select>
        </div>
      </div>

      <div
        className="glass-panel animate-fade-in"
        style={{ padding: '0', animationDelay: '0.1s', overflow: 'hidden' }}
      >
        {loading ? (
          <div className="spinner" style={{ margin: '3rem auto' }}></div>
        ) : filteredLeaves.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <p>No leave requests found matching your filters.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Teacher Info</th>
                  <th>Leave Details</th>
                  <th>Dates & Days</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaves.map((leave) => (
                  <tr key={leave.id}>
                    <td>
                      <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{leave.teacher_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ID: {leave.teacher_id}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{leave.leave_type}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.875rem' }}>{new Date(leave.start_date).toLocaleDateString()} to</div>
                      <div style={{ fontSize: '0.875rem' }}>{new Date(leave.end_date).toLocaleDateString()}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '0.25rem' }}>
                        {leave.total_days} days
                      </div>
                    </td>
                    <td style={{ maxWidth: '200px' }}>
                      <p
                        style={{
                          fontSize: '0.875rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {leave.reason}
                      </p>
                    </td>
                    <td>
                      <Badge status={leave.status} />
                    </td>
                    <td>
                      {leave.status === 'Pending' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <input
                            type="text"
                            placeholder="Optional comment..."
                            className="form-control"
                            style={{ padding: '0.4rem', fontSize: '0.75rem' }}
                            value={actionComment[leave.id] || ''}
                            onChange={(e) =>
                              setActionComment({ ...actionComment, [leave.id]: e.target.value })
                            }
                          />
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              className="btn btn-success"
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', flex: 1 }}
                              onClick={() => handleAction(leave.id, 'approve')}
                            >
                              <Check size={14} /> Approve
                            </button>
                            <button
                              className="btn btn-danger"
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', flex: 1 }}
                              onClick={() => handleAction(leave.id, 'reject')}
                            >
                              <X size={14} /> Reject
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          style={{
                            fontSize: '0.875rem',
                            color: 'var(--text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}
                        >
                          <MessageSquare size={14} />
                          {leave.comment || 'No comment provided'}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Sidebar>
  );
};

export default AdminDashboard;