const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '..', 'src', 'data.json');
const db = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

// Add dashboardTrendData
db.dashboardTrendData = [
  { "month": "Jan", "attendance": 72, "nutrition": 70, "incidents": 30 },
  { "month": "Feb", "attendance": 74, "nutrition": 71, "incidents": 28 },
  { "month": "Mar", "attendance": 78, "nutrition": 72, "incidents": 27 },
  { "month": "Apr", "attendance": 80, "nutrition": 70, "incidents": 25 },
  { "month": "May", "attendance": 81, "nutrition": 68, "incidents": 24 },
  { "month": "Jun", "attendance": 78, "nutrition": 65, "incidents": 23 },
  { "month": "Jul", "attendance": 74, "nutrition": 63, "incidents": 22 },
  { "month": "Aug", "attendance": 72, "nutrition": 64, "incidents": 23 },
  { "month": "Sep", "attendance": 71, "nutrition": 67, "incidents": 24 },
  { "month": "Oct", "attendance": 73, "nutrition": 71, "incidents": 25 },
  { "month": "Nov", "attendance": 76, "nutrition": 74, "incidents": 26 },
  { "month": "Dec", "attendance": 78, "nutrition": 76, "incidents": 27 }
];

// Add dashboardRiskData
db.dashboardRiskData = [
  { "name": "Healthy", "value": 24, "color": "#22c55e" },
  { "name": "Warning", "value": 16, "color": "#f59e0b" },
  { "name": "Critical", "value": 8, "color": "#ef4444" }
];

// Add aiInsightsData
db.aiInsightsData = [
  {
    "id": 1,
    "type": "Critical",
    "time": "just now",
    "title": "Nutrition gap predicted in 14 crèches",
    "description": "Model forecasts a 22% drop in meal compliance in Joda Block over the next 7 days based on supply patterns.",
    "actionText": "Trigger supply review →",
    "badgeBg": "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/30",
    "dotBg": "bg-rose-500"
  },
  {
    "id": 2,
    "type": "Warning",
    "time": "just now",
    "title": "Attendance anomaly in Block C",
    "description": "Attendance dropped 18% vs 4-week average. Likely cause: seasonal migration.",
    "actionText": "Schedule field visit →",
    "badgeBg": "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30",
    "dotBg": "bg-amber-500"
  },
  {
    "id": 3,
    "type": "Info",
    "time": "just now",
    "title": "Vaccination drive recommendation",
    "description": "36 children in Keonjhar district approaching DPT booster window.",
    "actionText": "Generate schedule →",
    "badgeBg": "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200/60 dark:border-slate-700/50",
    "dotBg": "bg-slate-400"
  }
];

// Add recentActivityData
db.recentActivityData = [
  { "id": 1, "avatar": "IR", "user": "Insp. Rao", "action": "submitted inspection for", "target": "Shishu Crèche 12", "time": "2 min ago" },
  { "id": 2, "avatar": "AE", "user": "AI Engine", "action": "flagged risk on", "target": "CH-2073", "time": "8 min ago" },
  { "id": 3, "avatar": "DA", "user": "District Admin", "action": "approved meal plan for", "target": "Block B", "time": "22 min ago" },
  { "id": 4, "avatar": "C", "user": "CCTV-AI", "action": "detected unauthorized entry at", "target": "Surya Crèche 4", "time": "45 min ago" },
  { "id": 5, "avatar": "PA", "user": "PMU Admin", "action": "published new protocol", "target": "Vaccination 2026", "time": "1 hr ago" },
  { "id": 6, "avatar": "IS", "user": "Insp. Singh", "action": "started inspection of", "target": "Tara Crèche 19", "time": "2 hr ago" }
];

// Add cctvFeedsData
db.cctvFeedsData = [
  { "id": "CAM-100", "name": "Joda Shishu Crèche" },
  { "id": "CAM-101", "name": "Champua Ananda Kendra" },
  { "id": "CAM-102", "name": "Anandapur Surya Crèche" },
  { "id": "CAM-103", "name": "Ghatagaon Tarini Crèche" }
];

// Add attendanceTrendData
db.attendanceTrendData = [
  { "name": "Mon", "percentage": 81.2 },
  { "name": "Tue", "percentage": 83.5 },
  { "name": "Wed", "percentage": 82.4 },
  { "name": "Thu", "percentage": 84.1 },
  { "name": "Fri", "percentage": 82.0 },
  { "name": "Sat", "percentage": 78.5 }
];

