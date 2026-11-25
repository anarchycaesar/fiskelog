// Ikonsæt – ens stregikoner (24×24, 1.75 streg, runde ender).
// Brug: icon('home') eller icon('pin', { size: 18 })

const PATHS = {
  home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.2 3.6-7 8-7s8 2.8 8 7"/>',
  fish: '<path d="M2 12c2.6-4.4 6.6-6 10.4-4.6 2.6 1 4.4 2.8 5.6 4.6-1.2 1.8-3 3.6-5.6 4.6C8.6 18 4.6 16.4 2 12Z"/><path d="M18 12l4-3.5v7z"/><circle cx="7" cy="11.2" r=".9" fill="currentColor" stroke="none"/>',
  pin: '<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/>',
  book: '<path d="M12 6.5C10 5 7 4.5 3.5 5v13c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5c-3.5-.5-6.5 0-8.5 1.5Z"/><path d="M12 6.5v13"/>',
  tackle: '<rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7"/><path d="M3 13h7M14 13h7"/><rect x="10" y="11.5" width="4" height="3" rx="1"/>',
  sparkle: '<path d="M11 3.5l1.8 5.2 5.2 1.8-5.2 1.8L11 17.5l-1.8-5.2L4 10.5l5.2-1.8L11 3.5Z"/><path d="M18.5 15v5M16 17.5h5"/>',
  trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0V4Z"/><path d="M8 6H4.5v1.5A3.5 3.5 0 0 0 8 11M16 6h3.5v1.5A3.5 3.5 0 0 1 16 11"/><path d="M12 13v4M9 20.5h6M10 17h4v3.5h-4z"/>',
  medal: '<circle cx="12" cy="9" r="5.5"/><path d="m9 13.8-1.5 7.2L12 19l4.5 2-1.5-7.2"/><path d="m12 6.5.8 1.7 1.8.2-1.3 1.3.3 1.8-1.6-.9-1.6.9.3-1.8-1.3-1.3 1.8-.2z" fill="currentColor" stroke="none"/>',
  chevronRight: '<path d="m9 6 6 6-6 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.4-4.4"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  thermometer: '<path d="M10 14.5V5a2 2 0 1 1 4 0v9.5a4 4 0 1 1-4 0Z"/><path d="M12 9v7"/>',
  wind: '<path d="M3 8h11a3 3 0 1 0-3-3M3 12h16a3 3 0 1 1-3 3M3 16h8"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z"/>',
  lock: '<rect x="5" y="11" width="14" height="9.5" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.8v.2"/>',
  ruler: '<rect x="2.5" y="8" width="19" height="8" rx="1.5"/><path d="M6.5 8v3M10.5 8v4M14.5 8v3M18.5 8v4"/>',
  scale: '<path d="M6 8h12l2 12H4L6 8Z"/><circle cx="12" cy="5.5" r="2.5"/>',
  log: '<rect x="5" y="3.5" width="14" height="17" rx="2.5"/><path d="M9 8.5h6M9 12.5h6M9 16.5h3.5"/>',
  layers:'<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/>',
  water: '<path d="M2 9c2 0 2-1.5 4-1.5S8 9 10 9s2-1.5 4-1.5S16 9 18 9s2-1.5 4-1.5"/><path d="M2 15c2 0 2-1.5 4-1.5S8 15 10 15s2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5"/>',
};

export function icon(name, { size = 24, label, stroke = 1.75, className = '' } = {}) {
  const a11y = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true" focusable="false"';
  return `<svg class="icon ${className}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round" ${a11y}>${PATHS[name] ?? ''}</svg>`;
}

/** FiskeLog-logomærke: fisk over bølger. */
export function logoMark({ size = 40, onDark = false } = {}) {
  const fish = onDark ? '#FFFFFF' : '#164B70';
  const wave = onDark ? '#BFDFF0' : '#3A8FB9';
  return `<svg width="${size}" height="${Math.round(size * 0.72)}" viewBox="0 0 64 46" aria-hidden="true" focusable="false">
    <path d="M6 24C13 11 30 6 44 13c5 2.5 8.5 6 13.5 7-4.5 2.6-8 7-13.5 9C31 34 14 34 6 24Z" fill="${fish}"/>
    <path d="M44 13c2-5 6-8 11-9-1 4-3 7-6 9" fill="${fish}"/>
    <circle cx="16.5" cy="20.5" r="2.2" fill="${onDark ? '#164B70' : '#FFFFFF'}"/>
    <path d="M3 36c5-3.5 9-3.5 14 0s9 3.5 14 0 9-3.5 14 0 9 3.5 14 0" fill="none" stroke="${wave}" stroke-width="3.2" stroke-linecap="round"/>
    <path d="M11 42.5c4-2.4 7-2.4 11 0s7 2.4 11 0 7-2.4 11 0" fill="none" stroke="${wave}" stroke-width="2.4" stroke-linecap="round" opacity=".6"/>
  </svg>`;
}
