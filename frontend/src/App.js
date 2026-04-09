import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Admin Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Candidates from './pages/Candidates';
import Jobs from './pages/Jobs';
import Interviews from './pages/Interviews';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

// Applicant Pages
import ApplicantDashboard from './pages/ApplicantDashboard';
import JobListings from './pages/JobListings';
import ApplicantProfile from './pages/ApplicantProfile';
import ApplicantInterviews from './pages/ApplicantInterviews';

// Components
import Layout from './components/Layout';
import ApplicantLayout from './components/ApplicantLayout';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import ApplicantRoute from './components/ApplicantRoute';

// Role-based redirect component
const RoleBasedRedirect = () => {
  const { isAdmin, isApplicant, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  if (isApplicant) {
    return <Navigate to="/applicant/dashboard" replace />;
  }
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin Routes - Wrapped in Layout */}
            <Route element={<AdminRoute><Layout /></AdminRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/candidates" element={<Candidates />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/interviews" element={<Interviews />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Applicant Routes - Wrapped in ApplicantLayout */}
            <Route element={<ApplicantRoute><ApplicantLayout /></ApplicantRoute>}>
              <Route path="/applicant/dashboard" element={<ApplicantDashboard />} />
              <Route path="/applicant/jobs" element={<JobListings />} />
              <Route path="/applicant/profile" element={<ApplicantProfile />} />
              <Route path="/applicant/interviews" element={<ApplicantInterviews />} />
            </Route>

            {/* Default Route - Role-based redirect */}
            <Route path="/" element={<PrivateRoute><RoleBasedRedirect /></PrivateRoute>} />
          </Routes>

          {/* Toast Notifications */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </AuthProvider>
  </ThemeProvider>
  );
}

export default App;
