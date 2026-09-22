const FALLBACK_IMAGE = "/favicon.svg";

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function safeText(value, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function safeImage(value, fallback = FALLBACK_IMAGE) {
  return safeText(value, fallback);
}

function safeNumber(value, fallback = null) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function formatCurrency(value, fallback = "$0.00") {
  const amount = safeNumber(value);
  return amount === null ? fallback : `$${amount.toFixed(2)}`;
}

function safeDate(value, fallback = "Unknown date") {
  if (!value) return fallback;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date.toLocaleDateString();
}

export {
  FALLBACK_IMAGE,
  asArray,
  asObject,
  formatCurrency,
  safeDate,
  safeImage,
  safeNumber,
  safeText,
};
