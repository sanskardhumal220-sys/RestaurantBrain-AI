import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const pagesData = {
 docs: {
 title: 'Documentation',
 content: 'Welcome to the official RestaurantBrain AI documentation. Here you will find everything you need to know about setting up and operating your smart restaurant.',
 body: (
 <div className="space-y-6">
 <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-8 mb-4">1. System Architecture</h2>
 <p>RestaurantBrain AI is built on a modern stack utilizing React for the frontend and Flask for the backend, with seamless Gemini AI integration for intelligent decision-making. The system handles real-time data flow between the kitchen, staff, and customers.</p>
 
 <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-8 mb-4">2. API Integration</h2>
 <p>For enterprise customers, we offer a robust RESTful API. Our API endpoints allow you to connect RestaurantBrain with your existing point-of-sale (POS) systems, accounting software, and inventory management tools.</p>
 
 <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-8 mb-4">3. AI Capabilities</h2>
 <ul className="list-disc pl-6 space-y-2">
 <li><strong>Predictive Analytics:</strong> Forecasting demand based on historical data, weather, and local events.</li>
 <li><strong>Automated Menu Optimization:</strong> AI suggests dynamic pricing and menu combinations.</li>
 <li><strong>Smart Chatbot:</strong> A dedicated copilot for staff to query restaurant performance metrics.</li>
 </ul>
 </div>
 )
 },
 guide: {
 title: 'User Guide',
 content: 'Learn how to use the AI Copilot, manage your menu, track active orders, and approve reservations through our comprehensive user guide.',
 body: (
 <div className="space-y-6">
 <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-8 mb-4">Getting Started</h2>
 <p>After registering your restaurant, head over to the <strong>Admin Dashboard</strong>. Here you can set up your restaurant profile, add tables, and configure your initial menu.</p>
 
 <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-8 mb-4">Managing Orders</h2>
 <p>The Staff Dashboard provides a real-time view of all incoming orders. Orders are color-coded based on status:</p>
 <ul className="list-disc pl-6 space-y-2">
 <li><strong>Pending (Yellow):</strong> New order received.</li>
 <li><strong>Preparing (Blue):</strong> Kitchen is actively working on the order.</li>
 <li><strong>Ready (Green):</strong> Order is ready for pickup or serving.</li>
 </ul>

 <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-8 mb-4">Using the AI Copilot</h2>
 <p>Click on the AI Dashboard to chat with your intelligent assistant. You can ask questions like <em>"What were the top selling items today?"</em> or <em>"Generate a health score report."</em></p>
 </div>
 )
 },
 faq: {
 title: 'Frequently Asked Questions',
 content: 'Find answers to common questions about billing, integrations, hardware compatibility, and AI capabilities.',
 body: (
 <div className="space-y-8 mt-8">
 <div>
 <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Do I need special hardware to run RestaurantBrain?</h3>
 <p className="text-slate-600 dark:text-white">No! RestaurantBrain AI is a cloud-based web application. It runs smoothly on any standard tablet, laptop, or smartphone with a modern web browser.</p>
 </div>
 <div>
 <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">How accurate is the AI Health Score?</h3>
 <p className="text-slate-600 dark:text-white">Our AI Health Score analyzes dozens of metrics including table turnover rate, order fulfillment times, and revenue trends to provide a highly accurate, real-time snapshot of your restaurant's operational efficiency.</p>
 </div>
 <div>
 <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Can I manage multiple restaurant locations?</h3>
 <p className="text-slate-600 dark:text-white">Yes, enterprise accounts support multi-location management from a centralized admin dashboard.</p>
 </div>
 </div>
 )
 },
 privacy: {
 title: 'Privacy Policy',
 content: 'We take your data seriously. Read our privacy policy to understand how we protect your customer data and restaurant analytics.',
 body: (
 <div className="space-y-6">
 <p className="text-sm font-semibold text-slate-500 dark:text-white uppercase tracking-wider mb-6">Last Updated: July 2026</p>
 <p>At RestaurantBrain AI, we are committed to protecting your privacy and ensuring the security of your data.</p>
 
 <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-8 mb-4">1. Data Collection</h2>
 <p>We collect information you provide directly to us when you create an account, modify your profile, or interact with the platform. This includes contact information, restaurant details, and transaction data.</p>
 
 <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-8 mb-4">2. How We Use Your Data</h2>
 <p>Your data is used strictly to provide and improve our services. Our AI models analyze your operational data to provide insights specifically for your restaurant. <strong>We do not sell your data to third parties.</strong></p>
 
 <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-8 mb-4">3. Data Security</h2>
 <p>We implement enterprise-grade security measures to protect your information. Passwords are securely hashed, and all data transmissions are encrypted via SSL.</p>
 </div>
 )
 },
 terms: {
 title: 'Terms & Conditions',
 content: 'By using RestaurantBrain AI, you agree to our Terms of Service. Review the legal terms and conditions here.',
 body: (
 <div className="space-y-6">
 <p className="text-sm font-semibold text-slate-500 dark:text-white uppercase tracking-wider mb-6">Effective Date: July 26, 2026</p>
 <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-8 mb-4">1. Acceptance of Terms</h2>
 <p>By accessing and using RestaurantBrain AI, you accept and agree to be bound by the terms and provision of this agreement.</p>
 
 <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-8 mb-4">2. Use License</h2>
 <p>Permission is granted to temporarily use the software for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.</p>
 
 <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-8 mb-4">3. Disclaimer</h2>
 <p>The materials on RestaurantBrain AI's web site are provided "as is". We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties.</p>
 </div>
 )
 },
 support: {
 title: 'Support',
 content: 'Need help? Our 24/7 support team is here for you. Reach out via email or phone for immediate assistance.',
 body: (
 <div className="space-y-8 mt-8">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="bg-white dark:bg-transparent transition-colors p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
 <Mail className="w-8 h-8 text-primary mb-4" />
 <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Email Support</h3>
 <p className="text-slate-600 dark:text-white mb-4">Send us an email anytime. We typically respond within 2 hours.</p>
 <a href="mailto:sanskardhumal220@gmail.com" className="text-primary font-bold hover:underline">sanskardhumal220@gmail.com</a>
 </div>
 <div className="bg-white dark:bg-transparent transition-colors p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
 <Phone className="w-8 h-8 text-primary mb-4" />
 <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Phone Support</h3>
 <p className="text-slate-600 dark:text-white mb-4">Call our dedicated support line for urgent operational issues.</p>
 <p className="text-primary font-bold">+91 74899 12345</p>
 </div>
 </div>
 
 <div className="bg-primary/5 p-6 md:p-8 rounded-2xl border border-primary/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
 <div>
 <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Still need help?</h3>
 <p className="text-slate-600 dark:text-white">Check out our community forums or submit a detailed ticket for complex issues.</p>
 </div>
 <Link to="/contact" className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center gap-2 whitespace-nowrap">
 Contact Us <ExternalLink className="w-5 h-5" />
 </Link>
 </div>
 </div>
 )
 },
 features: {
 title: 'Features',
 content: 'Discover the powerful capabilities of RestaurantBrain AI, from live order tracking to predictive AI analytics.',
 body: (
 <div className="space-y-6">
 <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-8 mb-4">Intelligent Dashboards</h2>
 <p>Access specialized views tailored for Management, Staff, and Customers. Each dashboard is designed to surface the most relevant information instantly.</p>
 
 <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-8 mb-4">AI-Powered Analytics</h2>
 <p>Leverage the power of Google's Gemini AI to generate comprehensive health scores, summarize daily performance, and provide actionable recommendations for menu and operations.</p>

 <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-8 mb-4">Real-Time Synchronization</h2>
 <p>Orders and reservations sync instantly across all devices. When a customer places an order, the kitchen staff sees it immediately, ensuring zero delays.</p>
 </div>
 )
 },
 about: {
 title: 'About Us',
 content: 'We built RestaurantBrain AI to revolutionize the hospitality industry using cutting-edge artificial intelligence.',
 body: (
 <div className="space-y-6 mt-8">
 <p>Please visit our dedicated <Link to="/about" className="text-primary font-bold hover:underline">About Us page</Link> for our full story, core values, and mission statement.</p>
 </div>
 )
 }
};

const StaticPages = ({ pageId }) => {
 const data = pagesData[pageId] || { title: 'Page Not Found', content: 'The page you are looking for does not exist.' };

 return (
 <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors pt-32 px-4 sm:px-6 lg:px-8 pb-24 font-sans">
 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5 }}
 className="max-w-4xl mx-auto glassmorphism dark:glass-dark bg-white/80 dark:bg-transparent transition-colors p-8 md:p-16 rounded-[2rem] border border-white/50 dark:border-white/10 shadow-xl"
 >
 <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8">{data.title}</h1>
 
 <div className="prose prose-lg text-slate-600 dark:text-white max-w-none">
 <p className={`lead text-xl ${data.body ? 'mb-8 border-b border-slate-200 dark:border-slate-700 pb-8' : 'mb-6'}`}>
 {data.content}
 </p>
 
 {data.body && (
 <div className="mt-8 text-slate-700 dark:text-white">
 {data.body}
 </div>
 )}
 </div>
 </motion.div>
 </div>
 );
};

export default StaticPages;
