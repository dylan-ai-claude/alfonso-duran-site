// Site behaviour: reveals, menu, the scroll-linked hero and work stage, the kit builder, fitted type.
// Everything here is an enhancement: with scripts off the page still reads top to bottom.

const motionOK = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const store = {
  get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode */ } },
};

// ---------- reveal once on entering the viewport ----------
(() => {
  const targets = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window)) { targets.forEach((el) => el.classList.add('is-in')); return; }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
  targets.forEach((el) => io.observe(el));
  // safety net: never leave something on screen hidden
  window.addEventListener('load', () => setTimeout(() => {
    targets.forEach((el) => { const r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) el.classList.add('is-in'); });
  }, 2000));
})();

// ---------- menu sheet (phones) ----------
const bar = document.querySelector('[data-bar]');
const menuBtn = document.querySelector('[data-menu]');
const sheet = document.querySelector('[data-sheet]');
const setMenu = (open) => {
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.textContent = open ? 'Close' : 'Menu';
  sheet.hidden = !open;
  document.body.style.overflow = open ? 'hidden' : '';
};
menuBtn?.addEventListener('click', () => setMenu(sheet.hidden));
sheet?.querySelectorAll('[data-close]').forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && sheet && !sheet.hidden) { setMenu(false); menuBtn.focus(); } });

// ---------- kit builder ----------
const kit = document.querySelector('[data-kit]');
const dock = document.querySelector('[data-dock]');
const dockLabel = document.querySelector('[data-dock-label]');
const dockDefault = dockLabel?.textContent;
const KIT_KEY = 'duran-kit';
let picked = store.get(KIT_KEY) || [];

function mailFor(list) {
  const addr = kit?.dataset.email || 'a@alfonso-duran.com';
  const body = list.length
    ? `Hi Alfonso,\n\nMy place / brand is called: \n\nWhat I need:\n${list.map((n) => `- ${n}`).join('\n')}\n\nWhen I need it by: \n\nThanks,\n`
    : 'Hi Alfonso,\n\n';
  return `mailto:${addr}?subject=${encodeURIComponent(list.length ? `New project: ${list.join(', ')}` : 'New project')}&body=${encodeURIComponent(body)}`;
}

function renderKit() {
  store.set(KIT_KEY, picked);
  if (dock && dockLabel) {
    dockLabel.textContent = picked.length ? `Email my kit (${picked.length})` : dockDefault;
    dock.setAttribute('href', picked.length ? mailFor(picked) : (kit ? '#contact' : '/#contact'));
  }
  if (!kit) return;
  kit.querySelectorAll('[data-kit-toggle]').forEach((b) => b.setAttribute('aria-pressed', String(picked.includes(b.dataset.name))));
  const summary = kit.querySelector('[data-kit-summary]');
  summary.textContent = picked.length
    ? `Your kit: ${picked.join(', ')}.`
    : 'Nothing added yet. Tap what you need, or just write.';
  kit.querySelector('[data-kit-mail]').setAttribute('href', mailFor(picked));
  const sms = picked.length ? `Hi Alfonso, I need: ${picked.join(', ')}. ` : 'Hi Alfonso, ';
  kit.querySelector('[data-kit-sms]').setAttribute('href', `sms:${kit.dataset.phone}?&body=${encodeURIComponent(sms)}`);
}

if (kit) {
  const rows = [...kit.querySelectorAll('[data-kit-row]')];
  const pics = [...kit.querySelectorAll('[data-kit-pic]')];
  const setActive = (i) => {
    rows.forEach((r, k) => r.classList.toggle('is-active', k === i));
    pics.forEach((p, k) => p.classList.toggle('is-on', k === i));
  };
  rows.forEach((row, i) => {
    const btn = row.querySelector('[data-kit-toggle]');
    row.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') setActive(i); });
    btn.addEventListener('focus', () => setActive(i));
    btn.addEventListener('click', () => {
      const n = btn.dataset.name;
      picked = picked.includes(n) ? picked.filter((x) => x !== n) : [...picked, n];
      setActive(i);
      renderKit();
    });
  });
  // the row crossing the middle of the screen becomes the active one
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) setActive(rows.indexOf(e.target));
    }, { rootMargin: window.matchMedia('(max-width: 50em)').matches ? '-55% 0px -35% 0px' : '-48% 0px -48% 0px' });
    rows.forEach((r) => io.observe(r));
  }
}
renderKit();

