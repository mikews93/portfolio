import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import * as THREE from 'three';
import type { Shape } from '../content';
import { createScene, type Stop } from './scene';
import { createSound } from './sound';

gsap.registerPlugin(ScrollTrigger);

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const desktop = matchMedia('(min-width: 900px)').matches;
const finePointer = matchMedia('(pointer: fine)').matches;
const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => [...r.querySelectorAll<T>(s)];

/* ---------- Smooth scroll ---------- */
let lenis: Lenis | null = null;
if (!reduced) {
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
$$<HTMLAnchorElement>('a[href^="#"]').forEach((a) =>
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href')!;
    if (id.length < 2) return;
    e.preventDefault();
    lenis ? lenis.scrollTo(id, { offset: 0, duration: 1.6 }) : $(id)?.scrollIntoView();
  }),
);

/* ---------- Split helpers ---------- */
function span(cls: string, text: string) {
  const s = document.createElement('span');
  s.className = cls;
  s.textContent = text;
  return s;
}
function splitChars(el: HTMLElement) {
  const text = el.textContent ?? '';
  el.setAttribute('aria-label', text);
  const words = text.split(' ');
  el.replaceChildren(
    ...words.flatMap((w, i) => {
      const word = span('word', '');
      word.setAttribute('aria-hidden', 'true');
      word.append(...[...w].map((ch) => span('ch', ch)));
      return i ? [document.createTextNode(' '), word] : [word];
    }),
  );
  return $$('.ch', el);
}
function splitWords(el: HTMLElement) {
  const words = (el.textContent ?? '').trim().split(/\s+/);
  el.replaceChildren(...words.flatMap((w, i) => (i ? [document.createTextNode(' '), span('w', w)] : [span('w', w)])));
  return $$('.w', el);
}

/* ---------- Preloader + hero intro ---------- */
function intro(ready: Promise<unknown>) {
  const loader = $('.loader');
  const count = $('.loader__count');
  const lines = $$('.hero__line .inner');
  lines.forEach((l) => splitChars(l));
  if (reduced) {
    loader?.remove();
    document.documentElement.classList.add('ready');
    return;
  }
  // The counter follows real work (fonts + the particle scene), never longer than ~2 s.
  const n = { v: 0 };
  let target = 12;
  const bump = (to: number) => () => (target = Math.max(target, to));
  document.fonts.ready.then(bump(55));
  ready.then(bump(100));
  const render = () => {
    n.v += (target - n.v) * 0.14;
    if (count) count.textContent = String(Math.round(n.v)).padStart(3, '0');
    gsap.set('.loader__bar', { scaleX: n.v / 100 });
  };
  gsap.ticker.add(render);
  const minTime = new Promise((r) => setTimeout(r, 650));
  const maxTime = new Promise((r) => setTimeout(r, 1600));
  let skip: () => void = () => {};
  const skipped = new Promise<void>((r) => (skip = r));
  loader?.addEventListener('click', () => skip());
  addEventListener('keydown', () => skip(), { once: true });
  Promise.race([Promise.all([Promise.all([document.fonts.ready, ready]), minTime]), maxTime, skipped]).then(() => {
    target = 100;
    gsap
      .timeline({ delay: 0.25, onStart: () => gsap.ticker.remove(render) })
      .set(count, { textContent: '100' })
      .to(loader, { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'expo.inOut' })
      .add(() => {
        loader?.remove();
        document.documentElement.classList.add('ready');
      })
      .from('.hero .ch', { yPercent: 110, rotate: 6, duration: 1.1, ease: 'expo.out', stagger: 0.025 }, '-=0.45')
      .from('.hero__eyebrow, .hero__tail, .hero__meta > *, .nav', { y: 24, autoAlpha: 0, duration: 1, ease: 'power3.out', stagger: 0.08 }, '-=0.8');
  });
}

