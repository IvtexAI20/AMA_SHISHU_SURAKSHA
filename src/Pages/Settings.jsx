import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  // Form states
  const [profile, setProfile] = useState({
    name: 'Pratima Devi',
    email: 'admin@odisha.gov.in',
    district: 'Khordha',
    role: 'Super Admin'
  });

  const [notifications, setNotifications] = useState({
    dailyDigest: true,
    safetyAlerts: true,
    weeklyReminders: false,
    smsAlerts: true
  });

  const [cctv, setCctv] = useState({
    resolution: '1080p',
    retention: '30'
  });

  // Load and sync Dark Mode state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleSave = (e) => {
    e.preventDefault();
    triggerToast('Settings saved successfully!');
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

        {/* Scrollable body */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto no-scrollbar space-y-6">

          {/* Header section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Settings
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                Configure system preferences and admin profile
              </p>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex border-b border-slate-200 dark:border-slate-700/60 pb-1.5 gap-6 select-none shrink-0 overflow-x-auto no-scrollbar">
            {[
              { id: 'profile', name: 'Profile Settings' },
              { id: 'notifications', name: 'Notifications' },
              { id: 'cctv', name: 'CCTV & Streams' },
              { id: 'theme', name: 'Theme Options' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 text-sm font-semibold relative transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-[#078662] dark:text-[#09a377]'
                    : 'text-slate-400 hover:text-slate-650 dark:hover:text-white'
                }`}
              >
                <span>{tab.name}</span>
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#078662] dark:bg-[#09a377] rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Contents Card */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-sm p-6 sm:p-8 transition-colors max-w-3xl">
            <form onSubmit={handleSave} className="space-y-6">
              
              {activeTab === 'profile' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-700/60">
                    {/* Avatar display */}
                    <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-[#078662] dark:text-emerald-400 font-bold text-2xl flex items-center justify-center border-2 border-emerald-100 dark:border-emerald-800/40 select-none shadow-sm">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="text-center sm:text-left space-y-1">
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white">{profile.name}</h3>
                      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{profile.role}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">District: {profile.district}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-450 uppercase tracking-wider mb-2">Full Name</label>
                      <input
                        type="text"
                        required
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus-glow-brand transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-455 uppercase tracking-wider mb-2">Email Address</label>
                      <input
                        type="email"
                        required
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus-glow-brand transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-455 uppercase tracking-wider mb-2">District Jurisdiction</label>
                      <input
                        type="text"
                        required
                        value={profile.district}
                        onChange={(e) => setProfile({ ...profile, district: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus-glow-brand transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-455 uppercase tracking-wider mb-2">System Role</label>
                      <input
                        type="text"
                        disabled
                        value={profile.role}
                        className="w-full px-4 py-2.5 border border-slate-100 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-900 text-sm text-slate-400 dark:text-slate-500 rounded-xl select-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6 text-left animate-in fade-in duration-200">
                  <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Alert Configurations</h3>
                  
                  <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                    {[
                      { key: 'dailyDigest', label: 'Daily Attendance summary digest', desc: 'Email summary reports of district crèches attendance counts.' },
                      { key: 'safetyAlerts', label: 'Critical safety & CCTV incidents', desc: 'Instant email/SMS triggers on hazard detections or camera loss.' },
                      { key: 'weeklyReminders', label: 'Weekly inspections checklists summary', desc: 'Reminders for due and scheduled inspection items.' },
                      { key: 'smsAlerts', label: 'SMS Notification alerts', desc: 'Direct critical alert transmissions to registered phone contacts.' }
                    ].map(item => (
                      <div key={item.key} className="py-4.5 flex items-center justify-between gap-6">
                        <div className="space-y-1">
                          <label className="text-sm font-bold text-slate-800 dark:text-white cursor-pointer select-none" htmlFor={item.key}>
                            {item.label}
                          </label>
                          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer select-none">
                          <input
                            type="checkbox"
                            id={item.key}
                            checked={notifications[item.key]}
                            onChange={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
                            className="sr-only peer"
                          />
                          <div className="w-10 h-5.5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-[#078662] dark:peer-checked:bg-[#09a377]"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'cctv' && (
                <div className="space-y-6 text-left animate-in fade-in duration-200">
                  <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">CCTV Feed Preferences</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-455 uppercase tracking-wider mb-2">Live Stream Resolution</label>
                      <select
                        value={cctv.resolution}
                        onChange={(e) => setCctv({ ...cctv, resolution: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#078662]/20"
                      >
                        <option value="720p">HD 720p (Data Saver)</option>
                        <option value="1080p">Full HD 1080p (Standard)</option>
                        <option value="4K">Ultra HD 4K (High Bandwidth)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-455 uppercase tracking-wider mb-2">Retention Storage duration</label>
                      <select
                        value={cctv.retention}
                        onChange={(e) => setCctv({ ...cctv, retention: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#078662]/20"
                      >
                        <option value="15">15 Days Archive</option>
                        <option value="30">30 Days (Recommended)</option>
                        <option value="90">90 Days (Enterprise)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'theme' && (
                <div className="space-y-6 text-left animate-in fade-in duration-200">
                  <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Appearance Selection</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setIsDarkMode(false)}
                      className={`flex flex-col items-center gap-3 p-5 rounded-2xl border text-center transition-all cursor-pointer ${
                        !isDarkMode
                          ? 'border-[#078662] bg-[#078662]/5 text-[#078662]'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m2.828 0l-.707-.707m2.828-11.314l-.707-.707M12 7a5 5 0 100 10 5 5 0 000-10z" />
                      </svg>
                      <span className="text-sm font-bold">Light Mode</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsDarkMode(true)}
                      className={`flex flex-col items-center gap-3 p-5 rounded-2xl border text-center transition-all cursor-pointer ${
                        isDarkMode
                          ? 'border-[#078662] dark:border-[#09a377] bg-[#078662]/5 dark:bg-emerald-950/20 text-[#078662] dark:text-emerald-400'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                      <span className="text-sm font-bold">Dark Mode</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Form Action Footer */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-700/60 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 text-sm font-bold text-white bg-[#078662] hover:bg-[#066e51] rounded-full transition-all cursor-pointer shadow-sm active:scale-95 premium-btn whitespace-nowrap"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>

        </main>
      </div>
    </div>
  );
}
