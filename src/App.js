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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/navbar" element={<Navbar />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/creches" element={<Creches />} />
        <Route path="/children" element={<Children />} />
        <Route path="/nutrition" element={<Nutrition />} />
        <Route path="/safety" element={<Safety />} />
        <Route path="/health" element={<Health />} />
      </Routes>
    </Router>
  );
}

// App component for Ama Shishu Suraksha Platform
export default App;
