import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ApplyLeave from './pages/ApplyLeave';
import LeaveHistory from './pages/LeaveHistory';
import Register from './pages/Register';
import AdminTeacherStats from './pages/AdminTeacherStats';

const PrivateRoute = ({ children, roleRequired }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="login-container"><div className="spinner"></div></div>;
  if (!user) return <Navigate to="/login" />;
  if (roleRequired && user.role !== roleRequired) return <Navigate to="/" />;

  return children;
};

const RoleBasedRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return user.role === 'admin' ? <Navigate to="/admin/dashboard" /> : <Navigate to="/teacher/dashboard" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<RoleBasedRedirect />} />
        
        {/* Teacher Routes */}
        <Route path="/teacher/dashboard" element={<PrivateRoute roleRequired="teacher"><TeacherDashboard /></PrivateRoute>} />
        <Route path="/teacher/apply" element={<PrivateRoute roleRequired="teacher"><ApplyLeave /></PrivateRoute>} />
        <Route path="/teacher/history" element={<PrivateRoute roleRequired="teacher"><LeaveHistory /></PrivateRoute>} />

        {/* Admin Routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <PrivateRoute roleRequired="admin">
              <AdminDashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/admin/stats" 
          element={
            <PrivateRoute roleRequired="admin">
              <AdminTeacherStats />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
