import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles, TrendingUp, AlertTriangle, TrendingDown, Send, User, ChevronRight, Activity, DollarSign, ShoppingBag, Clock, HeartPulse, Lightbulb, History } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

const AIDashboard = () => {
 const { t } = useTranslation();
 const [summary, setSummary] = useState(null);
 const [insights, setInsights] = useState(null);
 const [loadingInsights, setLoadingInsights] = useState(true);
 const [health, setHealth] = useState(null);
 const [loadingHealth, setLoadingHealth] = useState(true);
 const [recommendations, setRecommendations] = useState(null);
 const [loadingRecs, setLoadingRecs] = useState(true);
 const [timeline, setTimeline] = useState(null);
 const [loadingTimeline, setLoadingTimeline] = useState(true);
 
 // Chat state
 const [messages, setMessages] = useState([
 { role: 'ai', text: t('ai_dash.hello') }
 ]);
 const [inputMessage, setInputMessage] = useState('');
 const [isTyping, setIsTyping] = useState(false);
 const chatEndRef = useRef(null);

 useEffect(() => {
 fetchSummary();
 fetchInsights();
 fetchHealth();
 fetchRecommendations();
 fetchTimeline();
 }, []);

 useEffect(() => {
 chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
 }, [messages]);

 const fetchSummary = async () => {
 try {
 const res = await api.get('/api/ai/summary');
 setSummary(res.data);
 } catch (err) {
 console.error("Failed to fetch summary", err);
 }
 };

 const fetchInsights = async () => {
 setLoadingInsights(true);
 try {
 const res = await api.get('/api/ai/insights');
 setInsights(res.data.insights || []);
 } catch (err) {
 console.error("Failed to fetch insights", err);
 } finally {
 setLoadingInsights(false);
 }
 };

 const fetchHealth = async () => {
 setLoadingHealth(true);
 try {
 const res = await api.get('/api/ai/health-score');
 setHealth(res.data);
 } catch (err) {
 console.error("Failed to fetch health", err);
 } finally {
 setLoadingHealth(false);
 }
 };

 const fetchRecommendations = async () => {
 setLoadingRecs(true);
 try {
 const res = await api.get('/api/ai/recommendations');
 setRecommendations(res.data.recommendations || []);
 } catch (err) {
 console.error("Failed to fetch recommendations", err);
 } finally {
 setLoadingRecs(false);
 }
 };

 const fetchTimeline = async () => {
 setLoadingTimeline(true);
 try {
 const res = await api.get('/api/ai/timeline');
 setTimeline(res.data.timeline || []);
 } catch (err) {
 console.error("Failed to fetch timeline", err);
 } finally {
 setLoadingTimeline(false);
 }
 };

 const handleSendMessage = async (e) => {
 e.preventDefault();
 if (!inputMessage.trim()) return;

 const userMsg = inputMessage.trim();
 setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
 setInputMessage('');
 setIsTyping(true);

 try {
 const res = await api.post('/api/ai/chat', { message: userMsg });
 setMessages(prev => [...prev, { role: 'ai', text: res.data.reply }]);
 } catch (err) {
 setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I'm having trouble connecting right now." }]);
 } finally {
 setIsTyping(false);
 }
 };

 return (
 <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors pt-20 px-4 sm:px-6 lg:px-8 pb-20 font-sans">
 <div className="max-w-[1600px] mx-auto mt-4">
 
 {/* Header */}
 <div className="mb-8 flex items-center justify-between">
 <div>
 <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
 <span className="bg-primary/10 p-2 rounded-xl"><Bot className="w-8 h-8 text-primary" /></span>
 {t('ai_dash.title')}
 </h1>
 <p className="text-slate-500 dark:text-slate-400 mt-1">{t('ai_dash.subtitle')}</p>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 
 {/* Left Column: Summary & Insights */}
 <div className="lg:col-span-2 space-y-8">
 
 {/* Business Summary */}
 <div>
 <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
 <Activity className="w-5 h-5 text-accent" /> {t('ai_dash.snapshot')}
 </h2>
 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
 <div className="glassmorphism dark:glass-dark p-5 rounded-3xl bg-white dark:bg-transparent transition-colors border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
 <div className="flex items-center gap-2 mb-2">
 <DollarSign className="w-4 h-4 text-emerald-500" />
 <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{t('ai_dash.revenue')}</span>
 </div>
 <p className="text-2xl font-extrabold text-slate-900 dark:text-white">₹{summary?.metrics?.total_revenue || '0.00'}</p>
 </div>
 <div className="glassmorphism dark:glass-dark p-5 rounded-3xl bg-white dark:bg-transparent transition-colors border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
 <div className="flex items-center gap-2 mb-2">
 <ShoppingBag className="w-4 h-4 text-blue-500" />
 <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{t('ai_dash.orders')}</span>
 </div>
 <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{summary?.metrics?.total_orders || 0}</p>
 </div>
 <div className="glassmorphism dark:glass-dark p-5 rounded-3xl bg-white dark:bg-transparent transition-colors border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
 <div className="flex items-center gap-2 mb-2">
 <Clock className="w-4 h-4 text-orange-500" />
 <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{t('ai_dash.pending')}</span>
 </div>
 <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{summary?.metrics?.pending_orders || 0}</p>
 </div>
 <div className="glassmorphism dark:glass-dark p-5 rounded-3xl bg-white dark:bg-transparent transition-colors border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
 <div className="flex items-center gap-2 mb-2">
 <AlertTriangle className="w-4 h-4 text-red-500" />
 <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{t('ai_dash.stock_alerts')}</span>
 </div>
 <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
 {(summary?.inventory?.low_stock?.length || 0) + (summary?.inventory?.out_of_stock?.length || 0)}
 </p>
 </div>
 </div>
 </div>

 {/* Health Score & Timeline Grid */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 {/* Restaurant Health */}
 <div>
 <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
 <HeartPulse className="w-5 h-5 text-rose-500" /> {t('ai_dash.health')}
 </h2>
 <div className="glassmorphism dark:glass-dark rounded-3xl bg-white dark:bg-transparent transition-colors border border-slate-100 dark:border-slate-700 p-8 shadow-sm flex flex-col items-center justify-center text-center h-[300px]">
 {loadingHealth ? (
 <div className="animate-pulse flex flex-col items-center">
 <div className="w-24 h-24 rounded-full bg-slate-200 mb-4"></div>
 <div className="h-4 bg-slate-200 rounded w-32"></div>
 </div>
 ) : health ? (
 <>
 <div className="relative mb-6">
 <svg className="w-32 h-32 transform -rotate-90">
 <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
 <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="377" strokeDashoffset={377 - (377 * health.score) / 100} className={health.score >= 90 ? "text-emerald-500" : health.score >= 70 ? "text-amber-500" : "text-rose-500"} />
 </svg>
 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-extrabold text-slate-800 dark:text-slate-100">
 {health.score}
 </div>
 </div>
 <span className={`px-4 py-1.5 rounded-full text-sm font-bold mb-3 ${health.score >= 90 ? 'bg-emerald-100 text-emerald-700' : health.score >= 70 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
 {health.status}
 </span>
 <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{health.explanation}</p>
 </>
 ) : (
 <p className="text-slate-500 dark:text-slate-400">{t('ai_dash.unavailable')}</p>
 )}
 </div>
 </div>

 {/* AI Timeline */}
 <div>
 <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
 <History className="w-5 h-5 text-indigo-500" /> {t('ai_dash.timeline')}
 </h2>
 <div className="glassmorphism dark:glass-dark rounded-3xl bg-white dark:bg-transparent transition-colors border border-slate-100 dark:border-slate-700 p-6 shadow-sm h-[300px] overflow-y-auto hide-scrollbar">
 {loadingTimeline ? (
 <div className="space-y-4 animate-pulse">
 {[1, 2, 3].map(i => (
 <div key={i} className="flex gap-4">
 <div className="w-2 h-2 mt-2 bg-slate-200 rounded-full" />
 <div className="flex-1 space-y-2">
 <div className="h-3 bg-slate-200 rounded w-1/4" />
 <div className="h-4 bg-slate-200 rounded w-3/4" />
 </div>
 </div>
 ))}
 </div>
 ) : (
 <div className="relative border-l border-slate-200 dark:border-slate-700 ml-3 space-y-6">
 {timeline && timeline.map((event, idx) => (
 <motion.div key={idx} initial={{opacity:0, x:-10}} animate={{opacity:1, x:0}} transition={{delay: idx * 0.1}} className="relative pl-6">
 <span className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full ring-4 ring-white ${event.type === 'order' ? 'bg-blue-500' : event.type === 'reservation' ? 'bg-purple-500' : event.type === 'alert' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
 <div className="text-xs font-bold text-slate-400 mb-1">{event.time}</div>
 <div className="text-sm font-medium text-slate-800 dark:text-slate-100">{event.title}</div>
 </motion.div>
 ))}
 </div>
 )}
 </div>
 </div>
 </div>

 {/* Insights & Recommendations Grid */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 {/* Smart Insights */}
 <div>
 <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
 <Sparkles className="w-5 h-5 text-yellow-500" /> {t('ai_dash.insights')}
 </h2>
 <div className="space-y-4">
 {loadingInsights ? (
 <div className="flex justify-center items-center h-40 glassmorphism dark:glass-dark bg-white/50 dark:bg-transparent transition-colors rounded-3xl border border-slate-100 dark:border-slate-700">
 <div className="flex space-x-2">
 <div className="w-3 h-3 bg-primary rounded-full animate-bounce" />
 <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
 <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
 </div>
 </div>
 ) : (
 insights && insights.map((insight, idx) => {
 const typeStyles = {
 positive: 'bg-emerald-50 border-emerald-100 text-emerald-800',
 warning: 'bg-orange-50 border-orange-100 text-orange-800',
 info: 'bg-blue-50 border-blue-100 text-blue-800'
 };
 const Icon = insight.type === 'positive' ? TrendingUp : (insight.type === 'warning' ? AlertTriangle : TrendingDown);
 
 return (
 <motion.div 
 key={idx}
 initial={{ opacity: 0, x: -20 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: idx * 0.1 }}
 className={`p-5 rounded-3xl border ${typeStyles[insight.type] || typeStyles.info} shadow-sm flex gap-4`}
 >
 <div className="mt-0.5"><Icon className="w-5 h-5 opacity-80" /></div>
 <div>
 <h3 className="font-bold text-sm mb-1">{insight.title}</h3>
 <p className="text-sm opacity-90">{insight.description}</p>
 </div>
 </motion.div>
 )
 })
 )}
 </div>
 </div>

 {/* Recommendations */}
 <div>
 <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
 <Lightbulb className="w-5 h-5 text-amber-500" /> {t('ai_dash.recommendations')}
 </h2>
 <div className="space-y-4">
 {loadingRecs ? (
 <div className="flex justify-center items-center h-40 glassmorphism dark:glass-dark bg-white/50 dark:bg-transparent transition-colors rounded-3xl border border-slate-100 dark:border-slate-700">
 <div className="flex space-x-2">
 <div className="w-3 h-3 bg-amber-500 rounded-full animate-bounce" />
 <div className="w-3 h-3 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
 <div className="w-3 h-3 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
 </div>
 </div>
 ) : (
 recommendations && recommendations.map((rec, idx) => (
 <motion.div 
 key={idx}
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: idx * 0.1 }}
 className="p-5 rounded-3xl bg-white dark:bg-transparent transition-colors border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all flex gap-4"
 >
 <div className="mt-0.5 bg-amber-50 p-1.5 rounded-lg h-fit"><Lightbulb className="w-4 h-4 text-amber-500" /></div>
 <div>
 <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-1">{rec.title}</h3>
 <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{rec.description}</p>
 </div>
 </motion.div>
 ))
 )}
 </div>
 </div>
 </div>
 
 </div>

 {/* Right Column: AI Business Copilot */}
 <div className="lg:col-span-1 h-[calc(100vh-160px)] min-h-[600px]">
 <div className="glassmorphism dark:glass-dark rounded-3xl bg-white dark:bg-transparent transition-colors shadow-xl border border-slate-200 dark:border-slate-700 h-full flex flex-col overflow-hidden relative">
 {/* Header */}
 <div className="bg-slate-900 text-white p-5 flex items-center justify-between z-10">
 <div className="flex items-center gap-3">
 <div className="bg-white/20 dark:bg-transparent transition-colors p-2 rounded-full">
 <Bot className="w-5 h-5 text-white" />
 </div>
 <div>
 <h3 className="font-bold">{t('ai_dash.copilot')}</h3>
 <p className="text-xs text-slate-300">{t('ai_dash.powered_by')}</p>
 </div>
 </div>
 </div>

 {/* Chat Area */}
 <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50 dark:bg-slate-900/50 transition-colors hide-scrollbar">
 <AnimatePresence>
 {messages.map((msg, idx) => (
 <motion.div 
 key={idx}
 initial={{ opacity: 0, y: 10, scale: 0.95 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
 >
 <div className={`max-w-[85%] rounded-2xl p-4 ${
 msg.role === 'user' 
 ? 'bg-primary text-white rounded-tr-sm shadow-md shadow-primary/20' 
 : 'bg-white dark:bg-transparent transition-colors border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-sm shadow-sm'
 }`}>
 <p className="text-sm leading-relaxed">{msg.text}</p>
 </div>
 </motion.div>
 ))}
 
 {isTyping && (
 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
 <div className="bg-white dark:bg-transparent transition-colors border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-sm p-4 shadow-sm flex items-center gap-2">
 <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" />
 <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-75" />
 <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-150" />
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 <div ref={chatEndRef} />
 </div>

 {/* Input Area */}
 <div className="p-4 bg-white dark:bg-transparent transition-colors border-t border-slate-100 dark:border-slate-700">
 <form onSubmit={handleSendMessage} className="relative flex items-center">
 <input 
 type="text" 
 value={inputMessage}
 onChange={(e) => setInputMessage(e.target.value)}
 placeholder={t('ai_dash.chat_placeholder')}
 className="w-full bg-slate-50 dark:bg-slate-900 transition-colors border border-slate-200 dark:border-slate-700 rounded-full pl-5 pr-12 py-4 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
 />
 <button 
 type="submit"
 disabled={!inputMessage.trim() || isTyping}
 className="absolute right-2 bg-primary text-white p-2.5 rounded-full hover:bg-primary-dark disabled:opacity-50 transition-all shadow-md"
 >
 <Send className="w-4 h-4 ml-0.5" />
 </button>
 </form>
 </div>
 </div>
 </div>
 
 </div>
 </div>
 </div>
 );
};

export default AIDashboard;
