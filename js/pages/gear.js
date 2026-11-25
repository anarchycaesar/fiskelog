import { gear, gearCategories } from '../data/sample.js';
import { esc } from '../ui/util.js';
import { gearArt } from '../ui/scenery.js';
import { PageLayout } from '../components/page.js';
import { Card, Note, EmptyState } from '../components/card.js';
import { Section } from '../components/section-title.js';
import { ChipGroup, bindChips, setActiveChip } from '../components/input.js';
import { GearRow } from '../components/rows.js';

export const title = 'Grej';

const itemsIn = (cat) => gear.filter((g) => g.cat === cat);

function countLabel(cat) {
  const items = itemsIn(cat.id);
  return cat.unit === 'stk'
    ? `${items.reduce((sum, g) => sum + g.qty, 0)} stk.`
    : `${items.length} typer`;
}

function listHtml(catId) {
  const items = itemsIn(catId);
  if (items.length) return `<ul class="list">${items.map(GearRow).join('')}</ul>`;
  const cat = gearCategories.find((c) => c.id === catId);
  return EmptyState({ title: `Ingen ${cat.label.toLowerCase()} endnu`, text: 'Du har ikke tilføjet noget grej i denne kategori.', iconName: 'tackle' });
}

/** Oversigtsfelter for de øvrige kategorier – klik skifter kategori. */
const overviewHtml = (activeId) => gearCategories.filter((c) => c.id !== activeId).map((c) => `
  <button type="button" class="card card--interactive gear-tile" data-gear-cat="${c.id}" aria-label="Vis ${esc(c.label.toLowerCase())}, ${countLabel(c)}">
    <span class="gear-tile__art">${gearArt(c.id)}</span>
    <span class="t-h3">${esc(c.label)}</span>
    <span class="t-meta">${countLabel(c)}</span>
  </button>`).join('');

export function render() {
  const active = gearCategories[0].id;
  const body = `
    ${ChipGroup({ group: 'gear-cat', label: 'Vælg kategori', items: gearCategories.map((c) => ({ value: c.id, label: c.label })), active })}
    <div class="split">
      ${Card({ flush: true, body: `<div id="gear-list" aria-live="polite">${listHtml(active)}</div>` })}
      ${Section({ title: 'Mit udstyr – overblik', id: 'gear-overview', body: `<div class="grid grid--2" id="gear-overview-grid">${overviewHtml(active)}</div>` })}
    </div>
    ${Note({ text: 'Tilføjelse og redigering af grej bygges i en senere opgave.', iconName: 'tackle' })}`;

  return PageLayout({ route: 'grej', eyebrow: 'Stænger, hjul, liner og agn', title: 'Mit grej', body });
}

export function mount(root) {
  const list = root.querySelector('#gear-list');
  const overview = root.querySelector('#gear-overview-grid');
  const show = (catId) => {
    list.innerHTML = listHtml(catId);
    overview.innerHTML = overviewHtml(catId);
  };
  bindChips(root, 'gear-cat', show);
  overview.addEventListener('click', (e) => {
    const tile = e.target.closest('[data-gear-cat]');
    if (!tile) return;
    const id = tile.dataset.gearCat;
    setActiveChip(root, 'gear-cat', id);
    show(id);
    root.querySelector(`[data-chip-value="${id}"]`)?.focus();
  });
}