// Add crecheDetailTrendData
db.crecheDetailTrendData = [
  { "month": "Jan", "attendance": 70, "nutrition": 70 },
  { "month": "Feb", "attendance": 75, "nutrition": 68 },
  { "month": "Mar", "attendance": 78, "nutrition": 67 },
  { "month": "Apr", "attendance": 80, "nutrition": 65 },
  { "month": "May", "attendance": 82, "nutrition": 64 },
  { "month": "Jun", "attendance": 81, "nutrition": 63 },
  { "month": "Jul", "attendance": 77, "nutrition": 62 },
  { "month": "Aug", "attendance": 74, "nutrition": 64 },
  { "month": "Sep", "attendance": 73, "nutrition": 67 },
  { "month": "Oct", "attendance": 72, "nutrition": 69 },
  { "month": "Nov", "attendance": 75, "nutrition": 73 },
  { "month": "Dec", "attendance": 77, "nutrition": 76 }
];

// Add mockChildrenInCreche
db.mockChildrenInCreche = [
  { "id": "CH-101", "name": "Ramesh Kumar", "age": "3y", "gender": "M", "status": "Healthy", "attendance": "94%" },
  { "id": "CH-102", "name": "Sita Mohapatra", "age": "4y", "gender": "F", "status": "Healthy", "attendance": "91%" },
  { "id": "CH-103", "name": "Arup Patra", "age": "2y", "gender": "M", "status": "Warning", "attendance": "85%" },
  { "id": "CH-104", "name": "Liza Pradhan", "age": "5y", "gender": "F", "status": "Critical", "attendance": "76%" },
  { "id": "CH-105", "name": "Gopal Dash", "age": "3y", "gender": "M", "status": "Healthy", "attendance": "92%" }
];

// Add mockStaffInCreche
db.mockStaffInCreche = [
  { "name": "Minati Behera", "role": "Lead Caregiver", "status": "Present", "phone": "+91 98XX XXXX91" },
  { "name": "Sasmita Rout", "role": "Assistant Caregiver", "status": "Present", "phone": "+91 98XX XXXX92" },
  { "name": "Jyoti Naik", "role": "Nutrition Specialist", "status": "On Leave", "phone": "+91 98XX XXXX93" }
];

// Add childDetailHealthLogs
db.childDetailHealthLogs = [
  { "id": "hl-1", "type": "Sanitation Check", "desc": "Passed standard checks. Disinfection completed successfully.", "date": "2026-06-25", "status": "Healthy" },
  { "id": "hl-2", "type": "Water Safety Inspection", "desc": "Water sample taken. pH levels and chlorine within optimal bounds.", "date": "2026-06-18", "status": "Healthy" },
  { "id": "hl-3", "type": "First Aid Inventory Check", "desc": "Supplies restocked. Paracetamol and bandages replenished.", "date": "2026-06-10", "status": "Healthy" }
];

