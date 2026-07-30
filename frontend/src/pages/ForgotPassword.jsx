import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Mail, ArrowLeft, Loader2, CheckCircle, ShieldAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success'

  const [demoLink, setDemoLink] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setDemoLink(null);

    try {
      const response = await api.post('/api/auth/forgot-password', { email });
      setStatus('success');
      
      if (response.data.reset_link) {
        setDemoLink(response.data.reset_link);
        toast.success('🟡 Password Reset (Beta): Reset link generated!');
      } else {
        toast.success('Password reset link sent to your email!');
      }
    } catch (err) {
      setStatus('idle');
      toast.error(err.response?.data?.message || 'Failed to process request. Please try again.');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 dark:bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/3 -left-20 w-80 h-80 bg-orange-400/20 dark:bg-orange-500/10 rounded-full blur-3xl opacity-50"
        />
        <motion.div 
          animate={{ x: [0, -100, 0], y: [0, 100, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/3 -right-20 w-96 h-96 bg-primary/20 dark:bg-primary/10 rounded-full blur-3xl opacity-50"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="glassmorphism dark:glass-dark p-6 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 dark:from-white/5 dark:to-transparent pointer-events-none rounded-2xl"></div>
          
          <div className="relative z-10">
            <div className="mb-6">
              <Link to="/login" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-white dark:hover:text-slate-200 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to login
              </Link>
            </div>

            <div className="text-center mb-8 flex flex-col items-center">
              <motion.div 
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                className="bg-orange-100 dark:bg-orange-900/30 p-4 rounded-2xl mb-4"
              >
                <ShieldAlert className="h-8 w-8 text-orange-500" />
              </motion.div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Forgot Password</h2>
              <p className="text-slate-500 dark:text-white mt-2">Enter your email and we'll send a reset link.</p>
            </div>

              {status === 'success' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Check your email</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-6">
                    If an account exists for <span className="font-medium text-slate-700 dark:text-slate-300">{email}</span>, we've sent instructions to reset your password.
                  </p>
                  
                  {demoLink && (
                    <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl text-left">
                      <div className="flex items-center text-orange-600 dark:text-orange-400 font-medium mb-2">
                        <ShieldAlert className="w-5 h-5 mr-2" />
                        🟡 Password Reset (Beta)
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                        Because you haven't configured a real email server in your .env file, the email was not actually sent. Click this link to continue testing:
                      </p>
                      <a 
                        href={demoLink} 
                        className="text-primary hover:underline font-medium break-all text-sm"
                      >
                        {demoLink}
                      </a>
                    </div>
                  )}

                  <Link to="/login" className="block w-full py-2.5 px-4 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors mt-6">
                    Return to login
                  </Link>
                </motion.div>
              ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-white mb-2">{t('auth.email') || 'Email Address'}</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-orange-500 transition-colors">
                      <Mail className="h-5 w-5" />
                    </div>
                    <input
                      type="email"
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white/50 dark:bg-slate-800 outline-none transition-all dark:text-white"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl shadow-lg shadow-orange-500/20 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? <Loader2 className="animate-spin h-5 w-5" /> : 'Send Reset Link'}
                </motion.button>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
