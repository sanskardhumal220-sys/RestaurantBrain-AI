import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, Calendar, Clock, Users, X, Plus, Minus, Check, ChevronRight, Utensils, Compass, History, MapPin, Mic, MicOff, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import api from '../services/api';

const CustomerDashboard = () => {
 const { t } = useTranslation();
 const { user } = useContext(AuthContext);
 const { cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useContext(CartContext);
 
 const [activeTab, setActiveTab] = useState('menu'); // menu, tracking, reservation, my_reservations
 const [cartOpen, setCartOpen] = useState(false);
 const [categories, setCategories] = useState([]);
 const [menuItems, setMenuItems] = useState([]);
 const [searchQuery, setSearchQuery] = useState('');
 const [selectedCategory, setSelectedCategory] = useState('All');
 const [filterVeg, setFilterVeg] = useState(false);
 
 const [orders, setOrders] = useState([]);
 const [reservationData, setReservationData] = useState({ date: '', time: '', guests: 2 });
 const [myReservations, setMyReservations] = useState([]);
 
 // Voice Ordering State
 const [isListening, setIsListening] = useState(false);
 const [isProcessingVoice, setIsProcessingVoice] = useState(false);
 const [voiceTranscript, setVoiceTranscript] = useState('');
 
 // Checkout states
 const [orderNotes, setOrderNotes] = useState('');
 const [guests, setGuests] = useState(1);
 const [orderType, setOrderType] = useState('Takeaway');
 
 // Fetch Menu and Orders
 useEffect(() => {
 const fetchMenu = async () => {
 try {
 const [catRes, itemsRes] = await Promise.all([
 api.get('/api/menu/categories'),
 api.get('/api/menu/items')
 ]);
 setCategories(catRes.data);
 setMenuItems(itemsRes.data);
 } catch (err) {
 console.error('Failed to fetch menu', err);
 }
 };
 fetchMenu();
 }, []);

 useEffect(() => {
 let interval;
 if (activeTab === 'tracking') {
 const fetchOrders = async () => {
 try {
 const res = await api.get('/api/orders/');
 setOrders(res.data);
 } catch (err) {
 console.error('Failed to fetch orders', err);
 }
 };
 fetchOrders();
 interval = setInterval(fetchOrders, 5000); // Poll every 5s
 } else if (activeTab === 'my_reservations') {
 const fetchReservations = async () => {
 try {
 const res = await api.get('/api/reservations/');
 setMyReservations(res.data);
 } catch (err) {
 console.error('Failed to fetch reservations', err);
 }
 };
 fetchReservations();
 interval = setInterval(fetchReservations, 5000); // Poll every 5s
 }
 return () => clearInterval(interval);
 }, [activeTab]);

 const filteredItems = menuItems.filter(item => {
 const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
 const matchesCategory = selectedCategory === 'All' || item.category_name === selectedCategory;
 const matchesVeg = !filterVeg || item.is_veg;
 return matchesSearch && matchesCategory && matchesVeg;
 });

 const handlePlaceOrder = async () => {
 if (cart.length === 0) return;
 try {
 const payload = {
 items: cart.map(i => ({ menu_item_id: i.id, quantity: i.quantity })),
 notes: orderNotes,
 guests: orderType === 'Dine-In' ? parseInt(guests) : 1
 };
 await api.post('/api/orders/', payload);
 clearCart();
 setCartOpen(false);
 setOrderNotes('');
 setGuests(1);
 setActiveTab('tracking');
 } catch (err) {
 console.error('Failed to place order', err);
 alert('Failed to place order');
 }
 };

 const handleBookTable = async (e) => {
 e.preventDefault();
 try {
 await api.post('/api/reservations/', reservationData);
 alert('Reservation submitted successfully!');
 setReservationData({ date: '', time: '', guests: 2 });
 setActiveTab('my_reservations');
 } catch (err) {
 console.error('Failed to book table', err);
 alert('Failed to submit reservation');
 }
 };

 // --- AI Voice Ordering Logic ---
 const startListening = () => {
 const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
 if (!SpeechRecognition) {
 alert("Your browser does not support voice recognition.");
 return;
 }
 const recognition = new SpeechRecognition();
 recognition.lang = 'en-US';
 recognition.interimResults = false;
 recognition.maxAlternatives = 1;
 
 recognition.onstart = () => {
 setIsListening(true);
 setVoiceTranscript('');
 };
 
 recognition.onresult = async (event) => {
 const transcript = event.results[0][0].transcript;
 setVoiceTranscript(transcript);
 setIsListening(false);
 processVoiceOrder(transcript);
 };
 
 recognition.onerror = (event) => {
 console.error("Speech recognition error", event.error);
 setIsListening(false);
 };
 
 recognition.onend = () => {
 setIsListening(false);
 };
 
 recognition.start();
 };

 const processVoiceOrder = async (transcript) => {
 setIsProcessingVoice(true);
 try {
 const res = await api.post('/api/ai/parse-order', { transcript });
 const items = res.data.items;
 if (items && items.length > 0) {
 let addedNames = [];
 items.forEach(orderItem => {
 // addToCart increments by 1 in context, so we call it 'quantity' times
 for(let i=0; i<orderItem.quantity; i++) {
 addToCart(orderItem.item);
 }
 addedNames.push(`${orderItem.quantity}x ${orderItem.item.name}`);
 });
 alert(`AI added to cart: ${addedNames.join(', ')}`);
 setCartOpen(true);
 } else {
 alert("AI couldn't find those items on our menu. Please try again.");
 }
 } catch (err) {
 console.error("Error processing voice order", err);
 alert("Error understanding the order. Please try again or use the manual menu.");
 } finally {
 setIsProcessingVoice(false);
 }
 };
 // -------------------------------


 const menuTabs = [
 { id: 'menu', label: t('dash.explore_menu'), icon: <Compass className="w-5 h-5" /> },
 { id: 'tracking', label: t('dash.live_tracking'), icon: <Clock className="w-5 h-5" /> },
 { id: 'reservation', label: t('dash.book_table'), icon: <Calendar className="w-5 h-5" /> },
 { id: 'my_reservations', label: t('dash.my_bookings'), icon: <History className="w-5 h-5" /> },
 ];

 return (
 <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors pt-20 px-4 sm:px-6 lg:px-8 pb-24 font-sans">
 <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 relative mt-4">
 
 {/* Beautiful Side Navigation */}
 <div className="w-full md:w-72 flex-shrink-0 z-10">
 <div className="glassmorphism dark:glass-dark p-6 sticky top-28 rounded-3xl space-y-8 bg-white/60 dark:bg-transparent transition-colors">
 <div>
 <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard</h2>
 <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Welcome back, {user?.full_name || 'Guest'}</p>
 </div>
 
 <nav className="flex flex-row overflow-x-auto hide-scrollbar md:flex-col gap-2 md:gap-0 md:space-y-2 pb-2 md:pb-0 w-full">
 {menuTabs.map(tab => (
 <button 
 key={tab.id}
 onClick={() => setActiveTab(tab.id)} 
 className={`w-auto md:w-full shrink-0 text-left px-4 md:px-5 py-3 md:py-4 rounded-2xl transition-all duration-300 flex items-center gap-3 md:gap-4 group relative overflow-hidden ${activeTab === tab.id ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 hover:text-slate-900 dark:text-white'}`}
 >
 {activeTab === tab.id && (
 <motion.div layoutId="active-tab-bg" className="absolute inset-0 bg-primary z-0" />
 )}
 <span className="relative z-10">{tab.icon}</span>
 <span className="relative z-10 font-semibold">{tab.label}</span>
 {activeTab === tab.id && (
 <ChevronRight className="hidden md:block w-4 h-4 ml-auto relative z-10 opacity-70" />
 )}
 </button>
 ))}
 </nav>
 
 {/* Cart Button in Sidebar */}
 <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
 <button 
 onClick={() => setCartOpen(true)} 
 className="w-full text-left px-5 py-4 rounded-2xl transition-all duration-300 flex justify-between items-center bg-slate-900 text-white hover:bg-slate-800 shadow-xl hover:shadow-2xl hover:-translate-y-1 group"
 >
 <div className="flex items-center gap-4">
 <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
 <span className="font-semibold">{t('dash.your_cart')}</span>
 </div>
 {cart.length > 0 && (
 <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-inner">{cart.reduce((a,c) => a + c.quantity, 0)}</span>
 )}
 </button>
 </div>
 </div>
 </div>

 {/* Main Content Area */}
 <div className="flex-1 min-w-0 z-0">
 <AnimatePresence mode="wait">
 
 {/* DIGITAL MENU */}
 {activeTab === 'menu' && (
 <motion.div key="menu" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
 
 {/* Search & Filters */}
 <div className="glassmorphism dark:glass-dark p-6 rounded-3xl bg-white/60 dark:bg-transparent transition-colors mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center border border-white/50 dark:border-white/10 shadow-sm">
 <div className="flex items-center w-full sm:w-auto flex-1">
 <div className="relative w-full group">
 <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-primary transition-colors" />
 <input 
 type="text" 
 placeholder={t('dash.search_placeholder')} 
 className="w-full pl-12 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-transparent transition-colors transition-all outline-none font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 shadow-sm"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 />
 </div>
 
 <button 
 onClick={startListening}
 disabled={isProcessingVoice}
 className={`ml-3 p-3 rounded-2xl shrink-0 flex items-center justify-center transition-all ${
 isListening ? 'bg-red-500 text-white animate-pulse shadow-lg' : 
 isProcessingVoice ? 'bg-slate-200 text-slate-500 dark:text-slate-400 cursor-not-allowed' : 
 'bg-primary text-white hover:bg-primary-dark shadow-md hover:shadow-lg hover:-translate-y-0.5'
 }`}
 title="AI Voice Ordering"
 >
 {isProcessingVoice ? <Loader2 className="w-6 h-6 animate-spin" /> : 
 isListening ? <MicOff className="w-6 h-6" /> : 
 <Mic className="w-6 h-6" />}
 </button>
 </div>
 
 <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 hide-scrollbar items-center">
 <button 
 onClick={() => setSelectedCategory('All')}
 className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${selectedCategory === 'All' ? 'bg-slate-900 text-white shadow-md' : 'bg-white dark:bg-transparent transition-colors text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:bg-slate-900 transition-colors'}`}
 >All</button>
 {categories.map(cat => (
 <button 
 key={cat.id} 
 onClick={() => setSelectedCategory(cat.name)}
 className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${selectedCategory === cat.name ? 'bg-slate-900 text-white shadow-md' : 'bg-white dark:bg-transparent transition-colors text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:bg-slate-900 transition-colors'}`}
 >{cat.name}</button>
 ))}
 
 <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block"></div>
 
 <label className="flex items-center gap-2 bg-green-50 px-5 py-2.5 rounded-full text-sm font-semibold text-green-700 border border-green-200 cursor-pointer select-none hover:bg-green-100 transition-colors shrink-0">
 <input type="checkbox" checked={filterVeg} onChange={(e) => setFilterVeg(e.target.checked)} className="rounded text-green-600 focus:ring-green-500 w-4 h-4 border-green-300" />
 Veg Only
 </label>
 </div>
 </div>

 {/* Food Grid */}
 {filteredItems.length === 0 ? (
 <div className="text-center py-20">
 <Utensils className="w-16 h-16 mx-auto text-slate-300 mb-4" />
 <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">{t('dash.no_items')}</h3>
 <p className="text-slate-500 dark:text-slate-400 mt-2">{t('dash.try_adjusting')}</p>
 </div>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
 {filteredItems.map((item, idx) => (
 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: idx * 0.05 }}
 key={item.id} 
 className="glassmorphism dark:glass-dark bg-white/70 dark:bg-transparent transition-colors overflow-hidden flex flex-col group rounded-3xl border border-white/50 dark:border-white/10 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500"
 >
 <div className="h-56 bg-slate-100 relative overflow-hidden rounded-t-3xl">
 {item.image_url ? (
 <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
 ) : (
 <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-200">
 <Utensils className="w-8 h-8 opacity-20" />
 </div>
 )}
 <div className="absolute top-4 right-4 flex gap-2">
 {item.is_veg ? (
 <span className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 backdrop-blur-md">
 <span className="w-1.5 h-1.5 rounded-full bg-white dark:bg-transparent transition-colors"></span> VEG
 </span>
 ) : (
 <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 backdrop-blur-md">
 <span className="w-1.5 h-1.5 rounded-full bg-white dark:bg-transparent transition-colors"></span> NON-VEG
 </span>
 )}
 </div>
 
 {/* Popular / Recommended Tag (Mocked condition for demo) */}
 {item.price > 15 && (
 <div className="absolute top-4 left-4">
 <span className="bg-white/90 dark:bg-transparent transition-colors backdrop-blur-md text-slate-900 dark:text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
 Popular
 </span>
 </div>
 )}
 </div>
 
 <div className="p-6 flex-1 flex flex-col">
 <div className="flex justify-between items-start mb-3">
 <h4 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{item.name}</h4>
 <span className="font-extrabold text-lg text-slate-900 dark:text-white">${item.price.toFixed(2)}</span>
 </div>
 <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-6 flex-1 leading-relaxed">{item.description}</p>
 
 <div className="flex items-center justify-between mt-auto">
 <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${
 item.availability === 'Available' ? 'bg-green-50 text-green-700 border-green-200' : 
 item.availability === 'Low Stock' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-red-50 text-red-700 border-red-200'
 }`}>
 {item.availability}
 </span>
 
 {item.availability !== 'Out of Stock' ? (
 <button 
 onClick={() => addToCart(item)}
 className="bg-slate-900 text-white p-3 rounded-xl hover:bg-primary hover:scale-105 active:scale-95 transition-all shadow-md group-hover:shadow-lg"
 >
 <Plus className="w-5 h-5" />
 </button>
 ) : (
 <span className="text-slate-400 text-sm font-medium bg-slate-100 px-4 py-2 rounded-xl">{t('dash.sold_out')}</span>
 )}
 </div>
 </div>
 </motion.div>
 ))}
 </div>
 )}
 </motion.div>
 )}

 {/* LIVE TRACKING */}
 {activeTab === 'tracking' && (
 <motion.div key="tracking" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
 <div className="glassmorphism dark:glass-dark p-8 rounded-3xl bg-white/60 dark:bg-transparent transition-colors mb-8 border border-white/50 dark:border-white/10">
 <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">{t('dash.live_tracking')}</h2>
 <p className="text-slate-500 dark:text-slate-400">{t('dash.watch_journey')}</p>
 </div>
 
 <div className="space-y-8">
 {orders.length === 0 ? (
 <div className="glassmorphism dark:glass-dark p-16 text-center rounded-3xl border border-dashed border-slate-300">
 <Compass className="w-16 h-16 mx-auto text-slate-300 mb-4" />
 <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">{t('dash.no_active_orders')}</h3>
 <p className="text-slate-500 dark:text-slate-400 mt-2">{t('dash.hungry')}</p>
 <button onClick={() => setActiveTab('menu')} className="mt-6 bg-primary text-white px-6 py-3 rounded-full font-bold hover:bg-primary-dark transition-colors shadow-lg">{t('dash.explore_menu')}</button>
 </div>
 ) : (
 orders.map(order => {
 const statuses = ['Received', 'Preparing', 'Ready', 'Served', 'Completed'];
 const currentIdx = statuses.indexOf(order.status);
 
 return (
 <div key={order.id} className="glassmorphism dark:glass-dark p-8 rounded-3xl bg-white/70 dark:bg-transparent transition-colors relative overflow-hidden border border-white/50 dark:border-white/10 shadow-lg shadow-slate-200/50">
 
 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
 <div>
 <div className="flex items-center gap-3 mb-1">
 <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Order #{order.id.toString().padStart(4, '0')}</span>
 <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
 </div>
 <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{t('dash.currently')}: <span className="text-primary">{order.status}</span></h3>
 </div>
 
 <div className="bg-white dark:bg-transparent transition-colors p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4 min-w-[160px] justify-center">
 <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
 <Clock className="w-6 h-6" />
 </div>
 <div>
 <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{t('dash.est_prep')}</span>
 <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{order.estimated_prep_time}<span className="text-sm font-medium text-slate-500 dark:text-slate-400 ml-1">{t('dash.min')}</span></span>
 </div>
 </div>
 </div>

 {/* Animated Progress Timeline */}
 <div className="relative pt-8 pb-12 px-4 sm:px-12">
 <div className="absolute top-12 left-4 sm:left-12 right-4 sm:right-12 h-2 bg-slate-100 rounded-full overflow-hidden">
 <motion.div 
 initial={{ width: 0 }}
 animate={{ width: `${(currentIdx / (statuses.length - 1)) * 100}%` }}
 transition={{ duration: 1, ease: "easeOut" }}
 className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
 ></motion.div>
 </div>
 
 <div className="relative flex justify-between w-full z-10">
 {statuses.map((status, idx) => {
 const isCompleted = idx < currentIdx;
 const isCurrent = idx === currentIdx;
 return (
 <div key={status} className="flex flex-col items-center">
 <motion.div 
 initial={{ scale: 0 }}
 animate={{ scale: 1 }}
 transition={{ delay: idx * 0.1 }}
 className={`w-10 h-10 rounded-full flex items-center justify-center -mt-4 shadow-sm transition-colors duration-500 ${isCompleted ? 'bg-primary text-white shadow-primary/30' : isCurrent ? 'bg-white dark:bg-transparent transition-colors border-4 border-primary text-primary shadow-xl' : 'bg-white dark:bg-transparent transition-colors border-4 border-slate-100 dark:border-slate-700 text-slate-300'}`}
 >
 {isCompleted ? <Check className="w-5 h-5" /> : <div className={`w-3 h-3 rounded-full ${isCurrent ? 'bg-primary animate-pulse' : 'bg-transparent'}`}></div>}
 </motion.div>
 <span className={`text-sm font-bold mt-4 transition-colors duration-500 ${isCompleted || isCurrent ? 'text-slate-900 dark:text-white' : 'text-slate-400'} ${isCurrent ? 'scale-110' : ''}`}>{status}</span>
 </div>
 )
 })}
 </div>
 </div>

 <div className="mt-8 bg-slate-50 dark:bg-slate-900 transition-colors p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
 <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4 uppercase tracking-wider">Order Summary</h4>
 <div className="space-y-3">
 {order.items.map(item => (
 <div key={item.id} className="flex justify-between items-center text-slate-600 dark:text-slate-300">
 <div className="flex items-center gap-3">
 <span className="bg-slate-200 text-slate-700 dark:text-slate-200 w-6 h-6 rounded flex items-center justify-center text-xs font-bold">{item.quantity}x</span>
 <span className="font-medium text-slate-800 dark:text-slate-100">{item.menu_item_name}</span>
 </div>
 <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
 </div>
 ))}
 </div>
 <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-end">
 <span className="text-slate-500 dark:text-slate-400 font-medium">Total Paid</span>
 <span className="text-2xl font-extrabold text-slate-900 dark:text-white">${order.total_amount.toFixed(2)}</span>
 </div>
 </div>
 </div>
 )
 })
 )}
 </div>
 </motion.div>
 )}

 {/* RESERVATION */}
 {activeTab === 'reservation' && (
 <motion.div key="reservation" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4 }}>
 <div className="glassmorphism dark:glass-dark p-6 sm:p-10 max-w-2xl mx-auto rounded-[2rem] bg-white/70 dark:bg-transparent transition-colors border border-white/50 dark:border-white/10 shadow-xl relative overflow-hidden">
 
 {/* Decorative Elements */}
 <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
 
 <div className="text-center mb-10 relative z-10">
 <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
 <Calendar className="w-10 h-10 text-primary" />
 </div>
 <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{t('dash.reserve_table')}</h2>
 <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg">{t('dash.experience_vibe')}</p>
 </div>
 
 <form onSubmit={handleBookTable} className="space-y-6 relative z-10">
 <div className="bg-white dark:bg-transparent transition-colors p-2 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col">
 <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900 transition-colors rounded-xl mb-2">
 <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Select Date</label>
 <input 
 type="date" 
 required 
 className="w-full bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white font-bold text-lg p-0 outline-none"
 value={reservationData.date}
 onChange={(e) => setReservationData({...reservationData, date: e.target.value})}
 />
 </div>
 
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
 <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900 transition-colors rounded-xl">
 <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Time</label>
 <input 
 type="time" 
 required 
 className="w-full bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white font-bold text-lg p-0 outline-none"
 value={reservationData.time}
 onChange={(e) => setReservationData({...reservationData, time: e.target.value})}
 />
 </div>
 <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900 transition-colors rounded-xl">
 <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Guests</label>
 <input 
 type="number" 
 min="1" max="20"
 required 
 className="w-full bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white font-bold text-lg p-0 outline-none"
 value={reservationData.guests}
 onChange={(e) => setReservationData({...reservationData, guests: parseInt(e.target.value)})}
 />
 </div>
 </div>
 </div>
 
 <button 
 type="submit" 
 className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
 >
 Confirm Reservation
 </button>
 <p className="text-center text-sm text-slate-400 mt-4">No credit card required. Free cancellation.</p>
 </form>
 </div>
 </motion.div>
 )}

 {/* MY RESERVATIONS */}
 {activeTab === 'my_reservations' && (
 <motion.div key="my_reservations" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
 <div className="glassmorphism dark:glass-dark p-8 rounded-3xl bg-white/60 dark:bg-transparent transition-colors mb-8 border border-white/50 dark:border-white/10">
 <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">My Bookings</h2>
 <p className="text-slate-500 dark:text-slate-400">Manage your upcoming and past reservations.</p>
 </div>

 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
 {myReservations.length === 0 ? (
 <div className="col-span-full glassmorphism dark:glass-dark p-12 text-center text-slate-500 dark:text-slate-400 rounded-3xl border border-dashed border-slate-300">
 <Calendar className="w-16 h-16 mx-auto text-slate-300 mb-4" />
 <p className="text-lg font-medium">You have no upcoming reservations.</p>
 <button onClick={() => setActiveTab('reservation')} className="mt-4 text-primary font-bold hover:underline">Book a Table Now</button>
 </div>
 ) : (
 myReservations.map(res => (
 <motion.div whileHover={{ y: -5 }} key={res.id} className="glassmorphism dark:glass-dark p-6 rounded-3xl bg-white/80 dark:bg-transparent transition-colors border border-white/50 dark:border-white/10 shadow-lg shadow-slate-200/50 flex flex-col h-full">
 <div className="flex justify-between items-start mb-6">
 <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
 res.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
 res.status === 'Approved' ? 'bg-green-100 text-green-700' : 
 res.status === 'Rejected' ? 'bg-red-100 text-red-700' : 
 'bg-blue-100 text-blue-700'
 }`}>{res.status}</span>
 <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">#{res.id.toString().padStart(4, '0')}</span>
 </div>
 
 <div className="mb-6 flex-1">
 <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{res.date}</h3>
 <p className="text-lg text-primary font-semibold mb-4">{res.time}</p>
 
 <div className="flex items-center gap-4 text-slate-600 dark:text-slate-300 font-medium bg-slate-50 dark:bg-slate-900 transition-colors p-3 rounded-xl border border-slate-100 dark:border-slate-700">
 <div className="flex items-center gap-2"><Users className="w-4 h-4 text-slate-400" /> {res.guests} Guests</div>
 {res.table_number && (
 <div className="flex items-center gap-2 border-l border-slate-300 pl-4"><MapPin className="w-4 h-4 text-slate-400" /> Table {res.table_number}</div>
 )}
 </div>
 </div>
 
 {res.status === 'Approved' && (
 <div className="mt-auto p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs font-semibold flex gap-2">
 <Check className="w-4 h-4 shrink-0" />
 Confirmed. Arrive 10 mins early.
 </div>
 )}
 </motion.div>
 ))
 )}
 </div>
 </motion.div>
 )}

 </AnimatePresence>
 </div>
 </div>

 {/* CART DRAWER */}
 <AnimatePresence>
 {cartOpen && (
 <>
 <motion.div 
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 onClick={() => setCartOpen(false)}
 className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
 />
 <motion.div 
 initial={{ x: '100%', opacity: 0 }}
 animate={{ x: 0, opacity: 1 }}
 exit={{ x: '100%', opacity: 0 }}
 transition={{ type: 'spring', damping: 25, stiffness: 200 }}
 className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-transparent transition-colors shadow-2xl z-50 flex flex-col border-l border-slate-200 dark:border-slate-700"
 >
 <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white/90 dark:bg-transparent transition-colors backdrop-blur-md z-10 sticky top-0">
 <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
 <div className="p-2 bg-primary/10 rounded-xl"><ShoppingCart className="w-6 h-6 text-primary" /></div>
 Your Order
 </h2>
 <button onClick={() => setCartOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
 <X className="w-6 h-6 text-slate-500 dark:text-slate-400" />
 </button>
 </div>
 
 <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-900 transition-colors">
 {cart.length === 0 ? (
 <div className="h-full flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
 <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mb-6">
 <ShoppingCart className="w-10 h-10 text-slate-400" />
 </div>
 <p className="text-xl font-medium text-slate-800 dark:text-slate-100 mb-2">Your cart is empty</p>
 <p className="text-center text-sm mb-6">Looks like you haven't added anything to your order yet.</p>
 <button onClick={() => {setCartOpen(false); setActiveTab('menu');}} className="px-6 py-3 bg-white dark:bg-transparent transition-colors border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:bg-slate-900 transition-colors transition-colors shadow-sm">Browse Menu</button>
 </div>
 ) : (
 <div className="space-y-4">
 {cart.map(item => (
 <motion.div layout key={item.id} className="bg-white dark:bg-transparent transition-colors p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex gap-4">
 <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden shrink-0">
 {item.image_url ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><Utensils className="w-6 h-6" /></div>}
 </div>
 <div className="flex-1 flex flex-col justify-between">
 <div className="flex justify-between items-start">
 <h4 className="font-bold text-slate-800 dark:text-slate-100 leading-tight pr-4">{item.name}</h4>
 <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-red-500 transition-colors -mr-2"><X className="w-4 h-4" /></button>
 </div>
 <div className="flex justify-between items-center mt-2">
 <span className="font-bold text-primary">${item.price.toFixed(2)}</span>
 
 <div className="flex items-center bg-slate-100 rounded-full p-1 border border-slate-200 dark:border-slate-700 shadow-inner">
 <button onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 flex items-center justify-center hover:bg-white dark:bg-transparent transition-colors rounded-full text-slate-600 dark:text-slate-300 transition-colors shadow-sm"><Minus className="w-3 h-3" /></button>
 <span className="w-8 text-center font-bold text-sm text-slate-800 dark:text-slate-100">{item.quantity}</span>
 <button onClick={() => updateQuantity(item.id, 1)} className="w-7 h-7 flex items-center justify-center hover:bg-white dark:bg-transparent transition-colors rounded-full text-slate-600 dark:text-slate-300 transition-colors shadow-sm"><Plus className="w-3 h-3" /></button>
 </div>
 </div>
 </div>
 </motion.div>
 ))}
 </div>
 )}
 </div>
 
 {cart.length > 0 && (
 <div className="p-6 bg-white dark:bg-transparent transition-colors border-t border-slate-100 dark:border-slate-700 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
 <div className="space-y-3 mb-6">
 <div className="flex justify-between text-slate-500 dark:text-slate-400 text-sm font-medium">
 <span>Subtotal</span>
 <span>${getCartTotal().toFixed(2)}</span>
 </div>
 <div className="flex justify-between text-slate-500 dark:text-slate-400 text-sm font-medium">
 <span>Taxes & Fees</span>
 <span>Calculated at checkout</span>
 </div>
 <div className="h-px w-full bg-slate-100 my-2"></div>
 <div className="flex justify-between items-center text-lg font-bold">
 <span className="text-slate-800 dark:text-slate-100">Total</span>
 <span className="text-2xl text-slate-900 dark:text-white">${getCartTotal().toFixed(2)}</span>
 </div>
 </div>
 
 <div className="mb-6 space-y-4">
 <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
 <button onClick={() => setOrderType('Takeaway')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${orderType === 'Takeaway' ? 'bg-white dark:bg-transparent transition-colors shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>Takeaway</button>
 <button onClick={() => setOrderType('Dine-In')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${orderType === 'Dine-In' ? 'bg-white dark:bg-transparent transition-colors shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>Dine-In</button>
 </div>
 {orderType === 'Dine-In' && (
 <div>
 <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Number of Guests</label>
 <input type="number" min="1" value={guests} onChange={(e) => setGuests(e.target.value)} className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 transition-colors focus:bg-white dark:bg-transparent transition-colors focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
 </div>
 )}
 <div>
 <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Order Notes</label>
 <textarea 
 placeholder="e.g. Extra spicy, no onions..." 
 rows="2"
 value={orderNotes}
 onChange={(e) => setOrderNotes(e.target.value)}
 className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 transition-colors focus:bg-white dark:bg-transparent transition-colors focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none text-sm"
 />
 </div>
 </div>
 
 <button 
 onClick={handlePlaceOrder}
 className="w-full relative overflow-hidden group bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex justify-center items-center gap-2"
 >
 <span className="relative z-10">Checkout & Place Order</span>
 <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
 <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
 </button>
 </div>
 )}
 </motion.div>
 </>
 )}
 </AnimatePresence>

 </div>
 );
};

export default CustomerDashboard;
