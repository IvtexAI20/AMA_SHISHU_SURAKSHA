import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveName = () => {
    if (location.pathname === '/creches') return 'Crèches';
    if (location.pathname === '/children') return 'Children';
    if (location.pathname === '/nutrition') return 'Nutrition';
    if (location.pathname === '/safety') return 'Safety & CCTV';
    if (location.pathname === '/health') return 'Health';
    if (location.pathname === '/incidents') return 'Incidents';
    if (location.pathname === '/inspections') return 'Inspections';
    if (location.pathname === '/reports') return 'Reports';
    if (location.pathname === '/settings') return 'Settings';
    return 'Dashboard';
  };

  const activeItem = getActiveName();

  const menuItems = [
    {
      name: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      )
    },
    {
      name: 'Crèches',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      name: 'Children',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      name: 'Nutrition',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      name: 'Safety & CCTV',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      name: 'Health',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    },

    {
      name: 'Incidents',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    },
    {
      name: 'Inspections',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    },

    {
      name: 'Reports',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },


    {
      name: 'Settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  return (
    <>
      {/* Mobile & Tablet Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar Container: Fixed slide-over drawer on mobile/tablet, sticky left panel on desktop */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 lg:w-72 shrink-0 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex flex-col font-sans select-none border-r border-slate-100 dark:border-slate-700/60 shadow-lg lg:shadow-xs transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >

        {/* Header Profile Section */}
        <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60">
          <div className="flex items-center gap-4">
            {/* Profile Avatar */}
            <div className="w-12 h-12 rounded-full bg-[#078662]/10 flex items-center justify-center text-[#078662] font-bold text-lg">
              AS
            </div>

            {/* Title Details */}
            <div className="flex flex-col">
              <h2 className="text-slate-800 dark:text-white font-bold text-sm tracking-wide leading-tight">
                AMA SHISHU
              </h2>
              <span className="text-[10px] font-bold text-[#078662] tracking-wider uppercase mt-0.5">
                SURAKSHA PLATFORM
              </span>
            </div>
          </div>

          {/* Mobile Close (X) Button */}
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-650 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors lg:hidden"
            title="Close Sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 px-4 py-6 overflow-y-auto space-y-1.5 no-scrollbar">
          {menuItems.map((item) => {
            const isActive = activeItem === item.name;
            return (
              <button
                key={item.name}
                onClick={() => {
                  if (item.name === 'Crèches') navigate('/creches');
                  else if (item.name === 'Dashboard') navigate('/dashboard');
                  else if (item.name === 'Children') navigate('/children');
                  else if (item.name === 'Nutrition') navigate('/nutrition');
                  else if (item.name === 'Safety & CCTV') navigate('/safety');
                  else if (item.name === 'Health') navigate('/health');
                  else if (item.name === 'Incidents') navigate('/incidents');
                  else if (item.name === 'Inspections') navigate('/inspections');
                  else if (item.name === 'Reports') navigate('/reports');
                  else if (item.name === 'Settings') navigate('/settings');
                  if (onClose) onClose();
                }}
                className={`w-full flex items-center justify-between py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 group ${isActive
                  ? 'bg-[#078662] text-white shadow-sm'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-700/40 hover:text-slate-800 dark:hover:text-white text-slate-500 dark:text-slate-400'
                  }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className={`transition-colors duration-200 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-650'
                    }`}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </div>
              </button>
            );
          })}
        </div>

      </aside>
    </>
  );
}
