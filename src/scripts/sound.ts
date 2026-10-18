/**
 * Opt-in UI sound, synthesised live with the Web Audio API (no audio files).
 * Hovers pluck notes from a G-major pentatonic; settling on a new section
 * plays a soft chord. Nothing sounds until the visitor turns it on.
 */
const SCALE = [196.0, 220.0, 246.94, 293.66, 329.63, 392.0, 440.0, 493.88, 587.33, 659.25, 783.99];

export function createSound() {
  let ctx: AudioContext | null = null;
  let master: GainNode;
  let wet: GainNode;
  let on = false;
  const lastAt = new Map<number, number>();

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
  }

  function note(freq: number, vel: number, when = 0, len = 1.1, type: OscillatorType = 'triangle') {
    if (!ctx) return;
    const t = ctx.currentTime + when;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vel, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    o.connect(g);
    g.connect(master);
    g.connect(wet);
    o.start(t);
    o.stop(t + len + 0.05);
  }

  return {
    toggle() {
      on = !on;
      if (on && !ctx) init();
      if (on) {
        ctx?.resume();
        [0, 2, 4].forEach((d, k) => note(SCALE[d + 3], 0.25, k * 0.07, 1.8));
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
    chord(i: number) {
      if (!on || !ctx) return;
      const root = i % 5;
      [0, 2, 4].forEach((d, k) => note(SCALE[root + d] / 2, 0.16, k * 0.04, 2.4, 'sine'));
    },
  };
}
