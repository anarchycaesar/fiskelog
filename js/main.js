// App-indgang: hash-router + app-skal.
// Hash-routing (#/fisk) virker uden serveropsætning og kan senere skiftes til History API.

import * as home from './pages/home.js';
import * as fishPage from './pages/fish.js';
import * as catchesPage from './pages/catches.js';
import * as mapPage from './pages/map.js';
import * as gearPage from './pages/gear.js';
import * as profilePage from './pages/profile.js';
import * as aiPage from './pages/ai.js';
import * as designPage from './pages/design.js';
import { BottomNav, Sidebar } from './components/nav.js';
import { closeOpenModals } from './components/modal.js';
import { CHANGE_EVENT } from './data/store.js';

const ROUTES = {
  hjem: home,
  fisk: fishPage,
  fangster: catchesPage,
  kort: mapPage,
  grej: gearPage,
  profil: profilePage,
  ai: aiPage,
  design: designPage,
};
const DEFAULT_ROUTE = 'hjem';

let currentView = document.getElementById('view');
const sidebar = document.getElementById('sidebar');
const bottomnav = document.getElementById('bottomnav');
let firstRender = true;

function parseRoute() {
  const key = location.hash.replace(/^#\/?/, '').split(/[/?]/)[0];
  return ROUTES[key] ? key : null;
}

function render({ keepScroll = false } = {}) {
  let route = parseRoute();
  if (!route) {
    route = DEFAULT_ROUTE;
    history.replaceState(null, '', `#/${route}`);
  }
  const page = ROUTES[route];
  const scrollY = window.scrollY;

  closeOpenModals();
  // Nyt view-element pr. side, så event-lyttere fra forrige side ryddes op.
  const fresh = currentView.cloneNode(false);
  fresh.innerHTML = page.render();
  currentView.replaceWith(fresh);
  currentView = fresh;
  page.mount?.(fresh);

  sidebar.innerHTML = Sidebar(route);
  bottomnav.innerHTML = BottomNav(route);
  document.title = `${page.title} · FiskeLog`;

  if (keepScroll) {
    window.scrollTo(0, scrollY);
  } else if (!firstRender) {
    window.scrollTo(0, 0);
    fresh.querySelector('[data-page-heading]')?.focus({ preventScroll: true });
  }
  firstRender = false;
}

// Spring-til-indhold: håndteres i JS, så hash-routeren ikke opfanger "#main".
document.querySelector('[data-skip-link]')?.addEventListener('click', (e) => {
  e.preventDefault();
  const main = currentView.querySelector('#main');
  if (main) { main.setAttribute('tabindex', '-1'); main.focus(); }
});

window.addEventListener('hashchange', () => render());
// Data ændret (fangst gemt/slettet) → tegn den aktuelle side igen, men bliv hvor du er.
// Sider med onDataChange (Hjem) opdaterer sig selv, så kort, position og valgt sted ikke nulstilles.
document.addEventListener(CHANGE_EVENT, () => {
  const page = ROUTES[parseRoute() || DEFAULT_ROUTE];
  if (page.onDataChange) page.onDataChange();
  else render({ keepScroll: true });
});
render();
