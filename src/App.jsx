import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './Layout/Layout';
import PublicLayout from './Layout/PublicLayout';
import ProtectedRoute from './Auth/ProtectedRoute';
import Login from './Auth/Login';
import Profile from './Candidate/Profile';
import JobsDashboard from './Candidate/JobsDashboard';
import AdminDashboard from './Admin/AdminDashboard';
import Home from './pages/Home';
import { AuthProvider } from './context/AuthContext';
import JobDetails from './Candidate/JobDetails';
import Signup from './Auth/SignUp';
import ApplicationStatusPage from './Candidate/ApplicationStatus';
import ResetPassword from './Auth/ResetPassword';
import ForgotPassword from './Auth/ForgotPassword';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public pages (NO navbar) */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>

          {/* App pages (WITH navbar) */}
          <Route element={<Layout />}>
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/jobs"
              element={
                <ProtectedRoute>
                  <JobsDashboard />
                </ProtectedRoute>
              }
            />
            <Route
            path='/application-status'
            element={
              <ProtectedRoute>
                <ApplicationStatusPage filter="application-status" />
              </ProtectedRoute>
            }
          />

            <Route path="/jobs/:id" element={<JobDetails />} />

            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
        }}
      />
      </Router>
    </AuthProvider>
  );
}

export default App;
