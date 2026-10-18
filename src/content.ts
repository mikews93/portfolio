export type Lang = 'es' | 'en';

export const site = {
  url: 'https://migueblanco.com',
  email: 'mbtechorg@gmail.com',
  phone: '+57 300 732 3102',
  whatsapp: 'https://wa.me/573007323102',
  github: 'https://github.com/mikews93',
};

/** Scene shapes the WebGL particle field morphs into (see src/scripts/scene.ts). */
export type Shape = 'monogram' | 'galaxy' | 'torus' | 'book' | 'wave' | 'venn' | 'rings' | 'helix' | 'sphere';

export type Project = {
  id: string;
  name: string;
  shape: Shape;
  color: string;
  accent: string;
  year: string;
  url?: string;
  status: Record<Lang, string>;
  kicker: Record<Lang, string>;
  pitch: Record<Lang, string>;
  points: Record<Lang, string[]>;
  stack: string[];
};

export const projects: Project[] = [
  {
    id: 'deusrex',
    name: 'Deus Rex',
    shape: 'torus',
    color: '#2FC7A0',
    accent: '#12876B',
    year: '2026',
    url: 'https://deusrex.io',
    status: { es: 'En producción', en: 'Live in production' },
    kicker: { es: 'SaaS con IA para clínicas', en: 'AI SaaS for clinics' },
    pitch: {
      es: 'La plataforma todo en uno para profesionales de la salud en Latinoamérica: historia clínica, agenda, facturación DIAN, sitio web y una asistente de IA que atiende WhatsApp e Instagram.',
      en: 'The all-in-one platform for healthcare professionals in Latin America: medical records, scheduling, DIAN e-invoicing, websites and an AI assistant that answers WhatsApp and Instagram.',
    },
    points: {
      es: [
        'Escriba médico con IA: dictas la consulta y redacta la historia, los diagnósticos CIE-10 y la fórmula',
        'Sarai, agente de IA en WhatsApp, Instagram y voz que responde, agenda y cobra',
        'Constructor de sitios web con IA que publica en S3 + CloudFront',
        'Multi-tenant, hexagonal y con ~1.700 commits en ocho meses',
      ],
      en: [
        'AI medical scribe: dictate the visit and it drafts the record, ICD-10 codes and prescription',
        'Sarai, an AI agent on WhatsApp, Instagram and voice that answers, books and collects',
        'AI website builder that publishes to S3 + CloudFront',
        'Multi-tenant, hexagonal, ~1,700 commits in eight months',
      ],
    },
    stack: ['Bun', 'NestJS', 'tRPC', 'React 19', 'Postgres', 'Claude', 'Bedrock AgentCore', 'ElevenLabs', 'Terraform', 'ECS'],
  },
  {
    id: 'biblia',
    name: 'Biblia de Estudio',
    shape: 'book',
    color: '#E8A06A',
    accent: '#B4501A',
    year: '2026',
    url: 'https://biblia-de-estudio-eight.vercel.app',
    status: { es: 'Beta pública', en: 'Public beta' },
    kicker: { es: 'Estudio bíblico profundo con IA', en: 'Deep Bible study with AI' },
    pitch: {
      es: 'Tan simple como una app de lectura, tan profunda como una biblioteca de seminario. Griego y hebreo palabra por palabra, comentarios clásicos y un estudio con IA que cita cada versículo.',
      en: 'As simple as a reading app, as deep as a seminary library. Word-by-word Greek and Hebrew, classic commentaries and an AI study that cites every verse.',
    },
    points: {
      es: [
        'Interlineal griego y hebreo con números Strong y gramática',
        '«Estudiar con IA»: estudios citados, preguntas, pódcast, mapa mental y tarjetas',
        'Genealogías, mapas, línea de tiempo y referencias cruzadas',
        'Una sola base de código para iOS, Android y web',
      ],
      en: [
        'Greek and Hebrew interlinear with Strong’s numbers and grammar',
        '“Study with AI”: cited studies, Q&A, podcast, mind map and flashcards',
        'Genealogies, maps, timeline and cross-references',
        'One codebase for iOS, Android and the web',
      ],
    },
    stack: ['Expo', 'React Native', 'Vercel', 'Neon Postgres', 'Claude', 'Python data pipeline'],
  },
  {
    id: 'cancionero',
    name: 'Cancionero',
    shape: 'wave',
    color: '#4F6BFF',
    accent: '#2340D8',
    year: '2026',
    status: { es: 'Herramienta privada', en: 'Private tool' },
    kicker: { es: 'Estudio de composición con IA', en: 'AI songwriting studio' },
    pitch: {
      es: 'Mi taller de composición convertido en software: de la idea a la canción publicada, con métrica, rima, acordes, maquetas con IA y Claude como coautor.',
      en: 'My songwriting workshop turned into software: from idea to released song, with meter, rhyme, chords, AI demos and Claude as co-writer.',
    },
    points: {
      es: [
        'Motor de sílabas y rimas en español que entiende acordes',
        'Maquetas con ElevenLabs Music, Lyria y modelos locales',
        'Videos con letra sincronizada en el navegador y exportación .lrc',
        'Checklist de lanzamiento, derechos y plan de promoción',
      ],
      en: [
        'Spanish syllable and rhyme engine that understands chords',
        'Demos with ElevenLabs Music, Lyria and local models',
        'In-browser synced lyric videos with .lrc export',
        'Release checklist, rights tracking and promo plan',
      ],
    },
    stack: ['Node 22', 'Express 5', 'React 19', 'Vite', 'Claude', 'ElevenLabs', 'Tailscale'],
  },
  {
    id: 'hoyvemos',
    name: 'Hoy Vemos',
    shape: 'venn',
    color: '#FF7A5C',
    accent: '#F2B544',
    year: '2026',
    url: 'https://hoy-vemos-flame.vercel.app',
    status: { es: 'App instalable', en: 'Installable app' },
    kicker: { es: 'Qué ver hoy en pareja', en: 'What to watch tonight, together' },
    pitch: {
      es: 'Se acabó la media hora eligiendo película. Cada día una lista corta de lo mejor en tus plataformas; los dos votan deslizando y cuando coinciden, a ver.',
      en: 'No more half hour picking a movie. Every day a short list of the best on your platforms; you both swipe and when you match, press play.',
    },
    points: {
      es: [
        'Votación tipo swipe con «¡Coinciden!» en tiempo real',
        'Aprende los gustos de cada uno a partir de sus votos',
        'IMDb, Rotten Tomatoes y Metacritic en una sola ficha',
        'Hogares sincronizados entre teléfonos con Supabase Realtime',
      ],
      en: [
        'Swipe voting with a real-time “It’s a match!”',
        'Learns each person’s taste from their votes',
        'IMDb, Rotten Tomatoes and Metacritic on one card',
        'Households synced across phones with Supabase Realtime',
      ],
    },
    stack: ['React 19', 'Vite', 'Supabase', 'Postgres RLS', 'Vercel', 'TMDB', 'PWA'],
  },
];

