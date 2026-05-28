export function addMonths(date, months) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

export function getDaysLeft(expDate) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const exp = new Date(expDate);
  exp.setHours(0, 0, 0, 0);
  return Math.round((exp - now) / (1000 * 60 * 60 * 24));
}

export function getStatus(days) {
  if (days < 0)   return "expired";
  if (days <= 7)  return "critical";
  if (days <= 30) return "warning";
  return "ok";
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric"
  });
}