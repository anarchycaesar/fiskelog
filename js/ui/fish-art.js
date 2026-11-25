// Parametriske fiskeillustrationer (SVG). Én funktion tegner alle arter ud fra
// art-parametre i data. Kan senere udskiftes med rigtige fotos uden at ændre
// komponenterne – de kalder blot fishArt(fish).

import { uid, seeded, esc } from './util.js';

const CY = 45;
const TAIL_X = 158;

const cubic = (p0, p1, p2, p3, s) => {
  const m = 1 - s;
  return m * m * m * p0 + 3 * m * m * s * p1 + 3 * m * s * s * p2 + s * s * s * p3;
};

/** Slår y op på en kubisk kurve ud fra x (samplet). */
function yAt(curve, x) {
  let prev = null;
  for (let i = 0; i <= 48; i++) {
    const s = i / 48;
    const px = cubic(curve[0], curve[2], curve[4], curve[6], s);
    const py = cubic(curve[1], curve[3], curve[5], curve[7], s);
    if (prev && ((prev[0] <= x && px >= x) || (prev[0] >= x && px <= x))) {
      const k = (x - prev[0]) / (px - prev[0] || 1);
      return prev[1] + (py - prev[1]) * k;
    }
    prev = [px, py];
  }
  return CY;
}

export function fishArt(fish, { decorative = true } = {}) {
  const a = fish.art;
  const id = uid('fish');
  const t = a.depth;
  const nose = 14 - (a.snout ?? 0) * 12;
  const rnd = seeded(fish.id);

  const top = [nose, CY + 1, nose + 20, CY - t * 1.1, 95, CY - t * 1.12, TAIL_X, CY - t * 0.32];
  const bot = [nose, CY + 1, nose + 26, CY + t * 1.0, 100, CY + t * 1.02, TAIL_X, CY + t * 0.32];
  const body = `M${nose} ${CY + 1} C${top[2]} ${top[3]} ${top[4]} ${top[5]} ${TAIL_X} ${top[7]} L${TAIL_X} ${bot[7]} C${bot[4]} ${bot[5]} ${bot[2]} ${bot[3]} ${nose} ${CY + 1}Z`;
  const tailSpan = t * (a.tail ?? 1.05);
  const tail = `M${TAIL_X - 4} ${CY - t * 0.34} L194 ${CY - tailSpan} Q183 ${CY} 194 ${CY + tailSpan} L${TAIL_X - 4} ${CY + t * 0.34}Z`;

  // Rygfinne
  const [d1, d2] = a.dorsal ?? [62, 118];
  const dy1 = yAt(top, d1) + 1.5;
  const dy2 = yAt(top, d2) + 1.5;
  const dh = Math.max(7, t * (a.dorsalH ?? 0.62));
  const dorsal = `M${d1} ${dy1} C${d1 + 5} ${dy1 - dh * 1.15} ${d2 - 12} ${Math.min(dy1, dy2) - dh} ${d2} ${dy2}Z`;

  // Gatfinne og bugfinne
  const [a1, a2] = a.anal ?? [118, 142];
  const ay1 = yAt(bot, a1) - 1.5;
  const ay2 = yAt(bot, a2) - 1.5;
  const ah = Math.max(5, t * 0.42);
  const anal = `M${a1} ${ay1} C${a1 + 4} ${ay1 + ah} ${a2 - 6} ${ay2 + ah * 0.9} ${a2} ${ay2}Z`;
  const px = nose + (TAIL_X - nose) * 0.42;
  const py = yAt(bot, px) - 1.5;
  const pelvic = `M${px} ${py} L${px + 14} ${py + t * 0.5} L${px + 12} ${py}Z`;

  // Brystfinne
  const fx = nose + 40 + (a.snout ?? 0) * 6;
  const fy = CY + t * 0.22;
  const pect = `M${fx} ${fy} C${fx + 8} ${fy - 3} ${fx + 18} ${fy + 2} ${fx + 21} ${fy + 8} C${fx + 12} ${fy + 8} ${fx + 5} ${fy + 5} ${fx} ${fy}Z`;

  // Mønstre (klippes til kroppen)
  let pattern = '';
  if (a.pattern === 'bars') {
    const n = a.bars ?? 6;
    for (let i = 0; i < n; i++) {
      const x = nose + 34 + i * ((TAIL_X - nose - 46) / (n - 1));
      pattern += `<path d="M${x} ${CY - t * 1.3} q${5} ${t * 0.8} ${-1} ${t * 1.55}" stroke="${a.back}" stroke-width="${t * 0.34}" stroke-linecap="round" fill="none" opacity=".42"/>`;
    }
  } else if (a.pattern === 'spots') {
    for (let i = 0; i < 46; i++) {
      const x = nose + 30 + rnd() * (TAIL_X - nose - 26);
      const y = CY - t * 0.9 + rnd() * t * 1.5;
      pattern += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(2.2 + rnd() * 1.6).toFixed(1)}" ry="${(1.2 + rnd() * 0.8).toFixed(1)}" fill="${a.spot ?? '#E9E3A6'}" opacity=".75"/>`;
    }
  } else if (a.pattern === 'dots') {
    for (let i = 0; i < 34; i++) {
      const x = nose + 26 + rnd() * (TAIL_X - nose - 30);
      const y = CY - t * 0.95 + rnd() * t * 1.05;
      pattern += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(0.9 + rnd() * 1.1).toFixed(1)}" fill="${a.back}" opacity=".7"/>`;
    }
    if (a.red) {
      for (let i = 0; i < 12; i++) {
        const x = nose + 40 + rnd() * (TAIL_X - nose - 60);
        const y = CY - t * 0.25 + rnd() * t * 0.55;
        pattern += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.6" fill="#F4E9D6" opacity=".8"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.5" fill="#C7432E"/>`;
      }
    }
  } else if (a.pattern === 'scales') {
    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < 16; col++) {
        const x = nose + 34 + col * 8 + (row % 2) * 4;
        const y = CY - t + row * (t * 0.32);
        pattern += `<path d="M${x - 4} ${y} q4 4.5 8 0" stroke="${a.back}" stroke-width="1" fill="none" opacity=".28"/>`;
      }
    }
  } else if (a.pattern === 'mottled') {
    for (let i = 0; i < 70; i++) {
      const x = nose + 24 + rnd() * (TAIL_X - nose - 20);
      const y = CY - t * 1.0 + rnd() * t * 1.1;
      pattern += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(0.8 + rnd() * 1.4).toFixed(1)}" fill="${a.back}" opacity=".45"/>`;
    }
  }

  const eyeX = nose + 15 + (a.snout ?? 0) * 12;
  const eyeY = CY - t * 0.22;
  const eyeR = 2.4 + t * 0.07;
  const label = decorative ? 'aria-hidden="true" focusable="false"' : `role="img" aria-label="Illustration af ${esc(fish.name)}"`;

  return `<svg viewBox="0 6 200 78" ${label}>
    <defs>
      <linearGradient id="${id}b" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${a.back}"/>
        <stop offset=".46" stop-color="${a.body}"/>
        <stop offset=".78" stop-color="${a.belly}"/>
        <stop offset="1" stop-color="${a.belly}"/>
      </linearGradient>
      <linearGradient id="${id}s" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fff" stop-opacity=".35"/>
        <stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </linearGradient>
      <clipPath id="${id}c"><path d="${body}"/></clipPath>
    </defs>
    <path d="${tail}" fill="${a.fin}" opacity=".95"/>
    <path d="${dorsal}" fill="${a.dorsalColor ?? a.fin}" opacity=".95"/>
    <path d="${anal}" fill="${a.fin}" opacity=".95"/>
    <path d="${pelvic}" fill="${a.fin}" opacity=".95"/>
    <path d="${body}" fill="url(#${id}b)"/>
    <g clip-path="url(#${id}c)">
      ${pattern}
      <path d="M${nose + 30} ${CY - t * 0.08} Q100 ${CY - t * 0.3} ${TAIL_X} ${CY}" stroke="#fff" stroke-width="${a.lateral ? 1.6 : 0.9}" fill="none" opacity="${a.lateral ? 0.7 : 0.35}"/>
      <ellipse cx="85" cy="${CY - t * 0.62}" rx="58" ry="${t * 0.32}" fill="url(#${id}s)"/>
      <path d="M${nose + 30 + (a.snout ?? 0) * 8} ${CY - t * 0.62} Q${nose + 38 + (a.snout ?? 0) * 8} ${CY} ${nose + 30 + (a.snout ?? 0) * 8} ${CY + t * 0.62}" stroke="${a.back}" stroke-width="1.4" fill="none" opacity=".35"/>
    </g>
    <path d="${pect}" fill="${a.fin}" opacity=".9"/>
    <path d="M${nose + 1} ${CY + 1.5} l${6 + (a.snout ?? 0) * 6} ${0.8}" stroke="${a.back}" stroke-width="1" opacity=".5"/>
    <circle cx="${eyeX}" cy="${eyeY}" r="${eyeR + 1.1}" fill="#F3EBC8"/>
    <circle cx="${eyeX}" cy="${eyeY}" r="${eyeR}" fill="#151A1C"/>
    <circle cx="${eyeX - eyeR * 0.35}" cy="${eyeY - eyeR * 0.35}" r="${eyeR * 0.32}" fill="#fff"/>
  </svg>`;
}
