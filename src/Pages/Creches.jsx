import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';

import dbData from '../data.json';

const initialMockCreches = dbData.creches.map(c => ({
  id: c.id,
  code: c.code,
  name: c.name,
  district: c.district,
  block: c.block,
  children: c.children,
  attendance: c.attendance,
  safety: c.safety,
  status: c.status,
  activityStatus: "Active",
  phone: `+91 98XX XXXX${20 + (c.id % 80)}`,
  staffCount: 2 + (c.id % 3),
  incidentsCount: c.id % 4,
  inspectionsCount: 1 + (c.id % 3),
  lastInspected: `2026-0${1 + (c.id % 5)}-1${c.id % 9}`
}));

const mockTrendData = dbData.crecheDetailTrendData;
const mockChildrenInCreche = dbData.mockChildrenInCreche;
const mockStaffInCreche = dbData.mockStaffInCreche;

export default function Creches() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [crechesList, setCrechesList] = useState(() => {
    const saved = localStorage.getItem('crechesList');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return initialMockCreches;
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('All Blocks');
  const [selectedRisk, setSelectedRisk] = useState('All Risk Levels');
  const [showOnlyActive, setShowOnlyActive] = useState(location.state?.filterActive || false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  
  const blocksList = ['All Blocks', ...new Set(initialMockCreches.map(c => c.block))];
  
  // Crèche Detail View state
  const [selectedCreche, setSelectedCreche] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Interactive calendar attendance days
  const [attendanceDays, setAttendanceDays] = useState(
    Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      status: i % 12 === 4 ? 'Absent' : i % 12 === 9 ? 'Leave' : 'Present',
    }))
  );

  // Health inspection logs
  const [healthLogs, setHealthLogs] = useState(dbData.crecheDetailHealthLogs);

  // New Crèche Form State
  const [formCreche, setFormCreche] = useState({
    name: '',
    code: '',
    district: 'Khordha',
    block: 'Block A',
    children: '',
    attendance: '90%',
    safety: '85',
    status: 'Healthy'
  });

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!formCreche.name.trim()) return;

    const autoCode = formCreche.code.trim() || `OD/CR/${1013 + crechesList.length}`;
    const newRecord = {
      id: Date.now(),
      code: autoCode,
      name: formCreche.name.trim(),
      district: formCreche.district,
      block: formCreche.block,
      children: Number(formCreche.children) || 30,
      attendance: formCreche.attendance.includes('%') ? formCreche.attendance : `${formCreche.attendance}%`,
      safety: Number(formCreche.safety) || 85,
      status: formCreche.status,
      activityStatus: "Active",
      phone: "+91 98XX XXXX99",
      staffCount: 3,
      incidentsCount: 0,
      inspectionsCount: 1,
      lastInspected: new Date().toISOString().split('T')[0]
    };

    const updatedList = [newRecord, ...crechesList];
    setCrechesList(updatedList);
    localStorage.setItem('crechesList', JSON.stringify(updatedList));
    setShowRegisterModal(false);
    setFormCreche({
      name: '',
      code: '',
      district: 'Khordha',
      block: 'Block A',
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
      creche.district.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBlock = selectedBlock === 'All Blocks' || creche.block === selectedBlock;
    const matchesRisk = selectedRisk === 'All Risk Levels' || creche.status === selectedRisk;
    const matchesActiveOnly = !showOnlyActive || creche.status !== 'Critical';

    return matchesSearch && matchesBlock && matchesRisk && matchesActiveOnly;
  });

  const totalItems = filteredCreches.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedCreches = filteredCreches.slice(startIndex, startIndex + itemsPerPage);

  const handleToggleAttendanceDay = (dayNum) => {
    setAttendanceDays(
      attendanceDays.map((d) => {
        if (d.day === dayNum) {
          const nextStatus = d.status === 'Present' ? 'Absent' : d.status === 'Absent' ? 'Leave' : 'Present';
          return { ...d, status: nextStatus };
        }
        return d;
      })
    );
  };

  // Risk badge styling helper
  const renderRiskBadge = (status) => {
    let dotColor = '';
    let bgColor = '';
    let textColor = '';
    let borderColor = '';

    switch (status) {
      case 'Healthy':
        dotColor = 'bg-emerald-500';
        bgColor = 'bg-emerald-50 dark:bg-emerald-950/20';
        textColor = 'text-emerald-700 dark:text-emerald-400';
        borderColor = 'border-emerald-100 dark:border-emerald-900/30';
        break;
      case 'Warning':
        dotColor = 'bg-amber-500';
        bgColor = 'bg-amber-50 dark:bg-amber-950/20';
        textColor = 'text-amber-700 dark:text-amber-400';
        borderColor = 'border-amber-100 dark:border-amber-900/30';
        break;
      case 'Critical':
        dotColor = 'bg-rose-500';
        bgColor = 'bg-rose-50 dark:bg-rose-950/20';
        textColor = 'text-rose-700 dark:text-rose-450';
        borderColor = 'border-rose-100 dark:border-rose-900/30';
        break;
      default:
        dotColor = 'bg-slate-400';
        bgColor = 'bg-slate-50 dark:bg-slate-900/50';
        textColor = 'text-slate-700 dark:text-slate-400';
        borderColor = 'border-slate-100';
    }

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${bgColor} ${textColor} ${borderColor}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
        {status}
      </span>
    );
  };

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
          
          {selectedCreche ? (
            // ================== DETAIL VIEW (MATCHING MOCKUP) ==================
            <div className="space-y-6">
              
              {/* Back to Listing link */}
              <button 
                onClick={() => { setSelectedCreche(null); setActiveTab('Overview'); }}
                className="flex items-center gap-2 text-sm font-semibold text-slate-550 dark:text-slate-400 hover:text-[#078662] dark:hover:text-[#2dd4bf] transition-colors cursor-pointer select-none"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                <span>Back to crèches</span>
              </button>

              {/* Main Info Card */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-150/80 dark:border-slate-700/60 p-6 shadow-xs relative overflow-hidden transition-colors">
                
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-750">
                  <div className="flex items-center gap-4.5">
                    {/* Avatar circle */}
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#078662] to-[#0dbe8b] flex items-center justify-center text-white font-bold text-xl select-none shadow-sm shadow-[#078662]/20">
                      {selectedCreche.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>

                    <div className="flex flex-col">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-850 dark:text-white leading-tight">
                          {selectedCreche.name}
                        </h2>
                        {renderRiskBadge(selectedCreche.status)}
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          {selectedCreche.activityStatus}
                        </span>
                      </div>

                      {/* Metadata Items */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2 text-xs font-semibold text-slate-450 dark:text-slate-400">
                        <span>
                          {selectedCreche.code}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                          </svg>
                          {selectedCreche.district} · {selectedCreche.block}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.435-5.124-3.734-6.559-6.56l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                          </svg>
                          {selectedCreche.phone}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                          </svg>
                          Inspected {selectedCreche.lastInspected}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0 mt-4 lg:mt-0">
                    <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-bold text-slate-750 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-all active:scale-95 shadow-xxs cursor-pointer w-full sm:w-auto">
                      <svg className="w-4 h-4 text-slate-550 dark:text-slate-400" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                      <span>Report</span>
                    </button>
                  </div>
                </div>

                {/* Stat cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 mt-6">
                  {/* Stat block: Children */}
                  <div className="bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100/50 dark:border-slate-750 rounded-xl p-4 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">Children</span>
                    <span className="text-2xl font-bold text-slate-800 dark:text-white mt-1.5 leading-none">{selectedCreche.children}</span>
                  </div>

                  {/* Stat block: Attendance */}
                  <div className="bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100/50 dark:border-slate-750 rounded-xl p-4 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">Attendance</span>
                    <span className="text-2xl font-bold text-slate-800 dark:text-white mt-1.5 leading-none">{selectedCreche.attendance}</span>
                  </div>

                  {/* Stat block: Staff */}
                  <div className="bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100/50 dark:border-slate-750 rounded-xl p-4 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">Staff</span>
                    <span className="text-2xl font-bold text-slate-800 dark:text-white mt-1.5 leading-none">{selectedCreche.staffCount}</span>
                  </div>

                  {/* Stat block: Safety */}
                  <div className="bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100/50 dark:border-slate-750 rounded-xl p-4 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">Safety Idx</span>
                    <span className="text-2xl font-bold text-slate-800 dark:text-white mt-1.5 leading-none">{selectedCreche.safety}</span>
                  </div>

                  {/* Stat block: Incidents */}
                  <div className="bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100/50 dark:border-slate-750 rounded-xl p-4 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">Incidents</span>
                    <span className="text-2xl font-bold text-slate-800 dark:text-white mt-1.5 leading-none">{selectedCreche.incidentsCount}</span>
                  </div>

                  {/* Stat block: Inspections */}
                  <div className="bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100/50 dark:border-slate-750 rounded-xl p-4 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">Inspections</span>
                    <span className="text-2xl font-bold text-slate-800 dark:text-white mt-1.5 leading-none">{selectedCreche.inspectionsCount}</span>
                  </div>
                </div>

              </div>

              {/* Horizontal Tabs Selection bar */}
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-850 bg-white dark:bg-slate-800 rounded-xl px-4 py-1.5 shadow-xxs">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                  {['Overview', 'Children', 'Attendance', 'Nutrition', 'Health', 'Staff', 'CCTV', 'Documents', 'Reports'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3.5 py-2.5 text-xs font-bold transition-all relative shrink-0 rounded-lg cursor-pointer ${
                        activeTab === tab
                          ? 'text-[#078662] dark:text-[#2dd4bf] bg-slate-50 dark:bg-slate-700/40'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50/50 dark:hover:bg-slate-700/20'
                      }`}
                    >
                      {tab}
                      {activeTab === tab && (
                        <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-[#078662] dark:bg-[#2dd4bf] rounded-full"></span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tabs Content */}
              {activeTab === 'Overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: Attendance & Nutrition Trend Chart */}
                  <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-150/80 dark:border-slate-700/60 p-6 shadow-xs flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-800 dark:text-white">Attendance & Nutrition Trend</h3>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Yearly monitoring curve</p>
                    </div>

                    <div className="h-72 mt-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={mockTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#1e90ff" stopOpacity={0.15}/>
                              <stop offset="95%" stopColor="#1e90ff" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorNutrition" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#078662" stopOpacity={0.15}/>
                              <stop offset="95%" stopColor="#078662" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:hidden" />
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" className="hidden dark:block" />
                          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                          <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                          <Tooltip />
                          <Area type="monotone" name="Attendance" dataKey="attendance" stroke="#1e90ff" strokeWidth={2} fillOpacity={1} fill="url(#colorAttendance)" />
                          <Area type="monotone" name="Nutrition" dataKey="nutrition" stroke="#078662" strokeWidth={2} fillOpacity={1} fill="url(#colorNutrition)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Right Column: Timeline activity */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-150/80 dark:border-slate-700/60 p-6 shadow-xs">
                    <h3 className="text-base font-bold text-slate-800 dark:text-white">Timeline</h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 mb-6">Recent crèche activities</p>

                    <div className="relative border-l border-slate-100 dark:border-slate-750 ml-3.5 pl-6 space-y-6 text-sm">
                      {/* Timeline Item 1 */}
                      <div className="relative">
                        <span className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-sky-500 border-2 border-white dark:border-slate-800 flex items-center justify-center"></span>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Today</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">Meal compliance check passed</span>
                        </div>
                      </div>

                      {/* Timeline Item 2 */}
                      <div className="relative">
                        <span className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-800 flex items-center justify-center"></span>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Yesterday</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">Inspection submitted by Insp. Rao</span>
                        </div>
                      </div>

                      {/* Timeline Item 3 */}
                      <div className="relative">
                        <span className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-white dark:border-slate-800 flex items-center justify-center"></span>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">2 days ago</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">3 children flagged for nutrition</span>
                        </div>
                      </div>

                      {/* Timeline Item 4 */}
                      <div className="relative">
                        <span className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-slate-400 border-2 border-white dark:border-slate-800 flex items-center justify-center"></span>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">1 week ago</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">CCTV firmware updated</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Children' && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-150/80 dark:border-slate-700/60 p-6 shadow-xs">
                  <h3 className="text-base font-bold text-slate-800 dark:text-white mb-4">Enrolled Children</h3>
                  <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-750 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          <th className="py-3 px-4">ID</th>
                          <th className="py-3 px-4">Name</th>
                          <th className="py-3 px-4">Age</th>
                          <th className="py-3 px-4">Gender</th>
                          <th className="py-3 px-4">Attendance</th>
                          <th className="py-3 px-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-750">
                        {mockChildrenInCreche.map(ch => (
                          <tr key={ch.id} className="text-sm font-semibold text-slate-655 dark:text-slate-350">
                            <td className="py-3 px-4 font-mono text-xs text-slate-400">{ch.id}</td>
                            <td className="py-3 px-4 text-slate-800 dark:text-white">{ch.name}</td>
                            <td className="py-3 px-4">{ch.age}</td>
                            <td className="py-3 px-4">{ch.gender}</td>
                            <td className="py-3 px-4">{ch.attendance}</td>
                            <td className="py-3 px-4">{renderRiskBadge(ch.status)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'Staff' && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-150/80 dark:border-slate-700/60 p-6 shadow-xs">
                  <h3 className="text-base font-bold text-slate-800 dark:text-white mb-4">Staff Directory</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {mockStaffInCreche.map(st => (
                      <div key={st.name} className="border border-slate-150/80 dark:border-slate-700/60 rounded-xl p-4 flex flex-col justify-between bg-slate-50/30 dark:bg-slate-900/25">
                        <div>
                          <h4 className="font-bold text-slate-800 dark:text-white text-sm">{st.name}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-450 font-medium mt-0.5">{st.role}</p>
                          <p className="text-xs text-[#078662] font-semibold mt-2">{st.phone}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold self-start mt-4 ${
                          st.status === 'Present' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100/50' 
                            : 'bg-amber-50 text-amber-700 border border-amber-100/50'
                        }`}>
                          <span className={`w-1.2 h-1.2 rounded-full ${st.status === 'Present' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                          {st.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'CCTV' && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-150/80 dark:border-slate-700/60 p-6 shadow-xs">
                  <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1">Live CCTV Monitoring</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">Camera feeds are encrypted end-to-end</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Camera Feed 1 */}
                    <div className="border border-slate-150/80 dark:border-slate-700/60 rounded-2xl overflow-hidden shadow-xs relative aspect-video bg-slate-950 flex flex-col justify-between p-4 text-white">
                      <div className="flex items-center justify-between gap-2 z-10">
                        <span className="text-xs font-semibold bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-white/10">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-650 animate-pulse"></span>
                          CAM 01 - MAIN ENTRANCE
                        </span>
                        <span className="text-[10px] font-mono text-white/70 bg-black/40 px-2 py-0.5 rounded">LIVE</span>
                      </div>
                      
                      {/* Placeholder graphic for live feed */}
                      <div className="absolute inset-0 flex items-center justify-center text-white/20 select-none pointer-events-none">
                        <svg className="w-16 h-16 opacity-30" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                      </div>

                      <div className="flex items-center justify-between text-xs text-white/80 z-10">
                        <span className="font-mono">1080p · 24fps</span>
                        <span className="font-semibold text-[#2dd4bf]">Surveillance Active</span>
                      </div>
                    </div>

                    {/* Camera Feed 2 */}
                    <div className="border border-slate-150/80 dark:border-slate-700/60 rounded-2xl overflow-hidden shadow-xs relative aspect-video bg-slate-950 flex flex-col justify-between p-4 text-white">
                      <div className="flex items-center justify-between gap-2 z-10">
                        <span className="text-xs font-semibold bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-white/10">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-650 animate-pulse"></span>
                          CAM 02 - PLAYROOM
                        </span>
                        <span className="text-[10px] font-mono text-white/70 bg-black/40 px-2 py-0.5 rounded">LIVE</span>
                      </div>

                      {/* Placeholder graphic for live feed */}
                      <div className="absolute inset-0 flex items-center justify-center text-white/20 select-none pointer-events-none">
                        <svg className="w-16 h-16 opacity-30" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                      </div>

                      <div className="flex items-center justify-between text-xs text-white/80 z-10">
                        <span className="font-mono">1080p · 24fps</span>
                        <span className="font-semibold text-[#2dd4bf]">Surveillance Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Attendance' && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-150/80 dark:border-slate-700/60 p-6 shadow-xs space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-base font-bold text-slate-850 dark:text-white mb-1">Crèche Attendance Ledger</h4>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Click on any calendar day to toggle status record</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-semibold">
                      <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-emerald-500"></span> Present ({attendanceDays.filter(d => d.status === 'Present').length})</span>
                      <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-rose-500"></span> Absent ({attendanceDays.filter(d => d.status === 'Absent').length})</span>
                      <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-amber-500"></span> Leave ({attendanceDays.filter(d => d.status === 'Leave').length})</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-2.5">
                    {attendanceDays.map((d) => (
                      <button
                        key={d.day}
                        onClick={() => handleToggleAttendanceDay(d.day)}
                        className={`py-3.5 px-2 rounded-xl text-center font-bold text-sm select-none border transition-all active:scale-90 cursor-pointer ${
                          d.status === 'Present'
                            ? 'bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/40 dark:text-emerald-400'
                            : d.status === 'Absent'
                            ? 'bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900/40 dark:text-rose-450'
                            : 'bg-amber-50 border-amber-100 text-amber-600 dark:bg-amber-950/20 dark:border-amber-900/40 dark:text-amber-400'
                        }`}
                      >
                        <span className="block text-[10px] text-slate-400 font-medium mb-0.5">Day</span>
                        {d.day}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'Nutrition' && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-150/80 dark:border-slate-700/60 p-6 shadow-xs space-y-6">
                  <h4 className="text-base font-bold text-slate-850 dark:text-white">Crèche Nutritional Standards</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border border-slate-100 dark:border-slate-700/40 p-4 space-y-4">
                      <h5 className="font-bold text-slate-700 dark:text-slate-300 text-sm">Macronutrients Target</h5>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs font-semibold mb-1 text-slate-500">
                            <span>Protein Compliance</span>
                            <span className="text-slate-700 dark:text-slate-300">88%</span>
                          </div>
                          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '88%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs font-semibold mb-1 text-slate-500">
                            <span>Calorie Target</span>
                            <span className="text-slate-700 dark:text-slate-300">92%</span>
                          </div>
                          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-sky-500 rounded-full" style={{ width: '92%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs font-semibold mb-1 text-slate-500">
                            <span>Vitamin A Coverage</span>
                            <span className="text-slate-700 dark:text-slate-300">80%</span>
                          </div>
                          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: '80%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border border-slate-100 dark:border-slate-700/40 p-4 space-y-3">
                      <h5 className="font-bold text-slate-700 dark:text-slate-300 text-sm">Meals Served Log (Today)</h5>
                      <div className="space-y-2 text-sm text-slate-655 dark:text-slate-350 font-semibold">
                        <label className="flex items-center gap-2.5">
                          <input type="checkbox" defaultChecked disabled className="rounded text-[#078662] focus:ring-[#078662] h-4 w-4" />
                          <span>Morning: Hot Cooked Ragi Porridge</span>
                        </label>
                        <label className="flex items-center gap-2.5">
                          <input type="checkbox" defaultChecked disabled className="rounded text-[#078662] focus:ring-[#078662] h-4 w-4" />
                          <span>Lunch: Egg curry + rice + Dalma</span>
                        </label>
                        <label className="flex items-center gap-2.5">
                          <input type="checkbox" defaultChecked disabled className="rounded text-[#078662] focus:ring-[#078662] h-4 w-4" />
                          <span>Snack: Sprouts and Banana mix</span>
                        </label>
                      </div>
                    </div>

                    <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border border-slate-100 dark:border-slate-700/40 p-4 flex flex-col justify-between">
                      <div>
                        <h5 className="font-bold text-slate-700 dark:text-slate-300 text-sm mb-1.5">Dietary Advising</h5>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Strong compliance on local food grains. Recommend ensuring egg supplies are documented daily in the registry log.
                        </p>
                      </div>
                      <span className="text-[11px] font-bold text-slate-400 mt-4">Last checked: Today 11:30 AM</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Health' && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-150/80 dark:border-slate-700/60 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold text-slate-855 dark:text-white mb-0.5">Pediatric Health & Sanitation Logs</h4>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">History of sanitation, audit checkups, and water quality testing</p>
                    </div>
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-slate-750">
                    {healthLogs.map((log) => (
                      <div key={log.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 first:pt-0 last:pb-0">
                        <div>
                          <h5 className="font-bold text-slate-800 dark:text-white text-sm">{log.type}</h5>
                          <p className="text-xs text-slate-500 mt-0.5">{log.desc}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-bold text-slate-400">{log.date}</span>
                          <span className="block text-xs font-semibold text-emerald-600 mt-1">{log.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'Documents' && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-150/80 dark:border-slate-700/60 p-6 shadow-xs">
                  <h4 className="text-base font-bold text-slate-850 dark:text-white mb-4">Crèche Documentation & Permits</h4>
                  <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left text-sm font-semibold text-slate-655 dark:text-slate-350">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-750 text-xs text-slate-500 uppercase tracking-wider">
                          <th className="py-3 px-2">Document Name</th>
                          <th className="py-3 px-2">Format</th>
                          <th className="py-3 px-2">File Size</th>
                          <th className="py-3 px-2">Approved Date</th>
                          <th className="py-3 px-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-750">
                        {[
                          { name: 'Operational & Registry Permit', type: 'PDF', size: '2.4 MB', date: '2025-10-12' },
                          { name: 'Sanitation Certificate', type: 'PDF', size: '1.8 MB', date: '2026-01-05' },
                          { name: 'Fire Safety Clearance Certificate', type: 'PDF', size: '3.1 MB', date: '2026-01-10' },
                          { name: 'Staff Qualifications Dossier', type: 'ZIP', size: '8.5 MB', date: '2026-02-14' }
                        ].map((doc) => (
                          <tr key={doc.name} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20">
                            <td className="py-3.5 px-2 text-slate-800 dark:text-white font-bold">{doc.name}</td>
                            <td className="py-3.5 px-2 text-slate-550">{doc.type}</td>
                            <td className="py-3.5 px-2 text-slate-550">{doc.size}</td>
                            <td className="py-3.5 px-2 text-slate-550">{doc.date}</td>
                            <td className="py-3.5 px-2 text-right">
                              <button 
                                onClick={() => alert(`Downloading ${doc.name}`)}
                                className="text-cyan-500 hover:text-cyan-600 dark:text-cyan-400 dark:hover:text-cyan-300 hover:underline text-xs cursor-pointer font-bold"
                              >
                                Download
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'Reports' && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-150/80 dark:border-slate-700/60 p-6 shadow-xs">
                  <h4 className="text-base font-bold text-slate-850 dark:text-white mb-4">Monthly Surveillance & Audit Reports</h4>
                  <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left text-sm font-semibold text-slate-655 dark:text-slate-350">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-750 text-xs text-slate-500 uppercase tracking-wider">
                          <th className="py-3 px-2">Report Month</th>
                          <th className="py-3 px-2">Audit Score</th>
                          <th className="py-3 px-2">Surveillance Compliance</th>
                          <th className="py-3 px-2">Generated On</th>
                          <th className="py-3 px-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-750">
                        {[
                          { name: 'Surveillance Audit - May 2026', score: '94/100', compliance: '98%', date: '2026-06-01' },
                          { name: 'Surveillance Audit - April 2026', score: '92/100', compliance: '97%', date: '2026-05-01' },
                          { name: 'Surveillance Audit - March 2026', score: '90/100', compliance: '95%', date: '2026-04-01' }
                        ].map((rep) => (
                          <tr key={rep.name} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20">
                            <td className="py-3.5 px-2 text-slate-800 dark:text-white font-bold">{rep.name}</td>
                            <td className="py-3.5 px-2 text-emerald-600">{rep.score}</td>
                            <td className="py-3.5 px-2 text-slate-550">{rep.compliance}</td>
                            <td className="py-3.5 px-2 text-slate-550">{rep.date}</td>
                            <td className="py-3.5 px-2 text-right">
                              <button 
                                onClick={() => alert(`Downloading ${rep.name}`)}
                                className="text-cyan-500 hover:text-cyan-600 dark:text-cyan-400 dark:hover:text-cyan-300 hover:underline text-xs cursor-pointer font-bold"
                              >
                                Download Report
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          ) : (
            // ================== LISTING TABLE VIEW ==================
            <div className="space-y-6">
              
              {/* Page Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-855 dark:text-white tracking-tight">
                    Crèche Monitoring
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    <span className="font-semibold text-slate-700 dark:text-slate-350">{filteredCreches.length} crèches</span> · Live surveillance dashboard
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setShowRegisterModal(true)}
                    className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#078662] hover:bg-[#066e51] rounded-full transition-colors shadow-sm cursor-pointer active:scale-95 premium-btn"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    <span>Register Crèche</span>
                  </button>
                </div>
              </div>

              {/* Search & Filters Controls Container */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 p-4 shadow-xs flex flex-wrap items-center gap-4 transition-all duration-300 hover:shadow-md hover:shadow-slate-100/50 dark:hover:shadow-none">
                {/* Search Bar */}
                <div className="relative flex-1 min-w-[240px]">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    placeholder="Search by name, code or district..."
                    className="w-full pl-9.5 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus-glow-brand transition-all"
                  />
                </div>

                {showOnlyActive && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold transition-all">
                    <span>Active Only</span>
                    <button 
                      onClick={() => setShowOnlyActive(false)}
                      className="hover:text-emerald-900 dark:hover:text-white transition-colors cursor-pointer select-none"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Block Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Block:</span>
                  <select
                    value={selectedBlock}
                    onChange={(e) => { setSelectedBlock(e.target.value); setCurrentPage(1); }}
                    className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 focus-glow-brand cursor-pointer transition-all"
                  >
                    {blocksList.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                {/* Risk Level Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Risk Level:</span>
                  <select
                    value={selectedRisk}
                    onChange={(e) => { setSelectedRisk(e.target.value); setShowOnlyActive(false); setCurrentPage(1); }}
                    className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 focus-glow-brand cursor-pointer transition-all"
                  >
                    <option value="All Risk Levels">All Risk Levels</option>
                    <option value="Healthy">Healthy</option>
                    <option value="Warning">Warning</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              {/* Table Container (Formatted exactly like reference screenshot) */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-sm overflow-hidden transition-colors">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1200px] border-collapse text-left">
                    <thead>
                      <tr className="bg-[#f8fafc] dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-700/50 font-sans">
                        <th className="sticky left-0 z-20 bg-[#f8fafc] dark:bg-slate-900 px-3.5 py-4 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap w-[110px] min-w-[110px]">CODE</th>
                        <th className="sticky left-[110px] z-20 bg-[#f8fafc] dark:bg-slate-900 px-4 py-4 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap w-[220px] min-w-[220px] shadow-[2px_0_5px_rgba(0,0,0,0.05)] dark:shadow-[2px_0_5px_rgba(0,0,0,0.2)]">NAME</th>
                        <th className="px-3.5 py-4 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap">DISTRICT</th>
                        <th className="px-3.5 py-4 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap">BLOCK</th>
                        <th className="px-3.5 py-4 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap text-center">CHILDREN</th>
                        <th className="px-3.5 py-4 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap text-center">ATTENDANCE</th>
                        <th className="px-3.5 py-4 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap text-center">SAFETY</th>
                        <th className="px-3.5 py-4 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap">RISK</th>
                        <th className="px-3.5 py-4 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap">STATUS</th>
                        <th className="px-3.5 py-4 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap text-right pr-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                      {paginatedCreches.map((creche) => (
                        <tr key={creche.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                          <td className="sticky left-0 z-10 bg-white dark:bg-slate-800 px-3.5 py-3.5 text-[13px] text-slate-500 dark:text-slate-400 font-semibold whitespace-nowrap w-[110px] min-w-[110px] transition-colors group-hover:bg-[#f8fafc] dark:group-hover:bg-slate-700/20">
                            {creche.code}
                          </td>
                          <td className="sticky left-[110px] z-10 bg-white dark:bg-slate-800 px-4 py-3.5 whitespace-nowrap w-[220px] min-w-[220px] shadow-[2px_0_5px_rgba(0,0,0,0.05)] dark:shadow-[2px_0_5px_rgba(0,0,0,0.2)] transition-colors group-hover:bg-[#f8fafc] dark:group-hover:bg-slate-700/20">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                              {creche.name}
                            </span>
                          </td>
                          <td className="px-3.5 py-3.5 text-sm font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">
                            {creche.district}
                          </td>
                          <td className="px-3.5 py-3.5 text-sm font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">
                            {creche.block}
                          </td>
                          <td className="px-3.5 py-3.5 text-sm font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap text-center">
                            {creche.children}
                          </td>
                          <td className="px-3.5 py-3.5 text-sm font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap text-center">
                            {creche.attendance}
                          </td>
                          <td className="px-3.5 py-3.5 text-sm font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap text-center">
                            {creche.safety}
                          </td>
                          <td className="px-3.5 py-3.5 whitespace-nowrap">
                            {renderRiskBadge(creche.status)}
                          </td>
                          <td className="px-3.5 py-3.5 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              {creche.activityStatus}
                            </span>
                          </td>
                          <td className="px-3.5 py-3.5 text-right whitespace-nowrap pr-4">
                            <button 
                              onClick={() => { setSelectedCreche(creche); setActiveTab('Overview'); }}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#078662] hover:text-white border border-[#078662]/20 hover:border-transparent hover:bg-[#078662] transition-all duration-200 cursor-pointer select-none active:scale-95"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              <span>View</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination controls footer */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4.5 border-t border-slate-100 dark:border-slate-700/50 bg-slate-50/30 dark:bg-slate-900/10 text-sm transition-colors">
                  <div className="text-slate-500 dark:text-slate-400 font-medium">
                    Showing <span className="font-bold text-slate-800 dark:text-slate-200">{startIndex + 1}</span> to{' '}
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {endIndex}
                    </span>{' '}
                    of <span className="font-bold text-slate-800 dark:text-slate-200">{totalItems}</span> crèches
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    {/* Previous Button */}
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-all font-semibold text-xs sm:text-sm cursor-pointer select-none active:scale-95"
                    >
                      Previous
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm transition-all select-none cursor-pointer active:scale-95 ${
                          currentPage === page
                            ? 'bg-[#078662] text-white shadow-sm'
                            : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    {/* Next Button */}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-all font-semibold text-xs sm:text-sm cursor-pointer select-none active:scale-95"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* Register Crèche Modal Dialog */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-all animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-705 w-full max-w-lg shadow-2xl overflow-y-auto no-scrollbar max-h-[90vh] p-6 sm:p-8 relative animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700/60 mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Register New Crèche</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Enter details to add a new crèche to the monitoring network</p>
              </div>
              <button 
                type="button"
                onClick={() => setShowRegisterModal(false)}
                className="p-2 text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
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
                  placeholder="e.g. Balasore Shishu Suraksha Kendra"
                  value={formCreche.name}
                  onChange={(e) => setFormCreche({ ...formCreche, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#078662]/20 focus:border-[#078662] transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    District
                  </label>
                  <select
                    value={formCreche.district}
                    onChange={(e) => setFormCreche({ ...formCreche, district: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#078662]/20 focus:border-[#078662]"
                  >
                    <option value="Khordha">Khordha</option>
                    <option value="Cuttack">Cuttack</option>
                    <option value="Puri">Puri</option>
                    <option value="Ganjam">Ganjam</option>
                    <option value="Balasore">Balasore</option>
                    <option value="Sambalpur">Sambalpur</option>
                    <option value="Mayurbhanj">Mayurbhanj</option>
                    <option value="Kalahandi">Kalahandi</option>
                    <option value="Koraput">Koraput</option>
                    <option value="Sundargarh">Sundargarh</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    Block
                  </label>
                  <select
                    value={formCreche.block}
                    onChange={(e) => setFormCreche({ ...formCreche, block: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#078662]/20 focus:border-[#078662]"
                  >
                    <option value="Block A">Block A</option>
                    <option value="Block B">Block B</option>
                    <option value="Block C">Block C</option>
                    <option value="Block D">Block D</option>
                    <option value="Block E">Block E</option>
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
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#078662]/20 focus:border-[#078662]"
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
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#078662]/20 focus:border-[#078662]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    Safety
                  </label>
                  <input
                    type="number"
                    placeholder="85"
                    value={formCreche.safety}
                    onChange={(e) => setFormCreche({ ...formCreche, safety: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#078662]/20 focus:border-[#078662]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    Risk Level
                  </label>
                  <select
                    value={formCreche.status}
                    onChange={(e) => setFormCreche({ ...formCreche, status: e.target.value })}
                    className="w-full px-2 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#078662]/20 focus:border-[#078662]"
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
                  className="px-5 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-semibold text-white bg-[#078662] hover:bg-[#066e51] rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
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
