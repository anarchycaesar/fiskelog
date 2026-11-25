// Badge-illustrationer: ensartet sekskantet skjold + unik illustration pr. fiskeklasse.

import { uid } from './util.js';

const C = 56; // skjoldets centrum (y)

function hex(r) {
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const ang = (Math.PI / 180) * (-90 + i * 60);
    pts.push(`${(50 + r * Math.cos(ang)).toFixed(2)} ${(C + r * Math.sin(ang)).toFixed(2)}`);
  }
  return `M${pts.join(' L')}Z`;
}

const fishShape = (dark, { long = 1, deep = 1 } = {}) =>
  `<path d="M${-20 * long} 0C${-12 * long} ${-12 * deep} ${6 * long} ${-12 * deep} ${14 * long} 0C${6 * long} ${12 * deep} ${-12 * long} ${12 * deep} ${-20 * long} 0Z" fill="#fff"/>
   <path d="M${12 * long} 0l${10} ${-9 * deep}v${18 * deep}z" fill="#fff"/>
   <circle cx="${-13 * long}" cy="-2" r="1.9" fill="${dark}"/>`;

// Illustrationer tegnet omkring (0,0), ca. ±22 i udstrækning.
const GLYPHS = {
  ferskvand: (d) => `
    <path d="M-22 12 L-9 -10 L-2 0 L7 -15 L22 12Z" fill="#fff"/>
    <path d="M7 -15 L11 -8 L8 -9 L5 -6 L3.5 -8.5Z" fill="${d}" opacity=".35"/>
    <path d="M-17 12 l4 -10 4 10z M-12 6 l3 -7 3 7z" fill="${d}" opacity=".55"/>
    <path d="M-22 18 q5.5 -4 11 0 t11 0 11 0 11 0" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  saltvand: () => `
    <path d="M-20 4 C-14 -18 8 -20 14 -6 C8 -11 0 -8 2 -1 C4 4 12 3 16 -1" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M-22 10 q5.5 -5 11 0 t11 0 11 0 11 0 M-22 18 q5.5 -5 11 0 t11 0 11 0 11 0" stroke="#fff" stroke-width="3.2" fill="none" stroke-linecap="round"/>`,
  brakvand: () => `
    <path d="M-11 16V-6 M0 16V-14 M11 16V-3" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>
    <rect x="-14" y="-13" width="6" height="12" rx="3" fill="#fff"/>
    <rect x="-3" y="-22" width="6" height="13" rx="3" fill="#fff"/>
    <rect x="8" y="-10" width="6" height="11" rx="3" fill="#fff"/>
    <path d="M-5 6 q-8 -2 -12 -10 M5 4 q8 -2 13 -9" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/>
    <path d="M-22 19 q5.5 -4 11 0 t11 0 11 0 11 0" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round"/>`,
  laksefisk: (d) => `<g transform="rotate(-18)">${fishShape(d, { long: 1.05, deep: 0.85 })}
    <circle cx="-2" cy="-4" r="1.3" fill="${d}" opacity=".55"/><circle cx="4" cy="-5" r="1.3" fill="${d}" opacity=".55"/><circle cx="1" cy="1" r="1.3" fill="${d}" opacity=".55"/></g>
    <path d="M-20 19 q5 -4 10 0 t10 0 10 0 10 0" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".8"/>`,
  karpefisk: (d) => `${fishShape(d, { long: 0.95, deep: 1.35 })}
    <path d="M-6 -6 q3 3 6 0 M2 -6 q3 3 6 0 M-6 2 q3 3 6 0 M2 2 q3 3 6 0" stroke="${d}" stroke-width="1.3" fill="none" opacity=".5"/>
    <path d="M-20 1 q-3 4 -1 7" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round"/>`,
  rovfisk: (d) => `
    <path d="M-24 -1 L-10 -9 C2 -12 12 -8 16 0 C12 8 2 11 -10 8 L-22 5Z" fill="#fff"/>
    <path d="M14 0 l9 -8 v16z" fill="#fff"/>
    <path d="M6 -9 l5 -6 l3 7z" fill="#fff"/>
    <path d="M-24 -1 L-12 1 L-22 5" fill="${d}"/>
    <path d="M-21 0.2 l1.4 1.6 1.4 -1.4 1.4 1.6 1.4 -1.4" stroke="#fff" stroke-width="1" fill="none"/>
    <circle cx="-11" cy="-4.5" r="1.9" fill="${d}"/>`,
  aleklassen: (d) => `
    <path d="M-20 12 C-12 -14 -2 18 8 -4 S20 -14 22 -10" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round"/>
    <circle cx="20.5" cy="-10.5" r="1.4" fill="${d}"/>`,
  pelagiske: (d) => `
    <g transform="translate(-6 -10) scale(.55)">${fishShape(d)}</g>
    <g transform="translate(8 0) scale(.55)">${fishShape(d)}</g>
    <g transform="translate(-8 11) scale(.55)">${fishShape(d)}</g>`,
  vandrefisk: (d) => `
    <path d="M-16 -8 A19 19 0 0 1 16 -8" stroke="#fff" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <path d="M16 -8 l-6.5 -1 l4 -5z" fill="#fff"/>
    <path d="M16 10 A19 19 0 0 1 -16 10" stroke="#fff" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <path d="M-16 10 l6.5 1 l-4 5z" fill="#fff"/>
    <g transform="translate(0 1) scale(.5)">${fishShape(d)}</g>`,
  stationaere: () => `
    <circle cx="0" cy="-15" r="4.2" stroke="#fff" stroke-width="2.8" fill="none"/>
    <path d="M0 -10.5V18 M-9 -4h18 M-18 4 C-17 13 -9 18 0 18 C9 18 17 13 18 4" stroke="#fff" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <path d="M-18 4 l-3 5 M-18 4 l5 2.5 M18 4 l3 5 M18 4 l-5 2.5" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>`,
  bigfive: (d) => `
    <path d="M-15 8 L-18 -11 L-7 -2 L0 -15 L7 -2 L18 -11 L15 8Z" fill="#fff"/>
    <rect x="-15" y="10" width="30" height="5" rx="2" fill="#fff"/>
    <circle cx="0" cy="-2" r="2.2" fill="${d}"/><circle cx="-8.5" cy="3" r="1.6" fill="${d}"/><circle cx="8.5" cy="3" r="1.6" fill="${d}"/>
    <path d="M-23 14 C-30 2 -27 -12 -18 -20" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M23 14 C30 2 27 -12 18 -20" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>
    ${[-14, -6, 2, 10].map((y, i) => `<ellipse cx="${-26 + i * 0.8 - (i === 3 ? 0 : 0)}" cy="${y}" rx="3.4" ry="1.6" transform="rotate(${-50 + i * 12} ${-26 + i * 0.8} ${y})" fill="#fff"/><ellipse cx="${26 - i * 0.8}" cy="${y}" rx="3.4" ry="1.6" transform="rotate(${50 - i * 12} ${26 - i * 0.8} ${y})" fill="#fff"/>`).join('')}`,
};

