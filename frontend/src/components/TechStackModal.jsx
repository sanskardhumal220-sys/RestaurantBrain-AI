import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Code2, Database, Layout, Server, Sparkles, Key } from 'lucide-react';

const techInfo = {
 react: {
 name: 'React',
 icon: <Layout className="w-8 h-8 text-blue-500" />,
 description: 'We use React to build a dynamic, fast, and responsive user interface. Its component-based architecture allows us to create the complex dashboards for Restaurant Owners, Customers, and Staff with seamless real-time updates.',
 color: 'bg-blue-50 text-blue-600 border-blue-200'
 },
 flask: {
 name: 'Flask',
 icon: <Server className="w-8 h-8 text-slate-800 dark:text-slate-100" />,
 description: 'Flask powers our robust backend API. As a lightweight Python framework, it allows us to securely handle authentication, business logic, menu management, and real-time order tracking efficiently.',
 color: 'bg-slate-100 text-slate-800 dark:text-slate-100 border-slate-300'
 },
 tailwind: {
 name: 'Tailwind CSS',
 icon: <Code2 className="w-8 h-8 text-cyan-500" />,
 description: 'Tailwind CSS is our utility-first styling engine. It enables us to craft the beautiful glassmorphism dark:glass-dark designs, responsive layouts, and modern aesthetics that make RestaurantBrain AI feel like a premium SaaS product.',
 color: 'bg-cyan-50 text-cyan-600 border-cyan-200'
 },
 gemini: {
 name: 'Gemini AI',
 icon: <Sparkles className="w-8 h-8 text-indigo-500" />,
 description: 'Google Gemini AI is the brain behind our platform. It powers the AI Business Copilot, analyzing sales data, generating smart business insights, and providing actionable recommendations to restaurant owners.',
 color: 'bg-indigo-50 text-indigo-600 border-indigo-200'
 },
 mysql: {
 name: 'MySQL',
 icon: <Database className="w-8 h-8 text-orange-500" />,
 description: 'MySQL serves as our reliable relational database. It securely stores user accounts, restaurant menus, live active orders, and historical reservation data ensuring data integrity and fast queries.',
 color: 'bg-orange-50 text-orange-600 border-orange-200'
 },
 jwt: {
 name: 'JWT',
 icon: <Key className="w-8 h-8 text-purple-500" />,
 description: 'JSON Web Tokens (JWT) manage our secure authentication system. It ensures that Restaurant Owners, Staff, and Customers only have access to their specific dashboards and authorized data.',
 color: 'bg-purple-50 text-purple-600 border-purple-200'
 }
};

const TechStackModal = ({ isOpen, onClose, techId }) => {
 const tech = techInfo[techId];

 return (
 <AnimatePresence>
 {isOpen && tech && (
 <>
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 onClick={onClose}
 className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
 />
 <motion.div
 initial={{ opacity: 0, scale: 0.9, y: 20 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.9, y: 20 }}
 className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-[101] p-4"
 >
 <div className="glassmorphism dark:glass-dark bg-white/90 dark:bg-transparent transition-colors p-8 rounded-3xl shadow-2xl border border-white/50 dark:border-white/10 relative">
 <button 
 onClick={onClose}
 className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 dark:text-slate-300 transition-colors"
 >
 <X className="w-5 h-5" />
 </button>
 
 <div className="flex flex-col items-center text-center">
 <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-sm border ${tech.color}`}>
 {tech.icon}
 </div>
 <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
 {tech.name}
 </h3>
 <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
 {tech.description}
 </p>
 
 <button 
 onClick={onClose}
 className="mt-8 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl w-full"
 >
 Got it!
 </button>
 </div>
 </div>
 </motion.div>
 </>
 )}
 </AnimatePresence>
 );
};

export default TechStackModal;
