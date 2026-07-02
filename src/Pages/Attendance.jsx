import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

import dbData from '../data.json';

const attendanceTrendData = dbData.attendanceTrendData;

export default function Attendance() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('All');

  // Dynamic calculations from database
  const crechesList = (() => {
    const saved = localStorage.getItem('crechesList');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return dbData.creches.map(c => ({
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
  })();

  const childrenList = (() => {
    const saved = localStorage.getItem('childrenList');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return dbData.children;
  })();

  const totalCrechesCount = crechesList.length;
  const totalAttendancePct = crechesList.reduce((acc, c) => acc + parseFloat(c.attendance), 0);
  const avgAttendanceNum = totalAttendancePct / totalCrechesCount;
  const avgAttendance = avgAttendanceNum.toFixed(1) + '%';

  const totalEnrolled = childrenList.length;
  const presentCount = Math.round(totalEnrolled * (avgAttendanceNum / 100));
  const absentCount = totalEnrolled - presentCount;
  const absentPct = (100 - parseFloat(avgAttendance)).toFixed(1) + '%';

  // Blocks list
  const blocks = ['All', ...new Set(crechesList.map(c => c.block))];

  // Filter creches
  const filteredCreches = crechesList.filter(creche => {
    const matchesSearch = creche.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          creche.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBlock = selectedBlock === 'All' || creche.block === selectedBlock;
    return matchesSearch && matchesBlock;
  });

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">
                Attendance Intelligence
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Monitor and analyze student attendance metrics across crèches
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-6 shadow-sm flex flex-col justify-between hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300 min-h-[140px]">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs font-bold text-emerald-500">+1.8% vs last week</span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">{avgAttendance}</span>
                <span className="block text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">Average Attendance</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-6 shadow-sm flex flex-col justify-between hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300 min-h-[140px]">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                </div>
                <span className="text-xs font-bold text-blue-500">+2 enrolled</span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">{totalEnrolled}</span>
                <span className="block text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">Total Enrolled</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-6 shadow-sm flex flex-col justify-between hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300 min-h-[140px]">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="text-xs font-bold text-indigo-500">{presentCount} present</span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">{avgAttendance}</span>
                <span className="block text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">Present Today</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-6 shadow-sm flex flex-col justify-between hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300 min-h-[140px]">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs font-bold text-rose-500">{absentCount} absent</span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">{absentPct}</span>
                <span className="block text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">Absent Today</span>
              </div>
            </div>
          </div>

          {/* Chart & Daily Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Weekly Trend Chart */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-800 dark:text-white mb-4">Weekly Attendance Trend</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={attendanceTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#078662" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#078662" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:hidden" />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" className="hidden dark:block" />
                    <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <YAxis domain={[60, 100]} stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                      }}
                    />
                    <Area type="monotone" dataKey="percentage" name="Attendance Rate" stroke="#078662" strokeWidth={3} fillOpacity={1} fill="url(#colorAttendance)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Attendance Alert card */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-800 dark:text-white mb-2">Attendance Summary</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Detailed overview of attendance trends</p>
                
                <div className="space-y-4 mt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">Target Attendance</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-white">90.0%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#078662] h-full rounded-full" style={{ width: '90%' }}></div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs font-semibold text-slate-500">Current Average</span>
                    <span className="text-xs font-bold text-[#078662]">{avgAttendance}</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${avgAttendanceNum}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/60 text-xs text-slate-400 flex justify-between items-center">
                <span>Last updated 5 mins ago</span>
                <span className="font-semibold text-[#078662] cursor-pointer hover:underline">Refresh</span>
              </div>
            </div>
          </div>

          {/* Creche Attendance Tracker List */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-base font-bold text-slate-800 dark:text-white">Attendance by Crèche</h2>
              
              {/* Search & Filter Controls */}
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  placeholder="Search crèche name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#078662] w-48 transition-all focus-glow-brand"
                />

                <select
                  value={selectedBlock}
                  onChange={(e) => setSelectedBlock(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#078662] transition-all focus-glow-brand cursor-pointer"
                >
                  {blocks.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Attendance list table */}
            <div className="space-y-4">
              {/* Table Header */}
              <div className="grid grid-cols-12 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-700/60 px-4">
                <div className="col-span-4">Crèche Name</div>
                <div className="col-span-2 text-center">Enrolled</div>
                <div className="col-span-4 px-4">Attendance Rate</div>
                <div className="col-span-2 text-right">Status</div>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-slate-50 dark:divide-slate-700/40">
                {filteredCreches.length > 0 ? (
                  filteredCreches.map((c) => {
                    const rate = parseInt(c.attendance);
                    const statusText = rate >= 90 ? 'Excellent' : rate >= 80 ? 'Normal' : 'Low';
                    const badgeClass = statusText === 'Excellent' 
                      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400' 
                      : statusText === 'Normal'
                      ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400'
                      : 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400';
                      
                    const progressColor = rate >= 90 ? 'bg-[#078662]' : rate >= 80 ? 'bg-amber-500' : 'bg-rose-500';

                    return (
                      <div key={c.id} className="grid grid-cols-12 items-center py-3.5 hover:bg-slate-50/50 dark:hover:bg-slate-700/10 rounded-2xl transition-colors duration-150 px-4">
                        <div className="col-span-4 flex flex-col min-w-0 pr-2">
                          <span className="font-semibold text-xs text-slate-700 dark:text-slate-200 leading-tight truncate">
                            {c.name}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                            {c.code} · {c.block}
                          </span>
                        </div>
                        
                        <div className="col-span-2 text-center text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {c.children}
                        </div>

                        <div className="col-span-4 px-4 flex items-center gap-3">
                          <div className="flex-1 bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                            <div className={`${progressColor} h-full rounded-full transition-all duration-500`} style={{ width: `${rate}%` }}></div>
                          </div>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 w-8 text-right">
                            {c.attendance}
                          </span>
                        </div>

                        <div className="col-span-2 text-right">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${badgeClass}`}>
                            {statusText}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-xs text-slate-400">
                    No crèches match your filters.
                  </div>
                )}
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