/* ---------- Layered hero: each plane leaves at its own speed ---------- */
function heroDepth() {
  const hero = $('.hero');
  if (!hero || reduced) return;
  const st = { trigger: hero, start: 'top top', end: 'bottom top', scrub: true };
  gsap.to('.hero__backword', { yPercent: -8, scale: 0.94, ease: 'none', scrollTrigger: st });
  gsap.to('.hero__subject', { y: () => -innerHeight * 0.22, scale: 1.06, transformOrigin: '50% 100%', ease: 'none', scrollTrigger: st });
  gsap.to('.hero__title, .hero__tail', { y: () => -innerHeight * 0.38, ease: 'none', scrollTrigger: st });
  // The haze stays anchored to the bottom so the waist cut never shows.
  gsap.fromTo('.hero__haze', { opacity: 0.85 }, { opacity: 1, ease: 'none', scrollTrigger: st });
  gsap.to('.hero__eyebrow, .hero__meta', { autoAlpha: 0, y: -40, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: '35% top', scrub: true } });
  // The subject arrives first, as the preloader lifts.
  gsap.from('.hero__subject', { yPercent: 18, autoAlpha: 0, duration: 1.6, ease: 'expo.out', delay: 1.4 });
  gsap.from('.hero__backword', { xPercent: 12, autoAlpha: 0, duration: 2, ease: 'expo.out', delay: 1.2 });
  if (!finePointer) return;
  // A little parallax with the pointer; near planes move more.
  const planes: [string, number][] = [['.hero__backword', -10], ['.hero__subject', 16], ['.hero__haze', 24]];
  const movers = planes.map(([sel, k]) => [gsap.quickTo(sel, 'x', { duration: 1, ease: 'power3' }), k] as const);
  addEventListener('pointermove', (e) => {
    if (scrollY > innerHeight) return;
    const px = e.clientX / innerWidth - 0.5;
    movers.forEach(([to, k]) => to(px * k));
  });
}

/* ---------- Kinetic type: titles lean into the scroll ---------- */
function kinetic() {
  if (reduced) return;
  const els = $$('.section-title, .work__title, .panel__name, .contact__big, .music__title');
  const setters = els.map((el) => gsap.quickTo(el, 'skewY', { duration: 0.6, ease: 'power3.out' }));
  const settle = gsap.delayedCall(0.15, () => setters.forEach((f) => f(0))).pause();
  ScrollTrigger.create({
    onUpdate: (st) => {
      const v = gsap.utils.clamp(-5, 5, st.getVelocity() / -320);
      setters.forEach((f) => f(v));
      settle.restart(true);
    },
  });
}

/* ---------- Particle scene ---------- */
let markReady: (v?: unknown) => void = () => {};
const sceneReady = new Promise((r) => (markReady = r));
async function scene() {
  const canvas = $<HTMLCanvasElement>('#gl');
  if (!canvas) return markReady();
  try {
    await Promise.race([document.fonts.load('900 100px "Archivo Variable"'), new Promise((r) => setTimeout(r, 1500))]);
  } catch {
    /* fall back to the system font */
  }
  let s: ReturnType<typeof createScene>;
  try {
    s = createScene(canvas, { reduced });
  } catch {
    canvas.remove();
    document.documentElement.classList.add('no-gl');
    markReady();
    return;
  }
  const mobile = !desktop;
  const collect = () => {
    const stops: Stop[] = [];
    const add = (y: number, el: HTMLElement) => {
      const d = el.dataset;
      stops.push({
        y: Math.max(0, y),
        shape: d.shape as Shape,
        c1: new THREE.Color(d.c1 ?? '#ff4a3d'),
        c2: new THREE.Color(d.c2 ?? '#f1ece4'),
        x: mobile ? Number(d.xm ?? 0) : Number(d.x ?? 0),
        yo: Number((mobile ? d.ym : d.y) ?? 0),
        s: Number((mobile ? d.sm : d.s) ?? 1),
        a: Number((mobile ? (d.am ?? d.a) : d.a) ?? 1),
      });
    };
    $$('[data-shape]').forEach((el) => {
      if (el.closest('.work__track')) return;
      const top = el.getBoundingClientRect().top + scrollY;
      add(top - innerHeight * 0.15, el);
    });
    // Horizontal panels: one stop per panel along the pinned scroll.
    const panels = $$('.work__track [data-shape]');
    const st = workTrigger;
    if (st && desktop) {
      panels.forEach((p, k) => add(st.start + (k / Math.max(1, panels.length - 1)) * (st.end - st.start) - 40, p));
    } else panels.forEach((p) => add(p.getBoundingClientRect().top + scrollY - innerHeight * 0.3, p));
    s.setStops(stops);
  };
  ScrollTrigger.addEventListener('refresh', collect);
  collect();
  s.start();
  markReady();
  // Build the rest of the shapes when the browser is idle.
  const idle = (window as any).requestIdleCallback ?? ((f: () => void) => setTimeout(f, 300));
  idle(() => s.warm(['galaxy', 'sphere', 'torus', 'book', 'wave', 'venn', 'helix', 'rings']));
}