// Add incidents
db.incidents = [
  { "id": "INC-3000", "title": "Unauthorized entry detected", "creche": "Shishu Crèche 1", "category": "Safety", "severity": "High", "status": "Assigned", "assigned": "Insp. Rao", "reported": "2026-06-10 9:00" },
  { "id": "INC-3001", "title": "Fall detection alert", "creche": "Ananda Crèche 2", "category": "Health", "severity": "High", "status": "New", "assigned": "Insp. Singh", "reported": "2026-06-11 10:07" },
  { "id": "INC-3002", "title": "Meal quality concern", "creche": "Surya Crèche 3", "category": "Nutrition", "severity": "Medium", "status": "Closed", "assigned": "Insp. Behera", "reported": "2026-06-12 11:14" },
  { "id": "INC-3003", "title": "Child distress signal", "creche": "Tara Crèche 4", "category": "Infrastructure", "severity": "Low", "status": "Resolved", "assigned": "Insp. Patnaik", "reported": "2026-06-13 12:21" },
  { "id": "INC-3004", "title": "Power outage", "creche": "Jagannath Crèche 5", "category": "Safety", "severity": "Low", "status": "Investigating", "assigned": "Insp. Rao", "reported": "2026-06-14 13:28" },
  { "id": "INC-3005", "title": "Sanitation issue", "creche": "Konark Crèche 6", "category": "Health", "severity": "Critical", "status": "Assigned", "assigned": "Insp. Singh", "reported": "2026-06-15 14:35" },
  { "id": "INC-3006", "title": "Staff absence", "creche": "Lotus Crèche 7", "category": "Nutrition", "severity": "High", "status": "New", "assigned": "Insp. Behera", "reported": "2026-06-16 15:42" },
  { "id": "INC-3007", "title": "Equipment failure", "creche": "Asha Crèche 8", "category": "Infrastructure", "severity": "High", "status": "Closed", "assigned": "Insp. Patnaik", "reported": "2026-06-17 16:49" },
  { "id": "INC-3008", "title": "Unauthorized entry detected", "creche": "Shishu Crèche 9", "category": "Safety", "severity": "Medium", "status": "Resolved", "assigned": "Insp. Rao", "reported": "2026-06-18 17:56" },
  { "id": "INC-3009", "title": "Fall detection alert", "creche": "Ananda Crèche 10", "category": "Health", "severity": "Low", "status": "Investigating", "assigned": "Insp. Singh", "reported": "2026-06-19 9:03" },
  { "id": "INC-3010", "title": "Meal quality concern", "creche": "Surya Crèche 11", "category": "Nutrition", "severity": "Low", "status": "Assigned", "assigned": "Insp. Behera", "reported": "2026-06-20 10:10" },
  { "id": "INC-3011", "title": "Fire alarm trigger", "creche": "Tara Crèche 12", "category": "Safety", "severity": "Critical", "status": "New", "assigned": "Insp. Patnaik", "reported": "2026-06-21 11:20" },
  { "id": "INC-3012", "title": "Water supply failure", "creche": "Jagannath Crèche 13", "category": "Infrastructure", "severity": "Medium", "status": "Investigating", "assigned": "Insp. Rao", "reported": "2026-06-22 12:45" },
  { "id": "INC-3013", "title": "First aid dispatch", "creche": "Konark Crèche 14", "category": "Health", "severity": "Low", "status": "Resolved", "assigned": "Insp. Singh", "reported": "2026-06-23 13:15" },
  { "id": "INC-3014", "title": "Spoiled meal report", "creche": "Lotus Crèche 15", "category": "Nutrition", "severity": "High", "status": "Closed", "assigned": "Insp. Behera", "reported": "2026-06-24 14:05" },
  { "id": "INC-3015", "title": "Intruder warning", "creche": "Asha Crèche 16", "category": "Safety", "severity": "Critical", "status": "Assigned", "assigned": "Insp. Patnaik", "reported": "2026-06-25 15:30" },
  { "id": "INC-3016", "title": "Fever outbreak", "creche": "Shishu Crèche 17", "category": "Health", "severity": "High", "status": "New", "assigned": "Insp. Rao", "reported": "2026-06-26 16:12" },
  { "id": "INC-3017", "title": "Broken window pane", "creche": "Ananda Crèche 18", "category": "Infrastructure", "severity": "Low", "status": "Resolved", "assigned": "Insp. Singh", "reported": "2026-06-27 17:00" },
  { "id": "INC-3018", "title": "Hygiene checklist failure", "creche": "Surya Crèche 19", "category": "Health", "severity": "Medium", "status": "Investigating", "assigned": "Insp. Behera", "reported": "2026-06-28 08:30" },
  { "id": "INC-3019", "title": "Nutrition deficit alert", "creche": "Tara Crèche 20", "category": "Nutrition", "severity": "High", "status": "Assigned", "assigned": "Insp. Patnaik", "reported": "2026-06-29 09:15" },
  { "id": "INC-3020", "title": "Gate lock malfunction", "creche": "Jagannath Crèche 21", "category": "Safety", "severity": "Medium", "status": "New", "assigned": "Insp. Rao", "reported": "2026-06-30 10:45" },
  { "id": "INC-3021", "title": "Respiratory virus warning", "creche": "Konark Crèche 22", "category": "Health", "severity": "Critical", "status": "Investigating", "assigned": "Insp. Singh", "reported": "2026-07-01 11:20" },
  { "id": "INC-3022", "title": "Pest control needed", "creche": "Lotus Crèche 23", "category": "Infrastructure", "severity": "Low", "status": "Resolved", "assigned": "Insp. Behera", "reported": "2026-07-02 12:00" },
  { "id": "INC-3023", "title": "Expired food stock", "creche": "Asha Crèche 24", "category": "Nutrition", "severity": "High", "status": "Assigned", "assigned": "Insp. Patnaik", "reported": "2026-07-03 13:40" },
  { "id": "INC-3024", "title": "CCTV offline alert", "creche": "Shishu Crèche 25", "category": "Safety", "severity": "Medium", "status": "Closed", "assigned": "Insp. Rao", "reported": "2026-07-04 14:10" },
  { "id": "INC-3025", "title": "Heat stroke symptoms", "creche": "Ananda Crèche 26", "category": "Health", "severity": "High", "status": "New", "assigned": "Insp. Singh", "reported": "2026-07-05 15:55" },
  { "id": "INC-3026", "title": "Roof leakage issue", "creche": "Surya Crèche 27", "category": "Infrastructure", "severity": "Medium", "status": "Investigating", "assigned": "Insp. Behera", "reported": "2026-07-06 16:30" },
  { "id": "INC-3027", "title": "Underweight child alert", "creche": "Tara Crèche 28", "category": "Nutrition", "severity": "Low", "status": "Resolved", "assigned": "Insp. Patnaik", "reported": "2026-07-07 17:15" },
  { "id": "INC-3028", "title": "Unidentified parcel at gate", "creche": "Jagannath Crèche 29", "category": "Safety", "severity": "High", "status": "Assigned", "assigned": "Insp. Rao", "reported": "2026-07-08 09:10" },
  { "id": "INC-3029", "title": "Accidental cut/injury", "creche": "Konark Crèche 30", "category": "Health", "severity": "Low", "status": "Closed", "assigned": "Insp. Singh", "reported": "2026-07-09 10:20" },
  { "id": "INC-3030", "title": "Playground fence broken", "creche": "Lotus Crèche 31", "category": "Infrastructure", "severity": "Medium", "status": "New", "assigned": "Insp. Behera", "reported": "2026-07-10 11:35" },
  { "id": "INC-3031", "title": "Dietary restriction breach", "creche": "Asha Crèche 32", "category": "Nutrition", "severity": "High", "status": "Investigating", "assigned": "Insp. Patnaik", "reported": "2026-07-11 12:50" },
  { "id": "INC-3032", "title": "Suspected gas leak", "creche": "Shishu Crèche 33", "category": "Safety", "severity": "Critical", "status": "New", "assigned": "Insp. Rao", "reported": "2026-07-12 14:15" },
  { "id": "INC-3033", "title": "Skin allergy outbreak", "creche": "Ananda Crèche 34", "category": "Health", "severity": "Medium", "status": "Assigned", "assigned": "Insp. Singh", "reported": "2026-07-13 15:30" },
  { "id": "INC-3034", "title": "Kitchen appliance spark", "creche": "Surya Crèche 35", "category": "Infrastructure", "severity": "High", "status": "Resolved", "assigned": "Insp. Behera", "reported": "2026-07-14 16:45" },
  { "id": "INC-3035", "title": "Water contamination alert", "creche": "Tara Crèche 36", "category": "Health", "severity": "Critical", "status": "Investigating", "assigned": "Insp. Patnaik", "reported": "2026-07-15 17:50" }
];

