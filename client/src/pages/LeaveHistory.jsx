import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Badge from '../components/Badge';
import { XCircle } from 'lucide-react';

const LeaveHistory = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleWithdraw = async (id) => {
    if (window.confirm('Are you sure you want to withdraw this leave request?')) {
      try {
        await axios.post(`/leave/${id}/withdraw`);
        fetchLeaves(); // Refresh
      } catch (err) {
        alert(err.response?.data?.message || 'Error withdrawing leave');
      }
    }
  };

  return (
    <Sidebar>
      <h1 className="page-title animate-fade-in">Leave History</h1>

      <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem', animationDelay: '0.1s' }}>
        {loading ? (
          <div className="spinner" style={{ margin: '2rem auto' }}></div>
        ) : leaves.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>You have no leave history.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Request Date</th>
                  <th>Dates</th>
                  <th>Days</th>
                  <th>Type</th>
                  <th>Admin</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => {
                  // fallback date for request (if no created_at, using id as timestamp placeholder)
                  const requestDate = leave.created_at
                    ? new Date(leave.created_at).toLocaleDateString()
                    : new Date(leave.id * 1000).toLocaleDateString();

                  return (
                    <tr key={leave.id}>
                      <td>{requestDate}</td>
                      <td>
                        {new Date(leave.start_date).toLocaleDateString()} -{' '}
                        {new Date(leave.end_date).toLocaleDateString()}
                      </td>
                      <td>{leave.total_days}</td>
                      <td>{leave.leave_type}</td>
                      <td>{leave.admin_name || `ID: ${leave.admin_id}`}</td>
                      <td>
                        <Badge status={leave.status} />
                      </td>
                      <td>
                        {leave.status === 'Pending' ? (
                          <button
                            className="btn btn-outline"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}
                            onClick={() => handleWithdraw(leave.id)}
                          >
                            <XCircle size={14} /> Withdraw
                          </button>
                        ) : (
                          <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Sidebar>
  );
};

export default LeaveHistory;