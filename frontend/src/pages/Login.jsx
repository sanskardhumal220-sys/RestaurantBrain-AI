import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Mail, Lock, Loader2, Eye, EyeOff, Utensils } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';

const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      
      login(token, user);
      
      // The toast is handled in AuthContext upon successful login
      
      // Redirect based on role
      switch(user.role) {
        case 'Customer': navigate('/customer'); break;
        case 'Restaurant Owner': navigate('/restaurant'); break;
        case 'Staff': navigate('/staff'); break;
        default: navigate('/');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials or Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const response = await api.post('/api/auth/google-login', { 
        email: 'testcustomer@example.com',
        name: 'Google User',
        googleId: '1234567890'
      });
      const { token, user } = response.data;
      login(token, user);
      switch(user.role) {
        case 'Customer': navigate('/customer'); break;
        case 'Restaurant Owner': navigate('/restaurant'); break;
        case 'Staff': navigate('/staff'); break;
        default: navigate('/');
      }
    } catch (err) {
      toast.error('Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 dark:bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 dark:bg-primary/10 rounded-full blur-3xl opacity-50"
        />
        <motion.div 
          animate={{ x: [0, -100, 0], y: [0, 100, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 -right-20 w-[30rem] h-[30rem] bg-accent/20 dark:bg-accent/10 rounded-full blur-3xl opacity-50"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md z-10"
      >
        <div className="glassmorphism dark:glass-dark p-6 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle gradient overlay on card */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 dark:from-white/5 dark:to-transparent pointer-events-none rounded-2xl"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-8 flex flex-col items-center">
              <motion.div 
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                className="bg-primary/10 p-3 rounded-2xl mb-4"
              >
                <Utensils className="h-8 w-8 text-primary" />
              </motion.div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Welcome Back</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2">Sign in to your RestaurantBrain account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('auth.email')}</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-primary text-slate-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm transition-all dark:text-white outline-none"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('auth.password')}</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-primary text-slate-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="block w-full pl-10 pr-10 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm transition-all dark:text-white outline-none"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-slate-300 dark:border-slate-600 rounded bg-transparent"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
                    {t('auth.remember')}
                  </label>
                </div>
                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-primary hover:text-primary-dark transition-colors">
                    {t('auth.forgot')}
                  </Link>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl shadow-lg shadow-primary/20 text-sm font-medium text-white bg-gradient-to-r from-primary to-emerald-400 hover:from-primary-dark hover:to-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : t('auth.sign_in_btn')}
              </motion.button>
              
              <div className="mt-8 text-center">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-transparent text-slate-500 dark:text-slate-400 relative z-10 before:absolute before:inset-0 before:bg-white dark:before:bg-slate-900 before:-z-10 before:blur-sm">{t('auth.or_continue')}</span>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="mt-6 w-full flex justify-center items-center py-3 px-4 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm bg-white/80 dark:bg-slate-800/80 backdrop-blur hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  ) : (
                    <img className="h-5 w-5 mr-2" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google logo" />
                  )}
                  Continue with Google
                </motion.button>
              </div>
              
            </form>
            
            <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
              {t('auth.dont_have_account')}{' '}
              <Link to="/register" className="font-medium text-primary hover:text-primary-dark transition-colors">
                {t('auth.sign_up_link')}
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
