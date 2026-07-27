import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
 const { user, loading } = useContext(AuthContext);

 if (loading) {
 return <div className="flex justify-center items-center h-screen">Loading...</div>;
 }

 if (!user) {
 return <Navigate to="/login" replace />;
 }

 if (allowedRoles && !allowedRoles.includes(user.role)) {
 // Redirect unauthorized users to their own dashboard
 switch(user.role) {
 case 'Customer': return <Navigate to="/customer" replace />;
 case 'Restaurant Owner': return <Navigate to="/restaurant" replace />;
 case 'Staff': return <Navigate to="/staff" replace />;
 default: return <Navigate to="/" replace />;
 }
 }

 return children;
};

export default ProtectedRoute;
