import { collectionStats, fishWithRecords } from '../data/store.js';
import { PageLayout } from '../components/page.js';
import { Card, Note, EmptyState } from '../components/card.js';
import { ProgressBar } from '../components/stat.js';
import { SearchField, ChipGroup, bindChips } from '../components/input.js';
import { FishCard } from '../components/fish-card.js';
import { bindFishModals } from './shared.js';

export const title = 'Fisk';

const WATERS = ['Alle', 'Ferskvand', 'Saltvand', 'Brakvand'];

function filtered({ q, water }) {
  const needle = q.trim().toLowerCase();
  return fishWithRecords().filter((f) =>
    (water === 'Alle' || f.water === water) &&
    (!needle || f.name.toLowerCase().includes(needle) || f.latin.toLowerCase().includes(needle)));
}

function gridHtml(list) {
  return list.length
    ? list.map(FishCard).join('')
    : `<div style="grid-column:1/-1">${EmptyState({ title: 'Ingen arter fundet', text: 'Prøv et andet søgeord eller filter.' })}</div>`;
}

const countText = (list) => `${list.length} ${list.length === 1 ? 'art' : 'arter'} vist`;

export function render() {
  const list = filtered({ q: '', water: 'Alle' });
  const stats = collectionStats();
  const body = `
    ${Card({ body: ProgressBar({ label: 'Din samling', value: stats.species, max: stats.speciesTotal, caption: `${stats.species} af ${stats.speciesTotal} arter` }) })}
    <div class="stack">
      ${SearchField({ id: 'fish-search', label: 'Søg efter art', placeholder: 'Søg efter art eller latinsk navn' })}
      ${ChipGroup({ group: 'water', label: 'Filtrér efter vandtype', items: WATERS.map((w) => ({ value: w, label: w })), active: 'Alle' })}
    </div>
    <section class="section" aria-labelledby="fish-list-title">
      <div class="section-title"><h2 class="t-h2" id="fish-list-title">Arter</h2><span class="t-meta" id="fish-count" aria-live="polite">${countText(list)}</span></div>
      <div class="grid grid--cards" id="fish-grid">${gridHtml(list)}</div>
    </section>
    ${Note({ text: 'Viser et udvalg af arter. Det fulde fiskebibliotek bygges i en senere opgave. Arter bliver til fangede, når du registrerer en fangst.', iconName: 'book' })}`;

  return PageLayout({ route: 'fisk', eyebrow: 'Fiskesamling og bibliotek', title: 'Fisk', body });
}

export function mount(root) {
  const state = { q: '', water: 'Alle' };
  const grid = root.querySelector('#fish-grid');
  const count = root.querySelector('#fish-count');
  const update = () => {
    const list = filtered(state);
    grid.innerHTML = gridHtml(list);
    count.textContent = countText(list);
  };
  root.querySelector('#fish-search').addEventListener('input', (e) => { state.q = e.target.value; update(); });
  bindChips(root, 'water', (v) => { state.water = v; update(); });
  bindFishModals(root);
}
