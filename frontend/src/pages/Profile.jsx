import React, { useState, useContext, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Lock, Save, Camera, Loader2, Mail } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { user, login } = useContext(AuthContext);
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    fullName: user?.full_name || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
  });
  
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.full_name || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.put('/api/auth/profile', formData);
      
      // Update local context
      const token = localStorage.getItem('token');
      if (token && response.data.user) {
        login(token, response.data.user);
      }
      
      toast.success('Profile updated successfully');
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' })); // clear passwords
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 sm:px-6 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Profile</h1>
          <p className="text-slate-500 dark:text-white mt-1">Manage your account settings and preferences</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Sidebar / Avatar Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-1"
          >
            <div className="glassmorphism dark:glass-dark p-6 text-center shadow-lg">
              <div className="relative inline-block mb-4">
                <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-primary to-emerald-400 flex items-center justify-center text-4xl font-bold text-white shadow-inner mx-auto overflow-hidden">
                  {(formData.profilePicture || user.profile_picture) ? (
                    <img src={formData.profilePicture || user.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    user.full_name?.charAt(0).toUpperCase()
                  )}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-white rounded-full shadow-md border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{user.full_name}</h3>
              <p className="text-primary font-medium text-sm mt-1 uppercase tracking-wider">{user.role}</p>
              
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 text-left space-y-3">
                <div className="flex items-center text-slate-600 dark:text-white text-sm">
                  <Mail className="w-4 h-4 mr-3 text-slate-400" />
                  <span className="truncate">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center text-slate-600 dark:text-white text-sm">
                    <Phone className="w-4 h-4 mr-3 text-slate-400" />
                    <span>{user.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Edit Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-2"
          >
            <div className="glassmorphism dark:glass-dark p-8 shadow-lg">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-700 pb-3">Edit Details</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-white mb-1">Full Name</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary">
                        <User className="h-5 w-5" />
                      </div>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white/50 dark:bg-slate-800 outline-none transition-all dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-white mb-1">Phone Number</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary">
                        <Phone className="h-5 w-5" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white/50 dark:bg-slate-800 outline-none transition-all dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-200 dark:border-slate-700">
                  <h4 className="text-md font-semibold text-slate-800 dark:text-white mb-4">Change Password</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-white mb-1">Current Password</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary">
                          <Lock className="h-5 w-5" />
                        </div>
                        <input
                          type="password"
                          name="currentPassword"
                          placeholder="Leave blank to keep"
                          value={formData.currentPassword}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white/50 dark:bg-slate-800 outline-none transition-all dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-white mb-1">New Password</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary">
                          <Lock className="h-5 w-5" />
                        </div>
                        <input
                          type="password"
                          name="newPassword"
                          placeholder="Leave blank to keep"
                          value={formData.newPassword}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white/50 dark:bg-slate-800 outline-none transition-all dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center items-center py-2.5 px-6 rounded-xl shadow-lg shadow-primary/20 text-sm font-medium text-white bg-gradient-to-r from-primary to-emerald-400 hover:from-primary-dark hover:to-primary transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : <Save className="h-5 w-5 mr-2" />}
                    Save Changes
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
