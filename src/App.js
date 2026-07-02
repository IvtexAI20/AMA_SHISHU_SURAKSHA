import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import Creches from './Pages/Creches';
import Children from './Pages/Children';
import Nutrition from './Pages/Nutrition';
import Safety from './Pages/Safety';
import Health from './Pages/Health';
import Sidebar from './Pages/Sidebar';
import Navbar from './Pages/Navbar';
import Incidents from './Pages/Incidents';
import Inspection from './Pages/Inspection';
import Report from './Pages/Report';
import Settings from './Pages/Settings';

// Route guard component to check authentication
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = 
    localStorage.getItem('isAuthenticated') === 'true' || 
    sessionStorage.getItem('isAuthenticated') === 'true';
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route path="/navbar" element={<ProtectedRoute><Navbar /></ProtectedRoute>} />
        <Route path="/sidebar" element={<ProtectedRoute><Sidebar /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/creches" element={<ProtectedRoute><Creches /></ProtectedRoute>} />
        <Route path="/children" element={<ProtectedRoute><Children /></ProtectedRoute>} />
        <Route path="/nutrition" element={<ProtectedRoute><Nutrition /></ProtectedRoute>} />
        <Route path="/safety" element={<ProtectedRoute><Safety /></ProtectedRoute>} />
        <Route path="/health" element={<ProtectedRoute><Health /></ProtectedRoute>} />
        <Route path="/incidents" element={<ProtectedRoute><Incidents /></ProtectedRoute>} />
        <Route path="/inspections" element={<ProtectedRoute><Inspection /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Report /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

// App component for Ama Shishu Suraksha Platform
export default App;
