import { esc } from '../ui/util.js';
import { waveArt, avatarInitial } from '../ui/scenery.js';
import { user } from '../data/sample.js';
import { IconButton } from './button.js';

/**
 * Topbar (dybvands-hero). Samme opbygning på alle hovedsider:
 * titel til venstre, AI-rådgiver + profil til højre. `extra` = valgfrit indhold under titlen.
 */
export function Topbar({ route, title, eyebrow, extra = '' }) {
  return `<header class="topbar">
    <div class="topbar__glow" aria-hidden="true"></div>
    ${waveArt()}
    <div class="topbar__inner">
      <div class="topbar__row">
        <div>
          ${eyebrow ? `<p class="topbar__eyebrow">${esc(eyebrow)}</p>` : ''}
          <h1 class="t-h1 topbar__title" tabindex="-1" data-page-heading>${esc(title)}</h1>
        </div>
        <div class="topbar__actions">
          ${IconButton({ iconName: 'sparkle', label: 'AI-fiskerådgiver', href: '#/ai', onDark: true, current: route === 'ai' })}
          <a class="avatar-chip hide-desktop" href="#/profil" aria-label="Min profil" title="Min profil" ${route === 'profil' ? 'aria-current="page"' : ''}>${avatarInitial(user.name)}</a>
        </div>
      </div>
      ${extra ? `<div class="topbar__extra">${extra}</div>` : ''}
    </div>
  </header>`;
}

/** Fælles sideskabelon: topbar + indholdsark. Alle sider bruger denne. */
export function PageLayout({ route, title, eyebrow, extra, body }) {
  return `${Topbar({ route, title, eyebrow, extra })}
    <main class="sheet" id="main">
      <div class="sheet__inner">${body}</div>
    </main>`;
}
