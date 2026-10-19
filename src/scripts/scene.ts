import * as THREE from 'three';
import type { Shape } from '../content';

/**
 * One particle field, many shapes. Every section of the page names a shape
 * (data-shape) and a color; as you scroll, the particles flow from one shape
 * to the next. Blending happens on the CPU (cheap for ~16k points) so any two
 * shapes can follow each other; the shader adds drift, scatter and glow.
 */

export type Stop = { y: number; shape: Shape; c1: THREE.Color; c2: THREE.Color; x: number; yo: number; s: number; a: number };

const rand = (a = -1, b = 1) => a + Math.random() * (b - a);
const TAU = Math.PI * 2;

function sampleText(n: number, text: string): Float32Array {
  const W = 1200;
  const H = 520;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d', { willReadFrequently: true })!;
  g.fillStyle = '#fff';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.font = `900 470px "Archivo Variable", "Arial Black", sans-serif`;
  g.fillText(text, W / 2, H / 2 + 20);
  const data = g.getImageData(0, 0, W, H).data;
  const pts: number[] = [];
  for (let y = 0; y < H; y += 3) for (let x = 0; x < W; x += 3) if (data[(y * W + x) * 4 + 3] > 128) pts.push(x, y);
  const out = new Float32Array(n * 3);
  const count = pts.length / 2;
  for (let i = 0; i < n; i++) {
    const k = Math.floor(Math.random() * count) * 2;
    out[i * 3] = ((pts[k] + rand(-1.5, 1.5)) / W - 0.5) * 5.6;
    out[i * 3 + 1] = -((pts[k + 1] + rand(-1.5, 1.5)) / H - 0.5) * 2.45;
    out[i * 3 + 2] = rand(-0.18, 0.18);
  }
  return out;
}

function build(shape: Shape, n: number): Float32Array {
  const o = new Float32Array(n * 3);
  const set = (i: number, x: number, y: number, z: number) => {
    o[i * 3] = x;
    o[i * 3 + 1] = y;
    o[i * 3 + 2] = z;
  };
  for (let i = 0; i < n; i++) {
    const u = i / n;
    switch (shape) {
      case 'galaxy': {
        const arm = i % 3;
        const r = Math.pow(Math.random(), 0.6) * 3.2;
        const a = r * 1.15 + (arm / 3) * TAU + rand(-0.25, 0.25) * (1 + r * 0.2);
        const y = rand(-0.12, 0.12) * (1.6 - r * 0.4);
        const x = Math.cos(a) * r;
        const z = Math.sin(a) * r;
        // Tilt the disc ~60° so the arms face the viewer.
        set(i, x, y * 0.5 - z * 0.87, y * 0.87 + z * 0.5);
        break;
      }
      case 'sphere': {
        const phi = Math.acos(1 - 2 * (i + 0.5) / n);
        const th = Math.PI * (1 + Math.sqrt(5)) * i;
        const r = 1.75 + (Math.random() < 0.12 ? rand(0.1, 0.9) : rand(-0.03, 0.03));
        set(i, Math.cos(th) * Math.sin(phi) * r, Math.cos(phi) * r, Math.sin(th) * Math.sin(phi) * r);
        break;
      }
      case 'torus': {
        // (2,5) torus knot wrapped in a soft tube: Deus Rex.
        const t = u * TAU;
        const p = 2;
        const q = 5;
        const R = 1.35 + 0.55 * Math.cos(q * t);
        const cx = R * Math.cos(p * t);
        const cy = R * Math.sin(p * t);
        const cz = 0.55 * Math.sin(q * t);
        const tr = 0.16 * Math.sqrt(Math.random());
        const a = rand(0, TAU);
        set(i, cx + Math.cos(a) * tr, cy + Math.sin(a) * tr, cz + rand(-tr, tr));
        break;
      }
      case 'book': {
        // An open book seen from above: curled pages filled with rows of "text".
        const side = i % 2 ? 1 : -1;
        let x: number;
        let y: number;
        if (Math.random() < 0.15) {
          // page outline
          const e = Math.random();
          if (e < 0.5) [x, y] = [rand(0, 2.1), Math.random() < 0.5 ? -1.45 : 1.45];
          else [x, y] = [2.1, rand(-1.45, 1.45)];
        } else {
          const row = Math.floor(Math.random() * 20);
          x = 0.2 + Math.random() * (row % 7 === 6 ? 1.0 : 1.75);
          y = 1.25 - row * 0.13 + rand(-0.012, 0.012);
        }
        const z = 0.5 * Math.sin((x / 2.1) * Math.PI * 0.9) - 0.25;
        // Tilt back ~35° so we look down onto the pages.
        set(i, side * (x + 0.03), y * 0.82 - z * 0.57, y * 0.57 + z * 0.82);
        break;
      }
      case 'wave': {
        const gx = rand(-3.2, 3.2);
        const gz = rand(-1.6, 1.6);
        const y = 0.45 * Math.sin(gx * 1.6) * Math.cos(gz * 1.2) + 0.25 * Math.sin(gx * 3.1 + gz);
        set(i, gx, y, gz);
        break;
      }
      case 'venn': {
        const side = i % 2 ? 1 : -1;
        const a = rand(0, TAU);
        const edge = Math.random() < 0.7;
        const r = edge ? 1.35 + rand(-0.04, 0.04) : 1.35 * Math.sqrt(Math.random());
        set(i, side * 0.75 + Math.cos(a) * r, Math.sin(a) * r, rand(-0.12, 0.12));
        break;
      }
      case 'rings': {
        // Two interlocked wedding rings: Para siempre.
        const which = i % 2;
        const a = rand(0, TAU);
        const b = rand(0, TAU);
        const R = 1.05;
        const r = 0.13 * Math.sqrt(Math.random());
        const x = (R + r * Math.cos(b)) * Math.cos(a);
        const y = (R + r * Math.cos(b)) * Math.sin(a);
        const z = r * Math.sin(b);
        if (which) set(i, x - 0.55, y, z);
        else set(i, x + 0.55, z, y);
        break;
      }
      case 'helix': {
        const strand = i % 3;
        const t = rand(-1, 1);
        const a = t * TAU * 1.6 + (strand === 1 ? Math.PI : 0);
        if (strand === 2) {
          // rungs
          const k = Math.round(t * 18) / 18;
          const aa = k * TAU * 1.6;
          const m = rand(-1, 1);
          set(i, Math.cos(aa) * 0.85 * m, k * 3, Math.sin(aa) * 0.85 * m);
        } else set(i, Math.cos(a) * 0.85 + rand(-0.05, 0.05), t * 3, Math.sin(a) * 0.85 + rand(-0.05, 0.05));
        break;
      }
      default:
        set(i, rand(-3, 3), rand(-2, 2), rand(-2, 2));
    }
  }
  return o;
}

