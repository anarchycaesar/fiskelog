// Levende designsystem-oversigt: viser alle tokens og komponenter ét sted.
import { classes, fish } from '../data/sample.js';
import { icon } from '../ui/icons.js';
import { PageLayout } from '../components/page.js';
import { Card, Note, Pill } from '../components/card.js';
import { Button } from '../components/button.js';
import { Section } from '../components/section-title.js';
import { StatRow, ProgressBar } from '../components/stat.js';
import { TextField, SearchField, ChipGroup, bindChips } from '../components/input.js';
import { FishCard } from '../components/fish-card.js';
import { BadgeGrid } from '../components/badge.js';
import { openModal } from '../components/modal.js';
import { bindBadgeModals, bindFishModals } from './shared.js';

export const title = 'Designsystem';

const COLORS = [
  ['Off-white', '#F7F9FC', 'Primær baggrund'],
  ['Isblå', '#E8F2FA', 'Sekundære baggrunde'],
  ['Vandblå', '#BFDFF0', 'Lyse UI-elementer'],
  ['Havblå', '#3A8FB9', 'Aktive elementer'],
  ['Marineblå', '#164B70', 'Knapper og navigation'],
  ['Dybhavsblå', '#0B2B46', 'Overskrifter og kontrast'],
];

const ICONS = [['home', 'Hjem'], ['user', 'Profil'], ['fish', 'Fisk'], ['log', 'Fangster'], ['pin', 'Kort'], ['book', 'Guide'], ['tackle', 'Grej'], ['sparkle', 'AI'], ['trophy', 'Rekord'], ['medal', 'Klasser']];
const SPACING = [['XXS', 4], ['XS', 8], ['S', 12], ['M', 16], ['L', 24], ['XL', 32]];

export function render() {
  const body = `
    ${Section({ title: 'Farvepalette', id: 'ds-colors', body: `<div class="swatches">${COLORS.map(([n, hex, use]) => `
      <div class="swatch"><span class="swatch__chip" style="background:${hex}"></span><span class="t-meta" style="color:var(--c-deep);font-weight:600">${n}</span><span class="t-meta t-num">${hex}</span><span class="field__hint">${use}</span></div>`).join('')}</div>` })}

    ${Section({ title: 'Typografi', id: 'ds-type', body: Card({ body: `<div class="type-scale">
      <div><span class="t-meta">H1 · 28–32 px · Bold</span><p class="t-h1">Fang · Udforsk</p></div>
      <div><span class="t-meta">H2 · 20–22 px · Semibold</span><p class="t-h2">Mine badges</p></div>
      <div><span class="t-meta">H3 · 17 px · Semibold</span><p class="t-h3">Aborre</p></div>
      <div><span class="t-meta">Brødtekst · 15 px · Regular</span><p>Fisk langs skrænter og rundt om vegetation.</p></div>
      <div><span class="t-meta">Metadata · 13 px · Medium</span><p class="t-meta">Perca fluviatilis · 12. okt. 2026</p></div>
    </div>` }) })}

    ${Section({ title: 'Knapper', id: 'ds-buttons', body: Card({ body: `<div class="cluster" style="gap:12px">
      ${Button({ label: 'Primær knap', iconName: 'fish', attrs: 'data-demo-modal' })}
      ${Button({ label: 'Sekundær knap', variant: 'secondary', attrs: 'data-demo-modal' })}
      ${Button({ label: 'Tertiær knap', variant: 'tertiary', attrs: 'data-demo-modal' })}
      ${Button({ label: 'Lille', variant: 'secondary', size: 'sm', attrs: 'data-demo-modal' })}
    </div><p class="field__hint" style="margin-top:12px">Knapperne åbner et eksempel på modalvinduet.</p>` }) })}

    ${Section({ title: 'Inputfelter og filtre', id: 'ds-inputs', body: Card({ body: `<div class="stack">
      ${SearchField({ id: 'ds-search', label: 'Søg', placeholder: 'Søg efter art' })}
      ${TextField({ id: 'ds-text', label: 'Fiskested', placeholder: 'Fx Buresø', hint: 'Hjælpetekst vises her.' })}
      ${ChipGroup({ group: 'ds-chips', label: 'Eksempel på filter', items: ['Stænger', 'Hjul', 'Liner', 'Agn'].map((v) => ({ value: v, label: v })), active: 'Stænger' })}
    </div>` }) })}

    ${Section({ title: 'Kort og tags', id: 'ds-cards', body: `<div class="grid grid--cards">${FishCard({ ...fish[0], record: { cm: 45, kg: 1.4 } })}${FishCard({ ...fish[7], record: null })}</div>
      <div class="cluster">${Pill({ text: 'Standard' })}${Pill({ text: 'Primær', variant: 'success' })}${Pill({ text: 'Låst', variant: 'muted', iconName: 'lock' })}</div>
      ${Note({ text: 'Noter bruges til ærlig status – fx funktioner der kommer senere.' })}` })}

    ${Section({ title: 'Statistik og fremdrift', id: 'ds-stats', body: `${StatRow([
      { iconName: 'fish', value: 18, total: 25, label: 'Arter' },
      { iconName: 'medal', value: 6, total: 10, label: 'Klasser' },
    ])}${Card({ body: ProgressBar({ label: 'Fremdrift', value: 18, max: 25 }) })}` })}

    ${Section({ title: 'Badges (fiskeklasser)', id: 'ds-badges', body: Card({ body: BadgeGrid(classes) }) })}

    ${Section({ title: 'Ikoner', id: 'ds-icons', body: Card({ body: `<div class="icon-grid">${ICONS.map(([n, l]) => `<div class="icon-grid__item">${icon(n)}<span class="t-meta">${l}</span></div>`).join('')}</div>` }) })}

    ${Section({ title: 'Spacing', id: 'ds-spacing', body: Card({ body: `<div class="spacing-scale">${SPACING.map(([n, px]) => `<div><span class="spacing-scale__box" style="width:${px}px;height:${px}px"></span><span class="t-meta t-num">${px} px</span><span class="field__hint">${n}</span></div>`).join('')}</div>` }) })}`;

  return PageLayout({ route: 'design', eyebrow: 'Nordic Blue × Deep Water', title: 'Designsystem', body });
}

export function mount(root) {
  bindBadgeModals(root);
  bindFishModals(root);
  bindChips(root, 'ds-chips', () => {});
  root.addEventListener('click', (e) => {
    if (!e.target.closest('[data-demo-modal]')) return;
    openModal({
      title: 'Modalvindue',
      body: `<p>Bundark på mobil og centreret vindue på større skærme. Luk med knappen, Esc eller ved at klikke udenfor.</p>
        ${Button({ label: 'Luk', variant: 'primary', block: true, attrs: 'data-modal-close' })}`,
    });
  });
}
