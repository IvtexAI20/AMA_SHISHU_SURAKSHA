import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

import dbData from '../data.json';

const initialAlerts = dbData.healthAlerts;
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const blueData = dbData.blueCohortData;
const greenData = dbData.greenCohortData;

export default function Health() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [alerts, setAlerts] = useState(initialAlerts);
  const [toastMsg, setToastMsg] = useState('');
  const [hoveredPoint, setHoveredPoint] = useState(null);
  
  // Modal states
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);
  const [childStatus, setChildStatus] = useState('Normal');
  const [notes, setNotes] = useState('');

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg('');
    }, 4000);
  };

  const handleEscalate = (name) => {
    triggerToast(`Incident escalated for ${name} to Keonjhar block medical officer.`);
  };

  const handleOpenUpdate = (child) => {
    setSelectedChild(child);
    setChildStatus(child.risk > 90 ? 'Critical' : 'High');
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    triggerToast(`Medical log updated for ${selectedChild.name}.`);
    
    // Update alert in list with note or modified state
    setAlerts(alerts.map(a => {
      if (a.id === selectedChild.id) {
        return { ...a, risk: childStatus === 'Critical' ? 97 : 80 };
      }
      return a;
    }));

    setShowUpdateModal(false);
    setSelectedChild(null);
    setNotes('');
  };

  const downloadHealthReport = () => {
    triggerToast('Generating health report download...');
    
    // Create CSV content data string
    let csv = '\uFEFF'; // UTF-8 BOM
    csv += 'Ama Shishu Suraksha Platform - Health Monitoring Report\n';
    csv += `Generated Date: ${new Date().toLocaleDateString()}\n\n`;
    
    csv += 'SUMMARY STATS\n';
    csv += 'Metric,Value\n';
    csv += 'Children Tracked,240\n';
    csv += 'Vaccinated,85%\n';
    csv += 'Growth On-track,89%\n';
    csv += 'Active Medical Alerts,8\n\n';
    
    csv += 'COHORT GROWTH CHART DATA\n';
    csv += 'Month,Blue Cohort (avgHeight),Green Cohort (avgWeight)\n';
    months.forEach((m, idx) => {
      csv += `${m},${blueData[idx]},${Math.round((greenData[idx] / 100) * 16)}\n`;
    });
    csv += '\n';
    
    csv += 'ACTIVE INCIDENTS LOG\n';
    csv += 'Child Name,Risk Score,Age,Alert Level\n';
    alerts.forEach((alert) => {
      csv += `"${alert.name}",${alert.risk},${alert.age},${alert.type}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `health_monitoring_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // SVG Chart sizing configurations
  const width = 850;
  const height = 320;
  const paddingX = 55;
  const paddingY = 40;
  const chartWidth = width - 2 * paddingX;
  const chartHeight = height - 2 * paddingY;

  // Coordinate conversion helper functions
  const getX = (index) => paddingX + (index * chartWidth) / (months.length - 1);
  const getY = (val) => height - paddingY - (val / 100) * chartHeight;

  // Construct SVG path string helper
  const getPathD = (data) => {
    return data.reduce((path, val, idx) => {
      const x = getX(idx);
      const y = getY(val);
      return path + `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
    }, '');
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
                Health Monitoring
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                Growth, vaccination and medical surveillance
              </p>
            </div>

            <button
              onClick={() => setShowReportModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#078662] hover:bg-[#066e51] rounded-full transition-all shadow-sm cursor-pointer active:scale-95 self-end sm:self-auto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              <span>Health Report</span>
            </button>
          </div>

          {/* 4-Card Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            
            {/* Children Tracked */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-6 shadow-sm flex flex-col justify-between hover:shadow-xs transition-shadow">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-semibold text-slate-800 dark:text-white leading-tight">
                  240
                </span>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">
                  Children Tracked
                </span>
              </div>
            </div>

            {/* Vaccinated */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-6 shadow-sm flex flex-col justify-between hover:shadow-xs transition-shadow">
              <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-semibold text-slate-800 dark:text-white leading-tight">
                  85%
                </span>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">
                  Vaccinated
                </span>
              </div>
            </div>

            {/* Growth On-track */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-6 shadow-sm flex flex-col justify-between hover:shadow-xs transition-shadow">
              <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-semibold text-slate-800 dark:text-white leading-tight">
                  89%
                </span>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">
                  Growth On-track
                </span>
              </div>
            </div>

            {/* Active Medical Alerts */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-6 shadow-sm flex flex-col justify-between hover:shadow-xs transition-shadow">
              <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-semibold text-slate-800 dark:text-white leading-tight">
                  8
                </span>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">
                  Active Medical Alerts
                </span>
              </div>
            </div>

          </div>

          {/* Bottom Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            
            {/* Average Growth card - Side-by-side layout */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-6 shadow-sm flex flex-col justify-between transition-all relative">
              
              <div className="flex items-center justify-between gap-4 mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white">
                  Average Growth
                </h3>
              </div>

              <div className="w-full relative overflow-x-auto no-scrollbar">
                <div className="min-w-[750px] w-full h-[320px] relative">
                  
                  {/* SVG Chart */}
                  <svg className="w-full h-full text-slate-300 dark:text-slate-600" viewBox={`0 0 ${width} ${height}`}>
                    {/* Grid horizontal lines */}
                    {[0, 25, 50, 75, 100].map((tick) => (
                      <g key={tick}>
                        <line
                          x1={paddingX}
                          y1={getY(tick)}
                          x2={width - paddingX}
                          y2={getY(tick)}
                          stroke="currentColor"
                          strokeWidth="1"
                          strokeDasharray="4 4"
                          className="opacity-40"
                        />
                        <text
                          x={paddingX - 10}
                          y={getY(tick) + 4}
                          textAnchor="end"
                          className="text-[10px] font-semibold fill-slate-400 select-none"
                        >
                          {tick}
                        </text>
                      </g>
                    ))}

                    {/* Right axis ticks (0 to 16) */}
                    {[0, 4, 8, 12, 16].map((tick) => (
                      <text
                        key={tick}
                        x={width - paddingX + 10}
                        y={getY((tick / 16) * 100) + 4}
                        textAnchor="start"
                        className="text-[10px] font-semibold fill-slate-400 select-none"
                      >
                        {tick}
                      </text>
                    ))}

                    {/* Grid vertical lines */}
                    {months.map((m, idx) => (
                      <g key={m}>
                        <line
                          x1={getX(idx)}
                          y1={paddingY}
                          x2={getX(idx)}
                          y2={height - paddingY}
                          stroke="currentColor"
                          strokeWidth="1"
                          strokeDasharray="4 4"
                          className="opacity-20"
                        />
                        <text
                          x={getX(idx)}
                          y={height - paddingY + 16}
                          textAnchor="middle"
                          className="text-[10px] font-semibold fill-slate-400 select-none"
                        >
                          {m}
                        </text>
                      </g>
                    ))}

                    {/* Chart Frame lines */}
                    <line x1={paddingX} y1={paddingY} x2={paddingX} y2={height - paddingY} stroke="#cbd5e1" strokeWidth="1" />
                    <line x1={width - paddingX} y1={paddingY} x2={width - paddingX} y2={height - paddingY} stroke="#cbd5e1" strokeWidth="1" />
                    <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="#cbd5e1" strokeWidth="1" />

                    {/* Trend Line 1 (Blue) */}
                    <path
                      d={getPathD(blueData)}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2.5"
                      className="transition-all"
                    />

                    {/* Trend Line 2 (Green) */}
                    <path
                      d={getPathD(greenData)}
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="2.5"
                      className="transition-all"
                    />

                    {/* Interactive points */}
                    {blueData.map((val, idx) => {
                      const cx = getX(idx);
                      const cy = getY(val);
                      const handleActive = () => setHoveredPoint({
                        x: cx,
                        y: cy,
                        month: months[idx],
                        heightVal: val,
                        weightVal: Math.round((greenData[idx] / 100) * 16)
                      });
                      const handleDeactive = () => setHoveredPoint(null);
                      return (
                        <circle
                          key={`blue-${idx}`}
                          cx={cx}
                          cy={cy}
                          r="4"
                          fill="white"
                          stroke="#3b82f6"
                          strokeWidth="2.5"
                          className="cursor-pointer hover:r-6 transition-all animate-pulse"
                          onMouseEnter={handleActive}
                          onMouseLeave={handleDeactive}
                          onTouchStart={handleActive}
                          onTouchEnd={handleDeactive}
                        />
                      );
                    })}

                    {/* Green points */}
                    {greenData.map((val, idx) => {
                      const cx = getX(idx);
                      const cy = getY(val);
                      const handleActive = () => setHoveredPoint({
                        x: cx,
                        y: cy,
                        month: months[idx],
                        heightVal: blueData[idx],
                        weightVal: Math.round((val / 100) * 16)
                      });
                      const handleDeactive = () => setHoveredPoint(null);
                      return (
                        <circle
                          key={`green-${idx}`}
                          cx={cx}
                          cy={cy}
                          r="4"
                          fill="white"
                          stroke="#22c55e"
                          strokeWidth="2.5"
                          className="cursor-pointer hover:r-6 transition-all animate-pulse"
                          onMouseEnter={handleActive}
                          onMouseLeave={handleDeactive}
                          onTouchStart={handleActive}
                          onTouchEnd={handleDeactive}
                        />
                      );
                    })}

                  </svg>

                  {/* Interactive Chart Tooltip */}
                  {hoveredPoint && (
                    <div 
                      className="absolute z-10 bg-white text-slate-700 text-xs font-semibold p-4 rounded-2xl border border-slate-100 shadow-lg pointer-events-none select-none transition-all duration-150"
                      style={{ left: `${hoveredPoint.x + 12}px`, top: `${hoveredPoint.y + 12}px` }}
                    >
                      <p className="text-slate-800 font-bold text-sm mb-2">{hoveredPoint.month}</p>
                      <p className="text-[#3b82f6] font-semibold text-xs leading-none">avgHeight : {hoveredPoint.heightVal}</p>
                      <p className="text-[#22c55e] font-semibold text-xs leading-none mt-2">avgWeight : {hoveredPoint.weightVal}</p>
                    </div>
                  )}

                </div>
              </div>

              {/* Bottom center floating toolbar markup */}
              <div className="flex items-center justify-center mt-4">
                <div className="bg-slate-100/80 dark:bg-slate-700/60 backdrop-blur-xs py-1.5 px-3 rounded-full border border-slate-200/50 dark:border-slate-600/50 flex items-center gap-3.5 shadow-2xs">
                  <button className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors" title="Zoom">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637zM10.5 7.5v6m3-3h-6" />
                    </svg>
                  </button>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 select-none">T</span>
                  <button className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors" title="Draw">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                    </svg>
                  </button>
                  <button className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors" title="Comment">
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.282 3.42.349L12 21.75l2.623-2.67c1.15-.067 2.291-.183 3.42-.349a3.22 3.22 0 002.707-3.228V6.75a3.22 3.22 0 00-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                    </svg>
                  </button>
                </div>
              </div>

            </div>

            {/* Medical Alerts panel - Side-by-side layout */}
            <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-6 shadow-sm flex flex-col transition-colors">
              <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white mb-6">
                Medical Alerts
              </h3>

              <div className="space-y-4 overflow-y-auto no-scrollbar max-h-[500px]">
                {alerts.map((item) => (
                  <div 
                    key={item.id}
                    className="flex flex-col gap-3 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/60 bg-white dark:bg-slate-800 hover:shadow-xs transition-all"
                  >
                    
                    {/* Header: Avatar, Name, Badge */}
                    <div className="flex items-start justify-between gap-3 w-full">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
                          {item.initials}
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-slate-800 dark:text-white leading-tight">
                            {item.name}
                          </h4>
                          <p className="text-xs text-slate-400 mt-1 font-medium">
                            Risk {item.risk} · {item.age}
                          </p>
                        </div>
                      </div>

                      {/* Alert red badge */}
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-rose-50 text-rose-600 border-rose-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        Alert
                      </span>
                    </div>

                    {/* Actions Row */}
                    <div className="flex items-center gap-2.5 pt-1 mt-1">
                      <button
                        type="button"
                        onClick={() => handleOpenUpdate(item)}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#078662] hover:bg-[#066e51] transition-colors cursor-pointer"
                      >
                        Update
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEscalate(item.name)}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-800 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                      >
                        Escalate
                      </button>
                    </div>

                  </div>
                ))}
              </div>

            </div>

          </div>

        </main>
      </div>

      {/* Update Medical Status Modal Overlay */}
      {showUpdateModal && selectedChild && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-all animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 w-full max-w-md shadow-2xl overflow-hidden p-6 sm:p-8 relative animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700/60 mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Update Medical Status</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Record growth tracking details and status</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowUpdateModal(false);
                  setSelectedChild(null);
                }}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  Child Name
                </label>
                <input
                  type="text"
                  readOnly
                  disabled
                  value={`${selectedChild.name} (Risk Score: ${selectedChild.risk})`}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-500 dark:text-slate-400 focus:outline-none select-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  Severity State
                </label>
                <select
                  value={childStatus}
                  onChange={(e) => setChildStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="Critical">Critical Alert</option>
                  <option value="High">High Risk</option>
                  <option value="Normal">Normal (Mark Resolved)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  Medical Notes
                </label>
                <textarea
                  required
                  placeholder="e.g. Prescribed multi-vitamin supplements, scheduled weight check next week."
                  rows="3"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-700/60 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowUpdateModal(false);
                    setSelectedChild(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#078662] hover:bg-[#066e51] transition-colors cursor-pointer"
                >
                  Submit Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Preview Modal Overlay */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-all animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 w-full max-w-2xl shadow-2xl overflow-hidden p-6 sm:p-8 relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700/60 mb-4 shrink-0">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Health Monitoring Report</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Preview generated diagnostic datasets and log logs</p>
              </div>
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable Report Content */}
            <div className="flex-1 overflow-y-auto space-y-6 pr-2 no-scrollbar text-slate-800 dark:text-slate-200 text-sm">
              
              {/* Document Header */}
              <div className="text-center py-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-700 p-4">
                <h4 className="font-extrabold text-base text-[#001746] dark:text-blue-400 tracking-wide uppercase">Ama Shishu Suraksha Platform</h4>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1">Odisha Child Care Surveillance Initiative</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Generated: {new Date().toLocaleDateString()} · System: Active</p>
              </div>

              {/* Metrics Grid */}
              <div>
                <h5 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2">1. Summary Health Metrics</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50/50 dark:bg-slate-900/30 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                    <span className="text-xs text-slate-405">Children Tracked</span>
                    <p className="text-lg font-bold text-slate-800 dark:text-white">240</p>
                  </div>
                  <div className="bg-slate-50/50 dark:bg-slate-900/30 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                    <span className="text-xs text-slate-405">Vaccinated</span>
                    <p className="text-lg font-bold text-slate-800 dark:text-white">85%</p>
                  </div>
                  <div className="bg-slate-50/50 dark:bg-slate-900/30 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                    <span className="text-xs text-slate-405">Growth On-track</span>
                    <p className="text-lg font-bold text-slate-800 dark:text-white">89%</p>
                  </div>
                  <div className="bg-slate-50/50 dark:bg-slate-900/30 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                    <span className="text-xs text-slate-405">Active Medical Alerts</span>
                    <p className="text-lg font-bold text-slate-800 dark:text-white">8</p>
                  </div>
                </div>
              </div>

              {/* Alerts List */}
              <div>
                <h5 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2">2. Active Medical Incidents</h5>
                <div className="border border-slate-100 dark:border-slate-700/60 rounded-2xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-700/60 text-slate-500 text-[11px] font-bold uppercase">
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Risk</th>
                        <th className="px-4 py-2">Age</th>
                        <th className="px-4 py-2">Severity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-xs">
                      {alerts.map((a) => (
                        <tr key={a.id}>
                          <td className="px-4 py-2.5 font-semibold text-slate-700 dark:text-slate-300">{a.name}</td>
                          <td className="px-4 py-2.5">{a.risk}</td>
                          <td className="px-4 py-2.5">{a.age}</td>
                          <td className="px-4 py-2.5">
                            <span className="px-2 py-0.5 bg-rose-50 text-rose-600 rounded-full font-bold">{a.type}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Footer Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 mt-4 flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  downloadHealthReport();
                  setShowReportModal(false);
                }}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#078662] hover:bg-[#066e51] transition-colors flex items-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                <span>Download CSV</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
