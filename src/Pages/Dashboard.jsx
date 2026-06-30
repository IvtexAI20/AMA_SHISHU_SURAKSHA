import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// ---- Static data (replace with API data later) ----

const trendData = [
  { month: 'Jan', attendance: 72, nutrition: 70, incidents: 30 },
  { month: 'Feb', attendance: 74, nutrition: 71, incidents: 28 },
  { month: 'Mar', attendance: 78, nutrition: 72, incidents: 27 },
  { month: 'Apr', attendance: 80, nutrition: 70, incidents: 25 },
  { month: 'May', attendance: 81, nutrition: 68, incidents: 24 },
  { month: 'Jun', attendance: 78, nutrition: 65, incidents: 23 },
  { month: 'Jul', attendance: 74, nutrition: 63, incidents: 22 },
  { month: 'Aug', attendance: 72, nutrition: 64, incidents: 23 },
  { month: 'Sep', attendance: 71, nutrition: 67, incidents: 24 },
  { month: 'Oct', attendance: 73, nutrition: 71, incidents: 25 },
  { month: 'Nov', attendance: 76, nutrition: 74, incidents: 26 },
  { month: 'Dec', attendance: 78, nutrition: 76, incidents: 27 },
];

const riskData = [
  { name: 'Healthy', value: 24, color: '#22c55e' },
  { name: 'Warning', value: 16, color: '#f59e0b' },
  { name: 'Critical', value: 8, color: '#ef4444' },
];

const aiInsightsData = [
  {
    id: 1,
    type: 'Critical',
    time: 'just now',
    title: 'Nutrition gap predicted in 14 crèches',
    description: 'Model forecasts a 22% drop in meal compliance in Joda Block over the next 7 days based on supply patterns.',
    actionText: 'Trigger supply review →',
    badgeBg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/30',
    dotBg: 'bg-rose-500'
  },
  {
    id: 2,
    type: 'Warning',
    time: 'just now',
    title: 'Attendance anomaly in Block C',
    description: 'Attendance dropped 18% vs 4-week average. Likely cause: seasonal migration.',
    actionText: 'Schedule field visit →',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30',
    dotBg: 'bg-amber-500'
  },
  {
    id: 3,
    type: 'Info',
    time: 'just now',
    title: 'Vaccination drive recommendation',
    description: '36 children in Keonjhar district approaching DPT booster window.',
    actionText: 'Generate schedule →',
    badgeBg: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200/60 dark:border-slate-700/50',
    dotBg: 'bg-slate-400'
  }
];

const recentActivityData = [
  {
    id: 1,
    avatar: 'IR',
    user: 'Insp. Rao',
    action: 'submitted inspection for',
    target: 'Shishu Crèche 12',
    time: '2 min ago'
  },
  {
    id: 2,
    avatar: 'AE',
    user: 'AI Engine',
    action: 'flagged risk on',
    target: 'CH-2073',
    time: '8 min ago'
  },
  {
    id: 3,
    avatar: 'DA',
    user: 'District Admin',
    action: 'approved meal plan for',
    target: 'Block B',
    time: '22 min ago'
  },
  {
    id: 4,
    avatar: 'C',
    user: 'CCTV-AI',
    action: 'detected unauthorized entry at',
    target: 'Surya Crèche 4',
    time: '45 min ago'
  },
  {
    id: 5,
    avatar: 'PA',
    user: 'PMU Admin',
    action: 'published new protocol',
    target: 'Vaccination 2026',
    time: '1 hr ago'
  },
  {
    id: 6,
    avatar: 'IS',
    user: 'Insp. Singh',
    action: 'started inspection of',
    target: 'Tara Crèche 19',
    time: '2 hr ago'
  }
];

const cctvFeedsData = [
  { id: 'CAM-100', name: 'Joda Shishu Crèche' },
  { id: 'CAM-101', name: 'Champua Ananda Kendra' },
  { id: 'CAM-102', name: 'Anandapur Surya Crèche' },
  { id: 'CAM-103', name: 'Ghatagaon Tarini Crèche' }
];

const statCards = [
  {
    label: 'Total Crèches',
    value: '1,302',
    delta: '+12',
    deltaType: 'up',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V7l8-4 8 4v14M9 9h1m4 0h1m-6 4h1m4 0h1m-6 4h1m4 0h1" />
      </svg>
    ),
  },
  {
    label: 'Active Crèches',
    value: '1,284',
    delta: '98.4%',
    deltaType: 'up',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h4l2 6 4-12 2 6h6" />
      </svg>
    ),
  },
  {
    label: 'Children Enrolled',
    value: '28,476',
    delta: '+184',
    deltaType: 'up',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-2.13a4 4 0 10-4-4 4 4 0 004 4zm6 0a4 4 0 10-4-4" />
      </svg>
    ),
  },
  {
    label: 'Attendance Today',
    value: '82.4%',
    delta: '+1.8%',
    deltaType: 'up',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l5-5 4 4 8-8M14 7h7v7" />
      </svg>
    ),
  },
  {
    label: 'Health Cases',
    value: '129',
    delta: '-6',
    deltaType: 'down',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 10-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    ),
  },
  {
    label: 'Active Alerts',
    value: '22',
    delta: '+3',
    deltaType: 'up',
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-500',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 16.5h.008v.008H12v-.008z" />
      </svg>
    ),
  },
];

