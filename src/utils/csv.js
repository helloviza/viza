// src/utils/csv.js
// Tiny CSV helper (Excel-friendly). UTF-8 with BOM so Excel opens cleanly.

function escapeCsvField(v) {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function toCSV(rows, headers) {
  if (!Array.isArray(rows) || rows.length === 0) return "";
  const cols = headers ?? Object.keys(rows[0]);
  const headerLine = cols.map(escapeCsvField).join(",");
  const lines = rows.map(r => cols.map(c => escapeCsvField(r[c])).join(","));
  return [headerLine, ...lines].join("\n");
}

export function downloadCSV(filename, rows, headers) {
  const csv = toCSV(rows, headers);
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "export.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
