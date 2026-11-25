import { esc } from '../ui/util.js';
import { icon } from '../ui/icons.js';

// Alle felter har et skjult fejlfelt (#<id>-error), som formularer kan udfylde og vise.
const errorSpan = (id) => `<span class="field__error" id="${esc(id)}-error" hidden></span>`;
const describedBy = (id, hint) => `aria-describedby="${hint ? `${esc(id)}-hint ` : ''}${esc(id)}-error"`;
const hintSpan = (id, hint) => (hint ? `<span class="field__hint" id="${esc(id)}-hint">${esc(hint)}</span>` : '');

/** Tekstfelt med label, hjælpetekst og fejlfelt. */
export function TextField({ id, label, type = 'text', placeholder = '', value = '', hint, attrs = '' }) {
  return `<div class="field">
    <label class="field__label" for="${esc(id)}">${esc(label)}</label>
    <input class="field__control" id="${esc(id)}" type="${esc(type)}" placeholder="${esc(placeholder)}" value="${esc(value)}" ${describedBy(id, hint)} ${attrs}/>
    ${hintSpan(id, hint)}${errorSpan(id)}
  </div>`;
}

/** Flerlinjet tekstfelt. */
export function TextAreaField({ id, label, placeholder = '', value = '', hint, rows = 3, attrs = '' }) {
  return `<div class="field">
    <label class="field__label" for="${esc(id)}">${esc(label)}</label>
    <textarea class="field__control" id="${esc(id)}" rows="${rows}" placeholder="${esc(placeholder)}" ${describedBy(id, hint)} ${attrs}>${esc(value)}</textarea>
    ${hintSpan(id, hint)}${errorSpan(id)}
  </div>`;
}

/** Rulleliste. options: [{ value, label }]. placeholder giver en tom første mulighed. */
export function SelectField({ id, label, options, value = '', placeholder, hint, attrs = '' }) {
  const opts = (placeholder ? `<option value="">${esc(placeholder)}</option>` : '') +
    options.map((o) => `<option value="${esc(o.value)}"${o.value === value ? ' selected' : ''}>${esc(o.label)}</option>`).join('');
  return `<div class="field">
    <label class="field__label" for="${esc(id)}">${esc(label)}</label>
    <select class="field__control" id="${esc(id)}" ${describedBy(id, hint)} ${attrs}>${opts}</select>
    ${hintSpan(id, hint)}${errorSpan(id)}
  </div>`;
}

/** Søgefelt (label er skjult visuelt, men findes for skærmlæsere). */
export function SearchField({ id, label, placeholder }) {
  return `<div class="search">
    <label class="sr-only" for="${esc(id)}">${esc(label)}</label>
    ${icon('search', { size: 20 })}
    <input class="field__control" id="${esc(id)}" type="search" placeholder="${esc(placeholder)}" autocomplete="off" enterkeyhint="search"/>
  </div>`;
}

/**
 * Chips til filtre/faner. Brug data-chip-group + data-chip-value til håndtering.
 * items: [{ value, label }]
 */
export function ChipGroup({ group, label, items, active }) {
  return `<div class="chips" role="group" aria-label="${esc(label)}" data-chip-group="${esc(group)}">
    ${items.map((it) => `<button type="button" class="chip" data-chip-value="${esc(it.value)}" aria-pressed="${it.value === active}">${esc(it.label)}</button>`).join('')}
  </div>`;
}

/** Fælles hjælper: binder klik på en chip-gruppe og kalder onChange(value). */
export function bindChips(root, group, onChange) {
  const el = root.querySelector(`[data-chip-group="${group}"]`);
  if (!el) return;
  el.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-chip-value]');
    if (!chip) return;
    setActiveChip(root, group, chip.dataset.chipValue);
    onChange(chip.dataset.chipValue);
  });
}

export function setActiveChip(root, group, value) {
  root.querySelectorAll(`[data-chip-group="${group}"] [data-chip-value]`).forEach((c) => {
    c.setAttribute('aria-pressed', String(c.dataset.chipValue === value));
  });
}
