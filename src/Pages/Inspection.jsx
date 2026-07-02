import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Inspection() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Initial inspections mock data directly matching screenshot values
  const [inspections, setInspections] = useState([
    { id: 'INS-4000', creche: 'Shishu Crèche 1', inspector: 'Insp. Rao', date: '2026-07-5', status: 'In Progress', score: 98 },
    { id: 'INS-4001', creche: 'Ananda Crèche 2', inspector: 'Insp. Singh', date: '2026-07-6', status: 'In Progress', score: 90 },
    { id: 'INS-4002', creche: 'Surya Crèche 3', inspector: 'Insp. Behera', date: '2026-07-7', status: 'Scheduled', score: 82 },
    { id: 'INS-4003', creche: 'Tara Crèche 4', inspector: 'Insp. Patnaik', date: '2026-07-8', status: 'Approved', score: 74 },
    { id: 'INS-4004', creche: 'Jagannath Crèche 5', inspector: 'Insp. Rao', date: '2026-07-9', status: 'Approved', score: 66 },
    { id: 'INS-4005', creche: 'Konark Crèche 6', inspector: 'Insp. Singh', date: '2026-07-10', status: 'Submitted', score: 97 },
    { id: 'INS-4006', creche: 'Lotus Crèche 7', inspector: 'Insp. Behera', date: '2026-07-11', status: 'In Progress', score: 89 },
    { id: 'INS-4007', creche: 'Asha Crèche 8', inspector: 'Insp. Patnaik', date: '2026-07-12', status: 'In Progress', score: 81 },
    { id: 'INS-4008', creche: 'Shishu Crèche 9', inspector: 'Insp. Rao', date: '2026-07-13', status: 'Scheduled', score: 73 },
    { id: 'INS-4009', creche: 'Ananda Crèche 10', inspector: 'Insp. Singh', date: '2026-07-14', status: 'Approved', score: 65 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');

  // Checklist interactive state
  const [checklist, setChecklist] = useState({
    fireExtinguisher: false,
    emergencyExit: false,
    cctvOperational: false,
    firstAidStocked: false,
    drinkingWater: false,
    sanitation: false,
    electricalSafety: false,
  });

  const handleToggleCheck = (key) => {
    setChecklist(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Add modal state
  const [formInspection, setFormInspection] = useState({
    creche: '',
    inspector: 'Insp. Rao',
    date: '2026-07-15',
    status: 'Scheduled',
    score: 85
  });

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const filteredInspections = inspections.filter(ins => {
    const matchesSearch = ins.creche.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ins.inspector.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ins.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All Statuses' || ins.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formInspection.creche.trim()) return;

    const newId = `INS-${4000 + inspections.length}`;
    const newRecord = {
      id: newId,
      creche: formInspection.creche,
      inspector: formInspection.inspector,
      date: formInspection.date,
      status: formInspection.status,
      score: parseInt(formInspection.score) || 80
    };

    setInspections([newRecord, ...inspections]);
    setShowAddModal(false);
    setFormInspection({
      creche: '',
      inspector: 'Insp. Rao',
      date: '2026-07-15',
      status: 'Scheduled',
      score: 85
    });
    triggerToast(`Inspection schedule ${newId} created successfully!`);
  };

  // Badge rendering helper
  const renderStatusBadge = (status) => {
    let dotColor = '';
    let bgColor = '';
    let textColor = '';
    let borderColor = '';

    switch (status) {
      case 'Approved':
        dotColor = 'bg-[#22c55e]';
        bgColor = 'bg-[#edf9f1] dark:bg-emerald-950/40';
        textColor = 'text-[#22c55e] dark:text-emerald-400';
        borderColor = 'border-[#22c55e]/10 dark:border-emerald-900/30';
        break;
      case 'In Progress':
        dotColor = 'bg-[#f59e0b]';
        bgColor = 'bg-[#fffbeb] dark:bg-amber-950/40';
        textColor = 'text-[#f59e0b] dark:text-amber-400';
        borderColor = 'border-[#f59e0b]/10 dark:border-amber-900/30';
        break;
      case 'Scheduled':
        dotColor = 'bg-[#3b82f6]';
        bgColor = 'bg-[#eff6ff] dark:bg-blue-950/40';
        textColor = 'text-[#3b82f6] dark:text-blue-400';
        borderColor = 'border-[#3b82f6]/10 dark:border-blue-900/30';
        break;
      default: // Submitted
        dotColor = 'bg-[#0891b2]';
        bgColor = 'bg-[#ecfeff] dark:bg-cyan-950/40';
        textColor = 'text-[#0891b2] dark:text-cyan-400';
        borderColor = 'border-[#0891b2]/10 dark:border-cyan-900/30';
        break;
    }

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${bgColor} ${textColor} ${borderColor}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
        {status}
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

        {/* Scrollable body */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto no-scrollbar space-y-6">

          {/* Header section exactly matching layout */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
                Inspection Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                <span className="font-bold text-slate-800 dark:text-slate-200">{filteredInspections.length} inspections</span> matching
              </p>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#078662] hover:bg-[#066e51] rounded-full transition-colors shadow-sm cursor-pointer active:scale-95 whitespace-nowrap"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span>New Inspection</span>
              </button>
            </div>
          </div>

          {/* Search & Filter card */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by crèche, inspector, or ID..."
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border-none rounded-full text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#078662]/20 transition-all font-medium"
              />
            </div>

            {/* Dropdown Status Selector */}
            <div className="relative w-full sm:w-auto shrink-0">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="appearance-none w-full sm:w-48 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full pl-4 pr-9 py-2 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#078662]/20 transition-all"
              >
                <option value="All Statuses">All Statuses</option>
                <option value="Approved">Approved</option>
                <option value="In Progress">In Progress</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Submitted">Submitted</option>
              </select>
              <svg className="w-3.5 h-3.5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Schedule list table (Full-width) */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-white">Schedule</h3>

            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-sm overflow-hidden transition-colors">
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full min-w-[800px] text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f8fafc] dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-700/50 font-sans">
                      <th className="px-6 py-4.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap">ID</th>
                      <th className="px-6 py-4.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap">Crèche</th>
                      <th className="px-6 py-4.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap">Inspector</th>
                      <th className="px-6 py-4.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap">Scheduled</th>
                      <th className="px-6 py-4.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                      <th className="px-6 py-4.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                    {filteredInspections.map((ins) => (
                      <tr 
                        key={ins.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors"
                      >
                        <td className="px-6 py-5 text-[13px] text-slate-500 dark:text-slate-400 font-semibold whitespace-nowrap">
                          {ins.id}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className="text-sm font-bold text-slate-800 dark:text-white">
                            {ins.creche}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-sm font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">
                          {ins.inspector}
                        </td>
                        <td className="px-6 py-5 text-sm font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">
                          {ins.date}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          {renderStatusBadge(ins.status)}
                        </td>
                        <td className="px-6 py-5 text-sm font-extrabold text-slate-900 dark:text-white whitespace-nowrap">
                          {ins.score}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </main>
      </div>

      {/* Add New Inspection Modal overlay */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-all animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 w-full max-w-md shadow-2xl overflow-hidden p-6 sm:p-8 relative animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700/60 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Schedule New Inspection</h3>
                <p className="text-xs text-slate-500 dark:text-slate-450 mt-0.5 font-medium">Assign inspectors and set dates for checking crèches</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Crèche Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lotus Crèche 7"
                  value={formInspection.creche}
                  onChange={(e) => setFormInspection({ ...formInspection, creche: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#078662]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Inspector</label>
                  <select
                    value={formInspection.inspector}
                    onChange={(e) => setFormInspection({ ...formInspection, inspector: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#078662]/20"
                  >
                    <option value="Insp. Rao">Insp. Rao</option>
                    <option value="Insp. Singh">Insp. Singh</option>
                    <option value="Insp. Behera">Insp. Behera</option>
                    <option value="Insp. Patnaik">Insp. Patnaik</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Scheduled Date</label>
                  <input
                    type="date"
                    required
                    value={formInspection.date}
                    onChange={(e) => setFormInspection({ ...formInspection, date: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl text-sm text-slate-850 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#078662]/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Initial Status</label>
                  <select
                    value={formInspection.status}
                    onChange={(e) => setFormInspection({ ...formInspection, status: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#078662]/20"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Approved">Approved</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Safety Score</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={formInspection.score}
                    onChange={(e) => setFormInspection({ ...formInspection, score: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#078662]/20"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700/60 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#078662] hover:bg-[#066e51] rounded-full transition-colors cursor-pointer active:scale-95"
                >
                  Confirm Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
