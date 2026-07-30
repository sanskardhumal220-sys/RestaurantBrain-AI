import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, ClipboardList, UtensilsCrossed, CalendarCheck, CheckCircle, XCircle, TrendingUp, DollarSign, Users, ShoppingBag, LayoutDashboard, Plus, Trash2, Edit } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import {
 Chart as ChartJS,
 CategoryScale,
 LinearScale,
 PointElement,
 LineElement,
 BarElement,
 Title,
 Tooltip,
 Legend,
 Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
 CategoryScale,
 LinearScale,
 PointElement,
 LineElement,
 BarElement,
 Title,
 Tooltip,
 Legend,
 Filler
);

const RestaurantDashboard = () => {
 const { t } = useTranslation();
 const { user } = useContext(AuthContext);
 const [activeTab, setActiveTab] = useState('overview'); // overview, menu, tables, reservations, orders
 
 // Data State
 const [categories, setCategories] = useState([]);
 const [menuItems, setMenuItems] = useState([]);
 const [tables, setTables] = useState([]);
 const [reservations, setReservations] = useState([]);
 const [orders, setOrders] = useState([]);

 // Forms State
 const [newItem, setNewItem] = useState({ name: '', description: '', price: '', category_id: '', is_veg: true, image_url: '', availability: 'Available' });
 const [newCategory, setNewCategory] = useState({ name: '' });
 const [newTable, setNewTable] = useState({ table_number: '', capacity: '' });
 const [statusUpdates, setStatusUpdates] = useState({});
 const [toastMessage, setToastMessage] = useState('');

 const showToast = (msg) => {
 setToastMessage(msg);
 setTimeout(() => setToastMessage(''), 3000);
 };

 useEffect(() => {
 fetchData();
 }, [activeTab]);

 const fetchData = async () => {
 try {
 // Fetch everything for overview tab or specific things for other tabs
 const [catRes, itemRes, tablesRes, resRes, ordersRes] = await Promise.all([
 api.get('/api/menu/categories').catch(() => ({ data: [] })),
 api.get('/api/menu/items').catch(() => ({ data: [] })),
 api.get('/api/tables/').catch(() => ({ data: [] })),
 api.get('/api/reservations/').catch(() => ({ data: [] })),
 api.get('/api/orders/').catch(() => ({ data: [] }))
 ]);
 
 setCategories(catRes.data);
 setMenuItems(itemRes.data);
 setTables(tablesRes.data);
 setReservations(resRes.data);
 setOrders(ordersRes.data);
 
 if (catRes.data.length > 0 && !newItem.category_id) {
 setNewItem(prev => ({ ...prev, category_id: catRes.data[0].id }));
 }
 } catch (err) {
 console.error('Failed to fetch data', err);
 }
 };

 // Menu Management
 const handleAddCategory = async (e) => {
 e.preventDefault();
 try {
 await api.post('/api/menu/categories', newCategory);
 setNewCategory({ name: '' });
 fetchData();
 showToast('Category added successfully');
 } catch (err) { 
      console.error('Failed to add category:', err);
      alert('Failed to add category: ' + (err.response?.data?.message || err.message)); 
    }
 };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const catId = newItem.category_id || categories[0]?.id;
      if (!catId) {
        alert('Please create a category first');
        return;
      }
      const parsedPrice = parseFloat(newItem.price);
      if (isNaN(parsedPrice)) {
        alert('Please enter a valid price');
        return;
      }
      const payload = { 
        ...newItem, 
        price: parsedPrice, 
        category_id: parseInt(catId) 
      };
      await api.post('/api/menu/items', payload);
      setNewItem({ name: '', description: '', price: '', category_id: categories[0]?.id || '', is_veg: true, image_url: '', availability: 'Available' });
      fetchData();
      showToast('Menu item added successfully');
    } catch (err) { 
      console.error('Failed to add item:', err.response?.data || err.message || err);
      alert('Failed to add item: ' + (err.response?.data?.message || err.response?.data?.msg || err.message || 'Unknown error')); 
    }
  };

 const updateItemAvailability = async (id, status) => {
 try {
 await api.put(`/api/menu/items/${id}`, { availability: status });
 fetchData();
 } catch (err) { 
      console.error('Failed to update availability:', err);
      alert('Failed to update availability: ' + (err.response?.data?.message || err.message)); 
    }
 };
 
 const deleteItem = async (id) => {
 if (!confirm('Are you sure?')) return;
 try {
 await api.delete(`/api/menu/items/${id}`);
 fetchData();
 showToast('Item deleted');
 } catch (err) { 
      console.error('Failed to delete item:', err);
      alert('Failed to delete item: ' + (err.response?.data?.message || err.message)); 
    }
 };

 // Tables Management
 const handleAddTable = async (e) => {
 e.preventDefault();
 try {
 await api.post('/api/tables/', { ...newTable, capacity: parseInt(newTable.capacity) });
 setNewTable({ table_number: '', capacity: '' });
 fetchData();
 showToast('Table added successfully');
 } catch (err) { alert('Failed to add table'); }
 };

 // Reservations
 const updateReservationStatus = async (id, status) => {
 try {
 await api.put(`/api/reservations/${id}/status`, { status });
 fetchData();
 showToast(`Reservation ${status.toLowerCase()}`);
 } catch (err) { alert('Failed to update reservation'); }
 };

 const updateOrderStatus = async (orderId) => {
 const newStatus = statusUpdates[orderId];
 if (!newStatus) return; // No change made

 try {
 await api.put(`/api/orders/${orderId}/status`, { status: newStatus });
 showToast("Order status updated successfully.");
 fetchData();
 } catch (err) {
 alert('Failed to update order status');
 }
 };

 // KPI Calculations
 const totalRevenue = orders.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + o.total_amount, 0);
 const activeOrders = orders.filter(o => !['Completed', 'Cancelled'].includes(o.status)).length;
 const pendingReservations = reservations.filter(r => r.status === 'Pending').length;
 const outOfStockItems = menuItems.filter(m => m.availability === 'Out of Stock').length;

 // Chart Data
 const revenueChartData = {
 labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
 datasets: [
 {
 label: 'Revenue',
 data: [1200, 1900, 1500, 2200, 3100, 4200, 3800],
 borderColor: '#10b981',
 backgroundColor: 'rgba(16, 185, 129, 0.1)',
 fill: true,
 tension: 0.4,
 }
 ]
 };
 
 const chartOptions = {
 responsive: true,
 plugins: {
 legend: { display: false },
 },
 scales: {
 y: { display: false },
 x: { grid: { display: false } }
 },
 maintainAspectRatio: false
 };

 const tabs = [
 { id: 'overview', label: t('dash.overview'), icon: <LayoutDashboard className="w-5 h-5" /> },
 { id: 'orders', label: t('dash.active_orders', { defaultValue: 'Active Orders' }), icon: <ClipboardList className="w-5 h-5" /> },
 { id: 'reservations', label: t('dash.reservations', { defaultValue: 'Reservations' }), icon: <CalendarCheck className="w-5 h-5" /> },
 { id: 'menu', label: t('dash.menu_management', { defaultValue: 'Menu Management' }), icon: <UtensilsCrossed className="w-5 h-5" /> },
 { id: 'tables', label: t('dash.tables', { defaultValue: 'Tables' }), icon: <Settings className="w-5 h-5" /> },
 ];

 return (
 <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors pt-20 px-4 sm:px-6 lg:px-8 pb-24 font-sans">
 <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-8 relative mt-4">
 
 {/* Sidebar */}
 <div className="w-full lg:w-72 flex-shrink-0 z-10">
 <div className="glassmorphism dark:glass-dark p-6 sticky top-28 rounded-3xl space-y-8 bg-white/60 dark:bg-transparent transition-colors shadow-sm border border-slate-200 dark:border-slate-700">
 <div>
 <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{t('dash.admin')}</h2>
 <p className="text-sm text-slate-500 dark:text-white mt-1">{t('dash.restaurant_management')}</p>
 </div>
 
 <nav className="flex flex-row overflow-x-auto hide-scrollbar lg:flex-col gap-2 lg:gap-0 lg:space-y-2 pb-2 lg:pb-0 w-full">
 {tabs.map(tab => (
 <button 
 key={tab.id}
 onClick={() => setActiveTab(tab.id)} 
 className={`w-auto lg:w-full shrink-0 text-left px-4 lg:px-5 py-3 lg:py-4 rounded-2xl transition-all duration-300 flex items-center gap-3 lg:gap-4 group relative overflow-hidden ${activeTab === tab.id ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-slate-600 dark:text-white hover:bg-slate-100 hover:text-slate-900 dark:text-white'}`}
 >
 {activeTab === tab.id && (
 <motion.div layoutId="admin-active-tab" className="absolute inset-0 bg-primary z-0" />
 )}
 <span className="relative z-10">{tab.icon}</span>
 <span className="relative z-10 font-semibold">{tab.label}</span>
 </button>
 ))}
 </nav>
 
 <div className="pt-6 border-t border-slate-200 dark:border-slate-700 mt-8">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 dark:text-white font-bold border-2 border-white dark:border-white/10 shadow-sm">
 {user?.full_name?.charAt(0) || 'A'}
 </div>
 <div>
 <p className="font-bold text-sm text-slate-900 dark:text-white">{user?.full_name}</p>
 <p className="text-xs text-slate-500 dark:text-white capitalize">{user?.role}</p>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Main Content */}
 <div className="flex-1 min-w-0 z-0">
 <AnimatePresence mode="wait">
 
 {/* OVERVIEW DASHBOARD */}
 {activeTab === 'overview' && (
 <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="space-y-6">
 
 {/* KPI Cards */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
 {[
 { title: t('dash.total_revenue'), value: `₹${totalRevenue.toFixed(2)}`, icon: <DollarSign className="text-emerald-500" />, trend: '+12.5%', color: 'from-emerald-500/20 to-emerald-500/5', border: 'border-emerald-100' },
 { title: t('dash.active_orders', { defaultValue: 'Active Orders' }), value: activeOrders.toString(), icon: <ShoppingBag className="text-blue-500" />, trend: '+5.2%', color: 'from-blue-500/20 to-blue-500/5', border: 'border-blue-100' },
 { title: t('dash.pending_reservations'), value: pendingReservations.toString(), icon: <Users className="text-orange-500" />, trend: '-2.1%', color: 'from-orange-500/20 to-orange-500/5', border: 'border-orange-100' },
 { title: t('dash.items_out_of_stock'), value: outOfStockItems.toString(), icon: <AlertCircle className="text-red-500" />, trend: '+1', color: 'from-red-500/20 to-red-500/5', border: 'border-red-100', isBad: true }
 ].map((kpi, idx) => (
 <motion.div 
 key={idx} 
 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }}
 className={`glassmorphism dark:glass-dark rounded-3xl p-6 bg-gradient-to-br ${kpi.color} border ${kpi.border} shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow`}
 >
 <div className="flex justify-between items-start mb-4">
 <div className="w-12 h-12 rounded-2xl bg-white/60 dark:bg-transparent transition-colors flex items-center justify-center shadow-sm backdrop-blur-sm">
 {kpi.icon}
 </div>
 <span className={`text-xs font-bold px-2 py-1 rounded-full bg-white/60 dark:bg-transparent transition-colors backdrop-blur-sm ${kpi.isBad ? 'text-red-600' : 'text-emerald-600'}`}>
 {kpi.trend}
 </span>
 </div>
 <h4 className="text-slate-600 dark:text-white text-sm font-semibold mb-1">{kpi.title}</h4>
 <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{kpi.value}</h2>
 </motion.div>
 ))}
 </div>

 {/* Charts & Activity */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 {/* Revenue Chart */}
 <div className="lg:col-span-2 glassmorphism dark:glass-dark rounded-3xl p-6 bg-white/60 dark:bg-transparent transition-colors border border-slate-200 dark:border-slate-700">
 <div className="flex justify-between items-center mb-6">
 <div>
 <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('dash.revenue_overview')}</h3>
 <p className="text-sm text-slate-500 dark:text-white">Last 7 days performance</p>
 </div>
 <button onClick={() => toast('Full reporting module coming soon!', { icon: '📊' })} className="text-primary text-sm font-bold hover:underline">View Report</button>
 </div>
 <div className="h-72 w-full">
 <Line data={revenueChartData} options={chartOptions} />
 </div>
 </div>
 
 {/* Activity Feed */}
 <div className="glassmorphism dark:glass-dark rounded-3xl p-6 bg-white/60 dark:bg-transparent transition-colors border border-slate-200 dark:border-slate-700">
 <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">{t('dash.recent_activity')}</h3>
 <div className="space-y-6">
 {orders.slice(0, 4).map((o, i) => (
 <div key={i} className="flex gap-4 items-start relative">
 {i !== 3 && <div className="absolute top-8 left-[11px] bottom-[-20px] w-px bg-slate-200"></div>}
 <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 z-10 border-2 border-white dark:border-white/10 shadow-sm mt-1">
 <ShoppingBag className="w-3 h-3" />
 </div>
 <div>
 <p className="text-sm font-bold text-slate-800 dark:text-slate-100">New Order #{o.id}</p>
 <p className="text-xs text-slate-500 dark:text-white mt-1">{o.customer_name} • ${o.total_amount.toFixed(2)}</p>
 <span className="text-[10px] font-semibold text-slate-400 mt-1 block">{new Date(o.created_at).toLocaleTimeString()}</span>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 </motion.div>
 )}

 {/* ACTIVE ORDERS */}
 {activeTab === 'orders' && (
 <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
 <div className="glassmorphism dark:glass-dark p-8 rounded-3xl bg-white/60 dark:bg-transparent transition-colors mb-6 border border-white/50 dark:border-white/10">
 <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Active Orders</h2>
 <p className="text-slate-500 dark:text-white">Manage and update customer orders in real-time.</p>
 </div>
 
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 {orders.map(order => (
 <div key={order.id} className="glassmorphism dark:glass-dark p-6 rounded-3xl bg-white dark:bg-transparent transition-colors flex flex-col border border-slate-100 dark:border-slate-700 shadow-md hover:shadow-lg transition-shadow">
 <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-700 pb-4 mb-4">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
 <ShoppingBag className="w-6 h-6" />
 </div>
 <div>
 <div className="flex items-center gap-2 mb-1">
 <span className="text-xs font-bold text-slate-400">#{order.id.toString().padStart(4, '0')}</span>
 <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
 order.status === 'Completed' ? 'bg-green-100 text-green-700' :
 order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
 'bg-blue-100 text-blue-700'
 }`}>{order.status}</span>
 </div>
 <h4 className="font-bold text-slate-900 dark:text-white">{order.customer_name}</h4>
 </div>
 </div>
 
 <div className="flex flex-col gap-2 items-end">
 <div className="relative group">
 <select 
 className="text-sm border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 bg-slate-50 dark:bg-slate-900 transition-colors font-medium text-slate-700 dark:text-white outline-none appearance-none pr-8 cursor-pointer hover:bg-slate-100 transition-colors"
 value={statusUpdates[order.id] || order.status}
 onChange={(e) => setStatusUpdates({...statusUpdates, [order.id]: e.target.value})}
 >
 <option value="Received">Received</option>
 <option value="Preparing">Preparing</option>
 <option value="Ready">Ready</option>
 <option value="Served">Served</option>
 <option value="Completed">Completed</option>
 <option value="Cancelled">Cancelled</option>
 </select>
 </div>
 {(statusUpdates[order.id] && statusUpdates[order.id] !== order.status) && (
 <button 
 onClick={() => updateOrderStatus(order.id)}
 className="text-xs bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-800 transition-all shadow-md font-bold"
 >
 Confirm Update
 </button>
 )}
 </div>
 </div>
 
 <div className="flex-1 mb-6 space-y-3 bg-slate-50 dark:bg-slate-900 transition-colors p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
 <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Order Items</h5>
 {order.items.map(item => (
 <div key={item.id} className="flex justify-between text-sm">
 <div className="flex gap-3 items-center">
 <span className="w-6 h-6 bg-white dark:bg-transparent transition-colors rounded flex items-center justify-center font-bold text-slate-700 dark:text-white shadow-sm border border-slate-100 dark:border-slate-700">{item.quantity}</span>
 <span className="text-slate-800 dark:text-slate-100 font-medium">{item.menu_item_name}</span>
 </div>
 <span className="text-slate-600 dark:text-white font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
 </div>
 ))}
 </div>

 <div className="flex justify-between items-center mt-auto px-2">
 <span className="font-bold text-slate-500 dark:text-white text-sm uppercase tracking-wider">Total</span>
 <span className="font-extrabold text-2xl text-slate-900 dark:text-white">${order.total_amount.toFixed(2)}</span>
 </div>
 </div>
 ))}
 </div>
 </motion.div>
 )}

 {/* RESERVATIONS */}
 {activeTab === 'reservations' && (
 <motion.div key="reservations" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
 <div className="glassmorphism dark:glass-dark p-8 rounded-3xl bg-white/60 dark:bg-transparent transition-colors mb-6 border border-white/50 dark:border-white/10">
 <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Reservations</h2>
 <p className="text-slate-500 dark:text-white">Approve or reject customer table bookings.</p>
 </div>
 
 <div className="grid gap-4 md:grid-cols-2">
 {reservations.map(res => (
 <div key={res.id} className="bg-white dark:bg-transparent transition-colors rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-full">
 <div>
 <div className="flex justify-between items-start mb-4">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 dark:text-white">
 <CalendarCheck className="w-5 h-5" />
 </div>
 <div>
 <h4 className="font-bold text-slate-900 dark:text-white text-lg leading-none">{res.customer_name}</h4>
 <span className="text-xs font-bold text-slate-400">RES #{res.id}</span>
 </div>
 </div>
 <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm ${
 res.status === 'Pending' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
 res.status === 'Approved' ? 'bg-green-50 text-green-700 border border-green-200' : 
 'bg-red-50 text-red-700 border border-red-200'
 }`}>{res.status}</span>
 </div>
 
 <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900 transition-colors p-4 rounded-2xl border border-slate-100 dark:border-slate-700 mb-6">
 <div>
 <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Date</p>
 <p className="font-semibold text-slate-800 dark:text-slate-100">{res.date}</p>
 </div>
 <div>
 <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Time</p>
 <p className="font-semibold text-primary">{res.time}</p>
 </div>
 <div>
 <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Guests</p>
 <p className="font-semibold text-slate-800 dark:text-slate-100">{res.guests} Persons</p>
 </div>
 {res.table_number && (
 <div>
 <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Table</p>
 <p className="font-semibold text-slate-800 dark:text-slate-100">#{res.table_number}</p>
 </div>
 )}
 </div>
 </div>
 
 {res.status === 'Pending' && (
 <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
 <button 
 onClick={() => updateReservationStatus(res.id, 'Approved')} 
 className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-colors shadow-md shadow-green-500/20"
 >
 <CheckCircle className="w-5 h-5" /> Approve
 </button>
 <button 
 onClick={() => updateReservationStatus(res.id, 'Rejected')} 
 className="flex-1 bg-white dark:bg-transparent transition-colors border border-red-200 text-red-600 hover:bg-red-50 py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-colors"
 >
 <XCircle className="w-5 h-5" /> Reject
 </button>
 </div>
 )}
 </div>
 ))}
 </div>
 </motion.div>
 )}

 {/* MENU MANAGEMENT */}
 {activeTab === 'menu' && (
 <motion.div key="menu" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
 
 <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
 {/* Add Item Form */}
 <div className="xl:col-span-2 glassmorphism dark:glass-dark p-8 rounded-3xl bg-white/60 dark:bg-transparent transition-colors border border-white/50 dark:border-white/10">
 <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white"><Plus className="w-5 h-5 bg-primary/10 text-primary rounded-full p-0.5" /> Add New Menu Item</h3>
 <form onSubmit={handleAddItem} className="space-y-5">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
 <div>
 <label className="block text-xs font-bold text-slate-500 dark:text-white uppercase tracking-wider mb-2">Item Name</label>
 <input type="text" required placeholder="e.g. Truffle Fries" className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-transparent transition-colors focus:ring-2 focus:ring-primary/20 outline-none transition-all" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
 </div>
 <div>
 <label className="block text-xs font-bold text-slate-500 dark:text-white uppercase tracking-wider mb-2">Price (₹)</label>
 <input type="number" step="0.01" required placeholder="0.00" className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-transparent transition-colors focus:ring-2 focus:ring-primary/20 outline-none transition-all" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} />
 </div>
 <div>
 <label className="block text-xs font-bold text-slate-500 dark:text-white uppercase tracking-wider mb-2">Category</label>
 <select required className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-transparent transition-colors focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer" value={newItem.category_id} onChange={e => setNewItem({...newItem, category_id: e.target.value})}>
 {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
 </select>
 </div>
 <div>
 <label className="block text-xs font-bold text-slate-500 dark:text-white uppercase tracking-wider mb-2">Type</label>
 <select required className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-transparent transition-colors focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer" value={newItem.is_veg} onChange={e => setNewItem({...newItem, is_veg: e.target.value === 'true'})}>
 <option value="true">Vegetarian</option>
 <option value="false">Non-Vegetarian</option>
 </select>
 </div>
 </div>
 <div>
 <label className="block text-xs font-bold text-slate-500 dark:text-white uppercase tracking-wider mb-2">Image URL</label>
 <input type="text" placeholder="https://example.com/image.jpg" className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-transparent transition-colors focus:ring-2 focus:ring-primary/20 outline-none transition-all" value={newItem.image_url} onChange={e => setNewItem({...newItem, image_url: e.target.value})} />
 </div>
 <div>
 <label className="block text-xs font-bold text-slate-500 dark:text-white uppercase tracking-wider mb-2">Description</label>
 <textarea placeholder="Write a mouth-watering description..." rows="3" className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-transparent transition-colors focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} />
 </div>
 <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex justify-end">
 <button type="submit" className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-slate-800 transition-all flex items-center gap-2">
 Add Item
 </button>
 </div>
 </form>
 </div>

 {/* Add Category Form */}
 <div className="glassmorphism dark:glass-dark p-8 rounded-3xl bg-white/60 dark:bg-transparent transition-colors border border-white/50 dark:border-white/10 h-max">
 <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white"><Settings className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full p-0.5" /> Add Category</h3>
 <form onSubmit={handleAddCategory} className="space-y-5">
 <div>
 <label className="block text-xs font-bold text-slate-500 dark:text-white uppercase tracking-wider mb-2">Category Name</label>
 <input type="text" required placeholder="e.g. Beverages" className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-transparent transition-colors focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" value={newCategory.name} onChange={e => setNewCategory({name: e.target.value})} />
 </div>
 <button type="submit" className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all">Add Category</button>
 </form>
 
 <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
 <h4 className="text-sm font-bold text-slate-700 dark:text-white mb-4">Existing Categories</h4>
 <div className="flex flex-wrap gap-2">
 {categories.map(c => (
 <span key={c.id} className="bg-white dark:bg-transparent transition-colors border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-white shadow-sm">{c.name}</span>
 ))}
 </div>
 </div>
 </div>
 </div>

 {/* Menu List */}
 <div className="glassmorphism dark:glass-dark rounded-3xl bg-white/70 dark:bg-transparent transition-colors border border-white/50 dark:border-white/10 overflow-hidden shadow-sm">
 <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-white/50 dark:bg-transparent transition-colors flex justify-between items-center">
 <h3 className="text-xl font-bold text-slate-900 dark:text-white">Current Menu</h3>
 <span className="bg-slate-100 text-slate-600 dark:text-white px-3 py-1 text-sm font-bold rounded-lg">{menuItems.length} Items</span>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="bg-slate-50/50 dark:bg-slate-900/50 transition-colors">
 <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-white uppercase tracking-wider">Item Details</th>
 <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-white uppercase tracking-wider">Category</th>
 <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-white uppercase tracking-wider">Price</th>
 <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-white uppercase tracking-wider">Status</th>
 <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-white uppercase tracking-wider text-right">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100">
 {menuItems.map(item => (
 <tr key={item.id} className="hover:bg-slate-50/50 dark:bg-slate-900/50 transition-colors transition-colors">
 <td className="py-4 px-6">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
 {item.image_url ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><UtensilsCrossed className="w-4 h-4" /></div>}
 </div>
 <div>
 <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
 {item.name} 
 {item.is_veg ? <span className="w-2 h-2 rounded-full bg-green-500"></span> : <span className="w-2 h-2 rounded-full bg-red-500"></span>}
 </p>
 <p className="text-xs text-slate-500 dark:text-white truncate w-48">{item.description}</p>
 </div>
 </div>
 </td>
 <td className="py-4 px-6 text-slate-600 dark:text-white font-medium"><span className="bg-slate-100 px-2 py-1 rounded-md text-xs">{item.category_name}</span></td>
 <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">${item.price.toFixed(2)}</td>
 <td className="py-4 px-6">
 <select 
 className={`text-xs font-bold rounded-xl px-3 py-1.5 border appearance-none pr-6 cursor-pointer ${
 item.availability === 'Available' ? 'bg-green-50 text-green-700 border-green-200' :
 item.availability === 'Low Stock' ? 'bg-orange-50 text-orange-700 border-orange-200' :
 'bg-red-50 text-red-700 border-red-200'
 }`}
 value={item.availability}
 onChange={(e) => updateItemAvailability(item.id, e.target.value)}
 >
 <option value="Available">Available</option>
 <option value="Low Stock">Low Stock</option>
 <option value="Out of Stock">Out of Stock</option>
 </select>
 </td>
 <td className="py-4 px-6 text-right">
 <div className="flex justify-end gap-2">
 <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
 <button onClick={() => deleteItem(item.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </motion.div>
 )}

 {/* TABLES */}
 {activeTab === 'tables' && (
 <motion.div key="tables" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
 <div className="glassmorphism dark:glass-dark p-8 rounded-3xl bg-white/60 dark:bg-transparent transition-colors mb-8 border border-white/50 dark:border-white/10 max-w-2xl">
 <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white"><Plus className="w-5 h-5 bg-slate-900 text-white rounded-full p-0.5" /> Add New Table</h3>
 <form onSubmit={handleAddTable} className="flex flex-col sm:flex-row gap-4 items-start sm:items-end w-full">
 <div className="flex-1">
 <label className="block text-xs font-bold text-slate-500 dark:text-white uppercase tracking-wider mb-2">Table Identifier</label>
 <input type="text" required placeholder="e.g. T1 or Patio-1" className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-transparent transition-colors focus:ring-2 focus:ring-slate-900/20 outline-none" value={newTable.table_number} onChange={e => setNewTable({...newTable, table_number: e.target.value})} />
 </div>
 <div className="w-full sm:w-32">
 <label className="block text-xs font-bold text-slate-500 dark:text-white uppercase tracking-wider mb-2">Seats</label>
 <input type="number" required placeholder="e.g. 4" min="1" className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-transparent transition-colors focus:ring-2 focus:ring-slate-900/20 outline-none" value={newTable.capacity} onChange={e => setNewTable({...newTable, capacity: e.target.value})} />
 </div>
 <button type="submit" className="w-full sm:w-auto bg-slate-900 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-slate-800 transition-all">Add Table</button>
 </form>
 </div>

 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
 {tables.map(table => (
 <motion.div whileHover={{ y: -5 }} key={table.id} className="glassmorphism dark:glass-dark p-6 rounded-3xl bg-white dark:bg-transparent transition-colors border border-slate-100 dark:border-slate-700 shadow-sm text-center flex flex-col items-center justify-center relative overflow-hidden group">
 
 {table.status === 'Available' ? (
 <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/10 rounded-bl-full -mr-8 -mt-8"></div>
 ) : (
 <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-bl-full -mr-8 -mt-8"></div>
 )}
 
 <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 border-4 shadow-inner ${table.status === 'Available' ? 'bg-green-50 border-green-100 text-green-600' : 'bg-red-50 border-red-100 text-red-600'}`}>
 <span className="text-2xl font-extrabold">{table.table_number}</span>
 </div>
 
 <div className="flex items-center gap-2 text-slate-500 dark:text-white font-medium mb-3 bg-slate-50 dark:bg-slate-900 transition-colors px-3 py-1 rounded-lg text-sm">
 <Users className="w-4 h-4" /> {table.capacity} Seats
 </div>
 
 <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${table.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{table.status}</span>
 </motion.div>
 ))}
 </div>
 </motion.div>
 )}

 </AnimatePresence>
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
 <CheckCircle className="w-5 h-5 text-green-400" />
 {toastMessage}
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 );
};

// Lucide React fallback for AlertCircle
const AlertCircle = (props) => (
 <svg
 {...props}
 xmlns="http://www.w3.org/2000/svg"
 width="24"
 height="24"
 viewBox="0 0 24 24"
 fill="none"
 stroke="currentColor"
 strokeWidth="2"
 strokeLinecap="round"
 strokeLinejoin="round"
 >
 <circle cx="12" cy="12" r="10" />
 <line x1="12" y1="8" x2="12" y2="12" />
 <line x1="12" y1="16" x2="12.01" y2="16" />
 </svg>
);

export default RestaurantDashboard;
