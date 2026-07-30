import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import CustomerDashboard from './pages/CustomerDashboard';
import RestaurantDashboard from './pages/RestaurantDashboard';
import StaffDashboard from './pages/StaffDashboard';
import AIDashboard from './pages/AIDashboard';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import StaticPages from './pages/StaticPages';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
              <Toaster position="top-right" />
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                
                {/* Protected Routes */}
                <Route path="/customer" element={
                  <ProtectedRoute allowedRoles={['Customer']}>
                    <CustomerDashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/restaurant" element={
                  <ProtectedRoute allowedRoles={['Restaurant Owner']}>
                    <RestaurantDashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/staff" element={
                  <ProtectedRoute allowedRoles={['Staff']}>
                    <StaffDashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/ai" element={
                  <ProtectedRoute allowedRoles={['Restaurant Owner']}>
                    <AIDashboard />
                  </ProtectedRoute>
                } />
                
                {/* Public Pages */}
                <Route path="/analytics" element={<AnalyticsDashboard />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* Static Pages */}
                <Route path="/docs" element={<StaticPages pageId="docs" />} />
                <Route path="/guide" element={<StaticPages pageId="guide" />} />
                <Route path="/faq" element={<StaticPages pageId="faq" />} />
                <Route path="/privacy" element={<StaticPages pageId="privacy" />} />
                <Route path="/terms" element={<StaticPages pageId="terms" />} />
                <Route path="/support" element={<StaticPages pageId="support" />} />
                <Route path="/features" element={<StaticPages pageId="features" />} />

                {/* Profile */}
                <Route path="/profile" element={
                  <ProtectedRoute allowedRoles={['Customer', 'Restaurant Owner', 'Staff']}>
                    <Profile />
                  </ProtectedRoute>
                } />

                {/* Settings */}
                <Route path="/settings" element={
                  <ProtectedRoute allowedRoles={['Customer', 'Restaurant Owner', 'Staff']}>
                    <Settings />
                  </ProtectedRoute>
                } />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