function StatCard({ label, value, delta, deltaType, iconBg, iconColor, icon }) {
  const isUp = deltaType === 'up';
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 p-4 flex flex-col gap-3 transition-colors">
      <div className="flex items-center justify-between">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center ${iconBg} ${iconColor}`}>
          {icon}
        </div>
        <span
          className={`flex items-center gap-0.5 text-xs font-semibold ${isUp ? 'text-emerald-500' : 'text-rose-500'
            }`}
        >
          <svg
            className={`w-3 h-3 ${isUp ? '' : 'rotate-90'}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H8M17 7v9" />
          </svg>
          {delta}
        </span>
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">{value}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg shadow-lg px-3 py-2 text-xs">
      <p className="font-semibold text-slate-700 dark:text-slate-200 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [range, setRange] = useState('Last 12 months');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen bg-[#FAFAFA] dark:bg-slate-900 flex font-sans overflow-hidden transition-colors duration-200">
      {/* Sticky Left Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Navbar */}
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Scrollable Main Dashboard Body */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Real-time intelligence across <span className="font-semibold text-slate-700 dark:text-slate-200">1,302 crèches</span> · Odisha
            </p>
          </div>

          {/* Stat cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
            {statCards.map((card) => (
              <StatCard key={card.label} {...card} />
            ))}
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Trend chart */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 p-6 transition-colors">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Attendance, Nutrition & Incidents</h2>
                  <p className="text-sm text-slate-400 dark:text-slate-400 mt-0.5">12-month rolling trend</p>
                </div>
                <div className="relative">
                  <select
                    value={range}
                    onChange={(e) => setRange(e.target.value)}
                    className="appearance-none bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg pl-3 pr-8 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option>Last 12 months</option>
                    <option>Last 6 months</option>
                    <option>Last 3 months</option>
                  </select>
                  <svg
                    className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div className="h-80 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="attendanceFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.18} />
                        <stop offset="100%" stopColor="#14b8a6" stopOpacity={0.03} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#94a3b8' }}
                    />
                    <YAxis
                      domain={[0, 100]}
                      ticks={[0, 25, 50, 75, 100]}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#94a3b8' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="attendance"
                      name="Attendance"
                      stroke="#3b82f6"
                      strokeWidth={2.5}
                      fill="url(#attendanceFill)"
                      dot={false}
                    />
                    <Area
                      type="monotone"
                      dataKey="nutrition"
                      name="Nutrition"
                      stroke="#22c55e"
                      strokeWidth={2}
                      fill="transparent"
                      dot={false}
                    />
                    <Area
                      type="monotone"
                      dataKey="incidents"
                      name="Incidents"
                      stroke="#ef4444"
                      strokeWidth={2}
                      fill="transparent"
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Risk distribution donut */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 p-6 flex flex-col transition-colors">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Risk Distribution</h2>
              <p className="text-sm text-slate-400 dark:text-slate-400 mt-0.5 mb-4">Across all crèches</p>

              <div className="flex-1 flex items-center justify-center min-h-[220px]">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={riskData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={3}
                      startAngle={90}
                      endAngle={-270}
                      stroke="none"
                    >
                      {riskData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [`${value} crèches`, name]}
                      contentStyle={{ borderRadius: 8, border: '1px solid #f1f5f9', fontSize: 12 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-col gap-3 mt-2">
                {riskData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{item.name}</span>
                    </div>
                    <span className="text-slate-500 dark:text-slate-400">{item.value} crèches</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Insights, Recent Activity & Live CCTV Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">

            {/* Recent Activity Card (Image 2 Left) */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-6 flex flex-col justify-between transition-colors shadow-sm">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6">Recent Activity</h3>
                <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {recentActivityData.map((item) => (
                    <div key={item.id} className="py-3.5 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 font-bold text-xs flex items-center justify-center shrink-0">
                          {item.avatar}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 truncate">
                          <span className="font-bold text-slate-800 dark:text-slate-100">{item.user}</span> {item.action}{' '}
                          <span className="font-bold text-slate-800 dark:text-slate-100">{item.target}</span>
                        </p>
                      </div>
                      <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0 font-medium">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Live CCTV Card (Image 2 Right) */}
            <div className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-6 flex flex-col justify-between transition-colors shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Live CCTV</h3>
                  <button className="text-xs font-semibold text-cyan-500 hover:text-cyan-600 hover:underline">
                    Open all
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {cctvFeedsData.map((feed) => (
                    <div
                      key={feed.id}
                      className="bg-[#0c1a36] rounded-2xl p-3 text-white flex flex-col justify-between h-24 relative overflow-hidden group border border-blue-900/40"
                    >
                      <div className="flex items-center gap-1.5 z-10">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 absolute"></span>
                        <span className="text-[10px] font-bold tracking-wider text-slate-200 uppercase ml-2">LIVE</span>
                      </div>

                      <div className="z-10">
                        <span className="text-[11px] font-semibold text-slate-300 block truncate">
                          {feed.id} · {feed.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-cyan-500 transition-colors pt-2 border-t border-slate-100 dark:border-slate-700/50">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>View on map</span>
              </button>
            </div>

            {/* AI Insights Card (Image 1) */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-6 flex flex-col justify-between transition-colors shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 113.536 0l-1.414 1.414a2 2 0 01-2.828 0L7.05 16.243z" />
                    </svg>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">AI Insights</h3>
                  </div>
                  <button className="text-xs font-semibold text-cyan-500 hover:text-cyan-600 hover:underline">
                    Open assistant
                  </button>
                </div>

                <div className="space-y-3.5">
                  {aiInsightsData.map((insight) => (
                    <div
                      key={insight.id}
                      className="bg-slate-50/70 dark:bg-slate-900/40 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/40 space-y-2.5 transition-all hover:shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${insight.badgeBg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${insight.dotBg}`}></span>
                          {insight.type}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{insight.time}</span>
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug">
                        {insight.title}
                      </h4>

                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {insight.description}
                      </p>

                      <button className="text-xs font-semibold text-cyan-500 hover:text-cyan-600 transition-colors pt-1 flex items-center gap-1">
                        {insight.actionText}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