// Add inspections
db.inspections = [
  { "id": "INS-4000", "creche": "Shishu Crèche 1", "inspector": "Insp. Rao", "date": "2026-07-5", "status": "In Progress", "score": 98 },
  { "id": "INS-4001", "creche": "Ananda Crèche 2", "inspector": "Insp. Singh", "date": "2026-07-6", "status": "In Progress", "score": 90 },
  { "id": "INS-4002", "creche": "Surya Crèche 3", "inspector": "Insp. Behera", "date": "2026-07-7", "status": "Scheduled", "score": 82 },
  { "id": "INS-4003", "creche": "Tara Crèche 4", "inspector": "Insp. Patnaik", "date": "2026-07-8", "status": "Approved", "score": 74 },
  { "id": "INS-4004", "creche": "Jagannath Crèche 5", "inspector": "Insp. Rao", "date": "2026-07-9", "status": "Approved", "score": 66 },
  { "id": "INS-4005", "creche": "Konark Crèche 6", "inspector": "Insp. Singh", "date": "2026-07-10", "status": "Submitted", "score": 97 },
  { "id": "INS-4006", "creche": "Lotus Crèche 7", "inspector": "Insp. Behera", "date": "2026-07-11", "status": "In Progress", "score": 89 },
  { "id": "INS-4007", "creche": "Asha Crèche 8", "inspector": "Insp. Patnaik", "date": "2026-07-12", "status": "In Progress", "score": 81 },
  { "id": "INS-4008", "creche": "Shishu Crèche 9", "inspector": "Insp. Rao", "date": "2026-07-13", "status": "Scheduled", "score": 73 },
  { "id": "INS-4009", "creche": "Ananda Crèche 10", "inspector": "Insp. Singh", "date": "2026-07-14", "status": "Approved", "score": 65 }
];

// Add reports
db.reports = [
  { "id": "RP-001", "name": "Monthly District Summary — June 2026", "type": "District", "date": "2026-06-23", "size": "2.4 MB" },
  { "id": "RP-002", "name": "Nutrition Compliance — Q2 2026", "type": "Block", "date": "2026-06-20", "size": "1.8 MB" },
  { "id": "RP-003", "name": "Incident Postmortem — Konark Crèche 7", "type": "Crèche", "date": "2026-06-19", "size": "640 KB" },
  { "id": "RP-004", "name": "Child Growth Audit — Khordha", "type": "Child", "date": "2026-06-15", "size": "3.1 MB" },
  { "id": "RP-005", "name": "Vaccination Drive Outcomes — May 2026", "type": "District", "date": "2026-06-02", "size": "1.2 MB" }
];

fs.writeFileSync(dataFile, JSON.stringify(db, null, 2), 'utf8');
console.log('SUCCESS');
