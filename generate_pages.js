import fs from 'fs';
import path from 'path';

const pages = [
  'Login', 'Register', 'CustomerDashboard', 
  'RestaurantDashboard', 'StaffDashboard', 
  'AIDashboard', 'AnalyticsDashboard', 
  'About', 'Contact', 'NotFound'
];

const pageTemplate = (name) => `import React from 'react';
import { motion } from 'framer-motion';

const ${name} = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-slate-50 pt-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="glassmorphism p-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-4">${name}</h1>
          <p className="text-slate-600">This is a placeholder page for ${name}. Business logic will be implemented here.</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ${name};
`;

const components = [
  { dir: 'Navbar', name: 'Navbar' },
  { dir: 'Footer', name: 'Footer' }
];

const navbarTemplate = `import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed w-full z-50 glassmorphism rounded-none border-t-0 border-l-0 border-r-0 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Utensils className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl tracking-tight text-slate-900">RestaurantBrain</span>
            </Link>
          </div>
          <div className="hidden md:flex space-x-8">
            <Link to="/customer" className="text-slate-600 hover:text-primary transition-colors">Customer</Link>
            <Link to="/restaurant" className="text-slate-600 hover:text-primary transition-colors">Restaurant</Link>
            <Link to="/ai" className="text-slate-600 hover:text-primary transition-colors">AI</Link>
            <Link to="/analytics" className="text-slate-600 hover:text-primary transition-colors">Analytics</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-slate-600 hover:text-slate-900 font-medium">Log in</Link>
            <Link to="/register" className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors font-medium">Sign up</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
`;

const footerTemplate = `import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500">
        <p>&copy; 2026 RestaurantBrain AI. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
`;

pages.forEach(page => {
  fs.writeFileSync(path.join(process.cwd(), 'frontend', 'src', 'pages', page + '.jsx'), pageTemplate(page));
});

fs.writeFileSync(path.join(process.cwd(), 'frontend', 'src', 'components', 'Navbar', 'Navbar.jsx'), navbarTemplate);
fs.writeFileSync(path.join(process.cwd(), 'frontend', 'src', 'components', 'Footer', 'Footer.jsx'), footerTemplate);

console.log("Pages and components generated.");
