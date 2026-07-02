import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

import dbData from '../data.json';

const initialComplianceData = dbData.complianceData;
const initialRecentUploads = dbData.recentUploads;

export default function Nutrition() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [recentUploads, setRecentUploads] = useState(() => {
    const saved = localStorage.getItem('recentUploads');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return initialRecentUploads;
  });
  const [complianceData, setComplianceData] = useState(() => {
    const saved = localStorage.getItem('complianceData');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return initialComplianceData;
  });
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Form State for Meal Upload
  const [formData, setFormData] = useState({
    creche: 'Champua Ananda Kendra',
    mealType: 'Lunch',
    items: '',
    photo: null,
  });

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg('');
    }, 4000);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }));
    }
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newUpload = {
      id: Date.now(),
      creche: formData.creche,
      desc: formData.items.trim() || 'Ragi Porridge + Milk',
      time: timestamp,
      status: 'New',
    };

    // Update listings
    const updatedUploads = [newUpload, ...recentUploads];
    setRecentUploads(updatedUploads);
    localStorage.setItem('recentUploads', JSON.stringify(updatedUploads));
    
    // Add compliance bump for this crèche
    const updatedData = complianceData.map(c => {
      if (c.name === formData.creche) {
        return { ...c, compliance: Math.min(100, c.compliance + 5) };
      }
      return c;
    });
    setComplianceData(updatedData);
    localStorage.setItem('complianceData', JSON.stringify(updatedData));

    setShowUploadModal(false);
    triggerToast(`Meal uploaded successfully for ${formData.creche}!`);
    setFormData({
      creche: 'Champua Ananda Kendra',
      mealType: 'Lunch',
      items: '',
      photo: null,
    });
  };

  // Helper styling methods for Compliance bars
  const getComplianceColor = (val) => {
    if (val >= 90) return 'bg-[#22c55e]'; // Green
    if (val >= 80) return 'bg-[#8cc63f]'; // Lime Green
    if (val >= 70) return 'bg-[#f59e0b]'; // Orange/Amber
    return 'bg-[#e03e3e]'; // Red
  };

  const getComplianceTextColor = (val) => {
    if (val >= 90) return 'text-[#22c55e]';
    if (val >= 80) return 'text-[#8cc63f]';
    if (val >= 70) return 'text-[#f59e0b]';
    return 'text-[#e03e3e]';
  };

  const getComplianceBadge = (val) => {
    if (val >= 90) {
      return (
        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-[#e6fcf5] text-[#0ca678] border border-[#0ca678]/10 whitespace-nowrap">
          Excellent
        </span>
      );
    }
    if (val >= 80) {
      return (
        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-[#f4fce3] text-[#74b816] border border-[#74b816]/10 whitespace-nowrap">
          Good
        </span>
      );
    }
    if (val >= 70) {
      return (
        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-[#fff9db] text-[#f59f00] border border-[#f59f00]/10 whitespace-nowrap">
          Needs Attention
        </span>
      );
    }
    return (
      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-[#fff5f5] text-[#f03e3e] border border-[#f03e3e]/10 whitespace-nowrap">
        Needs Improvement
      </span>
    );
  };

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
                Nutrition Intelligence
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                Meal compliance, food quality and AI validation
              </p>
            </div>
            
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#078662] hover:bg-[#066e51] rounded-full transition-all shadow-sm cursor-pointer active:scale-95 premium-btn self-end sm:self-auto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <span>Upload Meal</span>
            </button>
          </div>

          {/* 4-Card Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            
            {/* Avg Compliance */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-none hover:-translate-y-1">
              <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-[#22c55e] flex items-center justify-center mb-4 transition-transform hover:scale-105 duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="block text-xl sm:text-2xl font-semibold text-slate-800 dark:text-white leading-tight">
                94.2%
              </span>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
                Avg Compliance
              </span>
              <span className="block text-xs text-slate-400 mt-2 font-semibold">
                <span className="text-emerald-500 font-bold">+0.6%</span> vs last week
              </span>
            </div>

            {/* Meals Logged Today */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-none hover:-translate-y-1">
              <div className="w-10 h-10 rounded-full bg-sky-50 dark:bg-sky-950/20 text-[#0ea5e9] flex items-center justify-center mb-4 transition-transform hover:scale-105 duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <span className="block text-xl sm:text-2xl font-semibold text-slate-800 dark:text-white leading-tight">
                1,184
              </span>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
                Meals Logged Today
              </span>
              <span className="block text-xs text-slate-400 mt-2 font-semibold">
                <span className="font-bold text-slate-600 dark:text-slate-300">91%</span> of expected
              </span>
            </div>

            {/* Quality Flags */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-none hover:-translate-y-1">
              <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-950/20 text-[#f59e0b] flex items-center justify-center mb-4 transition-transform hover:scale-105 duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <span className="block text-xl sm:text-2xl font-semibold text-slate-800 dark:text-white leading-tight">
                27
              </span>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
                Quality Flags
              </span>
              <span className="block text-xs text-slate-400 mt-2 font-semibold">
                Auto-detected by AI
              </span>
            </div>

            {/* Children at Risk */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-none hover:-translate-y-1">
              <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/20 text-[#ef4444] flex items-center justify-center mb-4 transition-transform hover:scale-105 duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <span className="block text-xl sm:text-2xl font-semibold text-slate-800 dark:text-white leading-tight">
                143
              </span>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
                Children at Risk
              </span>
              <span className="block text-xs text-slate-400 mt-2 font-semibold">
                Nutrition gap detected
              </span>
            </div>

          </div>

          {/* Bottom Grid Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Custom Compliance Progress Table exactly matching the image */}
            <div className="xl:col-span-2 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-6 shadow-sm flex flex-col justify-between transition-all">
              
              {/* Header block with Total Creches badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                    Today's Meal Compliance by Crèche
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
                    Percentage of children who received meals today
                  </p>
                </div>
                
                {/* Total Crèches Box */}
                <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/50 dark:border-blue-900/30 rounded-2xl py-3 px-5 flex items-center gap-4.5 shrink-0 shadow-xs">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Crèches</span>
                    <span className="block text-xl font-semibold text-blue-600 dark:text-blue-400 leading-none mt-1">12</span>
                  </div>
                </div>
              </div>

              {/* Table Column Labels */}
              <div className="hidden sm:grid grid-cols-12 gap-4 pb-3.5 border-b border-slate-100 dark:border-slate-700/50 text-[10px] sm:text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                <div className="col-span-3">Crèche</div>
                <div className="col-span-7 text-left px-4">Meal Compliance (%)</div>
                <div className="col-span-2 text-right"></div>
              </div>

              {/* Scrollable List container */}
              <div className="divide-y divide-slate-100 dark:divide-slate-700/50 overflow-y-auto no-scrollbar max-h-[380px] min-h-[360px]">
                {complianceData.map((item) => (
                  <div key={item.name} className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-4 py-4.5 items-stretch sm:items-center hover:bg-slate-50/20 dark:hover:bg-slate-900/10 transition-colors">
                    
                    {/* Crèche Name / Title line */}
                    <div className="flex items-center justify-between sm:col-span-3">
                      <span className="font-semibold text-xs text-slate-700 dark:text-slate-200 leading-tight">
                        {item.name}
                      </span>
                      {/* Mobile Badge indicator */}
                      <div className="flex items-center gap-2 sm:hidden shrink-0">
                        <span className={`text-xs font-bold leading-none ${getComplianceTextColor(item.compliance)}`}>
                          {item.compliance}%
                        </span>
                        {getComplianceBadge(item.compliance)}
                      </div>
                    </div>

                    {/* Progress Bar Column */}
                    <div className="sm:col-span-7 px-4 flex items-center w-full">
                      <div className="w-full bg-[#f1f5f9] dark:bg-slate-700/60 rounded-full h-4 sm:h-5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${getComplianceColor(item.compliance)}`} 
                          style={{ width: `${item.compliance}%` }}
                        />
                      </div>
                    </div>

                    {/* Desktop Score Value & Quality Label */}
                    <div className="hidden sm:flex sm:col-span-2 text-right flex-col items-end gap-1 shrink-0">
                      <span className={`text-sm font-semibold leading-none ${getComplianceTextColor(item.compliance)}`}>
                        {item.compliance}%
                      </span>
                      {getComplianceBadge(item.compliance)}
                    </div>

                  </div>
                ))}
              </div>

              {/* Bottom Grid X-Axis Ticks */}
              <div className="hidden sm:grid grid-cols-12 gap-4 pt-4 border-t border-slate-100 dark:border-slate-700/50 mt-2">
                <div className="col-span-3"></div>
                <div className="col-span-7 px-4 w-full relative">
                  <div className="flex justify-between text-[11px] font-bold text-slate-400 dark:text-slate-500 pr-1 select-none">
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>
                  </div>
                </div>
                <div className="col-span-2"></div>
              </div>

            </div>

            {/* Recent Meal Uploads Card */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-6 shadow-sm flex flex-col transition-colors">
              <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white mb-6">
                Recent Meal Uploads
              </h3>

              <div className="space-y-4 overflow-y-auto no-scrollbar max-h-[460px]">
                {recentUploads.map((item) => (
                  <div 
                    key={item.id}
                    className="flex items-center justify-between gap-4 p-3 rounded-2xl border border-slate-50 dark:border-slate-700/30 bg-slate-50/20 dark:bg-slate-900/10 hover:shadow-xs transition-shadow"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
                        {/* Food icon svg */}
                        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-slate-800 dark:text-white truncate">
                          {item.creche}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5 truncate">
                          {item.desc} {item.time && `· ${item.time}`}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        item.status === 'Approved'
                          ? 'bg-[#edf9f1] dark:bg-emerald-950/40 text-[#22c55e] dark:text-emerald-400 border border-[#22c55e]/15'
                          : item.status === 'Investigating'
                          ? 'bg-[#fffbeb] dark:bg-amber-950/40 text-[#f59e0b] dark:text-amber-400 border border-[#f59e0b]/15'
                          : 'bg-[#f0f9ff] dark:bg-sky-950/40 text-[#0284c7] dark:text-sky-400 border border-[#0284c7]/15'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          item.status === 'Approved' ? 'bg-[#22c55e]' : item.status === 'Investigating' ? 'bg-[#f59e0b]' : 'bg-[#0284c7]'
                        }`}></span>
                        {item.status}
                      </span>
                    </div>

                  </div>
                ))}
              </div>

            </div>

          </div>

        </main>
      </div>

      {/* Upload Meal Modal Overlay */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-all animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 w-full max-w-md shadow-2xl overflow-hidden p-6 sm:p-8 relative animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700/60 mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Upload Meal Information</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Submit meal details for AI food validation</p>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Select Crèche
                </label>
                <select
                  value={formData.creche}
                  onChange={(e) => setFormData({ ...formData, creche: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {complianceData.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Meal Type
                </label>
                <select
                  value={formData.mealType}
                  onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="Morning Snack">Morning Snack</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Afternoon Snack">Afternoon Snack</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Items Served *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Khichdi + Egg + Banana"
                  value={formData.items}
                  onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Photo upload */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Meal Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  id="meal-photo-input"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
                <label
                  htmlFor="meal-photo-input"
                  className="block border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer relative overflow-hidden min-h-[120px] flex flex-col items-center justify-center"
                >
                  {formData.photo ? (
                    <div className="w-full relative flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/50">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-white">
                          <img
                            src={URL.createObjectURL(formData.photo)}
                            alt="Meal preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-left min-w-0">
                          <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate max-w-[180px]">
                            {formData.photo.name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                            {(formData.photo.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setFormData({ ...formData, photo: null });
                        }}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                      >
                        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <>
                      <svg className="w-8 h-8 text-slate-400 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                      </svg>
                      <span className="block text-xs font-semibold text-slate-500">Drag image here or select file</span>
                      <span className="block text-[10px] text-slate-400 mt-1">Supports PNG, JPG (Max 5MB)</span>
                    </>
                  )}
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-700/60 mt-6">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#078662] hover:bg-[#066e51] transition-colors cursor-pointer"
                >
                  Submit Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
