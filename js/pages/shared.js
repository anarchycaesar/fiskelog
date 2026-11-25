// Fælles adfærd, som flere sider genbruger.
import { classes } from '../data/sample.js';
import { fishWithRecords } from '../data/store.js';
import { openModal } from '../components/modal.js';
import { FishDetail } from '../components/fish-card.js';
import { BadgeDetail } from '../components/badge.js';
import { openCatchForm, openCatchDetail } from '../components/catch-modals.js';

/** Klik på et fiskekort → detaljemodal (med brugerens rekord). */
export function bindFishModals(root) {
  root.addEventListener('click', (e) => {
    const card = e.target.closest('[data-fish-id]');
    if (!card) return;
    const f = fishWithRecords().find((x) => x.id === card.dataset.fishId);
    if (f) openModal({ title: f.name, body: FishDetail(f) });
  });
}

/** Klik på et badge → detaljemodal. */
export function bindBadgeModals(root) {
  root.addEventListener('click', (e) => {
    const b = e.target.closest('[data-badge-id]');
    if (!b) return;
    const cls = classes.find((c) => c.id === b.dataset.badgeId);
    if (cls) openModal({ title: cls.name, body: BadgeDetail(cls) });
  });
}

/** Klik på en fangst → detaljer med mulighed for at slette. */
export function bindCatchModals(root) {
  root.addEventListener('click', (e) => {
    const row = e.target.closest('[data-catch-id]');
    if (row) openCatchDetail(row.dataset.catchId);
  });
}

/** Alle knapper med data-new-catch åbner formularen til ny fangst. */
export function bindNewCatch(root) {
  root.addEventListener('click', (e) => {
    if (e.target.closest('[data-new-catch]')) openCatchForm();
  });
}

/** "Se alle"/"Vis færre"-knap, der skifter mellem to visninger. */
export function bindToggle(root, key, { less = 'Vis færre', more = 'Se alle' } = {}) {
  const btn = root.querySelector(`[data-toggle="${key}"]`);
  if (!btn) return;
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') !== 'true';
    btn.setAttribute('aria-expanded', String(open));
    btn.firstChild.textContent = open ? less : more;
    root.querySelectorAll(`[data-toggle-target="${key}"]`).forEach((el) => {
      el.hidden = el.dataset.toggleShow === 'open' ? !open : open;
    });
  });
}

/** Tungeste personlige rekord (ved lighed den længste). Arter uden vægt tæller som 0 kg. */
export const bestRecord = (list) =>
  list.filter((f) => f.record).sort((a, b) => (b.record.kg ?? 0) - (a.record.kg ?? 0) || b.record.cm - a.record.cm)[0];