/* ---------- Horizontal work gallery ---------- */
let workTrigger: ScrollTrigger | null = null;
function work() {
  const track = $('.work__track');
  const pin = $('.work__pin');
  if (!track || !pin) return;
  if (desktop && !reduced) {
    // A camera journey in depth: projects sit one behind another along Z and
    // the scroll flies the viewer through them.
    document.documentElement.classList.add('z-journey');
    const panels = $$('.panel');
    const n = panels.length;
    const depth = () => Math.max(1500, innerWidth * 1.15);
    const per = () => innerHeight * 1.15;
    const medias = panels.map((p) => $('.panel__media', p));
    let target = 0;
    let cur = 0;
    let lastIdx = 0;
    const st = ScrollTrigger.create({
      trigger: pin,
      pin: true,
      start: 'top top',
      end: () => `+=${per() * (n - 1)}`,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        // Hold each project in focus for most of its scroll, then fly to the next.
        const x = self.progress * (n - 1);
        const i = Math.floor(x);
        const f = x - i;
        const t = f < 0.3 ? 0 : f > 0.7 ? 1 : ((f - 0.3) / 0.4) ** 2 * (3 - 2 * ((f - 0.3) / 0.4));
        target = Math.min(n - 1, i + t);
      },
    });
    workTrigger = st;
    const layout = () => {
      cur += (target - cur) * 0.1;
      if (Math.abs(target - cur) < 0.0005) cur = target;
      const D = depth();
      panels.forEach((p, k) => {
        const rel = cur - k;
        const o = rel < 0 ? Math.max(0, 1 + rel / 1.1) : Math.max(0, 1 - rel * 4);
        p.style.transform = `translate3d(0, 0, ${(rel * D).toFixed(1)}px)`;
        p.style.opacity = o.toFixed(3);
        p.style.visibility = o < 0.01 ? 'hidden' : 'visible';
        p.style.pointerEvents = Math.abs(rel) < 0.45 ? 'auto' : 'none';
        medias[k]?.style.setProperty('--ry', `${(rel * -28).toFixed(2)}deg`);
        medias[k]?.style.setProperty('--rx', `${(rel * 8).toFixed(2)}deg`);
      });
      const idx = Math.round(cur);
      const bar = $('.work__progress i');
      if (bar) bar.style.transform = `scaleX(${cur / (n - 1)})`;
      const count = $('.work__count b');
      if (count) count.textContent = String(idx + 1).padStart(2, '0');
      if (idx !== lastIdx) {
        lastIdx = idx;
        dispatchEvent(new CustomEvent('mb:whoosh', { detail: panels[idx]?.dataset.sound }));
      }
    };
    layout();
    gsap.ticker.add(layout);
    // Media ripples like liquid when the journey moves fast or on hover.
    const disp = document.querySelector('#liquid feDisplacementMap');
    if (disp) {
      const o = { v: 0, hover: 0 };
      const apply = () => disp.setAttribute('scale', (o.v + o.hover).toFixed(1));
      ScrollTrigger.create({
        trigger: pin,
        start: 'top top',
        end: () => `+=${per() * (n - 1)}`,
        onUpdate: (self) => gsap.to(o, { v: Math.min(90, Math.abs(self.getVelocity()) / 25), duration: 0.3, overwrite: true, onUpdate: apply, onComplete: () => void gsap.to(o, { v: 0, duration: 0.9, ease: 'power2.out', onUpdate: apply }) }),
      });
      $$('.panel__media').forEach((m) => {
        m.addEventListener('pointerenter', () => gsap.to(o, { hover: 22, duration: 0.6, onUpdate: apply }));
        m.addEventListener('pointerleave', () => gsap.to(o, { hover: 0, duration: 0.8, onUpdate: apply }));
      });
    }
  } else {
    $$('.panel').forEach((p) =>
      gsap.from($$('.reveal', p), { y: 40, autoAlpha: 0, stagger: 0.06, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: p, start: 'top 75%' } }),
    );
  }
}

