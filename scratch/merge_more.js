const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '..', 'src', 'data.json');
const db = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

db.crecheDetailHealthLogs = [
  { "id": "hl-1", "type": "Sanitation Check", "desc": "Passed standard checks. Disinfection completed successfully.", "date": "2026-06-25", "status": "Healthy" },
  { "id": "hl-2", "type": "Water Safety Inspection", "desc": "Water sample taken. pH levels and chlorine within optimal bounds.", "date": "2026-06-18", "status": "Healthy" },
  { "id": "hl-3", "type": "First Aid Inventory Check", "desc": "Supplies restocked. Paracetamol and bandages replenished.", "date": "2026-06-10", "status": "Healthy" }
];

db.childActiveAlerts = [
  { "id": "a1", "title": "Growth Warning", "desc": "Weight gain curve is 12% flatter than typical WHO 50th percentile.", "date": "3 days ago", "type": "Warning" },
  { "id": "a2", "title": "Vaccination Alert", "desc": "DPT Booster 1 window is active. Scheduled recommendation is overdue by 14 days.", "date": "1 week ago", "type": "Critical" }
];

db.childDetailHealthLogs = [
  { "id": "h1", "type": "Regular Inspection", "desc": "Normal growth rate. Temperature 98.4F. Advised iron rich diet supplements.", "date": "2026-06-15", "status": "Healthy" },
  { "id": "h2", "type": "Immunization Visit", "desc": "Measles 1 dose administered. Weight log recorded as 12kg (+500g gain).", "date": "2026-03-15", "status": "Healthy" }
];

fs.writeFileSync(dataFile, JSON.stringify(db, null, 2), 'utf8');
console.log('SUCCESS');
