import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import dbData from '../data.json';

const initialIncidents = dbData.incidents;

export default function Incidents() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 11; // Matches the 11 items shown in the screenshot page 1

  // Filter logic
  const filteredIncidents = initialIncidents.filter(inc => {
    const matchesSearch =
      inc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.creche.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.assigned.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || inc.category === categoryFilter;
    const matchesSeverity = severityFilter === 'All' || inc.severity === severityFilter;
    const matchesStatus = statusFilter === 'All' || inc.status === statusFilter;

    return matchesSearch && matchesCategory && matchesSeverity && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredIncidents.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredIncidents.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Severity Badge Builder
  const renderSeverityBadge = (severity) => {
    let dotColor = '';
    let bgColor = '';
    let textColor = '';
    let borderColor = '';

    switch (severity) {
      case 'Critical':
        dotColor = 'bg-rose-600';
        bgColor = 'bg-rose-50 dark:bg-rose-950/20';
        textColor = 'text-rose-700 dark:text-rose-450';
        borderColor = 'border-rose-100 dark:border-rose-900/30';
        break;
      case 'High':
        dotColor = 'bg-rose-500';
        bgColor = 'bg-rose-50/70 dark:bg-rose-950/10';
        textColor = 'text-rose-600 dark:text-rose-400';
        borderColor = 'border-rose-100 dark:border-rose-900/20';
        break;
      case 'Medium':
        dotColor = 'bg-amber-500';
        bgColor = 'bg-amber-50 dark:bg-amber-950/20';
        textColor = 'text-amber-700 dark:text-amber-400';
        borderColor = 'border-amber-100 dark:border-amber-900/30';
        break;
      case 'Low':
        dotColor = 'bg-emerald-500';
        bgColor = 'bg-emerald-50 dark:bg-emerald-950/20';
        textColor = 'text-emerald-700 dark:text-emerald-400';
        borderColor = 'border-emerald-100 dark:border-emerald-900/30';
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
        {severity}
      </span>
    );
  };

  // Status Badge Builder
  const renderStatusBadge = (status) => {
    let dotColor = '';
    let bgColor = '';
    let textColor = '';
    let borderColor = '';

    switch (status) {
      case 'New':
        dotColor = 'bg-blue-500';
        bgColor = 'bg-blue-50/75 dark:bg-blue-950/20';
        textColor = 'text-blue-600 dark:text-blue-400';
        borderColor = 'border-blue-100/50 dark:border-blue-900/30';
        break;
      case 'Assigned':
        dotColor = 'bg-blue-500';
        bgColor = 'bg-blue-50/75 dark:bg-blue-950/20';
        textColor = 'text-blue-600 dark:text-blue-400';
        borderColor = 'border-blue-100/50 dark:border-blue-900/30';
        break;
      case 'Investigating':
        dotColor = 'bg-amber-500';
        bgColor = 'bg-amber-50 dark:bg-amber-950/20';
        textColor = 'text-amber-755 dark:text-amber-400';
        borderColor = 'border-amber-100 dark:border-amber-900/30';
        break;
      case 'Resolved':
        dotColor = 'bg-emerald-500';
        bgColor = 'bg-emerald-50 dark:bg-emerald-950/20';
        textColor = 'text-emerald-700 dark:text-emerald-400';
        borderColor = 'border-emerald-100 dark:border-emerald-900/30';
        break;
      case 'Closed':
        dotColor = 'bg-slate-400';
        bgColor = 'bg-slate-100 dark:bg-slate-800';
        textColor = 'text-slate-600 dark:text-slate-400';
        borderColor = 'border-slate-200/50 dark:border-slate-700/60';
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
    <div className="h-screen bg-[#FAFAFA] dark:bg-slate-900 flex font-sans overflow-hidden transition-colors duration-200 relative">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Navbar */}
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Main Body */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto no-scrollbar">
          {/* Header Panel */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-850 dark:text-white tracking-tight">
                Incident Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {filteredIncidents.length} incidents · live status board
              </p>
            </div>



          </div>

          {/* Interactive Search & Filter Controls */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 p-4 mb-6 shadow-xs flex flex-wrap items-center gap-4 transition-all duration-300 hover:shadow-md hover:shadow-slate-100/50 dark:hover:shadow-none">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by ID, title, crèche or inspector..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-9.5 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus-glow-brand transition-all"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 focus-glow-brand cursor-pointer transition-all duration-200"
              >
                <option value="All">All Categories</option>
                <option value="Safety">Safety</option>
                <option value="Health">Health</option>
                <option value="Nutrition">Nutrition</option>
                <option value="Infrastructure">Infrastructure</option>
              </select>
            </div>

            {/* Severity Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Severity:</span>
              <select
                value={severityFilter}
                onChange={(e) => { setSeverityFilter(e.target.value); setCurrentPage(1); }}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 focus-glow-brand cursor-pointer transition-all duration-200"
              >
                <option value="All">All Severities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 focus-glow-brand cursor-pointer transition-all duration-200"
              >
                <option value="All">All Statuses</option>
                <option value="New">New</option>
                <option value="Assigned">Assigned</option>
                <option value="Investigating">Investigating</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          {/* Incidents Board Content */}
          {filteredIncidents.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-12 text-center">
              <svg className="w-12 h-12 text-slate-300 dark:text-slate-650 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-base font-bold text-slate-800 dark:text-white">No incidents found</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Try tweaking your search terms or filter configurations.</p>
            </div>
          ) : viewMode === 'list' ? (
            // LIST VIEW (Beautiful matching layout)
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-150/80 dark:border-slate-700/60 shadow-sm overflow-hidden transition-all duration-200">
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-slate-50/65 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-750 text-[11px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider">
                      <th className="py-4.5 px-6 font-semibold">ID</th>
                      <th className="py-4.5 px-4 font-semibold">Title</th>
                      <th className="py-4.5 px-4 font-semibold">Crèche</th>
                      <th className="py-4.5 px-4 font-semibold">Category</th>
                      <th className="py-4.5 px-4 font-semibold">Severity</th>
                      <th className="py-4.5 px-4 font-semibold">Status</th>
                      <th className="py-4.5 px-4 font-semibold">Assigned</th>
                      <th className="py-4.5 px-6 font-semibold">Reported</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/80 dark:divide-slate-750">
                    {currentItems.map((inc) => (
                      <tr key={inc.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-700/30 transition-colors">
                        <td className="py-4 px-6 font-mono text-xs font-semibold text-slate-450 dark:text-slate-500">
                          {inc.id}
                        </td>
                        <td className="py-4 px-4 font-semibold text-slate-850 dark:text-slate-100 text-sm whitespace-nowrap lg:whitespace-normal max-w-xs">
                          {inc.title}
                        </td>
                        <td className="py-4 px-4 text-sm font-semibold text-slate-600 dark:text-slate-350">
                          {inc.creche}
                        </td>
                        <td className="py-4 px-4 text-sm font-semibold text-slate-500 dark:text-slate-400">
                          {inc.category}
                        </td>
                        <td className="py-4 px-4">
                          {renderSeverityBadge(inc.severity)}
                        </td>
                        <td className="py-4 px-4">
                          {renderStatusBadge(inc.status)}
                        </td>
                        <td className="py-4 px-4 text-sm font-semibold text-slate-600 dark:text-slate-350">
                          {inc.assigned}
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap">
                          {inc.reported}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Pagination Footer */}
              <div className="px-6 py-4.5 border-t border-slate-100 dark:border-slate-750 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/20 select-none">
                <span className="text-xs font-medium text-slate-450 dark:text-slate-450">
                  Showing <span className="font-semibold text-slate-750 dark:text-slate-200">{indexOfFirstItem + 1}</span> to <span className="font-semibold text-slate-750 dark:text-slate-200">{Math.min(indexOfLastItem, filteredIncidents.length)}</span> of <span className="font-semibold text-slate-750 dark:text-slate-200">{filteredIncidents.length}</span> entries
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="px-3.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:pointer-events-none shadow-xxs"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${currentPage === i + 1
                        ? 'bg-[#078662] text-white shadow-sm shadow-[#078662]/10'
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="px-3.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:pointer-events-none shadow-xxs"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // GRID VIEW (Premium interactive cards)
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentItems.map((inc) => (
                  <div key={inc.id} className="bg-white dark:bg-slate-800 border border-slate-150/80 dark:border-slate-700/60 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                    <div>
                      {/* Card Header details */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{inc.id}</span>
                        <span className="text-xs font-bold text-[#078662] bg-[#078662]/5 dark:bg-[#078662]/10 px-2 py-0.5 rounded-md">
                          {inc.category}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold text-slate-800 dark:text-white leading-snug mb-1">
                        {inc.title}
                      </h3>

                      {/* Crèche location */}
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-4">
                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                        {inc.creche}
                      </p>

                      {/* Badges row */}
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        {renderSeverityBadge(inc.severity)}
                        {renderStatusBadge(inc.status)}
                      </div>
                    </div>

                    {/* Officer assignment & reporting date */}
                    <div className="border-t border-slate-100 dark:border-slate-750 pt-3.5 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-[10px] text-slate-600 dark:text-slate-300">
                          {inc.assigned.split(' ').pop().substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-350">{inc.assigned}</span>
                          <span className="text-[9px] font-medium text-slate-400 uppercase tracking-wider">Assigned Inspector</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{inc.reported.split(' ')[0]}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Grid Pagination Footer */}
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
                <span className="text-xs font-medium text-slate-450 dark:text-slate-450">
                  Showing <span className="font-semibold text-slate-750 dark:text-slate-200">{indexOfFirstItem + 1}</span> to <span className="font-semibold text-slate-750 dark:text-slate-200">{Math.min(indexOfLastItem, filteredIncidents.length)}</span> of <span className="font-semibold text-slate-750 dark:text-slate-200">{filteredIncidents.length}</span> entries
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="px-3.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:pointer-events-none shadow-xxs"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${currentPage === i + 1
                        ? 'bg-[#078662] text-white shadow-sm shadow-[#078662]/10'
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="px-3.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:pointer-events-none shadow-xxs"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