/* ---------- Section reveals ---------- */
function reveals() {
  if (reduced) return;
  // Manifesto: words light up as you read.
  const m = $('.manifesto__text');
  if (m) {
    const words = splitWords(m);
    gsap.fromTo(words, { opacity: 0.12 }, { opacity: 1, stagger: 0.05, ease: 'none', scrollTrigger: { trigger: m, start: 'top 80%', end: 'bottom 45%', scrub: true } });
  }
  // Big titles.
  $$('.title-split').forEach((el) => {
    const chars = splitChars(el);
    gsap.from(chars, { yPercent: 105, duration: 1, ease: 'expo.out', stagger: 0.02, scrollTrigger: { trigger: el, start: 'top 85%' } });
  });
  $$('.service').forEach((el, i) =>
    gsap.from(el, { y: 70, autoAlpha: 0, duration: 1.1, delay: (i % 2) * 0.12, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } }),
  );
  $$('.fade-up').forEach((el) =>
    gsap.from(el, { y: 50, autoAlpha: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } }),
  );
  // Counters.
  $$<HTMLElement>('[data-count]').forEach((el) => {
    const end = Number(el.dataset.count);
    const o = { v: 0 };
    gsap.to(o, {
      v: end,
      duration: 2,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
      onUpdate: () => (el.textContent = Math.round(o.v).toLocaleString(document.documentElement.lang)),
    });
  });
  // Experience: each stop slides up as it arrives.
  $$('.job').forEach((row) =>
    gsap.from($$('.job__head, .job__company, .job__role, .job__promo, .job__text, .job__metrics > div, .chips', row), {
      y: 40,
      autoAlpha: 0,
      stagger: 0.06,
      duration: 1,
      ease: 'expo.out',
      scrollTrigger: { trigger: row, start: 'top 80%' },
    }),
  );
  // Skills marquee speed follows scroll velocity.
  $$('.marquee__row').forEach((row, i) => {
    const dir = i % 2 ? 1 : -1;
    const tw = gsap.to(row, { xPercent: dir * -50, repeat: -1, duration: 38 + i * 6, ease: 'none' });
    if (dir > 0) gsap.set(row, { xPercent: -50 });
    ScrollTrigger.create({
      trigger: '.skills',
      onUpdate: (st) => gsap.to(tw, { timeScale: 1 + Math.min(4, Math.abs(st.getVelocity()) / 400), duration: 0.2, overwrite: true, onComplete: () => void gsap.to(tw, { timeScale: 1, duration: 1 }) }),
    });
  });
  // Music: phone tilts in, lyrics light up line by line.
  gsap.fromTo('.phone', { rotateY: 25, rotateX: 8, y: 80 }, { rotateY: -10, rotateX: -4, y: -40, ease: 'none', scrollTrigger: { trigger: '.music', start: 'top bottom', end: 'bottom top', scrub: true } });
  const lyr = $$('.lyrics li');
  if (lyr.length)
    ScrollTrigger.create({
      trigger: '.lyrics',
      start: 'top 75%',
      end: 'bottom 35%',
      onUpdate: (st) => {
        const k = Math.floor(st.progress * lyr.length * 0.999);
        lyr.forEach((li, j) => li.classList.toggle('on', j <= k));
      },
    });
  // Contact: the giant word slides in.
  gsap.fromTo(
    '.contact__big .ch',
    { yPercent: 120, rotate: 8 },
    { yPercent: 0, rotate: 0, stagger: 0.04, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.contact__big', start: 'top 90%', toggleActions: 'play none none reverse' } },
  );
}

