import { esc, uid } from '../ui/util.js';
import { icon } from '../ui/icons.js';

/**
 * Åbner et modalvindue (native <dialog>: fokusfælde og Esc virker indbygget).
 * Bundark på mobil, centreret vindue fra 600px. `body` er betroet HTML.
 * Returnerer dialog-elementet.
 */
export function openModal({ title, body }) {
  const titleId = uid('modal-title');
  const dlg = document.createElement('dialog');
  dlg.className = 'modal';
  dlg.setAttribute('aria-labelledby', titleId);
  dlg.innerHTML = `<div class="modal__panel">
      <div class="modal__grab" aria-hidden="true"></div>
      <header class="modal__head">
        <h2 class="t-h2" id="${titleId}">${esc(title)}</h2>
        <button type="button" class="icon-btn" data-modal-close aria-label="Luk">${icon('close', { size: 20 })}</button>
      </header>
      <div class="modal__body">${body}</div>
    </div>`;

  // Klik på baggrunden (selve <dialog>, uden for panelet) eller luk-knap lukker.
  dlg.addEventListener('click', (e) => {
    if (e.target === dlg || e.target.closest('[data-modal-close]')) dlg.close();
  });
  dlg.addEventListener('close', () => {
    document.body.classList.remove('is-modal-open');
    dlg.remove();
  });

  document.body.append(dlg);
  document.body.classList.add('is-modal-open');
  dlg.showModal();
  return dlg;
}

/** Lukker en evt. åben modal (bruges ved sideskift). */
export function closeOpenModals() {
  document.querySelectorAll('dialog.modal[open]').forEach((d) => d.close());
}