const vert = /* glsl */ `
  attribute float aRand;
  uniform float uTime;
  uniform float uSize;
  uniform float uScatter;
  uniform vec2 uMouse;
  uniform vec3 uC1;
  uniform vec3 uC2;
  uniform float uAlpha;
  uniform vec3 uPointer;
  uniform float uRepel;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    float t = uTime * 0.5 + aRand * 6.2831;
    p += vec3(sin(t + p.y * 1.7), cos(t * 1.3 + p.x * 1.4), sin(t * 0.8 + p.z * 1.9)) * 0.035;
    vec3 dir = normalize(p + vec3(0.0001));
    p += dir * uScatter * (0.4 + aRand * 1.6);
    p += vec3(sin(t * 2.0), cos(t * 1.7), sin(t * 1.3)) * uScatter * 0.25;
    // The cursor (or a finger) parts the particles like a hand through sand.
    vec2 dd = p.xy - uPointer.xy;
    float push = smoothstep(1.7, 0.0, length(dd)) * uRepel;
    p.xy += normalize(dd + 0.0001) * push * (0.6 + aRand * 0.7);
    p.z += push * (0.3 + aRand * 0.6);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    // Points near the pointer swell a little.
    vec4 clip = projectionMatrix * mv;
    vec2 ndc = clip.xy / clip.w;
    float near = smoothstep(0.35, 0.0, distance(ndc, uMouse));
    gl_PointSize = uSize * (0.55 + aRand * 0.9) * (1.0 + near * 1.6) / -mv.z;
    gl_Position = clip;
    vColor = mix(uC1, uC2, smoothstep(0.2, 0.9, aRand)) + near * 0.25;
    vAlpha = (0.55 + aRand * 0.45) * uAlpha;
  }
`;

const frag = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    a *= a;
    gl_FragColor = vec4(vColor, a * vAlpha * 0.6);
  }
