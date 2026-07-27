import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { User, Mail, Phone, Lock, Loader2, Shield, ArrowRight, ArrowLeft, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'Customer'
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculatePasswordStrength = (password) => {
    let score = 0;
    if (!password) return score;
    if (password.length >= 8) score += 20;
    if (/[A-Z]/.test(password)) score += 20;
    if (/[a-z]/.test(password)) score += 20;
    if (/[0-9]/.test(password)) score += 20;
    if (/[^A-Za-z0-9]/.test(password)) score += 20;
    return score;
  };

  const strength = calculatePasswordStrength(formData.password);
  
  const getStrengthColor = () => {
    if (strength <= 20) return 'bg-red-500';
    if (strength <= 40) return 'bg-orange-500';
    if (strength <= 60) return 'bg-yellow-500';
    if (strength <= 80) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const nextStep = () => {
    // Validation before moving to next step
    if (step === 1) {
      if (!formData.fullName || !formData.email) {
        toast.error('Please fill in all required fields.');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error('Please enter a valid email address.');
        return;
      }
    }
    if (step === 2) {
      if (strength < 100) {
        toast.error('Please meet all password requirements.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match.');
        return;
      }
    }
    setStep(s => s + 1);
  };

  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/api/auth/register', {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role
      });
      
      setSuccess(true);
      toast.success('Registration successful!');
      
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    {
      id: 'Customer',
      title: 'Customer',
      desc: 'Dine in, order food, and make reservations easily.',
      icon: <User className="w-6 h-6" />
    },
    {
      id: 'Restaurant Owner',
      title: 'Restaurant Owner',
      desc: 'Manage your restaurant, menu, staff, and gain AI insights.',
      icon: <Shield className="w-6 h-6" />
    },
    {
      id: 'Staff',
      title: 'Staff',
      desc: 'Manage tables, orders, and daily operations.',
      icon: <CheckCircle className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 dark:bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ x: [0, -100, 0], y: [0, -50, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 -right-20 w-[40rem] h-[40rem] bg-accent/10 dark:bg-accent/5 rounded-full blur-3xl opacity-60"
        />
        <motion.div 
          animate={{ x: [0, 100, 0], y: [0, 100, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 -left-20 w-96 h-96 bg-primary/20 dark:bg-primary/10 rounded-full blur-3xl opacity-50"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-xl z-10"
      >
        <div className="glassmorphism dark:glass-dark p-8 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 dark:from-white/5 dark:to-transparent pointer-events-none rounded-2xl"></div>
          
          <div className="relative z-10">
            
            {success ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                  <Mail className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Check your email</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-8">
                  A verification email has been sent to <br/><span className="font-semibold text-slate-800 dark:text-slate-100">{formData.email}</span>. <br/>Please verify your account to continue.
                </p>
                <Link to="/login" className="inline-flex justify-center items-center py-3 px-6 rounded-xl shadow-lg shadow-primary/20 text-sm font-medium text-white bg-gradient-to-r from-primary to-emerald-400 hover:from-primary-dark hover:to-primary transition-all">
                  Back to Login
                </Link>
              </motion.div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{t('auth.create_account')}</h2>
                  <p className="text-slate-500 dark:text-slate-400 mt-2">Join RestaurantBrain in just a few steps</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8 relative">
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-slate-200 dark:bg-slate-700">
                    <motion.div 
                      initial={{ width: '33%' }}
                      animate={{ width: `${(step / 3) * 100}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
                    ></motion.div>
                  </div>
                  <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400 px-1">
                    <span className={step >= 1 ? 'text-primary' : ''}>Details</span>
                    <span className={step >= 2 ? 'text-primary' : ''}>Password</span>
                    <span className={step >= 3 ? 'text-primary' : ''}>Role</span>
                  </div>
                </div>

                <div className="min-h-[300px]">
                  <AnimatePresence mode="wait">
                    
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-5"
                      >
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('auth.full_name')} *</label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary">
                              <User className="h-5 w-5" />
                            </div>
                            <input
                              type="text"
                              name="fullName"
                              className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white/50 dark:bg-slate-800/50 outline-none transition-all dark:text-white"
                              placeholder="John Doe"
                              value={formData.fullName}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('auth.email')} *</label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary">
                              <Mail className="h-5 w-5" />
                            </div>
                            <input
                              type="email"
                              name="email"
                              className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white/50 dark:bg-slate-800/50 outline-none transition-all dark:text-white"
                              placeholder="you@example.com"
                              value={formData.email}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary">
                              <Phone className="h-5 w-5" />
                            </div>
                            <input
                              type="tel"
                              name="phone"
                              className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white/50 dark:bg-slate-800/50 outline-none transition-all dark:text-white"
                              placeholder="+1 (555) 000-0000"
                              value={formData.phone}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-5"
                      >
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('auth.password')} *</label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary">
                              <Lock className="h-5 w-5" />
                            </div>
                            <input
                              type={showPassword ? "text" : "password"}
                              name="password"
                              className="block w-full pl-10 pr-10 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white/50 dark:bg-slate-800/50 outline-none transition-all dark:text-white"
                              placeholder="••••••••"
                              value={formData.password}
                              onChange={handleChange}
                            />
                            <button 
                              type="button" 
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                            >
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                          
                          {/* Password Strength Meter */}
                          <div className="mt-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-500 dark:text-slate-400">Password strength</span>
                              <span className="font-medium text-slate-700 dark:text-slate-300">{strength}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                              <motion.div 
                                className={`h-full ${getStrengthColor()}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${strength}%` }}
                                transition={{ duration: 0.3 }}
                              />
                            </div>
                            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400">
                              <div className={`flex items-center gap-1 ${formData.password.length >= 8 ? 'text-green-600 dark:text-green-400' : ''}`}>
                                <CheckCircle className="w-3 h-3" /> Min 8 chars
                              </div>
                              <div className={`flex items-center gap-1 ${/[A-Z]/.test(formData.password) ? 'text-green-600 dark:text-green-400' : ''}`}>
                                <CheckCircle className="w-3 h-3" /> Uppercase
                              </div>
                              <div className={`flex items-center gap-1 ${/[a-z]/.test(formData.password) ? 'text-green-600 dark:text-green-400' : ''}`}>
                                <CheckCircle className="w-3 h-3" /> Lowercase
                              </div>
                              <div className={`flex items-center gap-1 ${/[0-9]/.test(formData.password) ? 'text-green-600 dark:text-green-400' : ''}`}>
                                <CheckCircle className="w-3 h-3" /> Number
                              </div>
                              <div className={`flex items-center gap-1 col-span-2 ${/[^A-Za-z0-9]/.test(formData.password) ? 'text-green-600 dark:text-green-400' : ''}`}>
                                <CheckCircle className="w-3 h-3" /> Special Character (@$!%*?&)
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('auth.confirm_password')} *</label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary">
                              <Lock className="h-5 w-5" />
                            </div>
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              name="confirmPassword"
                              className={`block w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:text-white bg-white/50 dark:bg-slate-800/50 ${
                                formData.confirmPassword && formData.password !== formData.confirmPassword 
                                ? 'border-red-500 focus:border-red-500' 
                                : 'border-slate-200 dark:border-slate-700 focus:border-primary'
                              }`}
                              placeholder="••••••••"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                            />
                            <button 
                              type="button" 
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                            >
                              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Select Your Role</label>
                        <div className="space-y-3">
                          {roles.map((role) => (
                            <div 
                              key={role.id}
                              onClick={() => setFormData({...formData, role: role.id})}
                              className={`cursor-pointer rounded-xl border-2 p-4 flex items-start gap-4 transition-all ${
                                formData.role === role.id 
                                ? 'border-primary bg-primary/5' 
                                : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'
                              }`}
                            >
                              <div className={`p-2 rounded-full ${formData.role === role.id ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                                {role.icon}
                              </div>
                              <div>
                                <h4 className={`font-semibold ${formData.role === role.id ? 'text-primary' : 'text-slate-800 dark:text-slate-200'}`}>{role.title}</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{role.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                  </AnimatePresence>
                </div>

                <div className="mt-8 flex justify-between items-center pt-6 border-t border-slate-200 dark:border-slate-700">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex items-center text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1" />
                      Back
                    </button>
                  ) : (
                    <div></div> // Empty div to keep Next button aligned right
                  )}

                  {step < 3 ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={nextStep}
                      className="flex items-center py-2.5 px-6 rounded-xl shadow-md shadow-primary/10 text-sm font-medium text-white bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 transition-all"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex justify-center items-center py-2.5 px-6 rounded-xl shadow-lg shadow-primary/20 text-sm font-medium text-white bg-gradient-to-r from-primary to-emerald-400 hover:from-primary-dark hover:to-primary transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : <CheckCircle className="h-5 w-5 mr-2" />}
                      Create Account
                    </motion.button>
                  )}
                </div>
              </>
            )}
            
            {!success && (
              <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
                {t('auth.already_have_account')}{' '}
                <Link to="/login" className="font-medium text-primary hover:text-primary-dark transition-colors">
                  {t('auth.sign_in_link')}
                </Link>
              </div>
            )}

          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
