import React from 'react';
import { motion } from 'framer-motion';
import { Target, Lightbulb, Users, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeIn = {
 initial: { opacity: 0, y: 20 },
 animate: { opacity: 1, y: 0 },
 transition: { duration: 0.6 }
};

const staggerContainer = {
 animate: {
 transition: {
 staggerChildren: 0.1
 }
 }
};

const About = () => {
 return (
 <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors relative overflow-hidden font-sans">
 {/* Background Gradients */}
 <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-br from-primary/10 via-accent/5 to-transparent rounded-b-[100px] pointer-events-none" />
 <div className="absolute top-40 right-20 w-72 h-72 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
 
 {/* Hero Section */}
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 relative z-10 text-center">
 <motion.div variants={staggerContainer} initial="initial" animate="animate" className="max-w-3xl mx-auto">
 <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
 Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Mission</span>
 </motion.h1>
 <motion.p variants={fadeIn} className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-10">
 At RestaurantBrain AI, we believe in empowering restaurateurs with cutting-edge artificial intelligence to streamline operations, enhance customer experiences, and drive unprecedented growth.
 </motion.p>
 </motion.div>
 </div>

 {/* Core Values Section */}
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
 {[
 { icon: <Target className="w-8 h-8" />, title: "Precision", desc: "Data-driven insights for perfect execution every time." },
 { icon: <Lightbulb className="w-8 h-8" />, title: "Innovation", desc: "Pioneering AI solutions for the modern hospitality industry." },
 { icon: <Users className="w-8 h-8" />, title: "Customer First", desc: "Tools designed to elevate the dining experience." },
 { icon: <ShieldCheck className="w-8 h-8" />, title: "Reliability", desc: "Robust systems you can trust during peak hours." }
 ].map((value, idx) => (
 <motion.div 
 key={idx}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: idx * 0.1 }}
 className="glassmorphism dark:glass-dark bg-white/60 dark:bg-transparent transition-colors p-8 rounded-3xl border border-white/80 dark:border-white/10 shadow-xl hover:-translate-y-2 transition-all duration-300"
 >
 <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
 {value.icon}
 </div>
 <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{value.title}</h3>
 <p className="text-slate-600 dark:text-slate-300">{value.desc}</p>
 </motion.div>
 ))}
 </div>
 </div>

 {/* Story Section */}
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
 <div className="glassmorphism dark:glass-dark bg-white/80 dark:bg-transparent transition-colors rounded-[3rem] p-8 md:p-16 border border-white/50 dark:border-white/10 shadow-2xl flex flex-col md:flex-row gap-12 items-center">
 <div className="flex-1 space-y-6">
 <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white">The Story Behind <br/>RestaurantBrain</h2>
 <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
 Born from a hackathon and a passion for technology, RestaurantBrain AI was created to bridge the gap between traditional hospitality and modern technological advancements. We saw restaurant owners struggling with fragmented systems, unpredictable demand, and manual operations.
 </p>
 <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
 Our intelligent operating system acts as the "brain" of the restaurant, seamlessly connecting front-of-house service with back-of-house efficiency.
 </p>
 <Link to="/contact" className="inline-flex items-center gap-2 text-primary font-bold text-lg hover:gap-3 transition-all mt-4">
 Get in touch with us <ArrowRight className="w-5 h-5" />
 </Link>
 </div>
 <div className="flex-1 w-full relative">
 <div className="aspect-square rounded-[2rem] overflow-hidden bg-slate-200 shadow-inner relative">
 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
 <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
 </div>
 {/* Floating Badge */}
 <motion.div 
 animate={{ y: [0, -10, 0] }}
 transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
 className="absolute -bottom-6 -left-6 glassmorphism dark:glass-dark bg-white/90 dark:bg-transparent transition-colors p-4 rounded-2xl shadow-xl border border-white dark:border-white/10 flex items-center gap-4 hidden sm:flex"
 >
 <div className="bg-green-100 p-3 rounded-full text-green-600 font-bold text-xl">10x</div>
 <div className="text-sm font-medium text-slate-700 dark:text-slate-200">Faster Operations<br/><span className="text-slate-400">with AI Copilot</span></div>
 </motion.div>
 </div>
 </div>
 </div>
 </div>
 );
};

export default About;
