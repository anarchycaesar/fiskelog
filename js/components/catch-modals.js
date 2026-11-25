// Modalvinduer til fangster: registrér ny fangst og se/slet en eksisterende.

import { fish as allFish, fishById, spots } from '../data/sample.js';
import { addCatch, removeCatch, getCatch, records, validateCatch, todayIso } from '../data/store.js';
import { esc, fmtNumber, fmtShortDate } from '../ui/util.js';
import { icon } from '../ui/icons.js';
import { fishArt } from '../ui/fish-art.js';
import { openModal } from './modal.js';
import { Button } from './button.js';
import { TextField, TextAreaField, SelectField } from './input.js';
import { StatTile } from './stat.js';
import { toast } from './toast.js';

const FIELDS = ['fishId', 'cm', 'kg', 'place', 'date', 'note'];

export function CatchForm({ fishId = '' } = {}) {
  const today = todayIso();
  const options = [...allFish]
    .sort((a, b) => a.name.localeCompare(b.name, 'da'))
    .map((f) => ({ value: f.id, label: f.name }));

  return `<form class="catch-form" novalidate data-catch-form>
    ${SelectField({ id: 'catch-fishId', label: 'Art', placeholder: 'Vælg art …', options, value: fishId, attrs: 'required' })}
    <div class="grid grid--2">
      ${TextField({ id: 'catch-cm', label: 'Længde (cm)', placeholder: 'fx 45', attrs: 'inputmode="decimal" autocomplete="off" required' })}
      ${TextField({ id: 'catch-kg', label: 'Vægt (kg)', placeholder: 'valgfri, fx 1,4', attrs: 'inputmode="decimal" autocomplete="off"' })}
    </div>
    ${TextField({ id: 'catch-place', label: 'Sted', placeholder: 'fx Furesøen', attrs: 'list="catch-places" maxlength="80" autocomplete="off"' })}
    <datalist id="catch-places">${spots.map((s) => `<option value="${esc(s.name)}"></option>`).join('')}</datalist>
    ${TextField({ id: 'catch-date', label: 'Dato', type: 'date', value: today, attrs: `max="${today}" required` })}
    ${TextAreaField({ id: 'catch-note', label: 'Note', placeholder: 'valgfri – fx agn, vejr eller stemning', attrs: 'maxlength="300"' })}
    <div class="form-actions">
      ${Button({ label: 'Annullér', variant: 'tertiary', attrs: 'data-modal-close' })}
      ${Button({ label: 'Gem fangst', type: 'submit' })}
    </div>
  </form>`;
}

/** Åbner formularen. Ved gem lukkes vinduet, og siderne tegnes igen via data-changed-eventet. */
export function openCatchForm(opts = {}) {
  const dlg = openModal({ title: 'Registrér fangst', body: CatchForm(opts) });
  const form = dlg.querySelector('[data-catch-form]');

  const clearErrors = () => {
    form.querySelectorAll('.field__control').forEach((el) => {
      el.removeAttribute('aria-invalid');
      const err = form.querySelector(`#${el.id}-error`);
      if (err) { err.hidden = true; err.textContent = ''; }
    });
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();
    const raw = Object.fromEntries(FIELDS.map((n) => [n, form.querySelector(`#catch-${n}`).value]));
    const result = validateCatch(raw);

    if (!result.ok) {
      let first = null;
      for (const [name, message] of Object.entries(result.errors)) {
        const el = form.querySelector(`#catch-${name}`);
        el.setAttribute('aria-invalid', 'true');
        const err = form.querySelector(`#catch-${name}-error`);
        err.textContent = message;
        err.hidden = false;
        first ??= el;
      }
      first.focus();
      return;
    }

    const isNewSpecies = !records().has(result.value.fishId);
    const saved = addCatch(result.value);
    dlg.close();
    const name = fishById[saved.fishId].name;
    toast(isNewSpecies ? `Ny art i samlingen: ${name} (${fmtNumber(saved.cm)} cm)` : `${name} på ${fmtNumber(saved.cm)} cm er gemt.`);
  });

  form.querySelector('#catch-fishId').focus();
  return dlg;
}

export function CatchDetail(c) {
  const f = fishById[c.fishId];
  return `<div class="fish-detail__art">${fishArt(f, { decorative: false })}</div>
    <div class="grid grid--3">
      ${StatTile({ iconName: 'ruler', value: `${fmtNumber(c.cm)} cm`, label: 'Længde' })}
      ${StatTile({ iconName: 'scale', value: c.kg == null ? '–' : `${fmtNumber(c.kg)} kg`, label: 'Vægt' })}
      ${StatTile({ iconName: 'calendar', value: fmtShortDate(c.date), label: 'Dato' })}
    </div>
    ${c.place ? `<p class="t-meta">${icon('pin', { size: 14, className: 'inline-icon' })}${esc(c.place)}</p>` : ''}
    ${c.note ? `<p class="catch-note">${esc(c.note)}</p>` : ''}
    <div class="catch-delete">
      <div data-delete-idle>${Button({ label: 'Slet fangst', variant: 'tertiary', iconName: 'close', attrs: 'data-delete-start' })}</div>
      <div data-delete-confirm hidden>
        <p class="t-meta catch-delete__text">Slet denne fangst? Det kan ikke fortrydes.</p>
        <div class="form-actions">
          ${Button({ label: 'Annullér', variant: 'secondary', attrs: 'data-delete-cancel' })}
          ${Button({ label: 'Ja, slet', variant: 'danger', attrs: 'data-delete-yes' })}
        </div>
      </div>
    </div>`;
}

export function openCatchDetail(id) {
  const c = getCatch(id);
  if (!c) return null;
  const dlg = openModal({ title: fishById[c.fishId].name, body: CatchDetail(c) });
  const idle = dlg.querySelector('[data-delete-idle]');
  const confirm = dlg.querySelector('[data-delete-confirm]');

  dlg.addEventListener('click', (e) => {
    if (e.target.closest('[data-delete-start]')) {
      idle.hidden = true;
      confirm.hidden = false;
      confirm.querySelector('[data-delete-cancel]').focus(); // sikreste valg først
    } else if (e.target.closest('[data-delete-cancel]')) {
      confirm.hidden = true;
      idle.hidden = false;
      idle.querySelector('button').focus();
    } else if (e.target.closest('[data-delete-yes]')) {
      dlg.close();
      removeCatch(id);
      toast('Fangsten er slettet.');
    }
  });
  return dlg;
}
