import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { Send } from 'lucide-react';

const ApplyLeave = () => {
  const [formData, setFormData] = useState({
    admin_id: '',
    leave_type: 'Casual',
    start_date: '',
    end_date: '',
    reason: '',
    terms: false
  });
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await axios.get('/auth/admins');
        setAdmins(res.data);
      } catch (err) {
        console.error('Failed to fetch admins');
      }
    };
    fetchAdmins();
  }, []);

  const calculateDays = (start, end) => {
    if (!start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);
    const diffTime = Math.abs(e - s);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays + 1; // inclusive
  };

  const totalDays = calculateDays(formData.start_date, formData.end_date);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.terms) {
      setError('You must accept terms and conditions');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      await axios.post('/leave', {
        ...formData,
        total_days: totalDays
      });
      navigate('/teacher/history');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request');
      setLoading(false);
    }
  };

  return (
    <Sidebar>
      <div style={{ maxWidth: '800px' }}>
        <h1 className="page-title animate-fade-in">Apply for Leave</h1>

        <div className="glass-panel animate-fade-in" style={{ padding: '2rem', animationDelay: '0.1s' }}>
          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--danger)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Select Admin / Supervisor</label>
                <select 
                  className="form-control"
                  value={formData.admin_id}
                  onChange={(e) => setFormData({...formData, admin_id: e.target.value})}
                  required
                >
                  <option value="">Select Admin...</option>
                  {admins.map(admin => (
                    <option key={admin.id} value={admin.id}>{admin.name} (ID: {admin.id})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Leave Type</label>
                <select 
                  className="form-control"
                  value={formData.leave_type}
                  onChange={(e) => setFormData({...formData, leave_type: e.target.value})}
                >
                  <option value="Casual">Casual Leave</option>
                  <option value="Sick">Sick Leave</option>
                  <option value="Emergency">Emergency Leave</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input 
                  type="date" 
                  className="form-control"
                  value={formData.start_date}
                  onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">End Date</label>
                <input 
                  type="date" 
                  className="form-control"
                  value={formData.end_date}
                  onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                  min={formData.start_date}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Total Days Calculated: </span>
              <strong style={{ fontSize: '1.25rem', color: 'var(--primary)', marginLeft: '0.5rem' }}>{totalDays > 0 ? totalDays : 0} Days</strong>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Reason for Leave</label>
              <textarea 
                className="form-control" 
                rows="4"
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                required
                placeholder="Please describe your reason..."
              ></textarea>
            </div>

            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label className="checkbox-group">
                <input 
                  type="checkbox" 
                  checked={formData.terms}
                  onChange={(e) => setFormData({...formData, terms: e.target.checked})}
                />
                I agree to the terms and conditions and certify the information is true.
              </label>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading || totalDays <= 0}>
              {loading ? <div className="spinner"></div> : <><Send size={18} /> Submit Application</>}
            </button>
          </form>
        </div>
      </div>
    </Sidebar>
  );
};

export default ApplyLeave;
