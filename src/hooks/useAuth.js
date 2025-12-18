import { useState, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout } from '../utils/api';
import toast from 'react-hot-toast';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');

  if (token && userData) {
    try {
      setUser(JSON.parse(userData));
    } catch {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
    }
  }
  setLoading(false);
}, []);


 const login = async (email, password) => {
  try {
    setLoading(true);
    const response = await apiLogin(email, password);

    // extract role correctly
  const role = response.role; // ✅ now defined

    localStorage.setItem('token', response.access_token);
    localStorage.setItem('user', JSON.stringify({
      email: email,
      role,
      name: email.split('@')[0]
    }));

    setUser({
      email: email,
      role,
      name: email.split('@')[0]
    });

    toast.success('Login successful!');
    return { ...response, role }; 
  } catch (error) {
    toast.error(error.message || 'Login failed');
    throw error;
  } finally {
    setLoading(false);
  }
};


  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    apiLogout();
    toast.success('Logged out successfully');
  };

  return { user, login, logout, loading };
}