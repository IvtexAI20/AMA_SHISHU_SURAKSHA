import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

import dbData from '../data.json';

const initialAlerts = dbData.safetyAlerts;

export default function Safety() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [alerts, setAlerts] = useState(initialAlerts);
  const [selectedAlertId, setSelectedAlertId] = useState('det-1');
  const [selectedCamera, setSelectedCamera] = useState('CAM-104');
  const [currentTime, setCurrentTime] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // Assign Modal States
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignTarget, setAssignTarget] = useState(null);
  const [assignedStaff, setAssignedStaff] = useState('Laxmi Priya');

  // Update time ticker in real-time
  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      setCurrentTime(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg('');
    }, 4000);
  };

  const handleResolveAlert = (id, title) => {
    setAlerts(alerts.filter(a => a.id !== id));
    triggerToast(`Incident resolved: ${title}`);
    if (selectedAlertId === id) {
      setSelectedAlertId('');
    }
  };

  const handleOpenAssign = (alertItem) => {
    setAssignTarget(alertItem);
    setShowAssignModal(true);
  };

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    if (!assignTarget) return;

    // Simulate assignment update
    triggerToast(`Assigned ${assignedStaff} to resolve ${assignTarget.title} at ${assignTarget.creche}.`);
    
    // Update alert status/message
    setAlerts(alerts.map(a => {
      if (a.id === assignTarget.id) {
        return { ...a, title: `${a.title} (Assigned to ${assignedStaff})` };
      }
      return a;
    }));

    setShowAssignModal(false);
    setAssignTarget(null);
  };

  // Live feed configurations
  const feedConfig = {
    'CAM-104': { creche: 'Telkoi Konark Crèche', bg: 'bg-[#0f1d3a]', alertText: 'Unauthorized entry', conf: '95%' },
    'CAM-105': { creche: 'Champua Ananda Kendra', bg: 'bg-[#1e2b47]', alertText: '', conf: '' },
    'CAM-106': { creche: 'Anandapur Surya Crèche', bg: 'bg-[#17253d]', alertText: '', conf: '' },
    'CAM-107': { creche: 'Ghatagaon Tarini Crèche', bg: 'bg-[#101b30]', alertText: '', conf: '' },
  };

  const currentFeed = feedConfig[selectedCamera] || { creche: 'Telkoi Konark Crèche', bg: 'bg-[#0f1d3a]', alertText: '', conf: '' };

  return (
    <div className="h-screen bg-[#FAFAFA] dark:bg-slate-900 flex font-sans overflow-hidden transition-colors duration-200 relative">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-900 text-white text-sm font-semibold shadow-xl border border-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Navbar */}
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Main Body */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto no-scrollbar">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
                Safety & CCTV
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                AI-powered video monitoring across 1,302 crèches
              </p>
            </div>
          </div>

          {/* 4-Card Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            
            {/* Active Cameras */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-6 shadow-sm flex flex-col justify-between hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-[#22c55e] flex items-center justify-center mb-4 transition-transform hover:scale-105 duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                </svg>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-semibold text-slate-800 dark:text-white leading-tight">
                  3,842
                </span>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">
                  Active Cameras
                </span>
              </div>
            </div>

            {/* Offline Cameras */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-6 shadow-sm flex flex-col justify-between hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/20 text-[#ef4444] flex items-center justify-center mb-4 transition-transform hover:scale-105 duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-semibold text-slate-800 dark:text-white leading-tight">
                  18
                </span>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">
                  Offline
                </span>
              </div>
            </div>

            {/* Detections Today */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-6 shadow-sm flex flex-col justify-between hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-950/20 text-[#f59e0b] flex items-center justify-center mb-4 transition-transform hover:scale-105 duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-semibold text-slate-800 dark:text-white leading-tight">
                  124
                </span>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">
                  Detections Today
                </span>
              </div>
            </div>

            {/* AI Confidence */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-6 shadow-sm flex flex-col justify-between hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 transition-transform hover:scale-105 duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-semibold text-slate-800 dark:text-white leading-tight">
                  98.6%
                </span>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">
                  AI Confidence
                </span>
              </div>
            </div>

          </div>

          {/* Bottom Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            
            {/* Live Camera View Block */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-6 shadow-sm flex flex-col justify-between transition-all">
              {/* Header Title / Live indicator */}
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping shrink-0"></span>
                  <span className="text-xs font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase select-none">
                    LIVE FEED
                  </span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-white">
                    {selectedCamera} · {currentFeed.creche}
                  </span>
                </div>
              </div>

              {/* Main Player Screen Area */}
              <div className={`w-full ${currentFeed.bg} rounded-2xl relative overflow-hidden flex flex-col justify-between p-4 shadow-inner border border-slate-950 aspect-video`}>
                {/* Top overlay */}
                <div className="flex items-center gap-2 text-[10px] sm:text-xs font-semibold text-white bg-slate-900/60 backdrop-blur-xs px-3 py-1.5 rounded-lg w-max select-none shadow-xs border border-white/5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  <span>LIVE · {selectedCamera} · {currentFeed.creche}</span>
                </div>

                {/* Golden Overlay Bounding Box (Only on CAM-104) */}
                {currentFeed.alertText && (
                  <div className="border-2 border-amber-500 bg-amber-500/10 rounded-2xl p-4 absolute left-6 right-6 top-1/2 -translate-y-1/2 max-w-md mx-auto shadow-lg animate-pulse backdrop-blur-3xs">
                    <span className="inline-flex items-center gap-1 bg-amber-500 text-slate-950 text-[10px] font-bold uppercase px-2 py-0.5 rounded-md leading-none mb-2">
                      AI · {currentFeed.conf}
                    </span>
                    <p className="text-sm sm:text-base font-bold text-amber-500 uppercase tracking-wide leading-none">
                      {currentFeed.alertText}
                    </p>
                  </div>
                )}

                {/* Bottom toolbar & time */}
                <div className="w-full flex items-center justify-between gap-4 mt-auto">
                  {/* Action controls panel */}
                  <div className="bg-slate-900/70 backdrop-blur-xs py-2 px-3 rounded-full border border-white/5 flex items-center gap-3.5 shadow-md">
                    <button className="text-slate-400 hover:text-white transition-colors" title="Zoom In">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637zM10.5 7.5v6m3-3h-6" />
                      </svg>
                    </button>
                    <button className="text-slate-400 hover:text-white transition-colors" title="Add Text">
                      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </button>
                    <button className="text-slate-400 hover:text-white transition-colors" title="Draw">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                      </svg>
                    </button>
                    <button className="text-slate-400 hover:text-white transition-colors" title="Audio Chat">
                      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                      </svg>
                    </button>
                  </div>

                  {/* Time indicator overlay */}
                  <span className="text-[11px] font-semibold text-white bg-slate-900/60 backdrop-blur-xs px-3 py-1.5 rounded-lg select-none shadow-xs border border-white/5">
                    {currentTime}
                  </span>
                </div>

              </div>

              {/* Bottom Camera Selectors Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                {Object.keys(feedConfig).map((cam) => {
                  const isActive = selectedCamera === cam;
                  const cfg = feedConfig[cam];
                  return (
                    <button
                      key={cam}
                      onClick={() => setSelectedCamera(cam)}
                      className={`h-16 sm:h-20 ${cfg.bg} rounded-xl relative overflow-hidden flex flex-col justify-end p-2 sm:p-3 select-none border-2 transition-all text-left ${
                        isActive ? 'border-cyan-500 shadow-md ring-4 ring-cyan-500/10' : 'border-slate-200 dark:border-slate-700/60 hover:opacity-80'
                      }`}
                    >
                      <span className="absolute top-1.5 left-1.5 text-[9px] sm:text-[10px] font-semibold text-white leading-none bg-slate-950/40 p-1 rounded-md">
                        {cam}
                      </span>
                      {cfg.alertText && (
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500 absolute top-2 right-2 animate-ping"></div>
                      )}
                      <span className="block text-[8px] sm:text-[10px] font-semibold text-slate-400 truncate w-full mt-auto">
                        {cfg.creche.replace(' Crèche', '').replace(' Kendra', '')}
                      </span>
                    </button>
                  );
                })}
              </div>

            </div>

            {/* AI Detections Panel */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-6 shadow-sm flex flex-col transition-colors">
              <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white mb-6">
                AI Detections
              </h3>

              <div className="space-y-4 overflow-y-auto no-scrollbar max-h-[500px]">
                {alerts.map((item) => {
                  const isSelected = selectedAlertId === item.id;
                  return (
                    <div 
                      key={item.id}
                      onClick={() => setSelectedAlertId(item.id)}
                      className={`flex flex-col gap-3 p-5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-[#eefcfc]/30 dark:bg-cyan-950/10 border-cyan-300 dark:border-cyan-800' 
                          : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700/60 hover:shadow-xs'
                      }`}
                    >
                      {/* Top Header line */}
                      <div className="flex items-center justify-between gap-4 w-full">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          item.type === 'Critical'
                            ? 'bg-[#fff5f5] text-[#f03e3e] border border-[#f03e3e]/10'
                            : item.type === 'High'
                            ? 'bg-[#fffbeb] text-[#f59e0b] border border-[#f59e0b]/10'
                            : 'bg-[#f8f9fa] text-[#495057] border border-[#495057]/10'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            item.type === 'Critical' ? 'bg-[#f03e3e]' : item.type === 'High' ? 'bg-[#f59e0b]' : 'bg-[#495057]'
                          }`}></span>
                          {item.type}
                        </span>
                        
                        <span className="text-[10px] font-semibold text-slate-400">
                          {item.time}
                        </span>
                      </div>

                      {/* Info description */}
                      <div className="min-w-0">
                        <h4 className="font-semibold text-sm text-slate-800 dark:text-white leading-tight">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 truncate">
                          {item.camera} · {item.creche}
                        </p>
                      </div>

                      {/* Trigger actions */}
                      <div className="flex items-center gap-2.5 pt-1 mt-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenAssign(item);
                          }}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#078662] hover:bg-[#066e51] transition-colors cursor-pointer"
                        >
                          Assign
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleResolveAlert(item.id, item.title);
                          }}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-800 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                        >
                          Resolve
                        </button>
                      </div>

                    </div>
                  );
                })}
                {alerts.length === 0 && (
                  <div className="text-center py-8 text-slate-400 font-semibold text-sm">
                    No active detections today.
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* Detection Categories Full-Width Section */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-6 shadow-sm flex flex-col transition-colors">
            <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white mb-6">
              Detection Categories
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Fall Detection */}
              <div className="bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-700/50 rounded-2xl p-5 flex flex-col justify-between min-h-[100px] shadow-2xs">
                <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <div>
                  <span className="block text-2xl font-bold text-slate-800 dark:text-white leading-none">14</span>
                  <span className="block text-xs font-medium text-slate-400 mt-1.5">Fall Detection</span>
                </div>
              </div>

              {/* Distress */}
              <div className="bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-700/50 rounded-2xl p-5 flex flex-col justify-between min-h-[100px] shadow-2xs">
                <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <div>
                  <span className="block text-2xl font-bold text-slate-800 dark:text-white leading-none">6</span>
                  <span className="block text-xs font-medium text-slate-400 mt-1.5">Distress</span>
                </div>
              </div>

              {/* Unauthorized Entry */}
              <div className="bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-700/50 rounded-2xl p-5 flex flex-col justify-between min-h-[100px] shadow-2xs">
                <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <span className="block text-2xl font-bold text-slate-800 dark:text-white leading-none">9</span>
                  <span className="block text-xs font-medium text-slate-400 mt-1.5">Unauthorized Entry</span>
                </div>
              </div>

              {/* Crowd Monitoring */}
              <div className="bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-700/50 rounded-2xl p-5 flex flex-col justify-between min-h-[100px] shadow-2xs">
                <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <span className="block text-2xl font-bold text-slate-800 dark:text-white leading-none">23</span>
                  <span className="block text-xs font-medium text-slate-400 mt-1.5">Crowd Monitoring</span>
                </div>
              </div>

            </div>
          </div>

        </main>
      </div>

      {/* Assign Modal Overlay */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-all animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 w-full max-w-md shadow-2xl overflow-hidden p-6 sm:p-8 relative animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700/60 mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Assign Incident Handler</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Assign staff to check on camera alert</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAssignModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  Select Staff Member
                </label>
                <select
                  value={assignedStaff}
                  onChange={(e) => setAssignedStaff(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="Laxmi Priya">Laxmi Priya (Crèche Supervisor)</option>
                  <option value="Priyanka Mohanty">Priyanka Mohanty (Primary Health Worker)</option>
                  <option value="Sasmita Rani">Sasmita Rani (Nutritionist)</option>
                  <option value="Field Inspector Singh">Field Inspector Singh (Security Expert)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  Incident Type
                </label>
                <input
                  type="text"
                  readOnly
                  disabled
                  value={assignTarget ? `${assignTarget.title} · ${assignTarget.camera}` : ''}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-500 dark:text-slate-400 focus:outline-none select-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-700/60 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#078662] hover:bg-[#066e51] transition-colors cursor-pointer"
                >
                  Submit Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
