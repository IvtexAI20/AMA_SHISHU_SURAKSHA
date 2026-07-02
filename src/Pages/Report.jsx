import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Report() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('info'); // 'info' | 'success'

  // Mock reports database matching screenshot values exactly
  const [reports] = useState([
    { id: 'RP-001', name: 'Monthly District Summary — June 2026', type: 'District', date: '2026-06-23', size: '2.4 MB' },
    { id: 'RP-002', name: 'Nutrition Compliance — Q2 2026', type: 'Block', date: '2026-06-20', size: '1.8 MB' },
    { id: 'RP-003', name: 'Incident Postmortem — Konark Crèche 7', type: 'Crèche', date: '2026-06-19', size: '640 KB' },
    { id: 'RP-004', name: 'Child Growth Audit — Khordha', type: 'Child', date: '2026-06-15', size: '3.1 MB' },
    { id: 'RP-005', name: 'Vaccination Drive Outcomes — May 2026', type: 'District', date: '2026-06-02', size: '1.2 MB' },
  ]);

  const triggerToast = (msg) => {
    setToastMsg(msg);
  };

  const handleDownload = (report) => {
    setToastType('info');
    triggerToast(`Downloading ${report.name}...`);

    setTimeout(() => {
      // Simulate real browser download by creating temporary text blob file
      const element = document.createElement("a");
      const file = new Blob([
        `Report ID: ${report.id}\n` +
        `Report Name: ${report.name}\n` +
        `Type: ${report.type}\n` +
        `Date: ${report.date}\n` +
        `Size: ${report.size}\n\n` +
        `--------------------------------------------------\n` +
        `This is a generated mockup export report file from AMA SHISHU SURAKSHA system.\n` +
        `All data remains protected under district guidelines.`
      ], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${report.name.replace(/ — /g, "_").replace(/ /g, "_")}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      // Transition to success state toast
      setToastType('success');
      triggerToast(`Downloaded ${report.name} successfully!`);
      
      // Auto dismiss after 2.5 seconds
      setTimeout(() => setToastMsg(''), 2500);
    }, 1200);
  };

  return (
    <div className="h-screen bg-[#FAFAFA] dark:bg-slate-900 flex font-sans overflow-hidden transition-colors duration-200 relative">
      {/* Toast Notification */}
      {toastMsg && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl text-white text-sm font-semibold shadow-xl border animate-in fade-in slide-in-from-bottom-4 duration-300 ${
          toastType === 'success' 
            ? 'bg-slate-900 border-slate-800 dark:bg-emerald-950/90 dark:border-emerald-800/50 text-white' 
            : 'bg-slate-900 border-slate-800'
        }`}>
          {toastType === 'success' ? (
            <svg className="w-5 h-5 text-emerald-400 animate-bounce" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-sky-400 animate-spin" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
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
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Reports
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                Generated and exported documents
              </p>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-sm overflow-hidden transition-colors">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full min-w-[800px] text-left border-collapse">
                <thead>
                  <tr className="bg-[#f8fafc] dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-700/50 font-sans">
                    <th className="px-6 py-4.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap">ID</th>
                    <th className="px-6 py-4.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap">Name</th>
                    <th className="px-6 py-4.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap">Type</th>
                    <th className="px-6 py-4.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap">Date</th>
                    <th className="px-6 py-4.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap">Size</th>
                    <th className="px-6 py-4.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {reports.map((report) => (
                    <tr 
                      key={report.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors"
                    >
                      <td className="px-6 py-5 text-[13px] text-slate-550 dark:text-slate-400 font-semibold whitespace-nowrap">
                        {report.id}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-sm font-bold text-slate-800 dark:text-white">
                            {report.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {report.type}
                      </td>
                      <td className="px-6 py-5 text-sm font-semibold text-slate-600 dark:text-slate-350 whitespace-nowrap">
                        {report.date}
                      </td>
                      <td className="px-6 py-5 text-sm font-semibold text-slate-600 dark:text-slate-350 whitespace-nowrap">
                        {report.size}
                      </td>
                      <td className="px-6 py-5 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleDownload(report)}
                          className="inline-flex items-center gap-1.5 text-[#0ea5e9] hover:text-sky-600 font-semibold text-sm transition-colors cursor-pointer select-none"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          <span>Download</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
