// src/models/CountryPrice.js
// Frontend shape + helpers for VisaCountryGrid admin management.

export const COUNTRY_TYPES = ["E-VISA", "VISA"]; // e-visa (electronic) vs sticker/regular

export function createCountryPrice(partial = {}) {
  return {
    id: partial.id ?? null,             // string id (backend) or null for new rows
    country: partial.country ?? "",     // matches your VisaCountryGrid country keys
    type: partial.type ?? "E-VISA",     // "E-VISA" | "VISA"
    currency: partial.currency ?? "INR",
    fee: Number(partial.fee ?? 0),      // numeric value only
    processing_time: partial.processing_time ?? "", // like "2–5 days"
    validity: partial.validity ?? "",   // like "30 days"
    stay: partial.stay ?? "",           // like "14 days"
    active: partial.active ?? true,
    updatedAt: partial.updatedAt ?? null,
    createdAt: partial.createdAt ?? null,
  };
}

export function validateCountryPrice(row) {
  const errors = {};
  if (!row.country || !row.country.trim()) errors.country = "Country is required";
  if (!COUNTRY_TYPES.includes(row.type)) errors.type = "Type must be E-VISA or VISA";
  if (!row.currency) errors.currency = "Currency code is required";
  if (!(Number.isFinite(row.fee) && row.fee >= 0)) errors.fee = "Fee must be a non-negative number";
  return errors;
}

// Map to the public grid card your VisaCountryGrid expects
export function toGridItem(row) {
  return {
    country: row.country,
    fees: row.fee,
    currency: row.currency,
    type: row.type,
    processing_time: row.processing_time,
    validity: row.validity,
    stay: row.stay,
  };
}
