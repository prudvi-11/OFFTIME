import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('teacher');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !successMsg) {
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/teacher/dashboard');
    }
  }, [user, navigate, successMsg]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const newUser = await register(name, role, password);
      setSuccessMsg(`Registration successful! Welcome, ${newUser.name}.`);
      
      setTimeout(() => {
        navigate(newUser.role === 'admin' ? '/admin/dashboard' : '/teacher/dashboard');
      }, 6000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card glass-panel animate-fade-in">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Logo size="medium" />
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid var(--danger)', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        {successMsg && (
          <div style={{ background: 'rgba(34, 197, 94, 0.1)', color: 'var(--success)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid var(--success)', fontSize: '1rem', fontWeight: 'bold', textAlign: 'center' }}>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              className="form-control" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              required 
              disabled={!!successMsg}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <select 
              className="form-control"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={!!successMsg}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
            >
              <option value="teacher" style={{background: '#1a1a2e'}}>Teacher</option>
              <option value="admin" style={{background: '#1a1a2e'}}>Admin</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required 
              disabled={!!successMsg}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '1rem', padding: '0.75rem' }}
            disabled={isLoading || !!successMsg}
          >
            {isLoading ? <div className="spinner"></div> : 'Register & Log In'}
          </button>
        </form>
        
        <div style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
           Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>Log in here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
