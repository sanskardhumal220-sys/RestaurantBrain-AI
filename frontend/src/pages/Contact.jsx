import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

const Contact = () => {
 const [formData, setFormData] = useState({
 name: '',
 email: '',
 subject: '',
 message: ''
 });
 const [loading, setLoading] = useState(false);
 const [showToast, setShowToast] = useState(false);

 const handleSubmit = (e) => {
 e.preventDefault();
 setLoading(true);
 // Simulate API call
 setTimeout(() => {
 setLoading(false);
 setShowToast(true);
 setFormData({ name: '', email: '', subject: '', message: '' });
 setTimeout(() => setShowToast(false), 5000);
 }, 1500);
 };

 return (
 <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors pt-32 px-4 sm:px-6 lg:px-8 pb-24 font-sans">
 <div className="max-w-6xl mx-auto">
 <div className="text-center mb-16">
 <motion.h1 
 initial={{ opacity: 0, y: -20 }}
 animate={{ opacity: 1, y: 0 }}
 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight"
 >
 Get in Touch
 </motion.h1>
 <motion.p 
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 transition={{ delay: 0.1 }}
 className="mt-4 text-xl text-slate-500 dark:text-slate-200 max-w-2xl mx-auto"
 >
 Have questions about RestaurantBrain AI? Our team is here to help you transform your restaurant.
 </motion.p>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
 {/* Contact Info */}
 <motion.div 
 initial={{ opacity: 0, x: -20 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: 0.2 }}
 className="space-y-8"
 >
 <div className="glassmorphism dark:glass-dark bg-white/70 dark:bg-transparent transition-colors p-8 rounded-[2rem] border border-white/50 dark:border-white/10 shadow-lg h-full flex flex-col justify-center space-y-10">
 <div className="flex items-start gap-4">
 <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
 <Mail className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Email Us</h3>
 <p className="text-slate-500 dark:text-slate-200 mb-2">Our friendly team is here to help.</p>
 <a href="mailto:sanskardhumal220@gmail.com" className="text-primary font-semibold hover:underline">sanskardhumal220@gmail.com</a>
 </div>
 </div>

 <div className="flex items-start gap-4">
 <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
 <Phone className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Call Us</h3>
 <p className="text-slate-500 dark:text-slate-200 mb-2">Mon-Fri from 8am to 5pm.</p>
 <a href="tel:+917489912345" className="text-primary font-semibold hover:underline">+91 74899 12345</a>
 </div>
 </div>

 <div className="flex items-start gap-4">
 <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
 <MapPin className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Visit Us</h3>
 <p className="text-slate-500 dark:text-slate-200 mb-2">Come say hello at our HQ.</p>
 <p className="text-primary font-semibold">Hari Shankarpuram<br/>Gwalior, M.P.</p>
 </div>
 </div>
 </div>
 </motion.div>

 {/* Contact Form */}
 <motion.div 
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: 0.3 }}
 className="lg:col-span-2"
 >
 <div className="glassmorphism dark:glass-dark bg-white/70 dark:bg-transparent transition-colors p-8 md:p-12 rounded-[2rem] border border-white/50 dark:border-white/10 shadow-xl">
 <form onSubmit={handleSubmit} className="space-y-6">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div>
 <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Your Name</label>
 <input 
 type="text" 
 required
 className="w-full px-5 py-4 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-transparent transition-colors outline-none transition-all shadow-sm"
 placeholder="John Doe"
 value={formData.name}
 onChange={(e) => setFormData({...formData, name: e.target.value})}
 />
 </div>
 <div>
 <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Email Address</label>
 <input 
 type="email" 
 required
 className="w-full px-5 py-4 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-transparent transition-colors outline-none transition-all shadow-sm"
 placeholder="john@example.com"
 value={formData.email}
 onChange={(e) => setFormData({...formData, email: e.target.value})}
 />
 </div>
 </div>

 <div>
 <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Subject</label>
 <input 
 type="text" 
 required
 className="w-full px-5 py-4 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-transparent transition-colors outline-none transition-all shadow-sm"
 placeholder="How can we help?"
 value={formData.subject}
 onChange={(e) => setFormData({...formData, subject: e.target.value})}
 />
 </div>

 <div>
 <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Message</label>
 <textarea 
 required
 rows="5"
 className="w-full px-5 py-4 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-transparent transition-colors outline-none transition-all shadow-sm resize-none"
 placeholder="Tell us about your restaurant's needs..."
 value={formData.message}
 onChange={(e) => setFormData({...formData, message: e.target.value})}
 />
 </div>

 <button 
 type="submit" 
 disabled={loading}
 className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
 >
 {loading ? (
 <div className="w-6 h-6 border-2 border-white/20 dark:border-white/10 border-t-white rounded-full animate-spin"></div>
 ) : (
 <>
 Send Message <Send className="w-5 h-5 ml-1" />
 </>
 )}
 </button>
 </form>
 </div>
 </motion.div>
 </div>
 </div>

 {/* Success Toast */}
 <AnimatePresence>
 {showToast && (
 <motion.div 
 initial={{ opacity: 0, y: 50, scale: 0.9 }} 
 animate={{ opacity: 1, y: 0, scale: 1 }} 
 exit={{ opacity: 0, y: 50, scale: 0.9 }}
 className="fixed bottom-8 right-8 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl z-50 font-medium flex items-center gap-3 border border-slate-700"
 >
 <CheckCircle className="w-6 h-6 text-green-400" />
 Message sent successfully! We'll be in touch soon.
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 );
};

export default Contact;
