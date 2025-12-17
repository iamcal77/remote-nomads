import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, User, LogOut, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-primary-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Globe className="h-6 w-6" />
            <span className="text-xl font-bold">Remote Nomads</span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm">Welcome, {user.name}</span>
                {user.role === 'admin' ? (
                  <Link to="/admin" className="btn-secondary text-sm">
                    Admin Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/jobs" className="flex items-center space-x-1 hover:text-primary-200">
                      <Briefcase className="h-4 w-4" />
                      <span>Jobs</span>
                    </Link>
                    <Link to="/profile" className="flex items-center space-x-1 hover:text-primary-200">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 hover:text-primary-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link to="/login" className="btn-secondary text-sm">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}