/* ---------- Experience timeline: the year rolls as each stop takes focus ---------- */
function timeline() {
  const rows = $$<HTMLElement>('.job');
  if (!rows.length) return;
  const year = $('.timeline__year span');
  const company = $('.timeline__company');
  const dots = $$('.timeline__rail b');
  let active = -1;
  const activate = (i: number) => {
    if (i === active) return;
    const dir = i > active ? 1 : -1;
    active = i;
    rows.forEach((r, k) => r.classList.toggle('is-active', k === i));
    dots.forEach((d, k) => d.classList.toggle('on', k <= i));
    const r = rows[i];
    if (company) company.textContent = r.dataset.company ?? '';
    if (year) {
      if (reduced) year.textContent = r.dataset.from ?? '';
      else
        gsap
          .timeline()
          .to(year, { yPercent: -110 * dir, duration: 0.22, ease: 'power2.in', overwrite: true })
          .add(() => (year.textContent = r.dataset.from ?? ''))
          .fromTo(year, { yPercent: 110 * dir }, { yPercent: 0, duration: 0.6, ease: 'expo.out' });
    }
    dispatchEvent(new CustomEvent('mb:tick', { detail: i }));
  };
  rows.forEach((r, i) =>
    ScrollTrigger.create({ trigger: r, start: 'top 60%', end: 'bottom 60%', onToggle: (st) => st.isActive && activate(i) }),
  );
  const fill = $('.timeline__fill');
  if (fill) gsap.to(fill, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.jobs', start: 'top 60%', end: 'bottom 60%', scrub: true } });
}

/* ---------- Lens: a liquid magnifier follows the cursor over project media ---------- */
function lens() {
  if (!finePointer || reduced || !desktop) return;
  const img = document.querySelector('#lens feImage');
  if (!img) return;
  const S = 256;
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const g = c.getContext('2d')!;
  const data = g.createImageData(S, S);
  for (let y = 0; y < S; y++)
    for (let x = 0; x < S; x++) {
      const dx = (x - S / 2) / (S / 2);
      const dy = (y - S / 2) / (S / 2);
      const r = Math.hypot(dx, dy);
      const f = r < 1 ? Math.pow(1 - r * r, 1.5) : 0;
      // Bulge plus a slight swirl, encoded around neutral grey (128).
      const i = (y * S + x) * 4;
      data.data[i] = 128 + (dx * 0.9 - dy * 0.35) * f * 127;
      data.data[i + 1] = 128 + (dy * 0.9 + dx * 0.35) * f * 127;
      data.data[i + 2] = 128;
      data.data[i + 3] = 255;
    }
  g.putImageData(data, 0, 0);
  img.setAttribute('href', c.toDataURL());
  const size = 260;
  img.setAttribute('width', String(size));
  img.setAttribute('height', String(size));
  const pos = { x: -9999, y: -9999 };
  const xTo = gsap.quickTo(pos, 'x', { duration: 0.35, ease: 'power3', onUpdate: () => img.setAttribute('x', String(pos.x - size / 2)) });
  const yTo = gsap.quickTo(pos, 'y', { duration: 0.35, ease: 'power3', onUpdate: () => img.setAttribute('y', String(pos.y - size / 2)) });
  $$('.panel__media > *').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      // Filter space is the element's own (untransformed) box.
      const sx = el.offsetWidth / r.width;
      const sy = el.offsetHeight / r.height;
      xTo((e.clientX - r.left) * sx);
      yTo((e.clientY - r.top) * sy);
    });
    el.addEventListener('pointerleave', () => {
      gsap.set(pos, { x: -9999, y: -9999 });
      img.setAttribute('x', '-9999');
    });
  });
}

