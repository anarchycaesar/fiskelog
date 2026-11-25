import { esc, cx } from '../ui/util.js';
import { icon, logoMark } from '../ui/icons.js';

/** Én kilde til navigationen – bundnav og sidebar læser begge herfra. */
export const NAV = [
  { route: 'hjem',     label: 'Hjem',     iconName: 'home' },
  { route: 'fisk',     label: 'Fisk',     iconName: 'fish' },
  { route: 'fangster', label: 'Fangster', iconName: 'plus', sideIcon: 'log', fab: true },
  { route: 'kort',     label: 'Kort',     iconName: 'pin' },
  { route: 'grej',     label: 'Grej',     iconName: 'tackle' },
  { route: 'profil',   label: 'Profil',   iconName: 'user', desktopOnly: true },
];

const current = (route, active) => (route === active ? 'aria-current="page"' : '');

/** Mobil/tablet: 5 punkter med fremhævet Fangster-knap i midten (som moodboardet). Profil nås via topbaren. */
export function BottomNav(active) {
  const items = NAV.filter((n) => !n.desktopOnly).map((n) => {
    if (n.fab) {
      return `<li><a class="bottomnav__fab" href="#/${n.route}" ${current(n.route, active)}>
        <span class="bottomnav__fab-circle">${icon(n.iconName, { size: 26, stroke: 2.2 })}</span><span>${esc(n.label)}</span></a></li>`;
    }
    return `<li><a class="bottomnav__item" href="#/${n.route}" ${current(n.route, active)}>${icon(n.iconName, { size: 22 })}<span>${esc(n.label)}</span></a></li>`;
  });
  return `<ul class="bottomnav__list">${items.join('')}</ul>`;
}

/** Desktop: sidebar med alle sektioner + AI-rådgiver. */
export function Sidebar(active) {
  const items = NAV.map((n) => `<li><a class="sidebar__item" href="#/${n.route}" ${current(n.route, active)}>
      ${icon(n.sideIcon ?? n.iconName, { size: 20 })}<span>${esc(n.label)}</span></a></li>`).join('');

  return `<a class="sidebar__brand" href="#/hjem" aria-label="FiskeLog – til forsiden">
      ${logoMark({ size: 44, onDark: true })}
      <span><span class="sidebar__brand-name">FiskeLog</span><span class="sidebar__brand-tag" style="display:block">Fang · Udforsk · Lær · Forbedr</span></span>
    </a>
    <nav aria-label="Hovednavigation">
      <ul class="sidebar__list">${items}
        <li><a class="${cx('sidebar__item', 'sidebar__item--ai')}" href="#/ai" ${current('ai', active)}>${icon('sparkle', { size: 20 })}<span>AI-fiskerådgiver</span></a></li>
      </ul>
    </nav>
    <div class="sidebar__foot">
      <a class="sidebar__item" href="#/design" ${current('design', active)}>${icon('layers', { size: 18 })}<span>Designsystem</span></a>
    </div>`;
}
