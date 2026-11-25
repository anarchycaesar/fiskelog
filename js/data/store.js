// Brugerens egne data (fangster).
//
// Der er endnu hverken login eller database, så fangster gemmes i browserens localStorage
// (kun på denne enhed). Alle sider går gennem denne fil – når backenden kommer, er det kun
// denne fil, der skal skiftes ud. Rekorder og "fanget" udledes af fangsterne og gemmes aldrig.

import { fish, fishById } from './sample.js';

const KEY = 'fiskelog.catches.v1';
export const CHANGE_EVENT = 'fiskelog:data-changed';
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

let persistent = false;
let items = load();

// --- lagring ---------------------------------------------------------------

function normalize(c) {
  return { ...c, kg: c?.kg ?? null, place: String(c?.place ?? ''), note: String(c?.note ?? '') };
}

/** Beskytter mod ødelagte/håndredigerede data og arter, der ikke findes længere. */
function isValid(c) {
  return Boolean(c) && typeof c.id === 'string' && Boolean(fishById[c.fishId]) &&
    Number.isFinite(c.cm) && c.cm > 0 && DATE_RE.test(c.date ?? '') &&
    (c.kg === null || Number.isFinite(c.kg));
}

function load() {
  try {
    localStorage.setItem('__fiskelog_probe__', '1');
    localStorage.removeItem('__fiskelog_probe__');
    persistent = true;
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.map(normalize).filter(isValid) : [];
  } catch {
    return []; // ingen lagring tilgængelig (fx privat tilstand eller sandkasse): hold data i hukommelsen
  }
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    persistent = false;
  }
}

const emit = () => document.dispatchEvent(new CustomEvent(CHANGE_EVENT));
const newId = () => globalThis.crypto?.randomUUID?.() ?? `c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

/** true hvis fangster faktisk gemmes i browseren (ellers forsvinder de, når siden lukkes). */
export const isPersistent = () => persistent;

// --- validering ------------------------------------------------------------

/** Dags dato som YYYY-MM-DD i brugerens egen tidszone. */
export function todayIso(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/**
 * Validerer en fangst fra formularen. Returnerer { ok:true, value } eller { ok:false, errors }.
 * errors er ordnet som felterne står i formularen.
 */
export function validateCatch(raw, today = todayIso()) {
  const errors = {};
  const num = (v) => {
    const s = String(v ?? '').trim().replace(',', '.');
    return s === '' ? NaN : Number(s);
  };

  const fishId = String(raw.fishId ?? '');
  if (!fishById[fishId]) errors.fishId = 'Vælg en art.';

  const cm = num(raw.cm);
  if (!(cm >= 1 && cm <= 300)) errors.cm = 'Angiv længden i cm (mellem 1 og 300).';

  let kg = null;
  if (String(raw.kg ?? '').trim() !== '') {
    kg = num(raw.kg);
    if (!(kg >= 0.01 && kg <= 500)) errors.kg = 'Vægten skal være mellem 0,01 og 500 kg.';
  }

  const place = String(raw.place ?? '').trim();
  if (place.length > 80) errors.place = 'Højst 80 tegn.';

  const date = String(raw.date ?? '');
  const parsed = new Date(`${date}T00:00:00Z`);
  if (!DATE_RE.test(date) || Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) errors.date = 'Vælg en dato.';
  else if (date > today) errors.date = 'Datoen må ikke ligge i fremtiden.';
  else if (date < '1950-01-01') errors.date = 'Datoen ligger for langt tilbage.';

  const note = String(raw.note ?? '').trim();
  if (note.length > 300) errors.note = 'Højst 300 tegn.';

  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    value: { fishId, cm: Math.round(cm * 10) / 10, kg: kg === null ? null : Math.round(kg * 100) / 100, date, place, note },
  };
}

// --- læs/skriv -------------------------------------------------------------

/** Alle fangster, nyeste dato først. */
export const getCatches = () =>
  [...items].sort((a, b) => b.date.localeCompare(a.date) || (b.createdAt ?? 0) - (a.createdAt ?? 0));

export const getCatch = (id) => items.find((c) => c.id === id) ?? null;

export function addCatch(input) {
  const result = validateCatch(input);
  if (!result.ok) throw new Error('Ugyldig fangst');
  const entry = { id: newId(), createdAt: Date.now(), ...result.value };
  items = [entry, ...items];
  save();
  emit();
  return entry;
}

export function removeCatch(id) {
  const before = items.length;
  items = items.filter((c) => c.id !== id);
  if (items.length === before) return false;
  save();
  emit();
  return true;
}

// --- afledte tal -----------------------------------------------------------

/** Bedste fangst pr. art (længste; ved lighed den tungeste). */
export function records() {
  const best = new Map();
  for (const c of items) {
    const b = best.get(c.fishId);
    if (!b || c.cm > b.cm || (c.cm === b.cm && (c.kg ?? 0) > (b.kg ?? 0))) best.set(c.fishId, c);
  }
  return best;
}

/** Artsbiblioteket med brugerens rekord og antal fangster pr. art. */
export function fishWithRecords() {
  const best = records();
  const counts = new Map();
  for (const c of items) counts.set(c.fishId, (counts.get(c.fishId) ?? 0) + 1);
  return fish.map((f) => {
    const r = best.get(f.id);
    return { ...f, record: r ? { cm: r.cm, kg: r.kg, date: r.date, place: r.place } : null, catchCount: counts.get(f.id) ?? 0 };
  });
}

export const collectionStats = () => ({
  species: new Set(items.map((c) => c.fishId)).size,
  speciesTotal: fish.length,
});

export function catchSummary() {
  const longest = items.reduce((best, c) => (!best || c.cm > best.cm ? c : best), null);
  return { count: items.length, longest };
}
