import { Link, useNavigate } from 'react-router-dom';
import { 
  Briefcase, User, LogOut, Globe, Menu, X, 
  Home, Search, Bell, MessageSquare, Settings,
  ChevronDown, Shield, Users as UsersIcon, Building
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
const handleClick = () => {
  toast.success("Coming Sooon.");
}
  return (
    <nav className="fixed top-0 left-0 w-full z-50" style={{
      background: 'linear-gradient(135deg, #0b1220 0%, #1a2536 100%)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
      borderBottom: '2px solid #c13d18'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{
                  background: 'linear-gradient(135deg, #c13d18 0%, #e04e1a 100%)',
                  boxShadow: '0 4px 12px rgba(193, 61, 24, 0.3)'
                }}>
                  <Globe className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-[#0b1220]"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white tracking-tight">Remote Nomads</span>
                <span className="text-xs text-gray-400">Work Anywhere</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:ml-10 md:flex md:space-x-1">
              <Link
                to="/"
                className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
              <Link
                to="/jobs"
                className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 flex items-center gap-2"
              >
                <Briefcase className="h-4 w-4" />
                Jobs
              </Link>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Notification & Messages (Desktop) */}
            {user && (
              <div className="hidden md:flex items-center space-x-2">
                <button 
                onClick={handleClick}
                className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-[#1a2536]"></span>
                </button>
                <button 
                onClick={handleClick}
                className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all relative">
                  <MessageSquare className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-blue-500 rounded-full border-2 border-[#1a2536]"></span>
                </button>
              </div>
            )}

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-3 group"
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="h-9 w-9 rounded-full flex items-center justify-center text-white font-semibold text-sm ring-2 ring-white/10 ring-offset-2 ring-offset-[#1a2536]"
                      style={{
                        background: 'linear-gradient(135deg, #c13d18 0%, #e04e1a 100%)'
                      }}
                    >
                      {getInitials(user.name)}
                    </div>
                    <div className="hidden md:block text-left">
                      <div className="text-sm font-medium text-white">{user.name}</div>
                      <div className="text-xs text-gray-400 capitalize">{user.role}</div>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 animate-in fade-in duration-200"
                    onMouseLeave={() => setIsProfileMenuOpen(false)}
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                    
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <User className="h-4 w-4 mr-3" />
                        My Profile
                      </Link>
                      
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <Shield className="h-4 w-4 mr-3" style={{ color: '#c13d18' }} />
                          Admin Dashboard
                        </Link>
                      )}
                      
                      <Link
                        // to="/settings"
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={handleClick}
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Settings
                      </Link>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-1">
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #c13d18 0%, #e04e1a 100%)',
                    boxShadow: '0 4px 12px rgba(193, 61, 24, 0.25)'
                  }}
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-2 pb-4 space-y-2 border-t border-white/10" style={{
            background: 'linear-gradient(135deg, #1a2536 0%, #0b1220 100%)'
          }}>
            {/* Mobile Search */}
            {user && (
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search jobs..."
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ focusRingColor: '#c13d18' }}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            )}

            <Link
              to="/"
              className="flex items-center px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="h-5 w-5 mr-3" />
              Home
            </Link>
            
            <Link
              to="/jobs"
              className="flex items-center px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              <Briefcase className="h-5 w-5 mr-3" />
              Jobs
            </Link>
            
            <Link
              to="/companies"
              className="flex items-center px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              <Building className="h-5 w-5 mr-3" />
              Companies
            </Link>

            {user && (
              <>
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-5 w-5 mr-3" />
                  Profile
                </Link>
                
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Shield className="h-5 w-5 mr-3" style={{ color: '#c13d18' }} />
                    Admin Dashboard
                  </Link>
                )}
                
                <div className="border-t border-white/10 pt-2 mt-2">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center w-full px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-white/5 transition-all"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Sign Out
                  </button>
                </div>
              </>
            )}

            {!user && (
              <div className="space-y-2 pt-2 border-t border-white/10">
                <Link
                  to="/login"
                  className="block px-4 py-3 rounded-lg text-center text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="block px-4 py-3 rounded-lg text-center font-medium transition-all hover:shadow-lg"
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    background: 'linear-gradient(135deg, #c13d18 0%, #e04e1a 100%)',
                    boxShadow: '0 4px 12px rgba(193, 61, 24, 0.25)'
                  }}
                >
                  Get Started Free
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}