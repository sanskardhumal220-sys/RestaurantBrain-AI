import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Settings as SettingsIcon, User, Palette, Globe, Bell, Shield, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState({
    order: true,
    reservation: true,
    aiInsights: false
  });

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 sm:px-6 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3 mb-3">
            <SettingsIcon className="w-8 h-8 text-primary" />
            Settings
            <span className="text-xs font-bold px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-500 rounded-full flex items-center gap-1 border border-yellow-200 dark:border-yellow-800/50">
              🟡 Beta
            </span>
          </h1>
          <p className="text-slate-600 dark:text-slate-200 max-w-2xl text-lg">
            This module is currently under development. Basic settings are available, and more customization options will be added in future updates.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Profile Section */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glassmorphism dark:glass-dark p-6 sm:p-8 rounded-3xl shadow-lg border border-slate-200/50 dark:border-slate-600"
            >
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-xl text-primary"><User className="w-5 h-5" /></div> Profile
              </h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center p-4 bg-white/60 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-600">
                  <span className="text-sm text-slate-500 dark:text-slate-200">Name</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{user.full_name}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/60 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-600">
                  <span className="text-sm text-slate-500 dark:text-slate-200">Email</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{user.email}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/60 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-600">
                  <span className="text-sm text-slate-500 dark:text-slate-200">Role</span>
                  <span className="font-semibold text-slate-900 dark:text-white capitalize px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs tracking-wide">{user.role}</span>
                </div>
              </div>
              <button onClick={() => navigate('/profile')} className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all hover:-translate-y-0.5 shadow-md hover:shadow-lg w-full sm:w-auto">
                Edit Profile
              </button>
            </motion.section>

            {/* Appearance Section */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glassmorphism dark:glass-dark p-6 sm:p-8 rounded-3xl shadow-lg border border-slate-200/50 dark:border-slate-600"
            >
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3 mb-6">
                <div className="p-2 bg-accent/10 rounded-xl text-accent"><Palette className="w-5 h-5" /></div> Appearance
              </h2>
              <div className="flex items-center justify-between p-4 bg-white/60 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-600">
                <div>
                  <span className="block font-semibold text-slate-900 dark:text-white mb-1">Theme Preferences</span>
                  <span className="text-sm text-slate-500 dark:text-slate-200">Toggle between dark and light mode</span>
                </div>
                <button
                  onClick={toggleTheme}
                  className="p-3 text-slate-500 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white transition-colors rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-600"
                >
                  <span className="text-xl leading-none">{theme === 'dark' ? '☀️' : '🌙'}</span>
                </button>
              </div>
            </motion.section>

            {/* Language Section */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glassmorphism dark:glass-dark p-6 sm:p-8 rounded-3xl shadow-lg border border-slate-200/50 dark:border-slate-600"
            >
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500"><Globe className="w-5 h-5" /></div> Language
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/60 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-600 gap-4">
                <div>
                  <span className="block font-semibold text-slate-900 dark:text-white mb-1">System Language</span>
                  <span className="text-sm text-slate-500 dark:text-slate-200">Select your preferred language</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => i18n.changeLanguage('en')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${i18n.language?.startsWith('en') ? 'bg-primary text-white shadow-md scale-105' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>English</button>
                  <button onClick={() => i18n.changeLanguage('hi')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${i18n.language?.startsWith('hi') ? 'bg-primary text-white shadow-md scale-105' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>हिंदी</button>
                </div>
              </div>
            </motion.section>

            {/* Notifications Section */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glassmorphism dark:glass-dark p-6 sm:p-8 rounded-3xl shadow-lg border border-slate-200/50 dark:border-slate-600"
            >
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-500/10 rounded-xl text-orange-500"><Bell className="w-5 h-5" /></div> Notifications
              </h2>
              <div className="space-y-3">
                {[
                  { key: 'order', label: 'Order Notifications', desc: 'Get alerted for new orders instantly' },
                  { key: 'reservation', label: 'Reservation Notifications', desc: 'Updates on table bookings' },
                  { key: 'aiInsights', label: 'AI Insights Notifications', desc: 'Daily summaries and recommendations' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-white/60 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-600">
                    <div>
                      <span className="block font-semibold text-slate-900 dark:text-white mb-0.5">{item.label}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-200">{item.desc}</span>
                    </div>
                    <button
                      onClick={() => toggleNotification(item.key)}
                      className={`w-14 h-7 rounded-full transition-colors relative flex items-center shadow-inner ${notifications[item.key] ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
                    >
                      <span className={`w-5 h-5 rounded-full bg-white absolute transition-transform duration-300 shadow-sm ${notifications[item.key] ? 'translate-x-8' : 'translate-x-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Security Section */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glassmorphism dark:glass-dark p-6 sm:p-8 rounded-3xl shadow-lg border border-slate-200/50 dark:border-slate-600"
            >
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-500/10 rounded-xl text-red-500"><Shield className="w-5 h-5" /></div> Security
              </h2>
              <div className="p-5 bg-white/60 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-600">
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-200 uppercase tracking-wider mb-4">Authentication Method</p>
                
                {user.google_id ? (
                  <div className="space-y-2">
                    <p className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-accent shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span> Google Account
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Your password is managed securely by Google.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
                        <span className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span> Email / Password
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-200">You log in using a standard password.</p>
                    </div>
                    <button onClick={() => navigate('/profile')} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-all w-full sm:w-auto border border-slate-200 dark:border-slate-600">
                      Change Password
                    </button>
                  </div>
                )}
              </div>
            </motion.section>

          </div>

          {/* Sidebar / Beta Section */}
          <div className="lg:col-span-1">
            <motion.section 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="glassmorphism dark:glass-dark p-6 sm:p-8 rounded-3xl shadow-lg border border-slate-200/50 dark:border-slate-600 sticky top-24"
            >
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3 mb-6">
                <div className="p-2 bg-yellow-500/10 rounded-xl text-yellow-500"><AlertTriangle className="w-5 h-5" /></div> Upcoming Features
              </h2>
              
              <ul className="space-y-3">
                {[
                  'Notification Preferences',
                  'Privacy Controls',
                  'Theme Personalization',
                  'Account Management',
                  'Data Export',
                  'Two-Factor Authentication'
                ].map((feature, i) => (
                  <li key={i} className="flex flex-col p-4 bg-white/40 dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{feature}</span>
                      <span className="text-[10px] font-bold px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-200 rounded-md uppercase tracking-wider">Beta</span>
                    </div>
                  </li>
                ))}
              </ul>
              
              <div className="mt-6 p-4 bg-primary/10 rounded-xl border border-primary/20">
                <p className="text-sm text-primary font-medium text-center">
                  We are actively building these features. Stay tuned for updates!
                </p>
              </div>
            </motion.section>
          </div>
        </div>

        {/* Footer info inside settings page */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 text-center pb-8"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-4 text-primary">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <p className="text-slate-900 dark:text-white font-bold text-lg">RestaurantBrain AI</p>
          <p className="text-slate-500 dark:text-slate-200 text-sm mt-1 mb-2 font-medium">Version 1.0</p>
          <p className="text-xs text-slate-400 dark:text-slate-300">More settings will be available in future updates.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
