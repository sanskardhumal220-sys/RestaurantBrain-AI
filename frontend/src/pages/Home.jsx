import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ArrowRight, Sparkles, LayoutDashboard, BrainCircuit, Users, 
  MenuSquare, CalendarCheck, Monitor, Bell, LineChart, 
  CheckCircle2, Laptop, Server, Database, Shield, Bot
} from 'lucide-react';

const Home = () => {
  const { t } = useTranslation();
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
          <span>{t('home.pill_text')}</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8 leading-[1.1]"
        >
          {t('home.hero_title_main')}
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-2xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-8"
        >
          {t('home.hero_title_sub')}
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="text-xl text-slate-600 dark:text-slate-300 max-w-4xl mb-12 leading-relaxed"
        >
          {t('home.hero_desc')}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto"
        >
          <Link to="/register" className="w-full sm:w-auto group relative flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-bold text-lg overflow-hidden shadow-[0_0_40px_rgba(15,23,42,0.3)] dark:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10">{t('home.get_started')}</span> 
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="#features" className="w-full sm:w-auto flex items-center justify-center gap-2 glassmorphism dark:glass-dark text-slate-900 dark:text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all hover:scale-105 border border-slate-200/50 dark:border-slate-700/50">
            {t('home.explore_features')}
          </Link>
        </motion.div>
      </section>

      {/* FEATURE SECTION */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">{t('home.features_title')}</h2>
          <p className="text-xl text-slate-600 dark:text-slate-400">{t('home.features_desc')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: <BrainCircuit/>, title: t('home.feat_ai_title'), desc: t('home.feat_ai_desc') },
            { icon: <LayoutDashboard/>, title: t('home.feat_order_title'), desc: t('home.feat_order_desc') },
            { icon: <Users/>, title: t('home.feat_role_title'), desc: t('home.feat_role_desc') },
            { icon: <MenuSquare/>, title: t('home.feat_menu_title'), desc: t('home.feat_menu_desc') },
            { icon: <CalendarCheck/>, title: t('home.feat_res_title'), desc: t('home.feat_res_desc') },
            { icon: <Monitor/>, title: t('home.feat_kds_title'), desc: t('home.feat_kds_desc') },
            { icon: <Bell/>, title: t('home.feat_notif_title'), desc: t('home.feat_notif_desc') },
            { icon: <LineChart/>, title: t('home.feat_analytics_title'), desc: t('home.feat_analytics_desc') }
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
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">{t('home.how_it_works')}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-primary via-accent to-purple-500 opacity-30" />
            
            {[
              { step: t('home.step_1_lbl'), title: t('home.step_1_title'), desc: t('home.step_1_desc') },
              { step: t('home.step_2_lbl'), title: t('home.step_2_title'), desc: t('home.step_2_desc') },
              { step: t('home.step_3_lbl'), title: t('home.step_3_title'), desc: t('home.step_3_desc') }
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
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">{t('home.why_choose_us')}</h2>
            <div className="space-y-4">
              {[
                t('home.benefit_1'),
                t('home.benefit_2'),
                t('home.benefit_3'),
                t('home.benefit_4'),
                t('home.benefit_5'),
                t('home.benefit_6')
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
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">{t('home.tech_stack')}</h2>
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
            {t('home.cta_title')}
          </h2>
          <p className="text-xl text-slate-700 dark:text-slate-300 mb-10 max-w-2xl mx-auto relative z-10">
            {t('home.cta_desc')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Link to="/login" className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
              {t('home.launch_dashboard')}
            </Link>
            <Link to="/register" className="w-full sm:w-auto flex justify-center glassmorphism dark:glass-dark text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all hover:scale-105">
              {t('home.view_demo')}
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
};

export default Home;
