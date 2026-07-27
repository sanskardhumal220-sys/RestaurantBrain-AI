import React, { useState, useEffect, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, Coffee, Check, Clock, Utensils, AlertCircle, GripVertical, CheckCircle2, TrendingUp, Users, FileText, Bell, BellOff, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

// Simple Web Audio API beep generator for notifications
const playBeep = (type) => {
 try {
 const AudioContext = window.AudioContext || window.webkitAudioContext;
 if (!AudioContext) return;
 const ctx = new AudioContext();
 const osc = ctx.createOscillator();
 const gain = ctx.createGain();
 osc.connect(gain);
 gain.connect(ctx.destination);
 
 if (type === 'new') {
 osc.type = 'sine';
 osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
 osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
 gain.gain.setValueAtTime(0.1, ctx.currentTime);
 gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
 osc.start();
 osc.stop(ctx.currentTime + 0.3);
 } else if (type === 'high_priority') {
 osc.type = 'square';
 osc.frequency.setValueAtTime(440, ctx.currentTime);
 osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
 osc.frequency.setValueAtTime(440, ctx.currentTime + 0.2);
 gain.gain.setValueAtTime(0.1, ctx.currentTime);
 gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
 osc.start();
 osc.stop(ctx.currentTime + 0.4);
 } else if (type === 'delayed') {
 osc.type = 'sawtooth';
 osc.frequency.setValueAtTime(300, ctx.currentTime);
 osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.5);
 gain.gain.setValueAtTime(0.1, ctx.currentTime);
 gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
 osc.start();
 osc.stop(ctx.currentTime + 0.5);
 }
 } catch (e) {
 console.warn("Audio play blocked by browser policy");
 }
};

