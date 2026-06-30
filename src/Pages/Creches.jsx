import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import dbData from '../data.json';

const mockCreches = dbData.creches;

export default function Creches() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [crechesList, setCrechesList] = useState(mockCreches);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('All Blocks');
  const [selectedRisk, setSelectedRisk] = useState('All Risk Levels');
  
  // Registration Modal State
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [formCreche, setFormCreche] = useState({
    name: '',
    code: '',
    block: 'Joda Block',
    children: '',
    attendance: '90%',
    safety: '85',
    status: 'Healthy'
  });

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!formCreche.name.trim()) return;

    const autoCode = formCreche.code.trim() || `OD/KJR/${1025 + crechesList.length}`;
    const newRecord = {
      id: Date.now(),
      name: formCreche.name.trim(),
      code: autoCode,
      district: 'Keonjhar',
      block: formCreche.block,
      status: formCreche.status,
      children: Number(formCreche.children) || 30,
      attendance: formCreche.attendance || '90%',
      safety: Number(formCreche.safety) || 85
    };

    setCrechesList([newRecord, ...crechesList]);
    setShowRegisterModal(false);
    setFormCreche({
      name: '',
      code: '',
      block: 'Joda Block',
      children: '',
      attendance: '90%',
      safety: '85',
      status: 'Healthy'
    });
  };

  const filteredCreches = crechesList.filter((creche) => {
    const matchesSearch = 
      creche.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      creche.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      creche.block.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBlock = selectedBlock === 'All Blocks' || creche.block === selectedBlock;
    const matchesRisk = selectedRisk === 'All Risk Levels' || creche.status === selectedRisk;

    return matchesSearch && matchesBlock && matchesRisk;
  });

  return (
    <div className="h-screen bg-[#FAFAFA] dark:bg-slate-900 flex font-sans overflow-hidden transition-colors duration-200">
      {/* Sticky Left Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Navbar */}
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Scrollable Main Body */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto no-scrollbar">
          
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
                Crèche Monitoring
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                <span className="font-bold text-slate-800 dark:text-slate-200">1,302 crèches</span> · Keonjhar District
              </p>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              <button className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-xs">
                <svg className="w-4 h-4 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                <span>Export</span>
              </button>

              <button 
                onClick={() => setShowRegisterModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#078662] hover:bg-[#066e51] rounded-full transition-colors shadow-sm cursor-pointer active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span>Register Crèche</span>
              </button>
            </div>
          </div>

          {/* Search & Filters Controls Container */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-4 mb-6 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4 transition-colors">
            {/* Search Bar */}
            <div className="relative w-full lg:max-w-xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or code..."
                className="w-full pl-11 pr-4 py-2.5 bg-slate-100/70 dark:bg-slate-900/60 border-none rounded-full text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3 w-full lg:w-auto">
              {/* Keonjhar Blocks Dropdown */}
              <div className="relative">
                <select
                  value={selectedBlock}
                  onChange={(e) => setSelectedBlock(e.target.value)}
                  className="appearance-none bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full pl-4 pr-9 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="All Blocks">All Keonjhar Blocks</option>
                  <option value="Joda Block">Joda Block</option>
                  <option value="Champua Block">Champua Block</option>
                  <option value="Anandapur Block">Anandapur Block</option>
                  <option value="Ghatagaon Block">Ghatagaon Block</option>
                  <option value="Harichandanpur Block">Harichandanpur Block</option>
                  <option value="Telkoi Block">Telkoi Block</option>
                  <option value="Banspal Block">Banspal Block</option>
                  <option value="Jhumpura Block">Jhumpura Block</option>
                  <option value="Saharpada Block">Saharpada Block</option>
                  <option value="Patna Block">Patna Block</option>
                  <option value="Hatadihi Block">Hatadihi Block</option>
                  <option value="Keonjhar Town">Keonjhar Town</option>
                </select>
                <svg className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Risk Level Dropdown */}
              <div className="relative">
                <select
                  value={selectedRisk}
                  onChange={(e) => setSelectedRisk(e.target.value)}
                  className="appearance-none bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full pl-4 pr-9 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="All Risk Levels">All Risk Levels</option>
                  <option value="Healthy">Healthy</option>
                  <option value="Warning">Warning</option>
                  <option value="Critical">Critical</option>
                </select>
                <svg className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Crèches Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCreches.map((creche) => (
              <div 
                key={creche.id}
                className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-5 flex flex-col justify-between hover:shadow-md transition-all group cursor-pointer"
              >
                <div>
                  {/* Top Header Row */}
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-base font-semibold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                      {creche.name}
                    </h3>

                    {/* Status Pill Badge */}
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold shrink-0 ${
                      creche.status === 'Healthy' 
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30' 
                        : creche.status === 'Warning'
                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30'
                        : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        creche.status === 'Healthy' ? 'bg-emerald-500' : creche.status === 'Warning' ? 'bg-amber-500' : 'bg-rose-500'
                      }`}></span>
                      {creche.status}
                    </span>
                  </div>

                  {/* Code & Location */}
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mb-1">
                    {creche.code}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-6">
                    {creche.district} · {creche.block}
                  </p>
                </div>

                {/* Metrics 3-Column Grid */}
                <div className="grid grid-cols-3 gap-2 text-center pt-3 border-t border-slate-100 dark:border-slate-700/50">
                  <div>
                    <span className="block text-base font-semibold text-slate-800 dark:text-white leading-tight">
                      {creche.children}
                    </span>
                    <span className="block text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-0.5">
                      Children
                    </span>
                  </div>

                  <div>
                    <span className="block text-base font-semibold text-slate-800 dark:text-white leading-tight">
                      {creche.attendance}
                    </span>
                    <span className="block text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-0.5">
                      Attendance
                    </span>
                  </div>

                  <div>
                    <span className="block text-base font-semibold text-slate-800 dark:text-white leading-tight">
                      {creche.safety}%
                    </span>
                    <span className="block text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-0.5">
                      Safe
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>

      {/* Register Crèche Modal Dialog */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-all animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 w-full max-w-lg shadow-2xl overflow-y-auto no-scrollbar max-h-[90vh] p-6 sm:p-8 relative animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700/60 mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Register New Crèche</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Enter details to add a new crèche to Keonjhar district</p>
              </div>
              <button 
                type="button"
                onClick={() => setShowRegisterModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Crèche Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anandapur Shishu Suraksha Kendra"
                  value={formCreche.name}
                  onChange={(e) => setFormCreche({ ...formCreche, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    Crèche Code (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. OD/KJR/1025"
                    value={formCreche.code}
                    onChange={(e) => setFormCreche({ ...formCreche, code: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    Keonjhar Block
                  </label>
                  <select
                    value={formCreche.block}
                    onChange={(e) => setFormCreche({ ...formCreche, block: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Joda Block">Joda Block</option>
                    <option value="Champua Block">Champua Block</option>
                    <option value="Anandapur Block">Anandapur Block</option>
                    <option value="Ghatagaon Block">Ghatagaon Block</option>
                    <option value="Harichandanpur Block">Harichandanpur Block</option>
                    <option value="Telkoi Block">Telkoi Block</option>
                    <option value="Banspal Block">Banspal Block</option>
                    <option value="Jhumpura Block">Jhumpura Block</option>
                    <option value="Saharpada Block">Saharpada Block</option>
                    <option value="Patna Block">Patna Block</option>
                    <option value="Hatadihi Block">Hatadihi Block</option>
                    <option value="Keonjhar Town">Keonjhar Town</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    Enrolled
                  </label>
                  <input
                    type="number"
                    placeholder="30"
                    value={formCreche.children}
                    onChange={(e) => setFormCreche({ ...formCreche, children: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    Attendance
                  </label>
                  <input
                    type="text"
                    placeholder="90%"
                    value={formCreche.attendance}
                    onChange={(e) => setFormCreche({ ...formCreche, attendance: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    Safe
                  </label>
                  <input
                    type="number"
                    placeholder="85"
                    value={formCreche.safety}
                    onChange={(e) => setFormCreche({ ...formCreche, safety: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    Status
                  </label>
                  <select
                    value={formCreche.status}
                    onChange={(e) => setFormCreche({ ...formCreche, status: e.target.value })}
                    className="w-full px-2 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Healthy">Healthy</option>
                    <option value="Warning">Warning</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700/60 mt-6">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-5 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-semibold text-white bg-[#078662] hover:bg-[#066e51] rounded-full shadow-md transition-all active:scale-95"
                >
                  Save & Register
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
