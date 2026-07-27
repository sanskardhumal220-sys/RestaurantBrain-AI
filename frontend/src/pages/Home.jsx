import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Sparkles, LayoutDashboard, BrainCircuit, Users, 
  MenuSquare, CalendarCheck, Monitor, Bell, LineChart, 
  CheckCircle2, Laptop, Server, Database, Shield, Bot
} from 'lucide-react';

const Home = () => {
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors relative overflow-hidden font-sans">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 dark:bg-primary/10 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] bg-accent/20 dark:bg-accent/10 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[40%] bg-purple-500/10 dark:bg-purple-500/10 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }} />
      </div>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glassmorphism dark:glass-dark text-primary font-medium text-sm mb-8 border border-primary/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
        >
          <Sparkles className="w-4 h-4" />
          <span>Powered by Gemini AI | Real-Time Restaurant Operations</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8 leading-[1.1]"
        >
          RestaurantBrain AI
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-2xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-8"
        >
          AI-Powered Smart Restaurant Operating System
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="text-xl text-slate-600 dark:text-slate-300 max-w-4xl mb-12 leading-relaxed"
        >
          RestaurantBrain AI is a modern restaurant management platform that combines real-time restaurant operations with Gemini AI to simplify menu management, order processing, reservations, staff coordination, and business insights through one intelligent dashboard.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto"
        >
          <Link to="/register" className="group relative flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-bold text-lg overflow-hidden shadow-[0_0_40px_rgba(15,23,42,0.3)] dark:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10">Get Started</span> 
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="#features" className="flex items-center justify-center gap-2 glassmorphism dark:glass-dark text-slate-900 dark:text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all hover:scale-105 border border-slate-200/50 dark:border-slate-700/50">
            Explore Features
          </Link>
        </motion.div>
      </section>

      {/* FEATURE SECTION */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Platform Features</h2>
          <p className="text-xl text-slate-600 dark:text-slate-400">Everything you need to manage your restaurant seamlessly.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: <BrainCircuit/>, title: "AI Business Copilot", desc: "Use Gemini AI to analyze restaurant operations, answer business questions, and generate intelligent recommendations." },
            { icon: <LayoutDashboard/>, title: "Real-Time Order Management", desc: "Synchronize customers, kitchen staff, waiters, and restaurant owners through a live order workflow." },
            { icon: <Users/>, title: "Role-Based Dashboards", desc: "Dedicated dashboards for Customer, Staff, and Restaurant Owner. Secure access to only the features they need." },
            { icon: <MenuSquare/>, title: "Digital Menu Management", desc: "Create categories. Manage menu items. Update pricing. Track item availability." },
            { icon: <CalendarCheck/>, title: "Reservation Management", desc: "Allow customers to book tables. Approve or reject reservations. Manage seating efficiently." },
            { icon: <Monitor/>, title: "Kitchen Display System", desc: "Kitchen staff receive orders instantly. Update order progress from Received to Completed." },
            { icon: <Bell/>, title: "Live Notifications", desc: "Receive real-time alerts for New Orders, Reservation Updates, Order Status Changes, and Operational Events." },
            { icon: <LineChart/>, title: "Restaurant Analytics", desc: "Monitor Revenue, Orders, Reservations, Restaurant Health Score, and Business Performance." }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glassmorphism dark:glass-dark rounded-3xl p-6 relative overflow-hidden group border border-slate-200/50 dark:border-white/10"
            >
              <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-2xl flex items-center justify-center text-primary mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-white/50 dark:bg-slate-950/50 relative z-10 border-y border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">How It Works</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-primary via-accent to-purple-500 opacity-30" />
            
            {[
              { step: "Step 1", title: "Customer Interaction", desc: "Customers browse the menu, place orders, and reserve tables." },
              { step: "Step 2", title: "Restaurant Operations", desc: "Kitchen staff prepare orders while waiters manage deliveries and table service." },
              { step: "Step 3", title: "AI Intelligence", desc: "Gemini AI analyzes operational data and generates business insights, recommendations, and summaries for restaurant owners." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative text-center z-10 px-4"
              >
                <div className="w-24 h-24 mx-auto glassmorphism dark:glass-dark rounded-full flex items-center justify-center text-3xl font-bold text-primary mb-6 shadow-xl border border-slate-200 dark:border-white/10 relative">
                  <div className="absolute inset-2 rounded-full border-2 border-dashed border-primary/30 animate-[spin_10s_linear_infinite]" />
                  {i + 1}
                </div>
                <h4 className="text-primary font-bold mb-2 tracking-widest uppercase text-sm">{item.step}</h4>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY RESTAURANTBRAIN AI & TECH STACK */}
      <section className="py-24 relative z-10 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Why Choose Us */}
          <motion.div
             initial={{ opacity: 0, x: -30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">Why RestaurantBrain AI</h2>
            <div className="space-y-4">
              {[
                "AI-Powered Restaurant Operations",
                "Secure Role-Based Access",
                "Real-Time Synchronization",
                "Intelligent Business Insights",
                "Digital Menu & Reservation Management",
                "Modern Responsive Interface"
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                  <span className="text-lg text-slate-700 dark:text-slate-300 font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tech Stack */}
          <motion.div
             initial={{ opacity: 0, x: 30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="glassmorphism dark:glass-dark rounded-3xl p-8 border border-slate-200/50 dark:border-white/10"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Technology Stack</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h4 className="flex items-center gap-2 text-primary font-bold mb-2"><Laptop className="w-5 h-5"/> Frontend</h4>
                <ul className="text-slate-600 dark:text-slate-400 space-y-1">
                  <li>React</li>
                  <li>Tailwind CSS</li>
                  <li>Framer Motion</li>
                </ul>
              </div>
              <div>
                <h4 className="flex items-center gap-2 text-primary font-bold mb-2"><Server className="w-5 h-5"/> Backend</h4>
                <ul className="text-slate-600 dark:text-slate-400 space-y-1">
                  <li>Python</li>
                  <li>Flask</li>
                </ul>
              </div>
              <div>
                <h4 className="flex items-center gap-2 text-primary font-bold mb-2"><Database className="w-5 h-5"/> Database</h4>
                <ul className="text-slate-600 dark:text-slate-400 space-y-1">
                  <li>MySQL / SQLAlchemy</li>
                </ul>
              </div>
              <div>
                <h4 className="flex items-center gap-2 text-primary font-bold mb-2"><Shield className="w-5 h-5"/> Authentication</h4>
                <ul className="text-slate-600 dark:text-slate-400 space-y-1">
                  <li>JWT</li>
                </ul>
              </div>
              <div className="sm:col-span-2">
                <h4 className="flex items-center gap-2 text-primary font-bold mb-2"><Bot className="w-5 h-5"/> Artificial Intelligence</h4>
                <ul className="text-slate-600 dark:text-slate-400 space-y-1">
                  <li>Google Gemini AI</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CALL TO ACTION BOTTOM */}
      <section className="py-24 relative z-10 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto glassmorphism dark:glass-dark rounded-[3rem] p-12 md:p-16 text-center relative overflow-hidden border border-slate-200/50 dark:border-white/10"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent dark:from-primary/10 dark:via-accent/5 pointer-events-none" />
          
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 relative z-10">
            Ready to Modernize Your Restaurant?
          </h2>
          <p className="text-xl text-slate-700 dark:text-slate-300 mb-10 max-w-2xl mx-auto relative z-10">
            Experience a smarter way to manage restaurant operations using AI-powered insights and real-time collaboration.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Link to="/login" className="bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
              Launch Dashboard
            </Link>
            <Link to="/register" className="glassmorphism dark:glass-dark text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all hover:scale-105">
              View Demo
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
};

export default Home;