export type Job = {
  from: string;
  to: Record<Lang, string>;
  company: string;
  role: Record<Lang, string>;
  place: string;
  text: Record<Lang, string>;
  tags: string[];
};

export const jobs: Job[] = [
  {
    from: '2026',
    to: { es: 'Hoy', en: 'Now' },
    company: 'Deus Rex · MB Technology Solutions',
    role: { es: 'Fundador e ingeniero principal', en: 'Founder & lead engineer' },
    place: 'Envigado, CO',
    text: {
      es: 'Diseño, construyo y opero un SaaS de salud con IA de punta a punta: producto, arquitectura, infraestructura en AWS, agentes de IA, facturación electrónica y salida al mercado.',
      en: 'I design, build and run an AI healthcare SaaS end to end: product, architecture, AWS infrastructure, AI agents, e-invoicing and go-to-market.',
    },
    tags: ['AI agents', 'AWS', 'Product'],
  },
  {
    from: '2022',
    to: { es: 'Hoy', en: 'Now' },
    company: 'Videate Inc.',
    role: { es: 'Senior Full Stack · Tech Lead', en: 'Senior Full Stack · Tech Lead' },
    place: 'Remoto · EE. UU.',
    text: {
      es: 'Contratado directamente tras liderar su equipo desde TEAM International. Reconstruí el dashboard desde cero (diseño, propuesta técnica y producción) y creé el paquete de WebSockets que conecta el dashboard, las máquinas de AWS y la extensión de Chrome en tiempo real.',
      en: 'Hired directly after leading their team through TEAM International. Rebuilt the dashboard from scratch (design, technical proposal, production) and built the WebSocket package that links the dashboard, AWS machines and the Chrome extension in real time.',
    },
    tags: ['React', 'TypeScript', 'Go', 'WebSockets'],
  },
  {
    from: '2019',
    to: { es: '2022', en: '2022' },
    company: 'TEAM International',
    role: { es: 'Senior Software Developer', en: 'Senior Software Developer' },
    place: 'Medellín, CO',
    text: {
      es: 'Arrive Logistics (carga en EE. UU.), CIDDAP (facturas con OCR e IA, arquitectura frontend desde cero), Indigo (financiación agrícola en Brasil y Argentina) y Videate, donde lideré un equipo de 4 y diseñé su API en Go.',
      en: 'Arrive Logistics (US freight), CIDDAP (OCR + AI invoicing, frontend architecture from scratch), Indigo (ag financing in Brazil and Argentina) and Videate, where I led a team of 4 and designed their Go API.',
    },
    tags: ['React', 'GraphQL', 'Node', 'Azure'],
  },
  {
    from: '2016',
    to: { es: '2019', en: '2019' },
    company: 'Condor Labs',
    role: { es: 'Software Developer', en: 'Software Developer' },
    place: 'Cartagena, CO',
    text: {
      es: 'Evercheck verifica las licencias de miles de profesionales de la salud en EE. UU. Lideré migraciones de sistemas legados a microservicios y nuevas arquitecturas, hice code reviews y formé a nuevos colegas.',
      en: 'Evercheck verifies the licenses of thousands of US healthcare professionals. I led migrations from legacy systems to microservices, did code reviews and mentored new colleagues.',
    },
    tags: ['Node', 'React', 'AWS', 'Microservices'],
  },
  {
    from: '2014',
    to: { es: '2016', en: '2016' },
    company: 'Xoftix · Comfenalco · New Minds',
    role: { es: 'Desarrollador', en: 'Developer' },
    place: 'Cartagena, CO',
    text: {
      es: 'Mensajería en tiempo real para el sistema judicial de Panamá (Temix), el módulo de becas de una universidad (AMSYS) y un punto de venta para Veneplast.',
      en: 'Real-time messaging for Panama’s judicial system (Temix), a university scholarship module (AMSYS) and a point of sale for Veneplast.',
    },
    tags: ['Java', 'C#', 'SQL'],
  },
];

