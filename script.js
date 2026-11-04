/* =========================================================
   LA ROMANA — ANIMAZIONI
   Cambia i valori in CONFIG per regolare le animazioni.
   ========================================================= */
const CONFIG = {
  heroSlideEvery: 4500,  // ms tra una foto e l'altra nell'hero
  smooth: 0.08,          // 0.01 = molto morbido, 0.3 = scattante
  tilt: 14               // inclinazione massima della La Romana Card (gradi)
};

const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/* ----- Menu ----- */
const menu = document.getElementById('menu');
const btn = document.getElementById('menuBtn');
function toggleMenu(open) {
  menu.classList.toggle('open', open);
  btn.setAttribute('aria-expanded', open);
  btn.textContent = open ? 'Chiudi' : 'Menu';
  document.body.classList.toggle('locked', open);
}
btn.addEventListener('click', () => toggleMenu(!menu.classList.contains('open')));
menu.addEventListener('click', e => { if (e.target.closest('a')) toggleMenu(false); });
addEventListener('keydown', e => { if (e.key === 'Escape') toggleMenu(false); });

/* ----- Hero: lo scoop si allarga con lo scroll, segue il mouse ----- */
const hero = document.getElementById('hero');
let target = 0, p = 0, mx = 0, my = 0, tmx = 0, tmy = 0;

function readScroll() {
  const max = hero.offsetHeight - innerHeight;
  target = clamp(-hero.getBoundingClientRect().top / max, 0, 1);
}
addEventListener('scroll', readScroll, { passive: true });
addEventListener('resize', readScroll);
addEventListener('pointermove', e => {
  tmx = (e.clientX / innerWidth - .5) * 2;
  tmy = (e.clientY / innerHeight - .5) * 2;
});
(function loop() {
  const k = reduce ? 1 : CONFIG.smooth;
  p += (target - p) * k; mx += (tmx - mx) * k; my += (tmy - my) * k;
  root.style.setProperty('--p', p.toFixed(4));
  root.style.setProperty('--mx', mx.toFixed(3));
  root.style.setProperty('--my', my.toFixed(3));
  requestAnimationFrame(loop);
})();
readScroll();

/* ----- Hero: alternanza foto ----- */
const slides = [...document.querySelectorAll('.scoop img')];
let cur = 0;
if (slides.length > 1 && !reduce) {
  setInterval(() => {
    slides[cur].classList.remove('on');
    cur = (cur + 1) % slides.length;
    slides[cur].classList.add('on');
  }, CONFIG.heroSlideEvery);
}

/* ----- Comparsa delle sezioni ----- */
const io = new IntersectionObserver(entries => entries.forEach(en => {
  if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
}), { threshold: .15 });
document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));

/* ----- La Romana Card: inclinazione 3D ----- */
const tilt = document.getElementById('tilt');
if (tilt && !reduce) {
  tilt.addEventListener('pointermove', e => {
    const r = tilt.getBoundingClientRect();
    tilt.style.setProperty('--tx', ((e.clientX - r.left) / r.width - .5) * CONFIG.tilt);
    tilt.style.setProperty('--ty', -((e.clientY - r.top) / r.height - .5) * CONFIG.tilt);
  });
  tilt.addEventListener('pointerleave', () => {
    tilt.style.setProperty('--tx', 0); tilt.style.setProperty('--ty', 0);
  });
}

/* ----- Popup (ISO, FEA) ----- */
document.querySelectorAll('[data-open]').forEach(b =>
  b.addEventListener('click', () => document.getElementById(b.dataset.open).showModal()));
document.querySelectorAll('dialog').forEach(d =>
  d.addEventListener('click', e => { if (e.target === d) d.close(); }));
