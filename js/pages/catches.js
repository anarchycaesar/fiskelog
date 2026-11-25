import { fishById } from '../data/sample.js';
import { getCatches, catchSummary, collectionStats, isPersistent } from '../data/store.js';
import { fmtMonth, fmtNumber } from '../ui/util.js';
import { PageLayout } from '../components/page.js';
import { Card, Note, EmptyState } from '../components/card.js';
import { Button } from '../components/button.js';
import { Section } from '../components/section-title.js';
import { StatRow } from '../components/stat.js';
import { CatchList } from '../components/rows.js';
import { bindCatchModals, bindNewCatch } from './shared.js';

export const title = 'Fangster';

export function render() {
  const list = getCatches();
  const { count, longest } = catchSummary();

  // Gruppér pr. måned (listen er sorteret nyeste først)
  const groups = [];
  for (const c of list) {
    const label = fmtMonth(c.date);
    const g = groups.at(-1);
    if (g && g.label === label) g.items.push(c);
    else groups.push({ label, items: [c] });
  }

  const history = list.length
    ? `<div class="catch-history">${groups.map((g, i) => Section({
        title: g.label.charAt(0).toUpperCase() + g.label.slice(1),
        id: `month-${i}`,
        className: 'catch-month',
        body: Card({ flush: true, body: CatchList(g.items, fishById) }),
      })).join('')}</div>`
    : Card({ body: EmptyState({ title: 'Ingen fangster endnu', text: 'Tryk på "Registrér fangst" for at tilføje din første.', iconName: 'log' }) });

  const storage = isPersistent()
    ? 'Dine fangster gemmes i denne browser på denne enhed, indtil login og database er bygget.'
    : 'Din browser tillader ikke lokal lagring her, så fangster forsvinder, når du lukker eller genindlæser siden.';

  const body = `
    ${StatRow([
      { iconName: 'log', value: count, label: 'Fangster' },
      { iconName: 'ruler', value: longest ? `${fmtNumber(longest.cm)} cm` : '–', label: longest ? `Længste (${fishById[longest.fishId].name.toLowerCase()})` : 'Længste fangst' },
      { iconName: 'fish', value: collectionStats().species, label: 'Arter' },
    ])}
    ${history}
    ${Note({ text: storage, iconName: 'info' })}`;

  return PageLayout({
    route: 'fangster',
    eyebrow: 'Registrering og historik',
    title: 'Fangster',
    extra: Button({ label: 'Registrér fangst', variant: 'on-dark', iconName: 'plus', attrs: 'data-new-catch' }),
    body,
  });
}

export function mount(root) {
  bindCatchModals(root);
  bindNewCatch(root);
}