// ---------- every-project preview frame ----------
(() => {
  const list = document.querySelector('[data-index]');
  const frame = document.querySelector('[data-frame]');
  if (!list || !frame) return;
  const img = frame.querySelector('img');
  const section = list.closest('section');
  const open = (row) => {
    img.src = row.dataset.preview;
    const top = row.getBoundingClientRect().top - section.getBoundingClientRect().top;
    const max = section.offsetHeight - frame.offsetHeight - 40;
    frame.style.transform = `translateY(${clamp(top - frame.offsetHeight / 3, list.offsetTop, max)}px)`;
    frame.classList.add('is-open');
  };
  const first = list.querySelector('.index__row');
  if (first) requestAnimationFrame(() => open(first));
  list.querySelectorAll('.index__row').forEach((row) => {
    row.addEventListener('pointerenter', () => open(row));
    row.addEventListener('focus', () => open(row));
  });
})();

// ---------- fit display type to the width it has ----------
function fit(el, lines) {
  el.style.fontSize = '';
  const fs = parseFloat(getComputedStyle(el).fontSize);
  const available = el.clientWidth;
  const widths = [...el.querySelectorAll('span')].map((s) => {
    const r = document.createRange(); r.selectNodeContents(s); return r.getBoundingClientRect().width;
  });
  const width = lines() ? Math.max(...widths) : widths.reduce((a, b) => a + b, 0);
  if (width > 0) el.style.fontSize = `${Math.floor(fs * (available / width) * 0.98 * 10) / 10}px`;
}
function fitAll() {
  const mail = document.querySelector('[data-fit]');
  if (mail) fit(mail, () => window.matchMedia('(max-width: 50em)').matches);
  const mark = document.querySelector('[data-fit-mark]');
  if (mark) {
    mark.innerHTML = `<span>${mark.textContent}</span>`;
    fit(mark, () => false);
  }
}
document.fonts?.ready.then(fitAll);
let resizeTimer;
window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(fitAll, 120); });

// ---------- scroll: hero window, work stage, bar, dock ----------
const hero = document.querySelector('[data-hero]');
const stage = document.querySelector('[data-stage]');
const items = stage ? [...stage.querySelectorAll('[data-stage-item]')] : [];
const stops = [...document.querySelectorAll('[data-contact], [data-dock-stop]')];
let lastY = scrollY;
let ticking = false;
const smooth = (x) => x * x * (3 - 2 * x);

function frame() {
  ticking = false;
  const vh = innerHeight;

  if (hero && motionOK) {
    const r = hero.getBoundingClientRect();
    const p = clamp(-r.top / (vh * 0.9), 0, 1);
    hero.style.setProperty('--p', p.toFixed(4));
    hero.classList.toggle('is-open', p > 0.17);
  }

  if (stage && motionOK && items.length) {
    const r = stage.getBoundingClientRect();
    const total = stage.offsetHeight - vh;
    const raw = clamp(-r.top / total, 0, 1) * (items.length - 1);
    const i = Math.min(Math.floor(raw), items.length - 1);
    // each project holds aligned for a moment before the next one tears in
    const t = i + smooth(clamp((raw - i - 0.3) / 0.4, 0, 1));
    items.forEach((el, k) => {
      const d = k - t;
      el.style.setProperty('--d', d.toFixed(4));
      el.style.setProperty('--a', Math.abs(d).toFixed(4));
      el.classList.toggle('is-current', Math.abs(d) < 0.5);
      el.style.visibility = Math.abs(d) >= 1 ? 'hidden' : '';
    });
  }

  const y = scrollY;
  if (bar && sheet?.hidden !== false) bar.classList.toggle('is-hidden', y > lastY && y > vh * 0.5);
  lastY = y;

  if (dock) {
    const pastHero = y > (hero ? vh * 1.2 : 300);
    const atStop = stops.some((el) => { const r = el.getBoundingClientRect(); return r.top < vh && r.bottom > 0; });
    dock.classList.toggle('is-on', pastHero && !atStop);
  }
}
const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);
frame();
