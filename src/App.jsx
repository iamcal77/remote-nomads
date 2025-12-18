import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './Layout/Layout';
import ProtectedRoute from './Auth/ProtectedRoute';
import Login from './Auth/Login';
import Profile from './Candidate/Profile';
import JobsDashboard from './Candidate/JobsDashboard';
import AdminDashboard from './Admin/AdminDashboard';
import Home from './pages/Home';
import Signup from './Auth/Signup';
import { AuthProvider } from './context/AuthContext';
import JobDetails from './Candidate/JobDetails';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />

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

        <Toaster position="top-right" />
      </Router>
    </AuthProvider>
  );
}

export default App;
