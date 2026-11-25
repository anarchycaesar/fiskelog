// Stemningsillustrationer: bølger i topbaren, profilbillede, stedsbilleder,
// grej-illustrationer og et stiliseret Danmarkskort (skabelon).

import { uid, esc } from './util.js';

export function waveArt() {
  return `<svg class="topbar__wave" viewBox="0 0 400 120" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <path d="M0 70 C60 52 110 88 170 72 S290 50 340 66 S390 76 400 70 V120 H0Z" fill="rgba(191,223,240,.07)"/>
    <path d="M0 88 C70 72 120 104 190 90 S310 70 360 84 S395 92 400 88 V120 H0Z" fill="rgba(191,223,240,.07)"/>
    <path d="M0 58 C50 46 100 70 150 60 S250 42 300 54 S370 64 400 56" fill="none" stroke="rgba(255,255,255,.10)" stroke-width="1.2"/>
    <path d="M0 80 C60 68 120 92 180 80 S300 62 360 76" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="1"/>
  </svg>`;
}

/** Profilbillede-pladsholder: forbogstav på havblå baggrund (indtil brugeren kan vælge et billede). */
export function avatarInitial(name = '') {
  const id = uid('av');
  const letter = esc(([...String(name).trim()][0] ?? '?').toUpperCase());
  return `<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3A8FB9"/><stop offset="1" stop-color="#164B70"/></linearGradient></defs>
    <rect width="100" height="100" fill="url(#${id})"/>
    <path d="M0 80 q12.5 -8 25 0 t25 0 t25 0 t25 0 V100 H0Z" fill="#fff" opacity=".12"/>
    <text x="50" y="66" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="46" font-weight="700" fill="#fff">${letter}</text>
  </svg>`;
}

/** Lille stedsbillede (sø/å/kyst) til kort og AI-kontekst. */
export function placeArt(type = 'Sø') {
  const id = uid('pl');
  const water = type === 'Kyst' ? ['#9CC9E0', '#2F6E96'] : ['#A9CFE2', '#3C7898'];
  const land = type === 'Kyst' ? '#C9B98E' : '#3D6346';
  return `<svg viewBox="0 0 120 72" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="${id}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#CFE6F3"/><stop offset="1" stop-color="#F3F8FB"/></linearGradient>
      <linearGradient id="${id}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${water[0]}"/><stop offset="1" stop-color="${water[1]}"/></linearGradient>
    </defs>
    <rect width="120" height="72" fill="url(#${id}s)"/>
    <path d="M0 34 Q20 24 40 31 T80 29 T120 30 V42 H0Z" fill="${land}"/>
    ${type !== 'Kyst' ? '<path d="M6 36 l5 -14 5 14z M16 36 l6 -18 6 18z M92 34 l5 -13 5 13z M102 34 l6 -17 6 17z" fill="#294A33"/>' : ''}
    <rect y="38" width="120" height="34" fill="url(#${id}w)"/>
    <path d="M14 50 h20 M60 56 h26 M30 63 h18 M86 47 h16" stroke="#fff" stroke-width="1.4" opacity=".45" stroke-linecap="round"/>
    ${type === 'Å' ? '<path d="M0 72 C30 52 70 66 120 44 V72Z" fill="#4F7F5A" opacity=".55"/>' : ''}
  </svg>`;
}

/** Grej-illustrationer (stang, hjul, line, agn, endegrej). */
export function gearArt(kind, accent = '#E2B33C') {
  const id = uid('g');
  switch (kind) {
    case 'stang':
      return `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
        <path d="M14 52 L58 6" stroke="#2A2E33" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M5 61 L17 49" stroke="#5B3B24" stroke-width="5.5" stroke-linecap="round"/>
        <path d="M17 49 L21 45" stroke="#1C1F22" stroke-width="4" stroke-linecap="round"/>
        <circle cx="28" cy="38" r="2" fill="none" stroke="#7D8A96" stroke-width="1.2"/>
        <circle cx="38" cy="27.5" r="1.6" fill="none" stroke="#7D8A96" stroke-width="1.1"/>
        <circle cx="47" cy="18" r="1.3" fill="none" stroke="#7D8A96" stroke-width="1"/>
        <path d="M18 47 l4 4" stroke="#9AA7B2" stroke-width="2.4" stroke-linecap="round"/>
      </svg>`;
    case 'hjul':
      return `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
        <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#C9D3DB"/><stop offset="1" stop-color="#55626D"/></linearGradient></defs>
        <rect x="27" y="6" width="6" height="16" rx="2" fill="#3A4048"/>
        <ellipse cx="30" cy="38" rx="17" ry="17" fill="url(#${id})"/>
        <ellipse cx="30" cy="38" rx="10" ry="10" fill="#2B3036"/>
        <ellipse cx="30" cy="38" rx="6" ry="6" fill="${accent}"/>
        <path d="M46 38 h8 v-8" stroke="#3A4048" stroke-width="3" fill="none" stroke-linecap="round"/>
        <circle cx="54" cy="28" r="3.5" fill="#1F2226"/>
      </svg>`;
    case 'line':
      return `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
        <ellipse cx="32" cy="44" rx="22" ry="8" fill="#5C6B78"/>
        <rect x="10" y="22" width="44" height="22" fill="#8FA5B5"/>
        <ellipse cx="32" cy="22" rx="22" ry="8" fill="#B9CAD6"/>
        <ellipse cx="32" cy="22" rx="8" ry="3" fill="#5C6B78"/>
        <path d="M10 28 h44 M10 33 h44 M10 38 h44" stroke="#fff" stroke-width=".8" opacity=".35"/>
        <path d="M54 30 C60 32 60 44 56 52" stroke="${accent}" stroke-width="1.4" fill="none"/>
      </svg>`;
    case 'agn':
      return `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
        <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5E8A3A"/><stop offset=".5" stop-color="${accent}"/><stop offset="1" stop-color="#F5EBC4"/></linearGradient></defs>
        <path d="M6 32 C14 20 34 18 50 28 C40 40 18 44 6 32Z" fill="url(#${id})"/>
        <path d="M48 27 l10 -7 v18z" fill="${accent}" opacity=".9"/>
        <path d="M6 32 l-4 3 6 1z" fill="#D9E3EA" opacity=".9"/>
        <circle cx="14" cy="29" r="2.2" fill="#fff"/><circle cx="14" cy="29" r="1.2" fill="#111"/>
        <path d="M24 42 v6 a3 3 0 0 0 6 0 M36 40 v6 a3 3 0 0 0 6 0" stroke="#7D8A96" stroke-width="1.3" fill="none"/>
      </svg>`;
    default:
      return `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
        <circle cx="32" cy="10" r="4" fill="none" stroke="#55626D" stroke-width="2.2"/>
        <path d="M32 14 V42 C32 50 22 52 18 46 C16 43 17 40 18 38" stroke="#55626D" stroke-width="2.6" fill="none" stroke-linecap="round"/>
        <path d="M18 38 l5 2 -4 3z" fill="#55626D"/>
        <path d="M42 22 V40 C42 46 50 48 53 43" stroke="#8FA5B5" stroke-width="2" fill="none" stroke-linecap="round"/>
        <circle cx="42" cy="19" r="3" fill="none" stroke="#8FA5B5" stroke-width="1.8"/>
      </svg>`;
  }
}