`;

export function createScene(canvas: HTMLCanvasElement, opts: { reduced: boolean }) {
  const mobile = matchMedia('(max-width: 820px)').matches;
  const N = mobile ? 7000 : 16000;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.5 : 1.75));
  renderer.setClearColor(0x0a0a0c, 1);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 14);

  const shapes = new Map<Shape, Float32Array>();
  const get = (s: Shape) => {
    if (!shapes.has(s)) shapes.set(s, s === 'monogram' ? sampleText(N, 'MB') : build(s, N));
    return shapes.get(s)!;
  };

  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(N * 3);
  pos.set(get('monogram'));
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const r = new Float32Array(N);
  for (let i = 0; i < N; i++) r[i] = Math.random();
  geo.setAttribute('aRand', new THREE.BufferAttribute(r, 1));

  const uniforms = {
    uTime: { value: 0 },
    uSize: { value: (mobile ? 46 : 58) * renderer.getPixelRatio() },
    uScatter: { value: 0 },
    uMouse: { value: new THREE.Vector2(9, 9) },
    uC1: { value: new THREE.Color('#ff4a3d') },
    uC2: { value: new THREE.Color('#f1ece4') },
    uAlpha: { value: 1 },
    uPointer: { value: new THREE.Vector3(99, 99, 0) },
    uRepel: { value: 0 },
  };
  const mat = new THREE.ShaderMaterial({
    vertexShader: vert,
    fragmentShader: frag,
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(geo, mat);
  const group = new THREE.Group();
  group.add(points);
  scene.add(group);

  const ray = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const hit = new THREE.Vector3();
  const ndc = new THREE.Vector2();
  let active = 0;
  let baseZ = 9;

  let stops: Stop[] = [];
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let intro = opts.reduced ? 1 : 0;
  let last = performance.now();
  let spin = 0;
  let time = 0;
  const c1 = new THREE.Color();
  const c2 = new THREE.Color();

  function resize() {
    const w = innerWidth;
    const h = innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Keep shapes framed on narrow screens.
    baseZ = w < 820 ? 13 : 9;
    camera.updateProjectionMatrix();
  }
  resize();
  addEventListener('resize', resize);
  addEventListener('pointermove', (e) => {
    pointer.tx = (e.clientX / innerWidth) * 2 - 1;
    pointer.ty = -(e.clientY / innerHeight) * 2 + 1;
    active = 1;
  });
  const idle = () => (active = 0);
  addEventListener('pointerup', (e) => e.pointerType !== 'mouse' && idle());
  addEventListener('pointercancel', idle);
  document.documentElement.addEventListener('pointerleave', idle);

  function frame() {
    const now = performance.now();
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    time += dt;
    uniforms.uTime.value = time;
    intro = Math.min(1, intro + dt * 0.55);

    // Where are we between two stops?
    const y = scrollY;
    let i = 0;
    while (i < stops.length - 2 && y >= stops[i + 1].y) i++;
    const a = stops[i];
    const b = stops[i + 1] ?? a;
    let raw = b === a ? 0 : (y - a.y) / (b.y - a.y);
    raw = Math.min(1, Math.max(0, raw));
    const k = raw <= 0.2 ? 0 : raw >= 0.8 ? 1 : (() => { const x = (raw - 0.2) / 0.6; return x * x * (3 - 2 * x); })();

    if (a) {
      const A = get(a.shape);
      const B = get(b.shape);
      if (k === 0) pos.set(A);
      else if (k === 1) pos.set(B);
      else for (let j = 0; j < pos.length; j++) pos[j] = A[j] + (B[j] - A[j]) * k;
      geo.attributes.position.needsUpdate = true;
      c1.copy(a.c1).lerp(b.c1, k);
      c2.copy(a.c2).lerp(b.c2, k);
      uniforms.uC1.value.lerp(c1, 0.12);
      uniforms.uC2.value.lerp(c2, 0.12);
      const ox = a.x + (b.x - a.x) * k;
      const sc = a.s + (b.s - a.s) * k;
      uniforms.uAlpha.value += (a.a + (b.a - a.a) * k - uniforms.uAlpha.value) * 0.1;
      // Offsets were tuned at 16:10; narrower screens pull shapes toward the centre.
      const fit = Math.min(1.2, Math.max(0.55, camera.aspect / 1.6));
      group.position.x += (ox * fit - group.position.x) * 0.08;
      const oy = a.yo + (b.yo - a.yo) * k;
      group.position.y += (oy - group.position.y) * 0.08;
      const s = sc * (0.6 + 0.4 * easeOut(intro));
      group.scale.setScalar(s);
    }
    const morph = Math.sin(k * Math.PI);
    uniforms.uScatter.value = morph * 0.9 + (1 - easeOut(intro)) * 2.5;

    pointer.x += (pointer.tx - pointer.x) * 0.06;
    pointer.y += (pointer.ty - pointer.y) * 0.06;
    uniforms.uMouse.value.set(pointer.tx, pointer.ty);
    // Free shapes spin; the monogram settles facing the camera.
    const cur = k > 0.5 ? b : a;
    if (cur?.shape === 'monogram') {
      const home = Math.round(spin / TAU) * TAU;
      spin += (home - spin) * 0.05;
    } else if (!opts.reduced) spin += dt * 0.08;
    group.rotation.y = spin + pointer.x * 0.3 + (cur?.shape === 'monogram' ? Math.sin(time * 0.4) * 0.08 : 0);
    group.rotation.x = -pointer.y * 0.2 + (cur?.shape === 'wave' ? 0.35 : 0);

    // Fly through the cloud while it changes shape.
    const targetZ = baseZ - morph * 2.6 + (1 - easeOut(intro)) * 5;
    camera.position.z += (targetZ - camera.position.z) * 0.1;

    // Pointer in the group's own space, for the repel field.
    group.updateMatrixWorld();
    ndc.set(pointer.tx, pointer.ty);
    ray.setFromCamera(ndc, camera);
    plane.constant = -group.position.z;
    if (ray.ray.intersectPlane(plane, hit)) uniforms.uPointer.value.copy(group.worldToLocal(hit));
    uniforms.uRepel.value += ((opts.reduced ? 0 : active) - uniforms.uRepel.value) * 0.08;

    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }

  function easeOut(x: number) {
    return 1 - Math.pow(1 - x, 3);
  }

  return {
    setStops(s: Stop[]) {
      stops = s.sort((p, q) => p.y - q.y);
    },
    start() {
      requestAnimationFrame(frame);
    },
    warm(list: Shape[]) {
      for (const s of list) get(s);
    },
  };
}
