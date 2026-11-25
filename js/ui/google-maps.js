// Google Maps: indlæsning af Maps JavaScript API + et lille kort med fiskesteder.
// Ingen npm-afhængighed – scriptet hentes fra Google, når Kort-siden åbnes første gang.

import { config } from '../config.js';

const CALLBACK = '__fiskelogMapsReady';
const TIMEOUT_MS = 12000;
let loading = null;
let authFailed = false;

/** true hvis Google har afvist nøglen i denne session. */
export const mapsAuthFailed = () => authFailed;

/** true hvis der er sat en API-nøgle i config.js. */
export const hasMapsKey = () => Boolean(config.googleMapsApiKey?.trim());

/**
 * Indlæser Maps JavaScript API én gang. Afviser ved manglende nøgle, netværks-/CSP-fejl,
 * timeout eller afvist nøgle (gm_authFailure).
 */
export function loadGoogleMaps() {
  if (window.google?.maps?.Map) return Promise.resolve(window.google.maps);
  if (!hasMapsKey()) return Promise.reject(new Error('no-key'));
  if (loading) return loading;

  loading = new Promise((resolve, reject) => {
    const fail = (reason) => {
      clearTimeout(timer);
      delete window[CALLBACK];
      loading = null;
      reject(new Error(reason));
    };
    const timer = setTimeout(() => fail('timeout'), TIMEOUT_MS);

    window[CALLBACK] = () => {
      clearTimeout(timer);
      delete window[CALLBACK];
      resolve(window.google.maps);
    };
    // Google kalder denne, hvis nøglen er ugyldig eller ikke tilladt for domænet.
    window.gm_authFailure = () => {
      authFailed = true;
      document.dispatchEvent(new CustomEvent('fiskelog:maps-auth-failure'));
    };

    const params = new URLSearchParams({
      key: config.googleMapsApiKey.trim(),
      v: 'weekly',
      language: 'da',
      region: 'DK',
      loading: 'async',
      callback: CALLBACK,
    });
    if (config.googleMapsMapId) params.set('libraries', 'marker');

    const s = document.createElement('script');
    s.src = `https://maps.googleapis.com/maps/api/js?${params}`;
    s.async = true;
    s.onerror = () => { s.remove(); fail('load-error'); };
    document.head.append(s);
  });
  return loading;
}

// Appens kortstil (bruges kun uden Map ID). Farver fra designsystemet.
const NORDIC_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#F7F9FC' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#4E6A80' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#F7F9FC' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#BFDFF0' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#3A8FB9' }] },
  { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#EEF3F7' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ visibility: 'on' }, { color: '#DDEBE2' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#FFFFFF' }] },
  { featureType: 'road', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#E8F2FA' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#9CC6DD' }] },
];

const DENMARK_CENTER = { lat: 56.1, lng: 10.6 };

function pinSvg(selected) {
  const fill = selected ? '#164B70' : '#FFFFFF';
  const stroke = '#164B70';
  const dot = selected ? '#FFFFFF' : '#164B70';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="46" viewBox="0 0 36 46">
    <path d="M18 2C9.2 2 2 9 2 17.6 2 29 18 44 18 44s16-15 16-26.4C34 9 26.8 2 18 2Z" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>
    <circle cx="18" cy="17.5" r="5.5" fill="${dot}"/></svg>`;
}

/**
 * Opretter et Google-kort med en markør pr. fiskested.
 * Returnerer { select(id), filter(ids) }.
 */
export function createSpotMap(el, maps, spots, { selectedId, onSelect }) {
  const useAdvanced = Boolean(config.googleMapsMapId && maps.marker?.AdvancedMarkerElement);
  const map = new maps.Map(el, {
    center: DENMARK_CENTER,
    zoom: 6.6,
    ...(useAdvanced ? { mapId: config.googleMapsMapId } : { styles: NORDIC_STYLE }),
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    clickableIcons: false,
    gestureHandling: 'cooperative',
  });

  const markers = new Map();
  let current = selectedId;

  const iconFor = (selected) => ({
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(pinSvg(selected))}`,
    scaledSize: new maps.Size(36, 46),
    anchor: new maps.Point(18, 44),
  });

  for (const s of spots) {
    const position = { lat: s.lat, lng: s.lng };
    let marker;
    if (useAdvanced) {
      const content = document.createElement('div');
      content.className = 'gmap-pin';
      content.innerHTML = pinSvg(s.id === current);
      marker = new maps.marker.AdvancedMarkerElement({ map, position, title: s.name, content, gmpClickable: true });
      marker.addListener('click', () => onSelect(s.id));
      marker._setSelected = (on) => { content.innerHTML = pinSvg(on); marker.zIndex = on ? 10 : 1; };
      marker._setVisible = (on) => { marker.map = on ? map : null; };
    } else {
      marker = new maps.Marker({ map, position, title: s.name, icon: iconFor(s.id === current), optimized: false });
      marker.addListener('click', () => onSelect(s.id));
      marker._setSelected = (on) => { marker.setIcon(iconFor(on)); marker.setZIndex(on ? 10 : 1); };
      marker._setVisible = (on) => marker.setVisible(on);
    }
    markers.set(s.id, marker);
  }

  const fit = (ids) => {
    const list = spots.filter((s) => ids.includes(s.id));
    if (!list.length) return;
    if (list.length === 1) { map.panTo({ lat: list[0].lat, lng: list[0].lng }); map.setZoom(10); return; }
    const b = new maps.LatLngBounds();
    list.forEach((s) => b.extend({ lat: s.lat, lng: s.lng }));
    map.fitBounds(b, 48);
  };
  fit(spots.map((s) => s.id));

  return {
    select(id) {
      if (id === current) return;
      markers.get(current)?._setSelected(false);
      markers.get(id)?._setSelected(true);
      current = id;
      const s = spots.find((x) => x.id === id);
      if (s) map.panTo({ lat: s.lat, lng: s.lng });
    },
    filter(ids) {
      markers.forEach((m, id) => m._setVisible(ids.includes(id)));
      fit(ids);
    },
  };
}

