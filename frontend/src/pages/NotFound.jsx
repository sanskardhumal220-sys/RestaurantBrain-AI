import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, SearchX } from 'lucide-react';

const NotFound = () => {
 return (
 <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors flex items-center justify-center px-4 relative overflow-hidden font-sans">
 {/* Background Ornaments */}
 <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
 <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent/20 blur-[100px] rounded-full pointer-events-none" />

 <motion.div 
 initial={{ opacity: 0, scale: 0.9, y: 20 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 transition={{ duration: 0.5 }}
 className="max-w-2xl w-full text-center relative z-10"
 >
 <div className="glassmorphism dark:glass-dark bg-white/60 dark:bg-transparent transition-colors p-12 md:p-16 rounded-[3rem] border border-white/80 dark:border-white/10 shadow-2xl backdrop-blur-xl">
 <motion.div 
 initial={{ rotate: -10 }}
 animate={{ rotate: 0 }}
 transition={{ type: "spring", stiffness: 200, damping: 10 }}
 className="w-24 h-24 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner"
 >
 <SearchX className="w-12 h-12" />
 </motion.div>
 
 <h1 className="text-7xl md:text-9xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">
 4<span className="text-primary">0</span>4
 </h1>
 
 <h2 className="text-2xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">
 Looks like this table is empty!
 </h2>
 
 <p className="text-lg text-slate-600 dark:text-slate-300 mb-10 max-w-md mx-auto leading-relaxed">
 The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Let's get you back to the main menu.
 </p>

 <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
 <button 
 onClick={() => window.history.back()}
 className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-transparent transition-colors border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:bg-slate-900 transition-colors transition-all shadow-sm"
 >
 <ArrowLeft className="w-5 h-5" /> Go Back
 </button>
 
 <Link 
 to="/"
 className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
 >
 <Home className="w-5 h-5" /> Return Home
 </Link>
 </div>
 </div>
 </motion.div>
 </div>
 );
};

export default NotFound;