/* ---------- Service cards: a spotlight follows the cursor ---------- */
function spotlight() {
  if (!finePointer) return;
  $$('.service').forEach((el) =>
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    }),
  );
}

/* ---------- Breathing type: letters widen near the cursor (Archivo's wdth axis) ---------- */
function breathe() {
  if (reduced) return;
  const groups = [$$('.hero .ch'), $$('.contact__big .ch')].filter((g) => g.length);
  // Each title's resting width (its CSS font-stretch); letters near the cursor condense toward 70%.
  const base = (ch: HTMLElement) => parseFloat(getComputedStyle(ch.closest('h1, h2')!).fontStretch) || 115;
  const bases = groups.map((g) => base(g[0]));
  if (finePointer) {
    let mx = -9999;
    let my = -9999;
    addEventListener('pointermove', (e) => {
      mx = e.clientX;
      my = e.clientY;
    });
    gsap.ticker.add(() => {
      for (const [gi, chars] of groups.entries()) {
        const b0 = bases[gi];
        const box = chars[0].parentElement!.closest('h1, h2')!.getBoundingClientRect();
        if (box.bottom < 0 || box.top > innerHeight) continue;
        // Read every box first, then write, so the browser lays out once per frame.
        const rects = chars.map((c) => c.getBoundingClientRect());
        for (const [k, ch] of chars.entries()) {
          const r = rects[k];
          const d = Math.hypot(r.left + r.width / 2 - mx, r.top + r.height / 2 - my);
          const f = Math.max(0, 1 - d / 320);
          const cur = Number(ch.dataset.f ?? 0);
          const next = cur + (f - cur) * 0.15;
          if (Math.abs(next - cur) < 0.002) continue;
          ch.dataset.f = String(next);
          ch.style.fontStretch = `${b0 - next * (b0 - 70)}%`;
          ch.style.fontWeight = String(Math.round(800 + next * 100));
        }
      }
    });
  } else {
    // Touch screens: a slow wave runs through the letters.
    gsap.ticker.add((time) => {
      groups.forEach((chars, gi) =>
        chars.forEach((ch, i) => {
          const f = Math.pow((Math.sin(time * 1.4 - i * 0.5) + 1) / 2, 3);
          ch.style.fontStretch = `${bases[gi] - f * (bases[gi] - 80)}%`;
        }),
      );
    });
  }
}

/* ---------- Pointer niceties ---------- */
function pointer() {
  if (!finePointer || reduced) return;
  const dot = $('.cursor');
  if (dot) {
    const xTo = gsap.quickTo(dot, 'x', { duration: 0.35, ease: 'power3' });
    const yTo = gsap.quickTo(dot, 'y', { duration: 0.35, ease: 'power3' });
    addEventListener('pointermove', (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    });
    $$('a, button, [data-hover]').forEach((el) => {
      el.addEventListener('pointerenter', () => dot.classList.add('is-hover'));
      el.addEventListener('pointerleave', () => dot.classList.remove('is-hover'));
    });
    $$<HTMLElement>('.panel__media[data-href]').forEach((el) => {
      el.addEventListener('pointerenter', () => dot.classList.add('is-view'));
      el.addEventListener('pointerleave', () => dot.classList.remove('is-view'));
      el.addEventListener('click', () => window.open(el.dataset.href, '_blank', 'noopener'));
    });
  }
  $$('.magnetic').forEach((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * 0.35);
      yTo((e.clientY - r.top - r.height / 2) * 0.35);
    });
    el.addEventListener('pointerleave', () => {
      xTo(0);
      yTo(0);
    });
  });
  // 3D tilt on device mockups.
  $$('[data-tilt]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(el, { '--tx': `${py * -8}deg`, '--ty': `${px * 10}deg`, duration: 0.6, ease: 'power3.out' });
    });
    el.addEventListener('pointerleave', () => gsap.to(el, { '--tx': '0deg', '--ty': '0deg', duration: 0.8, ease: 'power3.out' }));
  });
}