const StaffDashboard = () => {
 const { t } = useTranslation();
 const { user } = useContext(AuthContext);
 
 const [activeTab, setActiveTab] = useState('kitchen');
 const [orders, setOrders] = useState([]);
 const [activities, setActivities] = useState([]);
 const [toastMessage, setToastMessage] = useState('');
 const [soundEnabled, setSoundEnabled] = useState(true);
 const [now, setNow] = useState(new Date());
 const prevOrdersRef = useRef([]);

 const showToast = (msg) => {
 setToastMessage(msg);
 setTimeout(() => setToastMessage(''), 3000);
 };

 const addActivity = (msg) => {
 setActivities(prev => [{ id: Date.now() + Math.random(), time: new Date(), message: msg }, ...prev].slice(0, 50));
 };

 useEffect(() => {
 const timer = setInterval(() => setNow(new Date()), 60000); // Update timers every minute
 return () => clearInterval(timer);
 }, []);

 useEffect(() => {
 fetchOrders();
 const interval = setInterval(fetchOrders, 5000);
 return () => clearInterval(interval);
 }, []);

 // Check for new or delayed orders to trigger sounds/activities
 useEffect(() => {
 if (orders.length > 0 && prevOrdersRef.current.length > 0) {
 const prevIds = new Set(prevOrdersRef.current.map(o => o.id));
 orders.forEach(order => {
 if (!prevIds.has(order.id)) {
 // New order
 const priority = getOrderPriority(order);
 if (soundEnabled) {
 if (priority === 'High' || priority === 'Highest') playBeep('high_priority');
 else playBeep('new');
 }
 addActivity(`Order #${order.id} Received (${priority} Priority)`);
 } else {
 // Check status change
 const prevOrder = prevOrdersRef.current.find(o => o.id === order.id);
 if (prevOrder && prevOrder.status !== order.status) {
 addActivity(`Order #${order.id} is now ${order.status}`);
 }
 }
 });
 }
 prevOrdersRef.current = orders;
 }, [orders, soundEnabled]);

 const fetchOrders = async () => {
 try {
 const res = await api.get('/api/orders/');
 setOrders(res.data);
 } catch (err) {
 console.error('Failed to fetch orders', err);
 }
 };

 const updateOrderStatus = async (id, status) => {
 try {
 setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
 await api.put(`/api/orders/${id}/status`, { status });
 showToast(`Order #${id} moved to ${status}`);
 } catch (err) {
 alert('Failed to update status');
 fetchOrders();
 }
 };

 // --- Drag and Drop Logic ---
 const handleDragStart = (e, orderId) => {
 e.dataTransfer.setData('orderId', orderId);
 e.currentTarget.classList.add('opacity-50');
 };
 const handleDragEnd = (e) => {
 e.currentTarget.classList.remove('opacity-50');
 };
 const handleDragOver = (e) => {
 e.preventDefault();
 e.currentTarget.classList.add('bg-primary/5');
 };
 const handleDragLeave = (e) => {
 e.currentTarget.classList.remove('bg-primary/5');
 };
 const handleDrop = (e, targetStatus) => {
 e.preventDefault();
 e.currentTarget.classList.remove('bg-primary/5');
 const orderId = e.dataTransfer.getData('orderId');
 if (orderId) {
 const order = orders.find(o => o.id === parseInt(orderId));
 if (order && order.status !== targetStatus) {
 updateOrderStatus(parseInt(orderId), targetStatus);
 }
 }
 };

 // --- Utilities ---
 const getElapsedMinutes = (createdAt) => {
 return Math.floor((now - new Date(createdAt)) / 60000);
 };

 const getTimerStatus = (elapsed, estimated) => {
 if (elapsed > estimated + 10) return { label: 'Delayed', color: 'text-red-600', bg: 'bg-red-50 border-red-200', bar: 'bg-red-500' };
 if (elapsed > estimated - 5) return { label: 'Warning', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200', bar: 'bg-orange-500' };
 return { label: 'On Time', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', bar: 'bg-emerald-500' };
 };

 const getOrderPriority = (order) => {
 const elapsed = getElapsedMinutes(order.created_at);
 if (order.total_amount > 150) return 'Highest'; // VIP / Huge Order
 if (elapsed > (order.estimated_prep_time || 30) + 10) return 'High';
 if (order.items.length >= 5) return 'Medium';
 return 'Normal';
 };

 const priorityColors = {
 'Highest': 'bg-purple-100 text-purple-700 border-purple-200',
 'High': 'bg-red-100 text-red-700 border-red-200',
 'Medium': 'bg-orange-100 text-orange-700 border-orange-200',
 'Normal': 'bg-slate-100 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
 };

 // --- KPI Calculations ---
 const todayOrders = orders.filter(o => new Date(o.created_at).toDateString() === new Date().toDateString());
 const completedToday = todayOrders.filter(o => o.status === 'Completed').length;
 const inProgress = todayOrders.filter(o => ['Received', 'Preparing', 'Ready'].includes(o.status)).length;
 const delayedOrders = todayOrders.filter(o => getElapsedMinutes(o.created_at) > (o.estimated_prep_time || 30) + 10).length;
 const avgPrepTime = completedToday > 0 ? "24m" : "--";
 const efficiency = completedToday > 0 ? Math.round((completedToday / (completedToday + delayedOrders)) * 100) : 100;

 const kanbanColumns = [
 { id: 'Received', title: 'Received', icon: <Clock className="w-5 h-5 text-blue-500" />, borderColor: 'border-blue-500' },
 { id: 'Preparing', title: 'Preparing', icon: <Utensils className="w-5 h-5 text-orange-500" />, borderColor: 'border-orange-500' },
 { id: 'Ready', title: 'Ready', icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />, borderColor: 'border-emerald-500' },
 { id: 'Completed', title: 'Completed', icon: <Check className="w-5 h-5 text-slate-500 dark:text-slate-400" />, borderColor: 'border-slate-500' }
 ];

 return (
 <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors pt-20 px-4 sm:px-6 lg:px-8 pb-20 font-sans flex flex-col">
 <div className="max-w-[1800px] mx-auto w-full flex-1 flex flex-col">
 
 {/* Header & Settings */}
 <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
 <div>
 <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Operations Center</h1>
 <p className="text-slate-500 dark:text-slate-400 font-medium">Real-time restaurant orchestration.</p>
 </div>
 
 <div className="flex items-center gap-4">
 <button 
 onClick={() => setSoundEnabled(!soundEnabled)}
 className={`p-3 rounded-xl transition-all shadow-sm border ${soundEnabled ? 'bg-white dark:bg-transparent transition-colors text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:bg-slate-900 transition-colors' : 'bg-slate-100 text-slate-400 border-slate-200 dark:border-slate-700'}`}
 title="Toggle Live Sound Alerts"
 >
 {soundEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
 </button>
 <div className="bg-white dark:bg-transparent transition-colors p-1.5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 inline-flex">
 <button 
 onClick={() => setActiveTab('kitchen')} 
 className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'kitchen' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-50 dark:bg-slate-900 transition-colors'}`}
 >
 <ChefHat className="w-5 h-5" /> Kitchen
 </button>
 <button 
 onClick={() => setActiveTab('waiter')} 
 className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'waiter' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-50 dark:bg-slate-900 transition-colors'}`}
 >
 <Coffee className="w-5 h-5" /> Floor
 </button>
 </div>
 </div>
 </div>

 {/* KITCHEN PERFORMANCE PANEL */}
 {activeTab === 'kitchen' && (
 <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
 {[
 { label: "Today's Orders", val: todayOrders.length, icon: <FileText className="w-5 h-5 text-blue-500"/> },
 { label: "Completed", val: completedToday, icon: <CheckCircle2 className="w-5 h-5 text-emerald-500"/> },
 { label: "In Progress", val: inProgress, icon: <ChefHat className="w-5 h-5 text-orange-500"/> },
 { label: "Delayed", val: delayedOrders, icon: <AlertCircle className="w-5 h-5 text-red-500"/> },
 { label: "Avg Prep Time", val: avgPrepTime, icon: <Clock className="w-5 h-5 text-purple-500"/> },
 { label: "Efficiency", val: `${efficiency}%`, icon: <TrendingUp className="w-5 h-5 text-indigo-500"/> }
 ].map((kpi, i) => (
 <div key={i} className="glassmorphism dark:glass-dark bg-white/80 dark:bg-transparent transition-colors p-4 rounded-2xl border border-white dark:border-white/10 shadow-sm flex items-center gap-4">
 <div className="p-3 bg-slate-50 dark:bg-slate-900 transition-colors rounded-xl">{kpi.icon}</div>
 <div>
 <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{kpi.label}</p>
 <p className="text-xl font-extrabold text-slate-900 dark:text-white">{kpi.val}</p>
 </div>
 </div>
 ))}
 </motion.div>
 )}

 <div className="flex flex-1 gap-8 min-h-0">
 {/* MAIN KANBAN / WAITER AREA */}
 <div className="flex-1 flex flex-col min-h-0">
 <AnimatePresence mode="wait">
 {/* KITCHEN VIEW */}
 {activeTab === 'kitchen' && (
 <motion.div key="kitchen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col h-full">
 <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-full flex-1">
 {kanbanColumns.map(column => {
 const colOrders = orders.filter(o => o.status === column.id);
 return (
 <div 
 key={column.id} 
 className={`glassmorphism dark:glass-dark bg-white/40 dark:bg-transparent transition-colors border-t-4 ${column.borderColor} rounded-3xl p-4 flex flex-col transition-all duration-300 h-[70vh] min-h-[600px] overflow-hidden`}
 onDragOver={handleDragOver}
 onDragLeave={handleDragLeave}
 onDrop={(e) => handleDrop(e, column.id)}
 >
 <div className="flex justify-between items-center mb-4 px-2 shrink-0">
 <h2 className="font-bold text-slate-800 dark:text-slate-100 text-lg flex items-center gap-2">
 {column.icon} {column.title}
 </h2>
 <span className="bg-slate-200 text-slate-700 dark:text-slate-200 font-bold px-3 py-1 rounded-full text-xs shadow-inner">
 {colOrders.length}
 </span>
 </div>
 
 <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4 hide-scrollbar">
 <AnimatePresence>
 {colOrders.map(order => {
 const priority = getOrderPriority(order);
 const elapsed = getElapsedMinutes(order.created_at);
 const estimated = order.estimated_prep_time || 30;
 const timerStat = getTimerStatus(elapsed, estimated);
 
 return (
 <motion.div 
 layout
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.9 }}
 key={order.id}
 draggable
 onDragStart={(e) => handleDragStart(e, order.id)}
 onDragEnd={handleDragEnd}
 className="bg-white dark:bg-transparent transition-colors p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow group relative overflow-hidden flex flex-col"
 >
 <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
 <GripVertical className="w-5 h-5 text-slate-300" />
 </div>
 
 {/* Badges */}
 <div className="flex justify-between items-start mb-3 gap-2">
 <div className="flex flex-col gap-1">
 <span className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider">#{order.id.toString().padStart(4, '0')}</span>
 <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider w-max ${priorityColors[priority]}`}>{priority}</span>
 </div>
 
 {/* Kitchen Timer */}
 {column.id !== 'Completed' && (
 <div className={`flex flex-col items-end px-3 py-1.5 rounded-xl border ${timerStat.bg}`}>
 <div className={`text-xs font-black flex items-center gap-1 ${timerStat.color}`}>
 <Clock className="w-3 h-3" />
 {elapsed}m / {estimated}m
 </div>
 <div className="w-16 h-1 bg-white/50 dark:bg-transparent transition-colors rounded-full mt-1 overflow-hidden">
 <div className={`h-full ${timerStat.bar}`} style={{ width: `${Math.min((elapsed/estimated)*100, 100)}%` }}></div>
 </div>
 </div>
 )}
 </div>

 {/* Smart Table Assignment Info */}
 <div className="mb-3 p-3 bg-slate-50 dark:bg-slate-900 transition-colors rounded-xl border border-slate-100 dark:border-slate-700">
 {order.table_id ? (
 <div className="flex justify-between items-center">
 <span className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2"><MapPin className="w-4 h-4 text-primary"/> Table {order.table_number || 'T?'}</span>
 <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-transparent transition-colors px-2 py-1 rounded shadow-sm flex items-center gap-1"><Users className="w-3 h-3"/> {order.guests || 1}</span>
 </div>
 ) : (
 <span className="font-bold text-indigo-600 flex items-center gap-2"><Utensils className="w-4 h-4"/> Takeaway Order</span>
 )}
 <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">{order.customer_name || 'Guest'}</div>
 </div>
 
 {/* Order Items */}
 <div className="space-y-2 mb-4">
 {order.items.map(item => (
 <div key={item.id} className="flex justify-between text-sm font-bold border-b border-slate-50 pb-2 last:border-0 last:pb-0">
 <span className="text-slate-700 dark:text-slate-200">{item.menu_item_name}</span>
 <span className="bg-slate-100 text-slate-700 dark:text-slate-200 px-2 py-0.5 rounded font-black shrink-0">x{item.quantity}</span>
 </div>
 ))}
 </div>
 
 {/* Customer Notes */}
 {order.notes && (
 <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-xl text-xs font-bold flex gap-2 items-start">
 <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
 <p>{order.notes}</p>
 </div>
 )}
 
 {/* Actions */}
 <div className="mt-auto pt-2">
 {column.id === 'Received' && (
 <button onClick={() => updateOrderStatus(order.id, 'Preparing')} className="w-full text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl transition-colors shadow-md">
 Start Preparing
 </button>
 )}
 {column.id === 'Preparing' && (
 <button onClick={() => updateOrderStatus(order.id, 'Ready')} className="w-full text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2">
 <CheckCircle2 className="w-4 h-4" /> Mark as Ready
 </button>
 )}
 </div>
 </motion.div>
 );
 })}
 </AnimatePresence>
 
 {colOrders.length === 0 && (
 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-40 border-2 border-dashed border-slate-300/50 rounded-2xl flex flex-col items-center justify-center text-slate-400 text-sm font-medium">
 {column.id === 'Received' ? (
 <>
 <span className="text-2xl mb-2">🎉</span>
 <span>Great Job! No new orders.</span>
 </>
 ) : (
 <span>Drop orders here</span>
 )}
 </motion.div>
 )}
 </div>
 </div>
 )
 })}
 </div>
 </motion.div>
 )}

 {/* WAITER VIEW */}
 {activeTab === 'waiter' && (
 <motion.div key="waiter" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
 {orders.filter(o => o.status === 'Ready' || o.status === 'Served').length === 0 ? (
 <div className="col-span-full glassmorphism dark:glass-dark p-16 text-center text-slate-500 dark:text-slate-400 rounded-3xl border border-dashed border-slate-300 bg-white/50 dark:bg-transparent transition-colors">
 <Coffee className="w-16 h-16 mx-auto text-slate-300 mb-4" />
 <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">All clear!</h3>
 <p className="mt-2">No orders waiting to be served right now.</p>
 </div>
 ) : (
 orders.filter(o => o.status === 'Ready' || o.status === 'Served').map(order => {
 const priority = getOrderPriority(order);
 const elapsed = getElapsedMinutes(order.created_at);
 
 return (
 <motion.div layout key={order.id} className="glassmorphism dark:glass-dark rounded-3xl overflow-hidden bg-white/90 dark:bg-transparent transition-colors border border-white/50 dark:border-white/10 shadow-xl flex flex-col h-full relative group">
 {order.status === 'Ready' && (
 <div className="absolute -right-12 top-6 bg-emerald-500 text-white text-[10px] font-black px-12 py-1 rotate-45 shadow-sm z-10 tracking-widest uppercase">
 Dispatch
 </div>
 )}
 
 <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex flex-col gap-4">
 <div className="flex justify-between items-start">
 <div className="flex flex-col gap-1">
 <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Order #{order.id}</span>
 <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider w-max ${priorityColors[priority]}`}>{priority}</span>
 </div>
 <div className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-full">
 <Clock className="w-3 h-3" /> Wait: {elapsed}m
 </div>
 </div>
 
 <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-inner">
 {order.table_id ? (
 <div className="flex justify-between items-center">
 <span className="font-bold text-xl flex items-center gap-2"><MapPin className="w-5 h-5 text-primary"/> Table {order.table_number || 'T?'}</span>
 <span className="text-sm font-bold bg-white/20 dark:bg-transparent transition-colors px-3 py-1 rounded-lg flex items-center gap-1"><Users className="w-4 h-4"/> {order.guests || 1} Guests</span>
 </div>
 ) : (
 <span className="font-bold text-xl flex items-center gap-2"><Utensils className="w-5 h-5 text-primary"/> Takeaway</span>
 )}
 <div className="text-sm font-medium text-slate-300 mt-2">{order.customer_name || 'Guest Customer'}</div>
 </div>
 </div>
 
 <div className="flex-1 p-6 bg-slate-50/50 dark:bg-slate-900/50 transition-colors space-y-4">
 {order.notes && (
 <div className="bg-yellow-100 border border-yellow-200 text-yellow-800 p-3 rounded-xl text-sm font-bold flex gap-2 items-start shadow-sm">
 <AlertCircle className="w-5 h-5 shrink-0" />
 <p>{order.notes}</p>
 </div>
 )}
 <div>
 <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Deliver Items:</p>
 <ul className="space-y-2">
 {order.items.map(item => (
 <li key={item.id} className="text-slate-800 dark:text-slate-100 font-bold text-sm flex justify-between bg-white dark:bg-transparent transition-colors p-3 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
 <span>{item.menu_item_name}</span>
 <span className="text-primary font-black bg-primary/10 px-2 py-0.5 rounded">x{item.quantity}</span>
 </li>
 ))}
 </ul>
 </div>
 </div>
 
 <div className="p-4 bg-white dark:bg-transparent transition-colors border-t border-slate-100 dark:border-slate-700">
 {order.status === 'Ready' ? (
 <button 
 onClick={() => updateOrderStatus(order.id, 'Served')}
 className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-bold transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 text-lg flex items-center justify-center gap-3"
 >
 Serve Order <ArrowRight className="w-5 h-5" />
 </button>
 ) : (
 <button 
 onClick={() => updateOrderStatus(order.id, 'Completed')}
 className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 dark:text-slate-300 py-4 rounded-2xl font-bold transition-colors text-lg"
 >
 Complete & Clear
 </button>
 )}
 </div>
 </motion.div>
 )
 })
 )}
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>

 {/* LIVE ACTIVITY FEED (RIGHT PANEL) */}
 <div className="w-80 hidden lg:flex flex-col shrink-0">
 <div className="glassmorphism dark:glass-dark bg-white/70 dark:bg-transparent transition-colors rounded-3xl p-6 border border-white/50 dark:border-white/10 h-[70vh] min-h-[600px] flex flex-col shadow-sm">
 <h3 className="font-extrabold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
 <div className="relative flex h-3 w-3">
 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
 <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
 </div>
 Live Activity Feed
 </h3>
 
 <div className="flex-1 overflow-y-auto space-y-4 pr-2 hide-scrollbar relative">
 <div className="absolute left-[11px] top-2 bottom-0 w-0.5 bg-slate-200 z-0"></div>
 <AnimatePresence>
 {activities.map(act => (
 <motion.initial initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} key={act.id} className="relative z-10 flex gap-4">
 <div className="w-6 h-6 rounded-full bg-white dark:bg-transparent transition-colors border-4 border-slate-200 dark:border-slate-700 shrink-0 mt-1 shadow-sm"></div>
 <div className="bg-white dark:bg-transparent transition-colors p-3 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex-1">
 <p className="text-xs font-bold text-primary mb-1">{act.time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
 <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{act.message}</p>
 </div>
 </motion.initial>
 ))}
 {activities.length === 0 && (
 <div className="text-slate-400 text-sm font-medium text-center mt-10">No recent activity.</div>
 )}
 </AnimatePresence>
 </div>
 </div>
 </div>
 </div>
 </div>
 
 {/* Toast Notification */}
 <AnimatePresence>
 {toastMessage && (
 <motion.div 
 initial={{ opacity: 0, y: 50, scale: 0.9 }} 
 animate={{ opacity: 1, y: 0, scale: 1 }} 
 exit={{ opacity: 0, y: 50, scale: 0.9 }}
 className="fixed bottom-8 right-8 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl z-50 font-medium flex items-center gap-3 border border-slate-700"
 >
 <CheckCircle2 className="w-5 h-5 text-emerald-400" />
 {toastMessage}
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 );
};

export default StaffDashboard;
