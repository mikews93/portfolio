import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import * as THREE from 'three';
import type { Shape } from '../content';
import { createScene, type Stop } from './scene';

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
function intro() {
  const loader = $('.loader');
  const count = $('.loader__count');
  const lines = $$('.hero__line .inner');
  lines.forEach((l) => splitChars(l));
  if (reduced) {
    loader?.remove();
    document.documentElement.classList.add('ready');
    return;
  }
  const n = { v: 0 };
  const tl = gsap.timeline();
  tl.to(n, {
    v: 100,
    duration: 1.1,
    ease: 'power2.inOut',
    onUpdate: () => count && (count.textContent = String(Math.round(n.v)).padStart(3, '0')),
  })
    .to('.loader__bar', { scaleX: 1, duration: 1.1, ease: 'power2.inOut' }, 0)
    .to(loader, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, '+=0.1')
    .add(() => {
      loader?.remove();
      document.documentElement.classList.add('ready');
    })
    .from('.hero .ch', { yPercent: 110, rotate: 6, duration: 1.1, ease: 'expo.out', stagger: 0.025 }, '-=0.45')
    .from('.hero__eyebrow, .hero__tail, .hero__meta > *, .nav', { y: 24, autoAlpha: 0, duration: 1, ease: 'power3.out', stagger: 0.08 }, '-=0.8');
}

/* ---------- Particle scene ---------- */
async function scene() {
  const canvas = $<HTMLCanvasElement>('#gl');
  if (!canvas) return;
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
        x: mobile ? 0 : Number(d.x ?? 0),
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
      const track = $('.work__track')!;
      const dist = Math.max(1, track.scrollWidth - innerWidth);
      panels.forEach((p) => add(st.start + Math.min(1, p.offsetLeft / dist) * (st.end - st.start) - 40, p));
    } else panels.forEach((p) => add(p.getBoundingClientRect().top + scrollY - innerHeight * 0.3, p));
    s.setStops(stops);
  };
  ScrollTrigger.addEventListener('refresh', collect);
  collect();
  s.start();
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
    const dist = () => track.scrollWidth - innerWidth;
    const tween = gsap.to(track, {
      x: () => -dist(),
      ease: 'none',
      scrollTrigger: {
        trigger: pin,
        pin: true,
        scrub: 0.6,
        end: () => `+=${dist()}`,
        invalidateOnRefresh: true,
        onUpdate: (st) => {
          const bar = $('.work__progress i');
          if (bar) bar.style.transform = `scaleX(${st.progress})`;
          const idx = Math.round(st.progress * ($$('.panel').length - 1));
          const cur = $('.work__count b');
          if (cur) cur.textContent = String(idx + 1).padStart(2, '0');
        },
      },
    });
    workTrigger = tween.scrollTrigger!;
    $$('.panel').forEach((p) => {
      gsap.from($$('.reveal', p), {
        y: 60,
        autoAlpha: 0,
        stagger: 0.06,
        ease: 'power3.out',
        scrollTrigger: { trigger: p, containerAnimation: tween, start: 'left 70%', end: 'left 20%', scrub: 0.8 },
      });
      const media = $('.panel__media', p);
      if (media)
        gsap.fromTo(
          media,
          { rotateY: -18, rotateX: 6, scale: 0.88 },
          { rotateY: 8, rotateX: -2, scale: 1, ease: 'none', scrollTrigger: { trigger: p, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } },
        );
    });
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
  // Experience rows.
  $$('.job').forEach((row) => {
    gsap.from(row, { clipPath: 'inset(0 0 100% 0)', y: 40, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: row, start: 'top 85%' } });
    gsap.from($('.job__line', row), { scaleX: 0, transformOrigin: 'left', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: row, start: 'top 90%' } });
  });
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

intro();
work();
reveals();
pointer();
nav();
scene();
addEventListener('load', () => ScrollTrigger.refresh());
