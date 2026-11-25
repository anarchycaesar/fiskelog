import { user, classes, fishById } from '../data/sample.js';
import { getCatches, collectionStats, fishWithRecords } from '../data/store.js';
import { PageLayout } from '../components/page.js';
import { Card, Note, EmptyState } from '../components/card.js';
import { Button } from '../components/button.js';
import { Section } from '../components/section-title.js';
import { ProfileSummary, ProfileStats } from '../components/profile-summary.js';
import { BadgeStrip, BadgeGrid } from '../components/badge.js';
import { CatchList, RecordCard, RecordRow } from '../components/rows.js';
import { bindBadgeModals, bindCatchModals, bindNewCatch, bindToggle, bestRecord } from './shared.js';

export const title = 'Profil';

export function render() {
  const catches = getCatches();
  const withRecords = fishWithRecords();
  const best = bestRecord(withRecords);
  const others = withRecords.filter((f) => f.record && f.id !== best?.id).sort((a, b) => b.record.cm - a.record.cm);
  const toggle = (key, controls) => ({ label: 'Se alle', attrs: `data-toggle="${key}" aria-expanded="false" aria-controls="${controls}"` });
  const newCatchButton = Button({ label: 'Registrér fangst', iconName: 'plus', attrs: 'data-new-catch' });

  const badges = Card({
    body: `<div data-toggle-target="badges" data-toggle-show="closed">${BadgeStrip(classes.filter((c) => c.featured))}</div>
      <div id="all-badges" data-toggle-target="badges" data-toggle-show="open" hidden>${BadgeGrid(classes)}</div>`,
  });

  const records = best
    ? `<div class="stack">${RecordCard(best)}${others.length ? `<div id="all-records" data-toggle-target="records" data-toggle-show="open" hidden>
        ${Card({ flush: true, body: `<ul class="list">${others.map(RecordRow).join('')}</ul>` })}
      </div>` : ''}</div>`
    : Card({ body: EmptyState({ title: 'Ingen rekorder endnu', text: 'Din længste fangst af hver art bliver til en personlig rekord.', iconName: 'trophy' }) });

  const recent = catches.length
    ? Card({ flush: true, body: CatchList(catches.slice(0, 3), fishById) })
    : Card({ body: EmptyState({ title: 'Ingen fangster endnu', text: 'Din aktivitet vises her.', iconName: 'log', action: newCatchButton }) });

  const body = `
    ${ProfileStats(collectionStats(), classes)}
    <div class="split">
      <div class="stack-l">
        ${Section({ title: 'Mine badges', id: 'profile-badges', action: toggle('badges', 'all-badges'), body: badges })}
        ${Section({ title: 'Personlige rekorder', id: 'profile-records', action: others.length ? toggle('records', 'all-records') : undefined, body: records })}
      </div>
      <div class="stack-l">
        ${Section({ title: 'Seneste fangster', id: 'profile-catches', action: catches.length ? { label: 'Se alle', href: '#/fangster' } : undefined, body: recent })}
        <div class="profile-dev">
          ${Button({ label: 'Designsystem', variant: 'tertiary', size: 'sm', href: '#/design', iconName: 'layers' })}
        </div>
      </div>
    </div>`;

  return PageLayout({ route: 'profil', eyebrow: 'Fiskerprofil', title: 'Min profil', extra: ProfileSummary(user, { catchCount: catches.length }), body });
}

export function mount(root) {
  bindBadgeModals(root);
  bindCatchModals(root);
  bindNewCatch(root);
  bindToggle(root, 'badges');
  bindToggle(root, 'records');
}
