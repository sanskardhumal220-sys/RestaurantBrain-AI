import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BarChart3, TrendingUp, Users, DollarSign, Activity, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const InteractiveDemoModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${API_URL}/api/auth/demo`, {
        method: 'POST',
      });
      const data = await response.json();
      if (response.ok) {
        login(data.token, data.user);
        toast.success('Entering Demo Mode...');
        navigate('/restaurant');
      } else {
        toast.error(data.message || 'Failed to start demo');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl bg-slate-50 dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Live Dashboard Preview</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Revenue', value: '$24,592.00', change: '+12.5%', icon: <DollarSign className="w-6 h-6 text-green-500" />, color: 'bg-green-100 dark:bg-green-500/10' },
                { label: 'Active Orders', value: '42', change: '+5.2%', icon: <Activity className="w-6 h-6 text-blue-500" />, color: 'bg-blue-100 dark:bg-blue-500/10' },
                { label: 'Total Customers', value: '1,284', change: '+18.1%', icon: <Users className="w-6 h-6 text-purple-500" />, color: 'bg-purple-100 dark:bg-purple-500/10' },
                { label: 'Growth', value: '+24%', change: '+2.4%', icon: <TrendingUp className="w-6 h-6 text-orange-500" />, color: 'bg-orange-100 dark:bg-orange-500/10' },
              ].map((stat, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                  <div className={`p-4 rounded-xl ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
                    <p className="text-xs font-medium text-green-600 dark:text-green-400 mt-1">{stat.change} vs last month</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Chart */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Revenue Overview</h3>
                  <div className="flex gap-2">
                    {['1W', '1M', '3M', '1Y'].map(t => (
                      <button key={t} className="px-3 py-1 text-xs font-medium rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors">
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Mock Chart Bars */}
                <div className="h-64 flex items-end justify-between gap-2 px-2">
                  {[40, 70, 45, 90, 65, 85, 100, 75, 50, 80, 60, 95].map((h, i) => (
                    <div key={i} className="w-full bg-primary/20 hover:bg-primary/40 dark:bg-primary/20 dark:hover:bg-primary/40 rounded-t-md relative group cursor-pointer transition-colors" style={{ height: `${h}%` }}>
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        ${h * 120}
                      </div>
                      <div className="absolute bottom-0 w-full bg-primary rounded-t-md" style={{ height: `${h * 0.7}%` }}></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Recent Orders</h3>
                <div className="space-y-4">
                  {[
                    { id: '#ORD-001', item: 'Margherita Pizza', time: '2 mins ago', price: '$14.00' },
                    { id: '#ORD-002', item: 'Truffle Pasta', time: '15 mins ago', price: '$22.00' },
                    { id: '#ORD-003', item: 'Caesar Salad', time: '32 mins ago', price: '$12.00' },
                    { id: '#ORD-004', item: 'Grilled Salmon', time: '1 hr ago', price: '$28.00' },
                    { id: '#ORD-005', item: 'Beef Burger', time: '2 hrs ago', price: '$16.00' },
                  ].map((order, i) => (
                    <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{order.item}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{order.id} • {order.time}</p>
                      </div>
                      <span className="text-sm font-bold text-primary">{order.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Footer CTA */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-center">
            <button 
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="px-6 py-2 bg-gradient-to-r from-primary to-emerald-400 hover:from-primary-dark hover:to-primary text-white rounded-xl font-medium shadow-lg shadow-primary/20 transition-all hover:scale-105 flex items-center justify-center min-w-[200px]"
            >
              {isLoading ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Entering...</>
              ) : (
                'Enter Real Live Demo'
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default InteractiveDemoModal;
