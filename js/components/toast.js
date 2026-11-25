// Kort bekræftelse nederst på skærmen (#toast i index.html er en aria-live-region).

let timer;

export function toast(message, ms = 4200) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = message;
  el.classList.add('is-visible');
  clearTimeout(timer);
  timer = setTimeout(() => el.classList.remove('is-visible'), ms);
}
