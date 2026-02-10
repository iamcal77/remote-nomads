import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { Lock, Globe, ArrowLeft } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("No reset token found. Please request a new password reset.");
      navigate("/forgot-password");
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/auth/reset-password`, {
        token,
        new_password: newPassword,
      });

      toast.success("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Invalid or expired token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Globe className="h-12 w-12 text-primary-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Set new password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create a new password for your account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-field pl-10 pr-10"
                  placeholder="Enter new password (min. 6 characters)"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Password must be at least 6 characters long
              </p>
            </div>
          </div>

          {passwordError && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{passwordError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 text-base font-medium"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
            ) : (
              "Reset Password"
            )}
          </button>

          <div className="text-center">
            <Link
              to="/forgot-password"
              className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to forgot password
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}