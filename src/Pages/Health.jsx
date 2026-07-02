import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

import dbData from '../data.json';

const initialAlerts = dbData.healthAlerts;
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const blueData = dbData.blueCohortData;
const greenData = dbData.greenCohortData;

export default function Health() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [alerts, setAlerts] = useState(() => {
    const saved = localStorage.getItem('healthAlerts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return initialAlerts;
  });
  const [toastMsg, setToastMsg] = useState('');
  const childrenList = (() => {
    const saved = localStorage.getItem('childrenList');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) { }
    }
    return dbData.children;
  })();

  const totalChildrenTracked = childrenList.length;

  const vaccinatedCount = childrenList.filter(c => c.vaccinated === 'Completed' || c.vaccinated === 'Fully Vaccinated').length;
  const vaccinatedPct = childrenList.length ? Math.round((vaccinatedCount / childrenList.length) * 100) + '%' : '85%';

  const healthyGrowthCount = childrenList.filter(c => c.status === 'Healthy').length;
  const growthOnTrackPct = childrenList.length ? Math.round((healthyGrowthCount / childrenList.length) * 100) + '%' : '89%';

  const activeMedicalAlertsCount = alerts.length;

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

  const handleEscalate = (id, name) => {
    const updatedList = alerts.map(a => {
      if (a.id === id) {
        return { ...a, escalated: true };
      }
      return a;
    });
    setAlerts(updatedList);
    localStorage.setItem('healthAlerts', JSON.stringify(updatedList));
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
    const updatedList = alerts.map(a => {
      if (a.id === selectedChild.id) {
        return {
          ...a,
          risk: childStatus === 'Critical' ? 97 : 80,
          type: childStatus,
          lastUpdated: 'Just now'
        };
      }
      return a;
    });
    setAlerts(updatedList);
    localStorage.setItem('healthAlerts', JSON.stringify(updatedList));

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

  const chartData = months.map((m, idx) => ({
    month: m,
    avgHeight: blueData[idx],
    avgWeight: parseFloat(((greenData[idx] / 100) * 16).toFixed(1))
  }));

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
              className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#078662] hover:bg-[#066e51] rounded-full transition-all shadow-sm cursor-pointer active:scale-95 premium-btn self-end sm:self-auto"
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
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-6 shadow-sm flex flex-col justify-between hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 transition-transform hover:scale-105 duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-semibold text-slate-800 dark:text-white leading-tight">
                  {totalChildrenTracked}
                </span>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">
                  Children Tracked
                </span>
              </div>
            </div>

            {/* Vaccinated */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-6 shadow-sm flex flex-col justify-between hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 transition-transform hover:scale-105 duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-semibold text-slate-800 dark:text-white leading-tight">
                  {vaccinatedPct}
                </span>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">
                  Vaccinated
                </span>
              </div>
            </div>

            {/* Growth On-track */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-6 shadow-sm flex flex-col justify-between hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 transition-transform hover:scale-105 duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-semibold text-slate-800 dark:text-white leading-tight">
                  {growthOnTrackPct}
                </span>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">
                  Growth On-track
                </span>
              </div>
            </div>

            {/* Active Medical Alerts */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-6 shadow-sm flex flex-col justify-between hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4 transition-transform hover:scale-105 duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-semibold text-slate-800 dark:text-white leading-tight">
                  {activeMedicalAlertsCount}
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
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-6 shadow-sm flex flex-col justify-start transition-all relative">

              <div className="flex items-center justify-between gap-4 mb-36">
                <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white">
                  Average Growth
                </h3>
              </div>

              <div className="w-full relative overflow-x-auto no-scrollbar">
                <div className="min-w-[700px] w-full h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={chartData}
                      margin={{ top: 0, right: 30, left: 10, bottom: 10 }}
                    >
                      <defs>
                        <linearGradient id="heightColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="weightColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                      />
                      <YAxis
                        yAxisId="left"
                        tickLine={false}
                        axisLine={false}
                        domain={[60, 100]}
                        tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                        unit=" cm"
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        tickLine={false}
                        axisLine={false}
                        domain={[5, 15]}
                        tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                        unit=" kg"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          border: 'none',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '12px',
                          fontWeight: '600',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                        }}
                        itemStyle={{ color: '#fff' }}
                        labelStyle={{ color: '#94a3b8', marginBottom: '4px', fontWeight: '700' }}
                        formatter={(value, name) => {
                          if (name === "avgHeight") return [`${value} cm`, "Avg Height"];
                          if (name === "avgWeight") return [`${value} kg`, "Avg Weight"];
                          return [value, name];
                        }}
                      />
                      <Legend
                        verticalAlign="top"
                        height={18}
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{ fontSize: '12px', fontWeight: '600' }}
                      />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="avgHeight"
                        name="avgHeight"
                        stroke="#3b82f6"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#heightColor)"
                        activeDot={{ r: 6 }}
                      />
                      <Area
                        yAxisId="right"
                        type="monotone"
                        dataKey="avgWeight"
                        name="avgWeight"
                        stroke="#22c55e"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#weightColor)"
                        activeDot={{ r: 6 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
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
                            {item.lastUpdated && (
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold ml-1">
                                (Updated {item.lastUpdated})
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1.5">
                        {/* Alert red badge */}
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-rose-50 text-rose-600 border-rose-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                          Alert
                        </span>
                        {item.escalated && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-600 border border-amber-100 uppercase tracking-wider">
                            Escalated
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div className="flex items-center gap-2.5 pt-1 mt-1">
                      <button
                        type="button"
                        onClick={() => handleOpenUpdate(item)}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#078662] hover:bg-[#066e51] transition-all cursor-pointer active:scale-95 premium-btn"
                      >
                        Update
                      </button>
                      <button
                        type="button"
                        disabled={item.escalated}
                        onClick={() => handleEscalate(item.id, item.name)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer active:scale-95 premium-btn ${item.escalated
                          ? 'text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 opacity-60 cursor-default active:scale-100'
                          : 'text-slate-550 hover:text-slate-800 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                          }`}
                      >
                        {item.escalated ? 'Escalated' : 'Escalate'}
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