/**
 * @param {{ id: string, colors: [string, string], special?: boolean }} cls
 */
export function badgeArt(cls) {
  const id = uid('bdg');
  const [light, dark] = cls.colors;
  const ring = cls.special ? ['#FFF3C4', '#D8A928', '#A87A0E'] : ['#F2F8FC', '#B6D3E4', '#7FA6BF'];
  const glyph = (GLYPHS[cls.id] ?? GLYPHS.saltvand)(dark);

  return `<svg viewBox="0 0 100 112" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="${id}r" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${ring[0]}"/><stop offset=".55" stop-color="${ring[1]}"/><stop offset="1" stop-color="${ring[2]}"/>
      </linearGradient>
      <linearGradient id="${id}f" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${light}"/><stop offset="1" stop-color="${dark}"/>
      </linearGradient>
    </defs>
    <path d="${hex(50)}" fill="url(#${id}r)" stroke="url(#${id}r)" stroke-width="6" stroke-linejoin="round"/>
    <path d="${hex(42)}" fill="url(#${id}f)" stroke="rgba(255,255,255,.55)" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M50 ${C - 42} L86.4 ${C - 21} L86.4 ${C - 4} Q50 ${C - 14} 13.6 ${C - 4} L13.6 ${C - 21}Z" fill="#fff" opacity=".12"/>
    <g transform="translate(50 ${C + 1})">${glyph}</g>
  </svg>`;
}