/**
 * Lille, ikke-interaktivt kort til Hjem: din position (blå prik) + vande i nærheden.
 * Kortet panoreres ikke, så hele fladen kan bruges som trykflade.
 * Returnerer { update({ user, places, selectedId }), select(id) }.
 */
export function createLocationMap(el, maps) {
  const map = new maps.Map(el, {
    center: DENMARK_CENTER,
    zoom: 6,
    styles: NORDIC_STYLE,
    disableDefaultUI: true,
    gestureHandling: 'none',
    keyboardShortcuts: false,
    clickableIcons: false,
  });

  const markers = new Map();
  let youMarker = null;
  let current = '';

  const iconFor = (selected) => ({
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(pinSvg(selected))}`,
    scaledSize: new maps.Size(26, 33),
    anchor: new maps.Point(13, 31),
  });

  return {
    update({ user, places, selectedId = '' }) {
      current = selectedId;
      const ids = new Set(places.map((p) => p.id));
      for (const [id, m] of markers) if (!ids.has(id)) { m.setMap(null); markers.delete(id); }
      for (const p of places) {
        if (markers.has(p.id)) continue;
        markers.set(p.id, new maps.Marker({ map, position: { lat: p.lat, lng: p.lng }, title: p.name, icon: iconFor(p.id === current), optimized: false }));
      }
      markers.forEach((m, id) => { m.setIcon(iconFor(id === current)); m.setZIndex(id === current ? 10 : 1); });

      if (user) {
        const pos = { lat: user.lat, lng: user.lng };
        if (youMarker) youMarker.setPosition(pos);
        else {
          youMarker = new maps.Marker({
            map, position: pos, title: 'Din position', zIndex: 20, optimized: false,
            icon: { path: maps.SymbolPath?.CIRCLE ?? 0, scale: 8, fillColor: '#2F7BF5', fillOpacity: 1, strokeColor: '#FFFFFF', strokeWeight: 3 },
          });
        }
      }

      const pts = [...(user ? [user] : []), ...places.slice(0, 4)];
      if (pts.length > 1) {
        const b = new maps.LatLngBounds();
        pts.forEach((p) => b.extend({ lat: p.lat, lng: p.lng }));
        map.setOptions?.({ maxZoom: 14 });
        map.fitBounds(b, { top: 56, right: 28, bottom: 76, left: 28 });
      } else if (pts.length === 1) {
        map.setCenter({ lat: pts[0].lat, lng: pts[0].lng });
        map.setZoom(12);
      }
    },
    select(id) {
      markers.get(current)?.setIcon(iconFor(false));
      current = id;
      const m = markers.get(id);
      if (m) { m.setIcon(iconFor(true)); m.setZIndex(10); }
    },
  };
}