/**
 * Stiliseret Danmarkskort (skabelon – IKKE geografisk præcist).
 * viewBox 0 0 400 360 – fiskesteder placeres i samme koordinatsystem.
 */
export function denmarkMapArt({ bleed = false, pins = '' } = {}) {
  const id = uid('dk');
  return `<svg class="dk-map__svg" viewBox="0 0 400 360" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="${id}w" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E8F2FA"/><stop offset="1" stop-color="#CFE5F2"/></linearGradient>
      <pattern id="${id}p" width="40" height="20" patternUnits="userSpaceOnUse">
        <path d="M0 10 q10 -5 20 0 t20 0" fill="none" stroke="#BFDFF0" stroke-width="1"/>
      </pattern>
    </defs>
    <rect ${bleed ? 'x="-2400" y="-2400" width="5200" height="5160"' : 'width="400" height="360"'} fill="url(#${id}w)"/>
    <rect ${bleed ? 'x="-2400" y="-2400" width="5200" height="5160"' : 'width="400" height="360"'} fill="url(#${id}p)" opacity=".7"/>
    <g fill="#FBFDFE" stroke="#9CC6DD" stroke-width="2" stroke-linejoin="round">
      <path d="M192 16 C186 26 180 36 178 48 C176 62 170 74 158 88 C156 98 160 106 170 112 C184 118 196 128 196 142 C198 154 186 162 176 168 C166 176 162 188 166 200 C170 210 178 218 174 230 C168 242 160 250 158 262 L156 282 C128 284 98 284 70 284 C66 268 64 254 62 240 C58 224 56 210 56 196 C54 180 50 166 52 150 C54 136 62 124 66 112 C66 102 58 94 62 84 C68 70 78 62 90 54 C102 46 114 40 126 34 C148 26 170 20 192 16Z"/>
      <path d="M206 222 C210 206 230 198 246 202 C258 204 266 214 262 228 C258 242 240 252 224 248 C212 245 204 236 206 222Z"/>
      <path d="M278 160 C284 140 300 126 318 126 C334 124 346 136 350 152 C354 168 352 186 344 200 C336 214 318 220 300 214 C286 210 272 198 270 184 C268 174 274 168 278 160Z"/>
      <path d="M284 244 C292 234 310 232 326 236 C338 238 348 244 344 254 C338 262 318 262 302 260 C290 258 280 252 284 244Z"/>
      <ellipse cx="384" cy="206" rx="11" ry="9"/>
    </g>
    <path d="M70 92 C92 96 112 84 138 92 C150 96 158 100 162 104" fill="none" stroke="#9CC6DD" stroke-width="5" stroke-linecap="round"/>
    <path d="M70 92 C92 96 112 84 138 92 C150 96 158 100 162 104" fill="none" stroke="#DCEEF8" stroke-width="3" stroke-linecap="round"/>
    <path d="M150 128 C138 146 128 160 118 182" fill="none" stroke="#9FC9E0" stroke-width="2" stroke-linecap="round" stroke-dasharray="1 0"/>
    <g font-family="Inter, system-ui, sans-serif" font-size="11" font-weight="600" fill="#6F889B" letter-spacing=".08em">
      <text x="88" y="200">JYLLAND</text>
      <text x="282" y="204">SJÆLLAND</text>
      <text x="222" y="230">FYN</text>
      <text x="22" y="330" font-size="10" font-weight="500" letter-spacing=".04em" fill="#3A8FB9">NORDSØEN</text>
      <text x="212" y="72" font-size="10" font-weight="500" letter-spacing=".04em" fill="#3A8FB9">KATTEGAT</text>
      <text x="250" y="300" font-size="10" font-weight="500" letter-spacing=".04em" fill="#3A8FB9">ØSTERSØEN</text>
    </g>
    ${pins}
  </svg>`;
}
