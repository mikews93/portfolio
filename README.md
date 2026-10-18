# migueblanco.com

Personal site of Miguel Blanco: software, AI and music. Spanish at `/`, English at `/en/`.

- **Astro 7** static site, no framework runtime
- **Three.js** particle field that morphs into a shape per section (`src/scripts/scene.ts`)
- **GSAP ScrollTrigger + Lenis** for the pinned project gallery, reveals and smooth scroll (`src/scripts/main.ts`)
- All copy lives in `src/content.ts` (both languages)

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
```

Respects `prefers-reduced-motion` and falls back to a CSS gradient without WebGL.
