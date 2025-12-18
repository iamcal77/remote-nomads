import { 
  User, Mail, Lock, Shield, CheckCircle, 
  XCircle, Clock, Eye, EyeOff 
} from 'lucide-react';
import { useState } from 'react';

export default function UserForm({
  userForm,
  setUserForm,
  editingUser,
  onSubmit,
  onCancel
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!userForm.full_name?.trim()) {
      newErrors.full_name = 'Full name is required';
    }
    
    if (!userForm.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userForm.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!editingUser && !userForm.password) {
      newErrors.password = 'Password is required';
    } else if (!editingUser && userForm.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(e);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'inactive': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <CheckCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <User className="h-4 w-4" />
            Full Name
          </label>
          <div className="relative">
            <input
              type="text"
              required
              placeholder="John Doe"
              value={userForm.full_name}
              onChange={(e) =>
                setUserForm({ ...userForm, full_name: e.target.value })
              }
              className={`w-full px-4 py-3 pl-10 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${
                errors.full_name 
                  ? 'border-red-300 focus:ring-red-200' 
                  : 'border-gray-300 focus:ring-gray-200'
              }`}
              style={{ focusRingColor: '#c13d18' }}
            />
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          {errors.full_name && (
            <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              required
              placeholder="john@example.com"
              value={userForm.email}
              onChange={(e) =>
                setUserForm({ ...userForm, email: e.target.value })
              }
              className={`w-full px-4 py-3 pl-10 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${
                errors.email 
                  ? 'border-red-300 focus:ring-red-200' 
                  : 'border-gray-300 focus:ring-gray-200'
              }`}
              style={{ focusRingColor: '#c13d18' }}
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Password (Create only) */}
        {!editingUser && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter password"
                value={userForm.password}
                onChange={(e) =>
                  setUserForm({ ...userForm, password: e.target.value })
                }
                className={`w-full px-4 py-3 pl-10 pr-10 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${
                  errors.password 
                    ? 'border-red-300 focus:ring-red-200' 
                    : 'border-gray-300 focus:ring-gray-200'
                }`}
                style={{ focusRingColor: '#c13d18' }}
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Must be at least 6 characters long
            </p>
          </div>
        )}

        {/* Role and Status - Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Role
            </label>
            <div className="relative">
              <select
                value={userForm.role}
                onChange={(e) =>
                  setUserForm({ ...userForm, role: e.target.value })
                }
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent appearance-none bg-white transition-all"
                style={{ focusRingColor: '#c13d18' }}
              >
                <option value="admin">Administrator</option>
                <option value="recruiter">Recruiter</option>
                <option value="candidate">Candidate</option>
              </select>
              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="relative">
              <select
                value={userForm.status}
                onChange={(e) =>
                  setUserForm({ ...userForm, status: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent appearance-none bg-white transition-all"
                style={{ focusRingColor: '#c13d18' }}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                {getStatusIcon(userForm.status)}
              </div>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Role Description */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Role Description</h4>
          {userForm.role === 'admin' && (
            <p className="text-sm text-gray-600">
              Full access to all system features, including user management, job postings, and system settings.
            </p>
          )}
          {userForm.role === 'recruiter' && (
            <p className="text-sm text-gray-600">
              Can post jobs, review applications, and manage candidate pipelines. Cannot manage system users.
            </p>
          )}
          {userForm.role === 'candidate' && (
            <p className="text-sm text-gray-600">
              Can apply for jobs, update profile, and track applications. Limited to personal account management.
            </p>
          )}
        </div>

        {/* Status Description */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Status Information</h4>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-gray-600">Active: Can access the system</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-gray-600">Inactive: Cannot access the system</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <span className="text-gray-600">Pending: Awaiting activation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 text-white rounded-lg font-medium transition-all hover:shadow-lg flex items-center gap-2"
          style={{
            background: 'linear-gradient(135deg, #c13d18 0%, #e04e1a 100%)',
            boxShadow: '0 4px 12px rgba(193, 61, 24, 0.25)'
          }}
        >
          {editingUser ? 'Update User' : 'Create User'}
        </button>
      </div>
    </form>
  );
}