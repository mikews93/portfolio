/**
 * Opt-in sound, synthesised live with the Web Audio API (no audio files).
 * Hovers pluck notes from a G-major pentatonic, a low pad breathes underneath,
 * and every section and project has its own signature sound, played as it
 * takes the screen. Nothing sounds until the visitor turns it on.
 */
const SCALE = [196.0, 220.0, 246.94, 293.66, 329.63, 392.0, 440.0, 493.88, 587.33, 659.25, 783.99];
const G = 196.0;
const hz = (semis: number, base = G) => base * 2 ** (semis / 12);

export function createSound() {
  let ctx: AudioContext | null = null;
  let master: GainNode;
  let wet: GainNode;
  let pad: GainNode;
  let noise: AudioBuffer;
  let on = false;
  const lastAt = new Map<number, number>();
  const strings = new Map<number, AudioBuffer>();

  function init() {
    ctx = new AudioContext();
    master = ctx.createGain();
    master.gain.value = 0.16;
    const delay = ctx.createDelay(1);
    delay.delayTime.value = 0.32;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.35;
    const tone = ctx.createBiquadFilter();
    tone.type = 'lowpass';
    tone.frequency.value = 2200;
    wet = ctx.createGain();
    wet.gain.value = 0.5;
    wet.connect(delay);
    delay.connect(feedback).connect(delay);
    delay.connect(tone).connect(master);
    master.connect(ctx.destination);

    noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;

    // A quiet, slowly breathing pad on G and D.
    pad = ctx.createGain();
    pad.gain.value = 0;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 600;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 250;
    lfo.connect(lfoGain).connect(lp.frequency);
    lfo.start();
    [98, 98.6, 146.83, 196].forEach((f) => {
      const o = ctx!.createOscillator();
      o.type = 'sawtooth';
      o.frequency.value = f;
      o.connect(lp);
      o.start();
    });
    lp.connect(pad).connect(master);
  }

  function env(g: GainNode, t: number, peak: number, attack: number, len: number) {
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + len);
  }

  function note(freq: number, vel: number, when = 0, len = 1.1, type: OscillatorType = 'triangle', send = true) {
    if (!ctx) return;
    const t = ctx.currentTime + when;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    const g = ctx.createGain();
    env(g, t, vel, 0.012, len);
    o.connect(g);
    g.connect(master);
    if (send) g.connect(wet);
    o.start(t);
    o.stop(t + len + 0.05);
  }

  /** Filtered noise burst: whooshes, clicks, breath. */
  function burst(when: number, len: number, vel: number, from: number, to: number, q = 1.2) {
    if (!ctx) return;
    const t = ctx.currentTime + when;
    const src = ctx.createBufferSource();
    src.buffer = noise;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.Q.value = q;
    bp.frequency.setValueAtTime(from, t);
    bp.frequency.exponentialRampToValueAtTime(to, t + len);
    const g = ctx.createGain();
    env(g, t, vel, Math.min(0.3, len / 3), len);
    src.connect(bp).connect(g).connect(master);
    src.start(t, Math.random() * 0.5);
    src.stop(t + len + 0.05);
  }

  /** Karplus-Strong plucked string, rendered once per pitch. */
  function string(freq: number, vel: number, when = 0) {
    if (!ctx) return;
    const key = Math.round(freq * 10);
    let buf = strings.get(key);
    if (!buf) {
      const sr = ctx.sampleRate;
      buf = ctx.createBuffer(1, Math.floor(sr * 2.2), sr);
      const out = buf.getChannelData(0);
      const n = Math.round(sr / freq);
      const ring = new Float32Array(n).map(() => Math.random() * 2 - 1);
      for (let i = 0; i < out.length; i++) {
        const j = i % n;
        const next = ring[(j + 1) % n];
        out[i] = ring[j];
        ring[j] = 0.996 * 0.5 * (ring[j] + next);
      }
      strings.set(key, buf);
    }
    const t = ctx.currentTime + when;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const g = ctx.createGain();
    g.gain.value = vel;
    src.connect(g);
    g.connect(master);
    g.connect(wet);
    src.start(t);
  }

  /** Bell: inharmonic partials, long decay. */
  function bell(freq: number, vel: number, when = 0) {
    [1, 2.0, 2.76, 5.4, 8.93].forEach((p, k) => note(freq * p, vel / (k + 1.2), when, 3.2 / (1 + k * 0.6), 'sine'));
  }

  const scenes: Record<string, () => void> = {
    // Hero: a bright rising signature on G.
    hero: () => [0, 4, 7, 12, 16].forEach((s, k) => note(hz(s, 392), 0.18, k * 0.09, 1.4)),
    // Manifesto: a warm swell, like taking a breath before talking.
    manifesto: () => {
      burst(0, 1.6, 0.18, 300, 900, 0.7);
      [0, 7, 16].forEach((s) => note(hz(s, 98), 0.12, 0.2, 2.6, 'sine'));
    },
    // Stats: a counter ticking up.
    stats: () => Array.from({ length: 8 }, (_, k) => note(hz(k * 2, 784), 0.06, k * 0.05, 0.12, 'square', false)),
    // Projects intro: a door opening onto the work.
    work: () => burst(0, 0.9, 0.35, 200, 2400),
    // Deus Rex: a calm heartbeat and a monitor beep.
    deusrex: () => {
      [0, 0.22].forEach((w, k) => {
        if (!ctx) return;
        const t = ctx.currentTime + w;
        const o = ctx.createOscillator();
        o.frequency.setValueAtTime(k ? 70 : 85, t);
        o.frequency.exponentialRampToValueAtTime(40, t + 0.16);
        const g = ctx.createGain();
        env(g, t, 0.6, 0.008, 0.22);
        o.connect(g).connect(master);
        o.start(t);
        o.stop(t + 0.3);
      });
      note(988, 0.1, 0.55, 0.18, 'sine', false);
      note(988, 0.1, 1.55, 0.18, 'sine', false);
    },
    // Biblia: a church bell, twice.
    biblia: () => {
      bell(hz(0, 196), 0.22);
      bell(hz(7, 196), 0.14, 0.9);
    },
    // Cancionero: a guitar strum, G major.
    cancionero: () => [98, 123.47, 146.83, 196, 246.94, 392].forEach((f, k) => string(f, 0.55, k * 0.035)),
    // Hoy Vemos: a film projector rolling, then the "match" chime.
    hoyvemos: () => {
      for (let k = 0; k < 14; k++) burst(k * 0.055, 0.03, 0.25, 2500, 1800, 3);
      note(hz(0, 784), 0.16, 0.85, 0.6);
      note(hz(7, 784), 0.16, 1.0, 1.2);
    },
    // Services: a warm doorbell, come on in.
    services: () => {
      bell(hz(4, 392), 0.12);
      bell(hz(0, 392), 0.12, 0.45);
    },
    // Experience: a clock's tick-tock.
    path: () => {
      burst(0, 0.04, 0.4, 3200, 3000, 6);
      burst(0.5, 0.04, 0.35, 2200, 2000, 6);
    },
    // Toolbox: digital bleeps.
    skills: () => [0, 7, 12, 19, 24, 19].forEach((s, k) => note(hz(s, 523.25), 0.05, k * 0.07, 0.1, 'square', false)),
    // Music: the first chords of a ballad, G · D/F# · Em.
    music: () => {
      [[0, 4, 7], [-1, 2, 7], [-3, 4, 7]].forEach((ch, k) => ch.forEach((s, j) => string(hz(s, 196), 0.4, k * 0.9 + j * 0.03)));
    },
    // Contact: a message sent.
    contact: () => {
      burst(0, 0.5, 0.25, 600, 3000);
      note(hz(7, 784), 0.14, 0.35, 0.5, 'sine');
      note(hz(12, 784), 0.14, 0.48, 1.0, 'sine');
    },
  };

  return {
    toggle() {
      on = !on;
      if (on && !ctx) init();
      if (!ctx) return on;
      const t = ctx.currentTime;
      if (on) {
        ctx.resume();
        pad.gain.cancelScheduledValues(t);
        pad.gain.linearRampToValueAtTime(0.045, t + 2.5);
        scenes.hero();
      } else {
        pad.gain.cancelScheduledValues(t);
        pad.gain.linearRampToValueAtTime(0, t + 0.6);
      }
      return on;
    },
    pluck(i: number, vel = 0.5) {
      if (!on || !ctx) return;
      const now = performance.now();
      if (now - (lastAt.get(i) ?? 0) < 120) return;
      lastAt.set(i, now);
      note(SCALE[(i * 3) % SCALE.length], vel * 0.5);
    },
    scene(name: string) {
      if (!on || !ctx) return;
      scenes[name]?.();
    },
    whoosh() {
      if (!on || !ctx) return;
      burst(0, 0.85, 0.5, 300, 2800, 1.4);
    },
    tick(i: number) {
      if (!on || !ctx) return;
      note(SCALE[(SCALE.length - 1 - i) % SCALE.length] * 2, 0.12, 0, 0.35, 'sine');
    },
  };
}
