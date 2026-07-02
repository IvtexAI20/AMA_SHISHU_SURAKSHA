import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

import dbData from '../data.json';

const initialChildren = dbData.children;
const crechesListOptions = dbData.crecheOptions;
const overviewTrendData = dbData.overviewTrendData;
const growthCurveData = dbData.growthCurveData;

export default function Children() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [childrenList, setChildrenList] = useState(() => {
    const saved = localStorage.getItem('childrenList');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return initialChildren;
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Detail View States
  const [selectedChild, setSelectedChild] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');

  // Trigger Modal States for Profile Header Card Actions
  const [showAddRecordModal, setShowAddRecordModal] = useState(false);
  const [showAssignCareModal, setShowAssignCareModal] = useState(false);
  const [showScheduleVisitModal, setShowScheduleVisitModal] = useState(false);

  // Success toast/message overlay state
  const [toastMsg, setToastMsg] = useState('');

  // Add Record Form State
  const [recordForm, setRecordForm] = useState({
    type: 'Growth',
    height: '',
    weight: '',
    inspectionNotes: '',
    inspectionStatus: 'Healthy',
  });

  // Assign Care Form State
  const [assignForm, setAssignForm] = useState({
    caregiver: 'Sasmita Rani',
    role: 'Nutritionist',
    notes: '',
  });

  // Schedule Visit Form State
  const [visitForm, setVisitForm] = useState({
    dateTime: '',
    doctor: 'Dr. Suresh Rao',
    purpose: 'Routine Health Check',
    notes: '',
  });

  // Dynamic log states
  const [vaccineList, setVaccineList] = useState([
    { name: 'BCG (Tuberculosis)', age: 'At Birth', status: 'Completed', date: '2025-06-12' },
    { name: 'OPV 0 (Polio)', age: 'At Birth', status: 'Completed', date: '2025-06-12' },
    { name: 'Pentavalent 1', age: '6 Weeks', status: 'Completed', date: '2025-07-24' },
    { name: 'Rotavirus 1', age: '6 Weeks', status: 'Completed', date: '2025-07-24' },
    { name: 'Measles 1 (MR)', age: '9 Months', status: 'Completed', date: '2026-03-15' },
    { name: 'DPT Booster 1', age: '16-24 Months', status: 'Pending', date: '-' },
    { name: 'OPV Booster 1', age: '16-24 Months', status: 'Pending', date: '-' },
  ]);

  const [attendanceDays, setAttendanceDays] = useState(
    Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      status: i % 12 === 4 ? 'Absent' : i % 12 === 9 ? 'Leave' : 'Present',
    }))
  );

  const [activeAlerts, setActiveAlerts] = useState(dbData.childActiveAlerts);

  const [healthLogs, setHealthLogs] = useState(dbData.childDetailHealthLogs);

  // Form state for enrolling a child
  const [formData, setFormData] = useState({
    name: '',
    ageNum: '3',
    gender: 'M',
    creche: 'Joda Shishu Crèche',
    riskScore: '30',
    attendance: '85',
    status: 'Healthy',
    height: '92 cm',
    weight: '13.5 kg',
    vaccinated: 'Pending',
    guardian: 'Guardian Name',
  });

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg('');
    }, 4000);
  };

  const handleEnrollSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const numericIds = childrenList
      .map((c) => parseInt(c.id.replace('CH-', ''), 10))
      .filter((num) => !isNaN(num));
    const nextNumericId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 2009;
    const newId = `CH-${nextNumericId}`;

    const score = parseInt(formData.riskScore, 10) || 0;
    
    const newChild = {
      id: newId,
      name: formData.name.trim(),
      age: `${formData.ageNum}y`,
      gender: formData.gender,
      creche: formData.creche,
      riskScore: score,
      attendance: `${formData.attendance}%`,
      status: formData.status,
      height: formData.height,
      weight: formData.weight,
      vaccinated: formData.vaccinated,
      guardian: formData.guardian,
    };

    const updatedList = [newChild, ...childrenList];
    setChildrenList(updatedList);
    localStorage.setItem('childrenList', JSON.stringify(updatedList));
    setShowEnrollModal(false);
    triggerToast(`Child ${formData.name.trim()} enrolled successfully!`);
    setFormData({
      name: '',
      ageNum: '3',
      gender: 'M',
      creche: 'Joda Shishu Crèche',
      riskScore: '30',
      attendance: '85',
      status: 'Healthy',
      height: '92 cm',
      weight: '13.5 kg',
      vaccinated: 'Pending',
      guardian: 'Guardian Name',
    });
  };

  // Submit Handler for Add Record
  const handleAddRecordSubmit = (e) => {
    e.preventDefault();
    if (!selectedChild) return;

    if (recordForm.type === 'Growth') {
      const hVal = recordForm.height.trim() ? `${recordForm.height} cm` : selectedChild.height;
      const wVal = recordForm.weight.trim() ? `${recordForm.weight} kg` : selectedChild.weight;
      
      const updated = {
        ...selectedChild,
        height: hVal,
        weight: wVal
      };
      setSelectedChild(updated);
      setChildrenList(childrenList.map(c => c.id === selectedChild.id ? updated : c));
      triggerToast(`Growth record added. Height: ${hVal}, Weight: ${wVal}`);
    } else {
      const newLog = {
        id: 'h_' + Date.now(),
        type: 'Health Inspection',
        desc: recordForm.inspectionNotes || 'General checkup completed.',
        date: new Date().toISOString().split('T')[0],
        status: recordForm.inspectionStatus,
      };
      setHealthLogs([newLog, ...healthLogs]);
      
      const updated = {
        ...selectedChild,
        status: recordForm.inspectionStatus
      };
      setSelectedChild(updated);
      setChildrenList(childrenList.map(c => c.id === selectedChild.id ? updated : c));
      triggerToast(`Health inspection log added successfully!`);
    }

    setShowAddRecordModal(false);
    setRecordForm({
      type: 'Growth',
      height: '',
      weight: '',
      inspectionNotes: '',
      inspectionStatus: 'Healthy',
    });
  };

  // Submit Handler for Assign Care
  const handleAssignCareSubmit = (e) => {
    e.preventDefault();
    if (!selectedChild) return;

    const guardianText = `${assignForm.caregiver} (${assignForm.role})`;
    const updated = {
      ...selectedChild,
      guardian: guardianText
    };
    setSelectedChild(updated);
    setChildrenList(childrenList.map(c => c.id === selectedChild.id ? updated : c));
    setShowAssignCareModal(false);
    triggerToast(`Assigned ${assignForm.caregiver} as ${assignForm.role}`);
    setAssignForm({
      caregiver: 'Sasmita Rani',
      role: 'Nutritionist',
      notes: '',
    });
  };

  // Submit Handler for Schedule Visit
  const handleScheduleVisitSubmit = (e) => {
    e.preventDefault();
    if (!selectedChild) return;

    const formattedTime = visitForm.dateTime ? visitForm.dateTime.replace('T', ' ') : 'Next Week';
    const newAlert = {
      id: 'a_' + Date.now(),
      title: `Scheduled: ${visitForm.purpose}`,
      desc: `Pediatric visit scheduled with ${visitForm.doctor} on ${formattedTime}. Notes: ${visitForm.notes || 'None'}`,
      date: 'Scheduled',
      type: 'Warning',
    };
    setActiveAlerts([newAlert, ...activeAlerts]);
    setShowScheduleVisitModal(false);
    triggerToast(`Visit scheduled with ${visitForm.doctor} for ${visitForm.purpose}`);
    setVisitForm({
      dateTime: '',
      doctor: 'Dr. Suresh Rao',
      purpose: 'Routine Health Check',
      notes: '',
    });
  };

  const filteredChildren = childrenList.filter((child) => {
    const matchesSearch = child.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === 'All Statuses' ||
      child.status.toLowerCase() === selectedStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredChildren.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedChildren = filteredChildren.slice(startIndex, endIndex);

  // Helper to extract initials for avatar
  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  const handleSelectChild = (child) => {
    setSelectedChild(child);
    setActiveTab('Overview');
  };

  // Vaccine status toggle handler
  const handleToggleVaccine = (index) => {
    const updated = [...vaccineList];
    const prevStatus = updated[index].status;
    const nowStatus = prevStatus === 'Completed' ? 'Pending' : 'Completed';
    updated[index].status = nowStatus;
    updated[index].date = nowStatus === 'Completed' ? new Date().toISOString().split('T')[0] : '-';
    setVaccineList(updated);

    // Update selected child state live
    if (selectedChild) {
      const allDone = updated.filter(v => v.status === 'Pending').length === 0;
      const nextVaccinatedStatus = allDone ? 'Completed' : 'Pending';
      
      setSelectedChild({ ...selectedChild, vaccinated: nextVaccinatedStatus });
      setChildrenList(childrenList.map(c => 
        c.id === selectedChild.id ? { ...c, vaccinated: nextVaccinatedStatus } : c
      ));
    }
  };

  // Calendar toggle handler
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

  // Dismiss alert handler
  const handleDismissAlert = (id) => {
    setActiveAlerts(activeAlerts.filter((a) => a.id !== id));
  };

  // Tab Rendering Function
  const renderTabContent = (child) => {
    switch (activeTab) {
      case 'Overview':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-base font-bold text-slate-800 dark:text-white mb-1">Health Trend Indicators</h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Monthly monitoring updates for the current calendar year</p>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={overviewTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="topMetric" 
                    name="Growth Percentile" 
                    stroke="#3b82f6" 
                    strokeWidth={2} 
                    dot={{ r: 4, fill: '#fff', stroke: '#3b82f6', strokeWidth: 2 }} 
                    activeDot={{ r: 6 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="bottomMetric" 
                    name="Risk Index" 
                    stroke="#22c55e" 
                    strokeWidth={2} 
                    dot={{ r: 4, fill: '#fff', stroke: '#22c55e', strokeWidth: 2 }} 
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      case 'Growth':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-base font-bold text-slate-800 dark:text-white mb-2">Weight growth curve (kg)</h4>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Comparison with WHO Standard curve for age groups</p>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={growthCurveData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                      <YAxis domain={[8, 16]} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                      <Tooltip />
                      <Legend verticalAlign="top" height={36} iconType="circle" />
                      <Line type="monotone" dataKey="standard" name="WHO Standard" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={1.5} dot={false} />
                      <Line type="monotone" dataKey="actual" name="Child Progress" stroke="#00bcd4" strokeWidth={2.5} dot={{ r: 4, fill: '#fff', stroke: '#00bcd4', strokeWidth: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-base font-bold text-slate-800 dark:text-white">Growth Stats</h4>
                <div className="border border-slate-100 dark:border-slate-700/60 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-900/30 space-y-3">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-slate-500">Weight Percentile</span>
                    <span className="text-slate-800 dark:text-white">45th Percentile (Healthy)</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-slate-500">Height Percentile</span>
                    <span className="text-slate-800 dark:text-white">48th Percentile (Healthy)</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-slate-500">BMI Calculation</span>
                    <span className="text-slate-800 dark:text-white">15.9 (Normal Range)</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-slate-500">Growth Velocity</span>
                    <span className="text-slate-800 dark:text-white">+250g / Month</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'Nutrition':
        return (
          <div className="space-y-6">
            <h4 className="text-base font-bold text-slate-800 dark:text-white">Nutritional Intake Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Daily targets progress bars */}
              <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border border-slate-100 dark:border-slate-700/40 p-4 space-y-4">
                <h5 className="font-bold text-slate-700 dark:text-slate-300 text-sm">Today's Macronutrients</h5>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1 text-slate-500">
                      <span>Protein</span>
                      <span className="text-slate-700 dark:text-slate-300">12g / 15g (80%)</span>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1 text-slate-500">
                      <span>Calories</span>
                      <span className="text-slate-700 dark:text-slate-300">820 kcal / 1000 kcal (82%)</span>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-sky-500 rounded-full" style={{ width: '82%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1 text-slate-500">
                      <span>Carbs</span>
                      <span className="text-slate-700 dark:text-slate-300">110g / 130g (85%)</span>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Today's meals Served checklist */}
              <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border border-slate-100 dark:border-slate-700/40 p-4 space-y-3">
                <h5 className="font-bold text-slate-700 dark:text-slate-300 text-sm">Meals Served Log</h5>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 font-semibold cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4" />
                    <span>Morning: Ragi Porridge (Served)</span>
                  </label>
                  <label className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 font-semibold cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4" />
                    <span>Lunch: Khichdi + Boiled Egg (Served)</span>
                  </label>
                  <label className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 font-semibold cursor-pointer">
                    <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4" />
                    <span>Afternoon: Banana / Apple (Pending)</span>
                  </label>
                </div>
              </div>

              {/* Diet chart */}
              <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border border-slate-100 dark:border-slate-700/40 p-4 space-y-2">
                <h5 className="font-bold text-slate-700 dark:text-slate-300 text-sm">Dietary Recommendations</h5>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Focus on calcium-rich supplements. Recommend adding 150ml milk daily to afternoon snacks. Compliance with protein target is strong.
                </p>
              </div>
            </div>
          </div>
        );
      case 'Attendance':
        const presentCount = attendanceDays.filter(d => d.status === 'Present').length;
        const absentCount = attendanceDays.filter(d => d.status === 'Absent').length;
        const leaveCount = attendanceDays.filter(d => d.status === 'Leave').length;
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-bold text-slate-800 dark:text-white mb-1">Monthly Attendance Ledger</h4>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Click on any calendar day to toggle status record</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-emerald-500"></span> Present ({presentCount})</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-rose-500"></span> Absent ({absentCount})</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-amber-500"></span> Leave ({leaveCount})</span>
              </div>
            </div>
            
            {/* Interactive Calendar grid */}
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2.5">
              {attendanceDays.map((d) => (
                <button
                  key={d.day}
                  onClick={() => handleToggleAttendanceDay(d.day)}
                  className={`py-3.5 px-2 rounded-xl text-center font-bold text-sm select-none border transition-all active:scale-90 ${
                    d.status === 'Present'
                      ? 'bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/40 dark:text-emerald-400'
                      : d.status === 'Absent'
                      ? 'bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900/40 dark:text-rose-400'
                      : 'bg-amber-50 border-amber-100 text-amber-600 dark:bg-amber-950/20 dark:border-amber-900/40 dark:text-amber-400'
                  }`}
                >
                  <span className="block text-[10px] text-slate-400 font-medium mb-0.5">Day</span>
                  {d.day}
                </button>
              ))}
            </div>
          </div>
        );
      case 'Health':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-slate-800 dark:text-white mb-1">Inspection Logs</h4>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">History of regular pediatric health checkups</p>
              </div>
              <button 
                onClick={() => {
                  setRecordForm({ ...recordForm, type: 'Health Inspection' });
                  setShowAddRecordModal(true);
                }}
                className="px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer active:scale-95"
              >
                + New Log
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {healthLogs.map((log) => (
                <div key={log.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 first:pt-0 last:pb-0">
                  <div>
                    <h5 className="font-bold text-slate-800 dark:text-white text-sm">{log.type}</h5>
                    <p className="text-xs text-slate-500 mt-0.5">{log.desc}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-slate-400">{log.date}</span>
                    <span className={`block text-xs font-semibold mt-1 ${
                      log.status.toLowerCase() === 'healthy' ? 'text-emerald-600' : log.status.toLowerCase() === 'monitoring' ? 'text-amber-600' : 'text-rose-600'
                    }`}>{log.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'Vaccination':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-base font-bold text-slate-800 dark:text-white mb-1">Standard Immunization Record</h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Mark administered vaccines to automatically update vaccination status card</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-700/50 font-bold text-slate-400">
                    <th className="py-3 px-2">Vaccine Name</th>
                    <th className="py-3 px-2">Target Age</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2">Administered Date</th>
                    <th className="py-3 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 font-medium">
                  {vaccineList.map((v, idx) => (
                    <tr key={v.name} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20">
                      <td className="py-3.5 px-2 font-bold text-slate-800 dark:text-white">{v.name}</td>
                      <td className="py-3.5 px-2 text-slate-500">{v.age}</td>
                      <td className="py-3.5 px-2">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          v.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                            : 'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${v.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                          {v.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-slate-500">{v.date}</td>
                      <td className="py-3.5 px-2 text-right">
                        <button 
                          onClick={() => handleToggleVaccine(idx)}
                          className="text-cyan-500 hover:text-cyan-600 font-bold text-xs hover:underline cursor-pointer select-none active:scale-95"
                        >
                          {v.status === 'Completed' ? 'Undo' : 'Mark Administered'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'Alerts':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-base font-bold text-slate-800 dark:text-white mb-1">AI Risk & Compliance Alerts</h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Automatic system-flagged anomalies that require intervention</p>
            </div>
            
            {activeAlerts.length === 0 ? (
              <div className="text-center py-10 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-700/60 rounded-2xl">
                <p className="text-sm font-semibold text-slate-400">All alerts dismissed. Child status is fully compliant!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeAlerts.map((a) => (
                  <div 
                    key={a.id} 
                    className={`flex items-start justify-between gap-4 border rounded-2xl p-4 transition-all shadow-xs ${
                      a.type === 'Critical'
                        ? 'bg-rose-50/40 border-rose-100 dark:bg-rose-950/20 dark:border-rose-900/30'
                        : 'bg-amber-50/40 border-amber-100 dark:bg-amber-950/20 dark:border-amber-900/30'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${a.type === 'Critical' ? 'bg-rose-500' : 'bg-amber-500'}`}></span>
                        <h5 className="font-bold text-slate-800 dark:text-white text-sm">{a.title}</h5>
                        <span className="text-[10px] font-bold text-slate-400">{a.date}</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{a.desc}</p>
                    </div>
                    <button 
                      onClick={() => handleDismissAlert(a.id)}
                      className="px-3 py-1 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-white/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  // Rendering detailed view of a selected child
  const renderChildDetail = (child) => {
    const ageLabel = child.age === '1y' ? '1 years' : child.age.replace('y', ' years');
    const genderLabel = child.gender === 'F' ? 'Female' : 'Male';
    return (
      <div className="space-y-6">
        {/* Back Link */}
        <button 
          onClick={() => setSelectedChild(null)}
          className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors group cursor-pointer"
        >
          <svg className="w-4 h-4 text-slate-400 group-hover:translate-x-[-2px] transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to children</span>
        </button>

        {/* Child Profile Card Header - Fully Responsive and Tidied UI */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-6 flex flex-col xl:flex-row xl:items-center justify-between gap-6 shadow-sm transition-colors">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4.5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#0ea5e9] text-white font-semibold text-lg sm:text-xl flex items-center justify-center shrink-0 shadow-md">
              {getInitials(child.name)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white leading-tight">
                  {child.name}
                </h2>
                <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold border ${
                  child.status.toLowerCase() === 'healthy'
                    ? 'bg-[#edf9f1] dark:bg-emerald-950/40 text-[#22c55e] dark:text-emerald-400 border border-[#22c55e]/10'
                    : child.status.toLowerCase() === 'monitoring'
                    ? 'bg-[#fffbeb] dark:bg-amber-950/40 text-[#f59e0b] dark:text-amber-400 border border-[#f59e0b]/10'
                    : 'bg-[#fef2f2] dark:bg-rose-950/40 text-[#ef4444] dark:text-rose-400 border border-[#ef4444]/10'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    child.status.toLowerCase() === 'healthy' ? 'bg-[#22c55e]' : child.status.toLowerCase() === 'monitoring' ? 'bg-[#f59e0b]' : 'bg-[#ef4444]'
                  }`}></span>
                  {child.status}
                </span>
              </div>
              
              <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                {child.id} · {ageLabel} · {genderLabel} · {child.creche}
              </p>
              <p className="text-xs sm:text-sm font-bold text-slate-400 mt-1">
                Guardian: {child.guardian || 'Guardian 1'}
              </p>
            </div>
          </div>

          {/* Action buttons with flex-wrap and responsive scaling */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto shrink-0">
            <button 
              onClick={() => {
                setRecordForm({
                  type: 'Growth',
                  height: child.height ? child.height.replace(' cm', '') : '',
                  weight: child.weight ? child.weight.replace(' kg', '') : '',
                  inspectionNotes: '',
                  inspectionStatus: child.status,
                });
                setShowAddRecordModal(true);
              }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95 cursor-pointer shadow-xs whitespace-nowrap"
            >
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span>Add Record</span>
            </button>
            <button 
              onClick={() => setShowAssignCareModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95 cursor-pointer shadow-xs whitespace-nowrap"
            >
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span>Assign Care</span>
            </button>
            <button 
              onClick={() => setShowScheduleVisitModal(true)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#078662] hover:bg-[#066e51] rounded-xl transition-all active:scale-95 shadow-md shadow-[#078662]/10 whitespace-nowrap cursor-pointer"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Schedule Visit</span>
            </button>
          </div>
        </div>

        {/* 5-Column Stats Grid - Clean, Spacious, and Fully Responsive */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4.5">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 p-5 shadow-sm transition-all hover:shadow-xs duration-200">
            <span className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Risk Score</span>
            <span className={`block text-xl font-semibold mt-2 leading-tight ${
              child.riskScore <= 35 ? 'text-emerald-500' : child.riskScore <= 70 ? 'text-amber-500' : 'text-rose-500'
            }`}>{child.riskScore}/100</span>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 p-5 shadow-sm transition-all hover:shadow-xs duration-200">
            <span className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Height</span>
            <span className="block text-xl font-semibold text-slate-800 dark:text-white mt-2 leading-tight">{child.height || '87 cm'}</span>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 p-5 shadow-sm transition-all hover:shadow-xs duration-200">
            <span className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Weight</span>
            <span className="block text-xl font-semibold text-slate-800 dark:text-white mt-2 leading-tight">{child.weight || '12 kg'}</span>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 p-5 shadow-sm transition-all hover:shadow-xs duration-200">
            <span className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Attendance</span>
            <span className="block text-xl font-semibold text-slate-800 dark:text-white mt-2 leading-tight">{child.attendance}</span>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 p-5 shadow-sm transition-all hover:shadow-xs duration-200 col-span-2 sm:col-span-1">
            <span className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Vaccinated</span>
            <span className={`block text-xl font-semibold mt-2 leading-tight ${
              child.vaccinated === 'Completed' ? 'text-emerald-500' : 'text-amber-500'
            }`}>{child.vaccinated || 'Pending'}</span>
          </div>
        </div>

        {/* Tabs Bar Container */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-6 shadow-sm transition-colors">
          <div className="border-b border-slate-100 dark:border-slate-700/50 mb-6 flex gap-6 overflow-x-auto scroll-smooth flex-nowrap whitespace-nowrap w-full">
            {['Overview', 'Growth', 'Nutrition', 'Attendance', 'Health', 'Vaccination', 'Alerts'].map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3.5 text-xs sm:text-sm font-semibold border-b-2 transition-all relative select-none cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'border-blue-600 text-slate-900 dark:text-white font-semibold'
                      : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Active Tab Panel Body */}
          <div className="animate-in fade-in duration-200">
            {renderTabContent(child)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-[#FAFAFA] dark:bg-slate-900 flex font-sans overflow-hidden transition-colors duration-200 relative">
      
      {/* Dynamic Success Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-900 text-white text-sm font-semibold shadow-xl border border-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Sticky Left Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Navbar */}
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Scrollable Main Children Body */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto no-scrollbar">
          {selectedChild ? (
            renderChildDetail(selectedChild)
          ) : (
            <>
              {/* Page Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
                    Children
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{childrenList.length} children</span> across all crèches
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <button
                    onClick={() => setShowEnrollModal(true)}
                    className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#078662] hover:bg-[#066e51] rounded-full transition-colors shadow-sm cursor-pointer active:scale-95 premium-btn"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    <span>Enroll Child</span>
                  </button>
                </div>
              </div>

              {/* Search & Filter card */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-4 mb-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-300 hover:shadow-md hover:shadow-slate-100/50 dark:hover:shadow-none">
                {/* Search Input */}
                <div className="relative w-full sm:max-w-xl">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search by name..."
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-transparent rounded-full text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus-glow-brand transition-all"
                  />
                </div>

                {/* Dropdown status selector */}
                <div className="relative w-full sm:w-auto">
                  <select
                    value={selectedStatus}
                    onChange={(e) => {
                      setSelectedStatus(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="appearance-none w-full sm:w-48 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full pl-4 pr-9 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 cursor-pointer focus-glow-brand transition-all"
                  >
                    <option value="All Statuses">All Statuses</option>
                    <option value="Healthy">Healthy</option>
                    <option value="Monitoring">Monitoring</option>
                    <option value="Alert">Alert</option>
                  </select>
                  <svg className="w-3.5 h-3.5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Children Table Container */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-sm overflow-hidden transition-colors">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1200px] border-collapse text-left">
                    <thead>
                      <tr className="bg-[#f8fafc] dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-700/50 font-sans">
                        <th className="sticky left-0 z-20 bg-[#f8fafc] dark:bg-slate-900 px-6 py-4.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider w-[100px] min-w-[100px]">ID</th>
                        <th className="sticky left-[100px] z-20 bg-[#f8fafc] dark:bg-slate-900 px-6 py-4.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider w-[220px] min-w-[220px] shadow-[2px_0_5px_rgba(0,0,0,0.05)] dark:shadow-[2px_0_5px_rgba(0,0,0,0.2)]">NAME</th>
                        <th className="px-6 py-4.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Age</th>
                        <th className="px-6 py-4.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Gender</th>
                        <th className="px-6 py-4.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Crèche</th>
                        <th className="px-6 py-4.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Risk Score</th>
                        <th className="px-6 py-4.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Attendance</th>
                        <th className="px-6 py-4.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-right pr-6"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                      {paginatedChildren.map((child) => (
                        <tr 
                          key={child.id}
                          className="group hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors"
                        >
                          <td className="sticky left-0 z-10 bg-white dark:bg-slate-800 px-6 py-4 text-[13px] text-slate-500 dark:text-slate-400 font-semibold whitespace-nowrap w-[100px] min-w-[100px] transition-colors group-hover:bg-[#f8fafc] dark:group-hover:bg-slate-700/20">
                            {child.id}
                          </td>
                          <td className="sticky left-[100px] z-10 bg-white dark:bg-slate-800 px-6 py-4 whitespace-nowrap w-[220px] min-w-[220px] shadow-[2px_0_5px_rgba(0,0,0,0.05)] dark:shadow-[2px_0_5px_rgba(0,0,0,0.2)] transition-colors group-hover:bg-[#f8fafc] dark:group-hover:bg-slate-700/20">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                              {child.name}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">
                            {child.age}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">
                            {child.gender}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">
                            {child.creche}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden shrink-0">
                                <div 
                                  className={`h-full rounded-full ${
                                    child.riskScore <= 35 
                                      ? 'bg-emerald-500' 
                                      : child.riskScore <= 70 
                                      ? 'bg-amber-500' 
                                      : 'bg-rose-500'
                                  }`} 
                                  style={{ width: `${child.riskScore}%` }}
                                />
                              </div>
                              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 w-8 text-right">
                                {child.riskScore}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">
                            {child.attendance}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                              child.status.toLowerCase() === 'healthy'
                                ? 'bg-[#edf9f1] dark:bg-emerald-950/40 text-[#22c55e] dark:text-emerald-400 border border-[#22c55e]/10 dark:border-emerald-900/30'
                                : child.status.toLowerCase() === 'monitoring'
                                ? 'bg-[#fffbeb] dark:bg-amber-950/40 text-[#f59e0b] dark:text-amber-400 border border-[#f59e0b]/10 dark:border-amber-900/30'
                                : 'bg-[#fef2f2] dark:bg-rose-950/40 text-[#ef4444] dark:text-rose-400 border border-[#ef4444]/10 dark:border-rose-900/30'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                child.status.toLowerCase() === 'healthy' 
                                  ? 'bg-[#22c55e]' 
                                  : child.status.toLowerCase() === 'monitoring' 
                                  ? 'bg-[#f59e0b]' 
                                  : 'bg-[#ef4444]'
                              }`}></span>
                              {child.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap pr-4">
                            <button 
                              onClick={() => handleSelectChild(child)}
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

                {/* Pagination Controls */}
                {filteredChildren.length > 0 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4.5 border-t border-slate-100 dark:border-slate-700/50 bg-slate-50/30 dark:bg-slate-900/10 text-sm transition-colors">
                    <div className="text-slate-500 dark:text-slate-400 font-medium">
                      Showing <span className="font-bold text-slate-800 dark:text-slate-200">{startIndex + 1}</span> to{' '}
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {Math.min(endIndex, filteredChildren.length)}
                      </span>{' '}
                      of <span className="font-bold text-slate-800 dark:text-slate-200">{filteredChildren.length}</span> children
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-all font-semibold text-xs sm:text-sm cursor-pointer select-none active:scale-95"
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-all font-semibold text-xs sm:text-sm cursor-pointer select-none active:scale-95"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {/* Pagination / Table Foot */}
                {filteredChildren.length === 0 && (
                  <div className="text-center py-12 bg-white dark:bg-slate-800 transition-colors">
                    <p className="text-sm font-medium text-slate-400 dark:text-slate-500">No children match the filter criteria</p>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Enroll Child Modal Overlay */}
      {showEnrollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-all animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 w-full max-w-lg shadow-2xl overflow-hidden p-6 sm:p-8 relative animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700/60 mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Enroll New Child</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Enter details to enroll a new child into the platform</p>
              </div>
              <button
                type="button"
                onClick={() => setShowEnrollModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleEnrollSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Child Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Patra"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    Age (Years)
                  </label>
                  <select
                    value={formData.ageNum}
                    onChange={(e) => setFormData({ ...formData, ageNum: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="1">1 Year</option>
                    <option value="2">2 Years</option>
                    <option value="3">3 Years</option>
                    <option value="4">4 Years</option>
                    <option value="5">5 Years</option>
                    <option value="6">6 Years</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="M">Male (M)</option>
                    <option value="F">Female (F)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Assigned Crèche
                </label>
                <select
                  value={formData.creche}
                  onChange={(e) => setFormData({ ...formData, creche: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {crechesListOptions.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    Risk Score (0 - 100)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.riskScore}
                    onChange={(e) => setFormData({ ...formData, riskScore: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    Attendance (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.attendance}
                    onChange={(e) => setFormData({ ...formData, attendance: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Initial Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="Healthy">Healthy</option>
                  <option value="Monitoring">Monitoring</option>
                  <option value="Alert">Alert</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-700/60 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEnrollModal(false)}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#078662] hover:bg-[#066e51] transition-colors cursor-pointer"
                >
                  Enroll Child
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* + Add Record Modal Overlay */}
      {showAddRecordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-all animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 w-full max-w-md shadow-2xl overflow-hidden p-6 sm:p-8 relative animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700/60 mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Add Health/Growth Record</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Record new growth metrics or health inspection outcomes</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddRecordModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddRecordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Record Type
                </label>
                <select
                  value={recordForm.type}
                  onChange={(e) => setRecordForm({ ...recordForm, type: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="Growth">Growth Metrics (Height & Weight)</option>
                  <option value="Inspection">Health Inspection Log</option>
                </select>
              </div>

              {recordForm.type === 'Growth' ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 89"
                      value={recordForm.height}
                      onChange={(e) => setRecordForm({ ...recordForm, height: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      placeholder="e.g. 12.5"
                      value={recordForm.weight}
                      onChange={(e) => setRecordForm({ ...recordForm, weight: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                      Health Status
                    </label>
                    <select
                      value={recordForm.inspectionStatus}
                      onChange={(e) => setRecordForm({ ...recordForm, inspectionStatus: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="Healthy">Healthy</option>
                      <option value="Monitoring">Monitoring</option>
                      <option value="Alert">Alert</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                      Inspection Notes
                    </label>
                    <textarea
                      required
                      placeholder="Enter details of checkup outcome..."
                      value={recordForm.inspectionNotes}
                      onChange={(e) => setRecordForm({ ...recordForm, inspectionNotes: e.target.value })}
                      className="w-full h-24 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                    />
                  </div>
                </div>
              )}

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-700/60 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddRecordModal(false)}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#078662] hover:bg-[#066e51] transition-colors cursor-pointer"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Care Modal Overlay */}
      {showAssignCareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-all animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 w-full max-w-md shadow-2xl overflow-hidden p-6 sm:p-8 relative animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700/60 mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Assign Care Staff</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Assign specialized staff to monitor child nutrition & safety</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAssignCareModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAssignCareSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Select Care Staff Member
                </label>
                <select
                  value={assignForm.caregiver}
                  onChange={(e) => setAssignForm({ ...assignForm, caregiver: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="Sasmita Rani">Sasmita Rani</option>
                  <option value="Priyanka Mohanty">Priyanka Mohanty</option>
                  <option value="Laxmi Priya">Laxmi Priya</option>
                  <option value="Dr. Ramesh Panda">Dr. Ramesh Panda (Pediatrician)</option>
                  <option value="Sneha Sethi">Sneha Sethi (Nutrition Expert)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Assigned Care Role
                </label>
                <select
                  value={assignForm.role}
                  onChange={(e) => setAssignForm({ ...assignForm, role: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="Nutritionist">Nutrition Specialist</option>
                  <option value="Pediatrician">Primary Pediatrician</option>
                  <option value="Head Caregiver">Head Crèche Supervisor</option>
                  <option value="Field Inspector">Field Inspector</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Internal Notes
                </label>
                <textarea
                  placeholder="Enter assignment reasons, shift notes..."
                  value={assignForm.notes}
                  onChange={(e) => setAssignForm({ ...assignForm, notes: e.target.value })}
                  className="w-full h-20 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-700/60 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAssignCareModal(false)}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#078662] hover:bg-[#066e51] transition-colors cursor-pointer"
                >
                  Assign Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Visit Modal Overlay */}
      {showScheduleVisitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-all animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 w-full max-w-md shadow-2xl overflow-hidden p-6 sm:p-8 relative animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700/60 mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Schedule Pediatric Visit</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Schedule a routine health checkup or medical visit</p>
              </div>
              <button
                type="button"
                onClick={() => setShowScheduleVisitModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleScheduleVisitSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Visit Date & Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={visitForm.dateTime}
                  onChange={(e) => setVisitForm({ ...visitForm, dateTime: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 animate-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Pediatrician / Inspector
                </label>
                <select
                  value={visitForm.doctor}
                  onChange={(e) => setVisitForm({ ...visitForm, doctor: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="Dr. Suresh Rao">Dr. Suresh Rao (Lead Pediatrician)</option>
                  <option value="Inspector Panda">Inspector Panda (Safety Auditor)</option>
                  <option value="Nurse Sneha">Nurse Sneha (Health Assistant)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Purpose of Visit
                </label>
                <select
                  value={visitForm.purpose}
                  onChange={(e) => setVisitForm({ ...visitForm, purpose: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="Routine Health Check">Routine Pediatric Checkup</option>
                  <option value="Nutrition Assessment">Nutrition Assessment</option>
                  <option value="Vaccination Drive">Vaccination Booster Dose</option>
                  <option value="CCTV Safety Audit">CCTV Safety & Hygiene Audit</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Notes
                </label>
                <textarea
                  placeholder="Special instructions for doctor..."
                  value={visitForm.notes}
                  onChange={(e) => setVisitForm({ ...visitForm, notes: e.target.value })}
                  className="w-full h-16 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-700/60 mt-6">
                <button
                  type="button"
                  onClick={() => setShowScheduleVisitModal(false)}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#078662] hover:bg-[#066e51] transition-colors cursor-pointer"
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
