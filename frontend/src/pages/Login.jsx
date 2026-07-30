import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Mail, Lock, Loader2, Eye, EyeOff, Utensils, User, Shield, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // State for new Google user role selection
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [pendingGoogleToken, setPendingGoogleToken] = useState(null);
  const [selectedRole, setSelectedRole] = useState('Customer');
  const [googleLoading, setGoogleLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      
      login(token, user);
      
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

  const handleGoogleSuccess = async (credentialResponse) => {
    setGoogleLoading(true);
    const token = credentialResponse.credential;
    
    try {
      const response = await api.post('/api/auth/google-login', { credential: token });
      
      if (response.data.requires_role) {
        // User doesn't exist, show role selection
        setPendingGoogleToken(token);
        setShowRoleSelection(true);
        setGoogleLoading(false);
      } else {
        // Existing user, log them in
        const { token: jwt, user } = response.data;
        login(jwt, user);
        
        switch(user.role) {
          case 'Customer': navigate('/customer'); break;
          case 'Restaurant Owner': navigate('/restaurant'); break;
          case 'Staff': navigate('/staff'); break;
          default: navigate('/');
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Google login failed. Please try again.');
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error('Google Sign-In was unsuccessful.');
  };

  const submitGoogleRegister = async () => {
    setGoogleLoading(true);
    try {
      const response = await api.post('/api/auth/google-register', { 
        credential: pendingGoogleToken,
        role: selectedRole
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
      toast.error(err.response?.data?.message || 'Google registration failed.');
    } finally {
      setGoogleLoading(false);
      setShowRoleSelection(false);
    }
  };

  const roles = [
    { id: 'Customer', title: 'Customer', desc: 'Dine in, order food, and make reservations easily.', icon: <User className="w-6 h-6" /> },
    { id: 'Restaurant Owner', title: 'Restaurant Owner', desc: 'Manage your restaurant, menu, staff, and gain AI insights.', icon: <Shield className="w-6 h-6" /> },
    { id: 'Staff', title: 'Staff', desc: 'Manage tables, orders, and daily operations.', icon: <CheckCircle className="w-6 h-6" /> }
  ];

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
            {showRoleSelection ? (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Complete Profile</h2>
                    <p className="text-slate-500 dark:text-slate-200 mt-2">Almost there! Please select your role.</p>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    {roles.map((role) => (
                      <div 
                        key={role.id}
                        onClick={() => setSelectedRole(role.id)}
                        className={`cursor-pointer rounded-xl border-2 p-4 flex items-start gap-4 transition-all ${
                          selectedRole === role.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'
                        }`}
                      >
                        <div className={`p-2 rounded-full ${selectedRole === role.id ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                          {role.icon}
                        </div>
                        <div>
                          <h4 className={`font-semibold ${selectedRole === role.id ? 'text-primary' : 'text-slate-800 dark:text-slate-200'}`}>{role.title}</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-200 mt-1">{role.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={submitGoogleRegister}
                    disabled={googleLoading}
                    className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl shadow-lg shadow-primary/20 text-sm font-medium text-white bg-gradient-to-r from-primary to-emerald-400 hover:from-primary-dark hover:to-primary transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {googleLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Complete Sign Up'}
                  </motion.button>
                  <button 
                    onClick={() => setShowRoleSelection(false)}
                    className="w-full mt-4 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  >
                    Cancel
                  </button>
                </motion.div>
              </AnimatePresence>
            ) : (
              <>
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
                  <p className="text-slate-500 dark:text-slate-200 mt-2">Sign in to your RestaurantBrain account</p>
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
                        className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white/50 dark:bg-slate-800 backdrop-blur-sm transition-all dark:text-white outline-none"
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
                        className="block w-full pl-10 pr-10 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white/50 dark:bg-slate-800 backdrop-blur-sm transition-all dark:text-white outline-none"
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
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 dark:text-slate-200 cursor-pointer">
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
                        <span className="px-4 bg-transparent text-slate-500 dark:text-slate-200 relative z-10 before:absolute before:inset-0 before:bg-white dark:before:bg-slate-900 before:-z-10 before:blur-sm">{t('auth.or_continue')}</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-center w-full">
                      {googleLoading ? (
                        <div className="w-full flex justify-center items-center py-3 px-4 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm bg-white/80 dark:bg-slate-800/80 backdrop-blur text-sm font-medium text-slate-700 dark:text-slate-200">
                          <Loader2 className="animate-spin h-5 w-5 mr-2" />
                          Authenticating...
                        </div>
                      ) : (
                        <div className="w-full flex justify-center">
                          <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            useOneTap
                            shape="rectangular"
                            text="continue_with"
                            size="large"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                </form>
                
                <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-200">
                  {t('auth.dont_have_account')}{' '}
                  <Link to="/register" className="font-medium text-primary hover:text-primary-dark transition-colors">
                    {t('auth.sign_up_link')}
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