export const t = {
  es: {
    meta: {
      title: 'Migue Blanco · Software, IA y música',
      description:
        'Ingeniero de software con más de 12 años construyendo productos. Fundador de Deus Rex. Hago software con IA y canciones que se quedan.',
    },
    nav: { work: 'Proyectos', path: 'Trayectoria', music: 'Música', contact: 'Contacto', switch: 'EN', switchHref: '/en/' },
    hero: {
      eyebrow: 'Ingeniero de software · Fundador de Deus Rex · Cantautor',
      line1: 'Construyo',
      line2: 'software que',
      line3: 'piensa',
      tail: 'y canciones que se quedan.',
      scroll: 'Desliza',
      where: 'Envigado, Colombia · Remoto para el mundo',
    },
    manifesto:
      'Doce años convirtiendo problemas difíciles en productos que la gente usa a diario. Hoy diseño agentes de IA, plataformas multi-tenant y apps que caben en un bolsillo, de la arquitectura al último pixel.',
    stats: [
      { n: 12, suffix: '+', label: 'años construyendo software' },
      { n: 4, suffix: '', label: 'productos propios en 2026' },
      { n: 1700, suffix: '+', label: 'commits en Deus Rex' },
      { n: 2, suffix: '', label: 'idiomas: español nativo, inglés C2' },
    ],
    work: { kicker: 'Proyectos recientes', title: 'Cosas que estoy construyendo', visit: 'Visitar', private: 'Uso privado', drag: 'Sigue bajando' },
    path: { kicker: 'Trayectoria', title: 'De Cartagena al mundo' },
    edu: {
      title: 'Formación',
      items: [
        { y: '2026', t: 'Máster en Ingeniería y Desarrollo de Soluciones de IA Generativa', s: 'EBIS Business Techschool' },
        { y: '', t: 'Associate’s Degree in Computer Science', s: 'SUNY Broome · Nueva York' },
        { y: '', t: 'Ingeniería de Sistemas', s: 'Tecnológico Comfenalco · Cartagena' },
      ],
    },
    skills: { kicker: 'Caja de herramientas', title: 'Con qué construyo' },
    music: {
      kicker: 'Música',
      title: 'Para siempre',
      sub: 'Primer sencillo · Pop latino',
      date: 'Llega el 26 de noviembre de 2026',
      text: 'Una canción para la persona que uno escoge todos los días. Mi primer sencillo como intérprete.',
      soon: 'Próximamente en todas las plataformas',
    },
    contact: {
      kicker: 'Contacto',
      title: 'Hablemos',
      text: '¿Tienes un producto por construir, un equipo por liderar o una idea con IA? Escríbeme.',
      email: 'Escríbeme',
      wa: 'WhatsApp',
    },
    footer: 'Hecho a mano con Astro, Three.js y GSAP.',
  },
  en: {
    meta: {
      title: 'Migue Blanco · Software, AI & music',
      description:
        'Software engineer with 12+ years building products. Founder of Deus Rex. I make AI software and songs that stay.',
    },
    nav: { work: 'Work', path: 'Experience', music: 'Music', contact: 'Contact', switch: 'ES', switchHref: '/' },
    hero: {
      eyebrow: 'Software engineer · Founder of Deus Rex · Songwriter',
      line1: 'I build',
      line2: 'software that',
      line3: 'thinks',
      tail: 'and songs that stay.',
      scroll: 'Scroll',
      where: 'Envigado, Colombia · Remote worldwide',
    },
    manifesto:
      'Twelve years turning hard problems into products people use every day. Today I design AI agents, multi-tenant platforms and apps that fit in a pocket, from the architecture to the last pixel.',
    stats: [
      { n: 12, suffix: '+', label: 'years building software' },
      { n: 4, suffix: '', label: 'own products shipped in 2026' },
      { n: 1700, suffix: '+', label: 'commits on Deus Rex' },
      { n: 2, suffix: '', label: 'languages: native Spanish, C2 English' },
    ],
    work: { kicker: 'Recent work', title: 'Things I’m building', visit: 'Visit', private: 'Private use', drag: 'Keep scrolling' },
    path: { kicker: 'Experience', title: 'From Cartagena to the world' },
    edu: {
      title: 'Education',
      items: [
        { y: '2026', t: 'Master’s in Generative AI Engineering', s: 'EBIS Business Techschool' },
        { y: '', t: 'Associate’s Degree in Computer Science', s: 'SUNY Broome · New York' },
        { y: '', t: 'Systems Engineering', s: 'Tecnológico Comfenalco · Cartagena' },
      ],
    },
    skills: { kicker: 'Toolbox', title: 'What I build with' },
    music: {
      kicker: 'Music',
      title: 'Para siempre',
      sub: 'Debut single · Latin pop',
      date: 'Out November 26, 2026',
      text: 'A song for the person you choose every day. My debut single as a performer.',
      soon: 'Coming soon to every platform',
    },
    contact: {
      kicker: 'Contact',
      title: 'Let’s talk',
      text: 'Got a product to build, a team to lead or an AI idea? Write to me.',
      email: 'Email me',
      wa: 'WhatsApp',
    },
    footer: 'Handmade with Astro, Three.js and GSAP.',
  },
} as const;

export const skills = [
  { g: 'AI', items: ['Claude API', 'Bedrock AgentCore', 'Agents & tools', 'RAG', 'Prompt evals', 'ElevenLabs', 'Veo', 'Langfuse'] },
  { g: 'Frontend', items: ['React 19', 'TypeScript', 'Astro', 'React Native · Expo', 'Three.js', 'GSAP', 'Tailwind'] },
  { g: 'Backend', items: ['Node · Bun', 'NestJS', 'tRPC', 'GraphQL', 'Go', 'Python · FastAPI', 'WebSockets'] },
  { g: 'Data & Cloud', items: ['Postgres', 'Drizzle', 'Supabase', 'AWS', 'Terraform', 'ECS Fargate', 'Vercel'] },
];

export const lyrics = [
  'Así tomados de la mano,',
  'como testigo nuestro Dios.',
  'Quiero decirte que te amo,',
  'que tú eres mi gran bendición.',
];
