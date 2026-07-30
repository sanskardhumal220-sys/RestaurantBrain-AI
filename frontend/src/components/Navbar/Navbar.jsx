import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Utensils, LogOut, User, Bell, ChevronDown, Bot, Globe, Menu, X, Settings } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLangOpen(false);
  };

  const [notifications, setNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState(() => {
    const saved = localStorage.getItem('readNotifications');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (user) {
      api.get('/api/auth/notifications')
        .then(res => setNotifications(res.data.notifications || []))
        .catch(err => console.error("Failed to fetch notifications", err));
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !readNotifications.includes(n.id)).length;
  const hasUnread = unreadCount > 0;

  const markAllRead = () => {
    const allIds = notifications.map(n => n.id);
    setReadNotifications(allIds);
    localStorage.setItem('readNotifications', JSON.stringify(allIds));
  };

  const handleNotificationClick = (id) => {
    if (!readNotifications.includes(id)) {
      const newRead = [...readNotifications, id];
      setReadNotifications(newRead);
      localStorage.setItem('readNotifications', JSON.stringify(newRead));
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  console.log("Navbar rendering, user is:", user);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user || !user.role) return '/';
    const role = user.role.toLowerCase();
    if (role === 'customer') return '/customer';
    if (role.includes('restaurant')) return '/restaurant';
    if (role === 'staff') return '/staff';
    return '/';
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glassmorphism dark:glass-dark border-b border-white/20 py-2' : 'bg-transparent py-4'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
                <Utensils className="h-6 w-6 text-primary" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">RestaurantBrain</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-4">
            {user && (
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 text-slate-500 hover:text-slate-900 transition-colors rounded-full"
              >
                <Bell className="w-5 h-5" />
                {hasUnread && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full ring-2 ring-white"></span>}
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {user && (
              <Link to={getDashboardLink()} className="relative text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                {t('nav.dashboard')}
                {location.pathname.includes('/dashboard') && (
                  <motion.div layoutId="nav-indicator" className="absolute -bottom-4 left-0 right-0 h-0.5 bg-primary" />
                )}
              </Link>
            )}
            {user && (user.role?.toLowerCase().includes('restaurant')) && (
              <Link to="/ai" className="flex items-center gap-1.5 relative text-sm font-bold text-primary hover:text-primary-dark transition-colors bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20 hover:bg-primary/20 shadow-sm">
                <Bot className="w-4 h-4" />
                {t('nav.ai_dashboard')}
                {location.pathname.includes('/ai') && (
                  <motion.div layoutId="nav-indicator-ai" className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-primary" />
                )}
              </Link>
            )}

            <button
              onClick={toggleTheme}
              className="relative p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <span className="text-lg leading-none">{theme === 'dark' ? '☀️' : '🌙'}</span>
            </button>

            <div className="relative">
              <button 
                onClick={() => {
                  setLangOpen(!langOpen);
                  setNotificationsOpen(false);
                  setProfileOpen(false);
                }}
                className="relative p-2 text-slate-500 hover:text-slate-900 transition-colors rounded-full hover:bg-slate-100 flex items-center gap-1"
              >
                <Globe className="w-5 h-5" />
                <span className="text-xs font-bold uppercase">{i18n.language?.split('-')[0]}</span>
              </button>
              
              <AnimatePresence>
                {langOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-32 glassmorphism dark:glass-dark shadow-xl overflow-hidden z-50 border border-slate-200/50"
                  >
                    <div className="p-1">
                      {['en', 'hi'].map(lng => (
                        <button 
                          key={lng}
                          onClick={() => changeLanguage(lng)}
                          className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${i18n.language?.startsWith(lng) ? 'bg-primary/10 text-primary font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                        >
                          {lng === 'en' ? 'English' : 'हिन्दी'}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {user ? (
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button 
                    onClick={() => {
                      setNotificationsOpen(!notificationsOpen);
                      setProfileOpen(false);
                      setLangOpen(false);
                    }}
                    className="relative p-2 text-slate-500 hover:text-slate-900 transition-colors rounded-full hover:bg-slate-100"
                  >
                    <Bell className="w-5 h-5" />
                    {hasUnread && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full ring-2 ring-white"></span>}
                  </button>

                  <AnimatePresence>
                    {notificationsOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-72 glassmorphism dark:glass-dark shadow-xl overflow-hidden z-50 border border-slate-200/50"
                      >
                        <div className="p-3 border-b border-slate-100 bg-white/50 flex justify-between items-center">
                          <h3 className="text-sm font-semibold text-slate-800">{t('nav.notifications')}</h3>
                          {hasUnread && (
                            <span onClick={markAllRead} className="text-xs text-primary font-medium cursor-pointer hover:underline">{t('nav.mark_read')}</span>
                          )}
                        </div>
                        <div className="max-h-[300px] overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-4 text-center text-sm text-slate-500">{t('nav.no_notifications')}</div>
                          ) : (
                            notifications.map(notif => {
                              const isUnread = !readNotifications.includes(notif.id);
                              return (
                                <div key={notif.id} onClick={() => handleNotificationClick(notif.id)} className={`p-3 border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer ${isUnread ? 'bg-primary/5' : ''}`}>
                                  <p className={`text-sm ${isUnread ? 'font-medium text-slate-900' : 'text-slate-600'}`}>{notif.text}</p>
                                  <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                                </div>
                              );
                            })
                          )}
                        </div>
                        <div className="p-2 text-center bg-slate-50/50 border-t border-slate-100">
                          <span className="text-xs text-slate-500 hover:text-slate-700 cursor-pointer">{t('nav.view_all')}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <div className="relative">
                  <button 
                    onClick={() => {
                      setProfileOpen(!profileOpen);
                      setNotificationsOpen(false);
                      setLangOpen(false);
                    }}
                    className="flex items-center gap-2 bg-white/60 border border-slate-200 px-3 py-1.5 rounded-full hover:shadow-sm transition-all"
                  >
                    <div className="bg-primary/10 rounded-full p-1">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">{user.full_name}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 glassmorphism dark:glass-dark shadow-xl overflow-hidden z-50 border border-slate-200/50"
                      >
                        <div className="p-3 border-b border-slate-100 bg-white/50">
                          <p className="text-sm font-semibold text-slate-800">{user.full_name}</p>
                          <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                        </div>
                        <div className="p-1">
                          <Link 
                            to="/profile"
                            onClick={() => setProfileOpen(false)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <User className="w-4 h-4" />
                            My Profile
                          </Link>
                          <Link 
                            to="/settings"
                            onClick={() => setProfileOpen(false)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <Settings className="w-4 h-4" />
                            Settings
                          </Link>
                          <div className="h-px bg-slate-200 dark:bg-slate-700 my-1"></div>
                          <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-error hover:bg-error/10 rounded-lg transition-colors font-medium"
                          >
                            <LogOut className="w-4 h-4" />
                            {t('nav.sign_out')}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">{t('nav.log_in')}</Link>
                <Link to="/register" className="bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all font-medium text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5">{t('nav.sign_up')}</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200/50 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md"
          >
            <div className="px-4 pt-2 pb-6 space-y-4 shadow-xl">
              {user && (
                <div className="py-2 flex items-center justify-between border-b border-slate-200/50 dark:border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 rounded-full p-2">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">{user.full_name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user.role}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col space-y-2">
                {user && (
                  <Link 
                    to={getDashboardLink()} 
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    {t('nav.dashboard')}
                  </Link>
                )}
                {user && (user.role?.toLowerCase().includes('restaurant')) && (
                  <Link 
                    to="/ai" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-primary hover:bg-primary/10 rounded-xl transition-colors"
                  >
                    <Bot className="w-5 h-5" />
                    {t('nav.ai_dashboard')}
                  </Link>
                )}
              </div>

              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200/50 dark:border-slate-700/50">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Theme</span>
                <button
                  onClick={toggleTheme}
                  className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center bg-slate-100 dark:bg-slate-800"
                >
                  <span className="text-lg leading-none">{theme === 'dark' ? '☀️' : '🌙'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/50 dark:border-slate-700/50">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Language</span>
                <div className="flex gap-2">
                  <button onClick={() => changeLanguage('en')} className={`px-3 py-1 rounded-lg text-xs font-bold ${i18n.language?.startsWith('en') ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>EN</button>
                  <button onClick={() => changeLanguage('hi')} className={`px-3 py-1 rounded-lg text-xs font-bold ${i18n.language?.startsWith('hi') ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>HI</button>
                </div>
              </div>

              {user ? (
                <div className="flex flex-col space-y-2 pt-2">
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200 flex items-center gap-3">
                    <User className="w-5 h-5" /> Profile
                  </Link>
                  <Link to="/settings" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200 flex items-center gap-3">
                    <Settings className="w-5 h-5" /> Settings
                  </Link>
                  <button onClick={handleLogout} className="px-4 py-3 text-sm text-error flex items-center gap-3 w-full text-left font-medium">
                    <LogOut className="w-5 h-5" /> {t('nav.sign_out')}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 pt-4 px-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full py-3 text-center text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl">{t('nav.log_in')}</Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full py-3 text-center bg-slate-900 text-white rounded-xl font-medium text-sm">{t('nav.sign_up')}</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
