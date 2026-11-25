// Vande i nærheden af en position: appens kendte fiskesteder + navngivne vande fra OpenStreetMap.
// OSM hentes via Overpass (gratis, ingen nøgle). Fejler opslaget, bruges kun de kendte steder.

import { spots } from './sample.js';

const OVERPASS = 'https://overpass-api.de/api/interpreter';
export const RADIUS_M = 15000;
const KNOWN_MAX_KM = 80;
const CAPS = { 'Sø': 5, 'Å': 3, 'Kyst': 3, 'Hav': 2, 'Ø': 2 };
const cache = new Map();

const rad = (d) => (d * Math.PI) / 180;

/** Afstand i km (haversine). */
export function distanceKm(a, b) {
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
}

export const fmtDist = (km) => (km < 1 ? `${Math.round(km * 10) * 100} m` : `${km.toFixed(km < 10 ? 1 : 0).replace('.', ',')} km`);

const norm = (s) => String(s).toLowerCase().replace(/[^a-zæøå0-9]/g, '');

function classify(t) {
  if (t.place === 'island') return 'Ø';
  if (t.place === 'sea') return 'Hav';
  if (t.natural === 'bay' || t.natural === 'strait') return 'Kyst';
  if (t.waterway === 'river' || t.waterway === 'stream' || t.water === 'river') return 'Å';
  if (t.water === 'lagoon' || t.water === 'fjord') return 'Kyst';
  if (t.natural === 'water' && t.water !== 'pond' && t.water !== 'canal') return 'Sø';
  return null;
}

const query = (lat, lng) => `[out:json][timeout:15];(
  nwr(around:${RADIUS_M},${lat},${lng})["natural"="water"]["name"];
  nwr(around:${RADIUS_M},${lat},${lng})["waterway"~"^(river|stream)$"]["name"];
  nwr(around:${RADIUS_M},${lat},${lng})["place"~"^(island|sea)$"]["name"];
  nwr(around:${RADIUS_M},${lat},${lng})["natural"~"^(bay|strait)$"]["name"];
);out tags center 80;`;

async function fetchOsm(pos, fetchImpl) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 14000);
  try {
    const res = await fetchImpl(OVERPASS, {
      method: 'POST',
      body: `data=${encodeURIComponent(query(pos.lat, pos.lng))}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`overpass ${res.status}`);
    const json = await res.json();
    const best = new Map();
    for (const el of json.elements || []) {
      const t = el.tags || {};
      const type = t.name && classify(t);
      const lat = el.lat ?? el.center?.lat;
      const lng = el.lon ?? el.center?.lon;
      if (!type || lat == null || lng == null) continue;
      const km = distanceKm(pos, { lat, lng });
      const key = `${type}:${norm(t.name)}`;
      if (!best.has(key) || km < best.get(key).km) {
        best.set(key, { id: `osm:${el.type}${el.id}`, name: t.name, type, lat, lng, km, known: false });
      }
    }
    return [...best.values()];
  } finally {
    clearTimeout(timer);
  }
}

/** Kendte steder som "places" (med afstand, hvis position kendes). */
export function knownPlaces(pos) {
  return spots.map((s) => ({
    id: s.id, name: s.name, type: s.type, lat: s.lat, lng: s.lng, known: true, spotId: s.id,
    km: pos ? distanceKm(pos, s) : null,
  }));
}

/**
 * Finder vande nær pos. Returnerer { places, osmOk }. places er sorteret efter afstand.
 */
export async function findNearby(pos, { fetchImpl = (...a) => fetch(...a) } = {}) {
  const ck = `${pos.lat.toFixed(3)},${pos.lng.toFixed(3)}`;
  if (cache.has(ck)) return cache.get(ck);

  const known = knownPlaces(pos).filter((p) => p.km <= KNOWN_MAX_KM);
  let osm = [];
  let osmOk = true;
  try { osm = await fetchOsm(pos, fetchImpl); } catch { osmOk = false; }

  // Fjern OSM-vande, der er det samme som et kendt sted.
  const knownNames = known.map((k) => norm(k.name));
  osm = osm.filter((o) => !knownNames.some((n) => norm(o.name).includes(n) || n.includes(norm(o.name))));

  // Maks. antal pr. type, de nærmeste først.
  const taken = {};
  const picked = osm.sort((a, b) => a.km - b.km).filter((o) => {
    taken[o.type] = (taken[o.type] || 0) + 1;
    return taken[o.type] <= (CAPS[o.type] ?? 2);
  });

  const places = [...known.filter((k) => k.km <= RADIUS_M / 1000 * 2 || !picked.length), ...picked].sort((a, b) => a.km - b.km).slice(0, 12);
  const result = { places, osmOk };
  if (osmOk) cache.set(ck, result);
  return result;
}
