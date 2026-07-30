import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { Lock, Loader2, CheckCircle, KeyRound, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success'

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setStatus('loading');

    // Simulate API call since we don't have a real reset endpoint yet
    setTimeout(() => {
      setStatus('success');
      toast.success('Password successfully reset!');
    }, 1500);
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 transition-colors">
        <div className="text-center bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-200 dark:border-slate-700">
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Invalid Reset Link</h2>
          <p className="text-slate-500 dark:text-slate-200 mb-6">This password reset link is invalid or has expired.</p>
          <Link to="/forgot-password" className="inline-flex justify-center items-center py-2.5 px-6 rounded-xl text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 transition-colors w-full">
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 dark:bg-slate-900 flex items-center justify-center py-12 px-4 transition-colors duration-300">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ x: [0, -50, 0], y: [0, -100, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 -right-10 w-96 h-96 bg-primary/20 dark:bg-primary/10 rounded-full blur-3xl opacity-50"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="glassmorphism dark:glass-dark p-6 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 dark:from-white/5 dark:to-transparent pointer-events-none rounded-2xl"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-8 flex flex-col items-center">
              <motion.div 
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="bg-primary/10 p-4 rounded-2xl mb-4"
              >
                <KeyRound className="h-8 w-8 text-primary" />
              </motion.div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Set New Password</h2>
              <p className="text-slate-500 dark:text-slate-200 mt-2">Create a new password for {email}</p>
            </div>

            {status === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800/50"
              >
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">Password Reset Successfully</h3>
                <p className="text-green-600 dark:text-green-400/80 text-sm mb-6">You can now use your new password to log in to your account.</p>
                <Link to="/login" className="inline-flex justify-center items-center py-3 px-6 rounded-xl shadow-lg shadow-primary/20 text-sm font-medium text-white bg-gradient-to-r from-primary to-emerald-400 hover:from-primary-dark hover:to-primary transition-all w-full">
                  Go to Login
                </Link>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">New Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                      <Lock className="h-5 w-5" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      className="block w-full pl-10 pr-10 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white/50 dark:bg-slate-800 outline-none transition-all dark:text-white"
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

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Confirm New Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                      <Lock className="h-5 w-5" />
                    </div>
                    <input
                      type="password"
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white/50 dark:bg-slate-800 outline-none transition-all dark:text-white"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl shadow-lg shadow-primary/20 text-sm font-medium text-white bg-gradient-to-r from-primary to-emerald-400 hover:from-primary-dark hover:to-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? <Loader2 className="animate-spin h-5 w-5" /> : 'Reset Password'}
                </motion.button>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
