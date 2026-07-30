import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../context/AuthContext';
import TechStackModal from '../TechStackModal';

const Footer = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const [showScroll, setShowScroll] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    const checkScrollTop = () => {
      if (!showScroll && window.scrollY > 400) {
        setShowScroll(true);
      } else if (showScroll && window.scrollY <= 400) {
        setShowScroll(false);
      }
    };
    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, [showScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <>
      <footer className="relative mt-20 pt-20 pb-10 overflow-hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 z-0 pointer-events-none"></div>
        <div className="absolute -top-[500px] left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
            
            {/* Brand & Mission Section */}
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp}
              className="lg:col-span-5 space-y-6"
            >
              <Link to="/" className="inline-block" onClick={scrollToTop}>
                <div className="flex items-center gap-2 group">
                  <div className="bg-slate-900 text-white w-10 h-10 rounded-xl flex justify-center items-center font-bold text-xl shadow-lg group-hover:bg-primary transition-colors">
                    R
                  </div>
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    RestaurantBrain AI<span className="text-primary text-2xl leading-none">.</span>
                  </span>
                </div>
              </Link>
              
              <p className="text-slate-600 dark:text-white font-semibold text-lg">
                AI-Powered Smart Restaurant Operating System
              </p>

              <div className="pt-4 space-y-3">
                <p className="text-sm font-medium text-slate-500 dark:text-white">
                  Developed for modern restaurant management using:
                </p>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Flask', 'Tailwind CSS', 'Gemini AI', 'MySQL', 'JWT Authentication'].map(tech => (
                    <span 
                      key={tech}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-white shadow-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp}
              className="lg:col-span-3 lg:col-start-7"
            >
              <h4 className="font-extrabold text-slate-900 dark:text-white mb-6">Quick Links</h4>
              <ul className="space-y-4">
                <li><Link to="/" onClick={scrollToTop} className="text-slate-500 dark:text-white hover:text-primary font-medium transition-colors">Home</Link></li>
                <li><Link to="/contact" className="text-slate-500 dark:text-white hover:text-primary font-medium transition-colors">Contact</Link></li>
                <li><Link to="/about" className="text-slate-500 dark:text-white hover:text-primary font-medium transition-colors">About Us</Link></li>
                <li><Link to="/features" className="text-slate-500 dark:text-white hover:text-primary font-medium transition-colors">Features</Link></li>
                
                {/* Role based links */}
                {user?.role === 'Customer' && (
                  <li><Link to="/customer" className="text-slate-500 dark:text-white hover:text-primary font-medium transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Customer Dashboard</Link></li>
                )}
                {user?.role === 'Staff' && (
                  <li><Link to="/staff" className="text-slate-500 dark:text-white hover:text-primary font-medium transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Staff Dashboard</Link></li>
                )}
                {user?.role === 'Restaurant Owner' && (
                  <>
                    <li><Link to="/restaurant" className="text-slate-500 dark:text-white hover:text-primary font-medium transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span> Admin Dashboard</Link></li>
                    <li><Link to="/ai" className="text-slate-500 dark:text-white hover:text-primary font-medium transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> AI Copilot</Link></li>
                  </>
                )}
              </ul>
            </motion.div>

            {/* Resources & Legal */}
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp}
              className="lg:col-span-3"
            >
              <h4 className="font-extrabold text-slate-900 dark:text-white mb-6">Resources</h4>
              <ul className="space-y-4">
                <li><Link to="/docs" className="text-slate-500 dark:text-white hover:text-primary font-medium transition-colors">Documentation</Link></li>
                <li><Link to="/faq" className="text-slate-500 dark:text-white hover:text-primary font-medium transition-colors">FAQ</Link></li>
                <li><Link to="/privacy" className="text-slate-500 dark:text-white hover:text-primary font-medium transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-slate-500 dark:text-white hover:text-primary font-medium transition-colors">Terms of Service</Link></li>
              </ul>
            </motion.div>

          </div>

          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">

            
            <div className="text-center md:text-right">
              <p className="text-slate-500 dark:text-white text-sm font-medium">
                © {new Date().getFullYear()} RestaurantBrain AI. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to top button */}
      <AnimatePresence>
        {showScroll && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-primary transition-all hover:scale-110 active:scale-95"
            aria-label="Back to top"
          >
            <ChevronUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default Footer;
