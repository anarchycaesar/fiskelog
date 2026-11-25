// Små, rene hjælpefunktioner. Ingen afhængigheder.

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Escaper tekst til sikker brug i HTML-strenge. */
export const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ESC[c]);

/** Samler klassenavne og springer falske værdier over. */
export const cx = (...names) => names.filter(Boolean).join(' ');

const nf = new Intl.NumberFormat('da-DK');
const nf1 = new Intl.NumberFormat('da-DK', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export const fmtNumber = (n) => nf.format(n);
export const fmtDecimal = (n) => nf1.format(n);
export const fmtDate = (iso) =>
  new Intl.DateTimeFormat('da-DK', { timeZone: 'UTC', day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso));
export const fmtShortDate = (iso) =>
  new Intl.DateTimeFormat('da-DK', { timeZone: 'UTC', day: 'numeric', month: 'short' }).format(new Date(iso));
export const fmtMonth = (iso) =>
  new Intl.DateTimeFormat('da-DK', { timeZone: 'UTC', month: 'long', year: 'numeric' }).format(new Date(iso));
export const fmtToday = () =>
  new Intl.DateTimeFormat('da-DK', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());

let counter = 0;
/** Unikke id'er til SVG-gradienter m.m. */
export const uid = (prefix = 'u') => `${prefix}${++counter}`;

/** Deterministisk pseudo-tilfældighed (samme fisk = samme mønster). */
export function seeded(seedText) {
  let h = 2166136261;
  for (const ch of seedText) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}
