import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Check token expiry
          const payload = JSON.parse(atob(token.split('.')[1]));
          const expiry = payload.exp * 1000;
          if (Date.now() > expiry) {
            toast.error('Session expired. Please log in again.');
            localStorage.removeItem('token');
            setUser(null);
            setLoading(false);
            return;
          }

          const response = await api.get('/api/auth/profile');
          setUser(response.data.user);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
    toast.success((
      <div>
        <p><b>Welcome back, {userData.full_name.split(' ')[0]}!</b></p>
        <p className="text-sm">Logged in successfully.</p>
        <p className="text-xs text-slate-500 mt-1">Role: {userData.role}</p>
      </div>
    ), { duration: 3000 });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast('👋 Logged out successfully.\nSee you again soon!', {
      duration: 3000,
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