/* ---------- Sound: the site plays a G-major pentatonic as you explore ---------- */
function sound() {
  const btn = $<HTMLButtonElement>('.nav__sound');
  if (!btn) return;
  const snd = createSound();
  const toggles = [btn, ...$$<HTMLButtonElement>('[data-sound-toggle]')];
  const label = $('[data-sound-toggle]');
  const onText = document.documentElement.lang === 'es' ? 'Sonido encendido' : 'Sound on';
  const offText = label?.textContent ?? '';
  toggles.forEach((t) =>
    t.addEventListener('click', () => {
      const on = snd.toggle();
      toggles.forEach((x) => {
        x.setAttribute('aria-pressed', String(on));
        x.classList.toggle('is-on', on);
      });
      if (label) label.textContent = on ? onText : offText;
    }),
  );
  addEventListener('mb:whoosh', () => snd.whoosh());
  addEventListener('mb:tick', (e) => snd.tick((e as CustomEvent<number>).detail));
  const targets = $$('a, button, .chips li, .job, .marquee__set span, .lyrics li');
  targets.forEach((el, i) => el.addEventListener('pointerenter', () => snd.pluck(i, el.matches('.job') ? 0.7 : 0.45)));
  $$('a, button').forEach((el, i) => el.addEventListener('click', () => snd.pluck(i + 2, 0.8)));
  // Every section and project has its own signature sound, played as it takes the screen.
  const zMode = () => document.documentElement.classList.contains('z-journey');
  let last = '';
  const play = (name?: string) => {
    if (!name || name === last) return;
    last = name;
    snd.scene(name);
  };
  addEventListener('mb:whoosh', (e) => play((e as CustomEvent<string>).detail));
  ScrollTrigger.create({
    onUpdate: () => {
      if (!btn.classList.contains('is-on')) return;
      const el = $$('[data-sound]').find((x) => {
        if (zMode() && x.closest('.work__track')) return false;
        const r = x.getBoundingClientRect();
        return r.top < innerHeight * 0.5 && r.bottom > innerHeight * 0.5;
      });
      // Inside the pinned journey the panel events above decide.
      if (el && !(zMode() && el.closest('.work'))) play(el.dataset.sound);
    },
  });
}

/* ---------- Nav state ---------- */
function nav() {
  const navEl = $('.nav');
  ScrollTrigger.create({
    start: 80,
    onUpdate: (st) => {
      navEl?.classList.toggle('is-scrolled', st.scroll() > 80);
      navEl?.classList.toggle('is-hidden', st.direction === 1 && st.scroll() > 600);
    },
  });
  const links = $$<HTMLAnchorElement>('.nav__links a');
  links.forEach((a) => {
    const target = $(a.getAttribute('href')!);
    if (target)
      ScrollTrigger.create({ trigger: target, start: 'top 50%', end: 'bottom 50%', onToggle: (st) => a.classList.toggle('active', st.isActive) });
  });
}

intro(sceneReady);
work();
reveals();
kinetic();
heroDepth();
breathe();
timeline();
lens();
spotlight();
pointer();
nav();
sound();
scene();
addEventListener('load', () => ScrollTrigger.refresh());
