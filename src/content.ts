export type Lang = 'es' | 'en';

export const site = {
  url: 'https://migueblanco.com',
  email: 'contacto@migueblanco.com',
  linkedin: 'https://www.linkedin.com/in/mikews935',
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
    url: 'https://biblia.migueblanco.com',
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
    url: 'https://hoyvemos.migueblanco.com',
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
  promo?: Record<Lang, string>;
  metrics?: { n: string; l: Record<Lang, string> }[];
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
    company: 'Hoag Health System',
    role: { es: 'AI Engineer', en: 'AI Engineer' },
    promo: { es: 'AI Engineer desde septiembre 2026 · antes Senior Backend Engineer', en: 'AI Engineer since September 2026 · previously Senior Backend Engineer' },
    place: 'Remoto · California, EE. UU.',
    text: {
      es: 'Construyo IA clínica para una plataforma de telemedicina con comunicación en tiempo real entre pacientes y médicos. Integré AWS Bedrock para automatizar el triaje y orquesto agentes de IA en Python con las APIs del backend, con datos protegidos bajo HIPAA e integración con el EHR de Epic.',
      en: 'I build clinical AI for a telemedicine platform with real-time patient and provider communication. I integrated AWS Bedrock to automate triage and orchestrate Python AI agents with the backend APIs, with HIPAA-compliant data handling and Epic EHR integration.',
    },
    metrics: [
      { n: 'Bedrock', l: { es: 'triaje clínico automatizado', en: 'automated clinical triage' } },
      { n: 'HIPAA', l: { es: 'datos de pacientes protegidos', en: 'protected patient data' } },
    ],
    tags: ['Python', 'AWS Bedrock', 'AI agents', 'HIPAA', 'Epic EHR'],
  },
  {
    from: '2026',
    to: { es: 'Hoy', en: 'Now' },
    company: 'Deus Rex',
    role: { es: 'Fundador e ingeniero principal', en: 'Founder & lead engineer' },
    place: 'Envigado, CO',
    text: {
      es: 'Diseño, construyo y opero un SaaS de salud con IA de punta a punta: producto, arquitectura, infraestructura en AWS, agentes de IA, facturación electrónica y salida al mercado.',
      en: 'I design, build and run an AI healthcare SaaS end to end: product, architecture, AWS infrastructure, AI agents, e-invoicing and go-to-market.',
    },
    metrics: [
      { n: '1.700+', l: { es: 'commits en ocho meses', en: 'commits in eight months' } },
      { n: '3', l: { es: 'idiomas: español, inglés y portugués', en: 'languages: Spanish, English, Portuguese' } },
    ],
    tags: ['AI agents', 'AWS', 'Product'],
  },
  {
    from: '2022',
    to: { es: '2026', en: '2026' },
    company: 'Videate',
    role: { es: 'Senior Full-Stack Lead Engineer', en: 'Senior Full-Stack Lead Engineer' },
    place: 'Remoto · Texas, EE. UU.',
    text: {
      es: 'Lideré la reescritura completa del producto: la nueva experiencia redujo la curva de aprendizaje un 30 % y los hooks y componentes reutilizables subieron la eficiencia del equipo un 25 %. Construí y mantuve la API en Go y el paquete de WebSockets que conecta el dashboard con las máquinas de AWS.',
      en: 'Led the complete rewrite of the product: the new UX cut the learning curve by 30% and reusable hooks and components raised team efficiency by 25%. Built and maintained the Go API and the WebSocket package linking the dashboard to AWS machines.',
    },
    metrics: [
      { n: '-30 %', l: { es: 'curva de aprendizaje', en: 'learning curve' } },
      { n: '+25 %', l: { es: 'eficiencia del equipo', en: 'team efficiency' } },
    ],
    tags: ['React', 'TypeScript', 'Node', 'Go', 'WebSockets'],
  },
  {
    from: '2021',
    to: { es: '2022', en: '2022' },
    company: 'TEAM International',
    role: { es: 'Senior Frontend Engineer', en: 'Senior Frontend Engineer' },
    place: 'Medellín, CO',
    text: {
      es: 'Lideré un equipo de 4 desarrolladores en una plataforma de video educativo: sistema de autenticación, componentes de video y funcionalidades frontend escalables con React.',
      en: 'Led a team of 4 developers on a video education platform: authentication system, video components and scalable frontend features in React.',
    },
    metrics: [{ n: '4', l: { es: 'desarrolladores a cargo', en: 'developers led' } }],
    tags: ['React', 'JavaScript', 'Leadership'],
  },
  {
    from: '2019',
    to: { es: '2021', en: '2021' },
    company: 'Avantica',
    role: { es: 'Software Developer', en: 'Software Developer' },
    place: 'Panamá',
    text: {
      es: 'Diseñé y mantuve de punta a punta los módulos de onboarding, SSO y requisitos de Heylaika, una plataforma de cumplimiento normativo. Servicios backend en Python e interfaces en React.',
      en: 'Designed and maintained the end-to-end onboarding, SSO and requirements modules of Heylaika, a compliance platform. Backend services in Python and React UIs.',
    },
    tags: ['Python', 'React', 'SSO'],
  },
  {
    from: '2016',
    to: { es: '2019', en: '2019' },
    company: 'Condor Labs',
    role: { es: 'Software Developer', en: 'Software Developer' },
    place: 'Cartagena, CO',
    text: {
      es: 'Reconstruí aplicaciones con frameworks modernos de JavaScript para miles de profesionales de la salud en EE. UU. (Evercheck). Hice code reviews y guié técnicamente a los nuevos integrantes del equipo.',
      en: 'Rebuilt applications with modern JavaScript frameworks for thousands of US healthcare professionals (Evercheck). Did code reviews and gave technical guidance to new team members.',
    },
    metrics: [{ n: '1.000s', l: { es: 'profesionales de la salud en EE. UU.', en: 'US healthcare professionals' } }],
    tags: ['JavaScript', 'React', 'Node', 'AWS'],
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
    nav: { work: 'Proyectos', services: 'Servicios', path: 'Trayectoria', music: 'Música', contact: 'Contacto', switch: 'EN', switchHref: '/en/' },
    hero: {
      eyebrow: 'AI Engineer · Fundador de Deus Rex · Cantautor',
      sound: 'Enciende el sonido',
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
    path: { kicker: 'Trayectoria', title: 'De Cartagena al mundo', now: 'Hoy', years: 'años', scroll: 'Doce años en siete paradas' },
    edu: {
      title: 'Formación',
      items: [
        { y: '2026', t: 'Máster en Soluciones de IA Generativa', s: 'EUNEIZ · EBIS Business Techschool · España', d: 'Diseñar, automatizar y desplegar proyectos de IA generativa, de la idea a producción. Tesis: MarketMind AI, inteligencia comercial con agentes.', badge: 'En curso' },
        { y: '2016', t: 'Ingeniería de Sistemas', s: 'Tecnológico Comfenalco · Cartagena', d: 'Ingeniería aplicada: crear soluciones tecnológicas, resolver problemas complejos y llevar la innovación a las empresas.' },
        { y: '2013', t: 'Associate’s Degree in Computer Science', s: 'SUNY Broome · Binghamton, Nueva York', d: 'Dos años en Estados Unidos estudiando programación, resolución de problemas y sistemas de cómputo.' },
        { y: 'C2', t: 'Inglés certificado', s: 'EF SET', d: 'Nivel C2, el más alto del Marco Común Europeo.', href: 'https://www.efset.org/cert/SzoDbe' },
      ],
    },
    skills: { kicker: 'Caja de herramientas', title: 'Con qué construyo' },
    music: {
      kicker: 'Música',
      title: 'Para siempre',
      sub: 'Primer sencillo · Pop latino',
      date: 'Llega el 26 de noviembre de 2026',
      text: 'Mis canciones son momentos. «Para siempre» es el primero, y pronto vivirán todos en musica.migueblanco.com, con la historia detrás de cada una.',
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
    nav: { work: 'Work', services: 'Services', path: 'Experience', music: 'Music', contact: 'Contact', switch: 'ES', switchHref: '/' },
    hero: {
      eyebrow: 'AI Engineer · Founder of Deus Rex · Songwriter',
      sound: 'Turn the sound on',
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
    path: { kicker: 'Experience', title: 'From Cartagena to the world', now: 'Now', years: 'years', scroll: 'Twelve years in seven stops' },
    edu: {
      title: 'Education',
      items: [
        { y: '2026', t: 'Master’s in Generative AI Solutions', s: 'EUNEIZ · EBIS Business Techschool · Spain', d: 'Designing, automating and deploying generative AI projects from concept to production. Thesis: MarketMind AI, agent-based market intelligence.', badge: 'In progress' },
        { y: '2016', t: 'Bachelor’s in Systems Engineering', s: 'Tecnológico Comfenalco · Cartagena', d: 'Applied engineering: building technology solutions, solving complex problems and bringing innovation to companies.' },
        { y: '2013', t: 'Associate’s Degree in Computer Science', s: 'SUNY Broome · Binghamton, New York', d: 'Two years in the United States studying programming, problem solving and computer systems.' },
        { y: 'C2', t: 'Certified English', s: 'EF SET', d: 'C2, the highest level of the Common European Framework.', href: 'https://www.efset.org/cert/SzoDbe' },
      ],
    },
    skills: { kicker: 'Toolbox', title: 'What I build with' },
    music: {
      kicker: 'Music',
      title: 'Para siempre',
      sub: 'Debut single · Latin pop',
      date: 'Out November 26, 2026',
      text: 'My songs are moments. «Para siempre» is the first one, and soon they will all live at musica.migueblanco.com, with the story behind each.',
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

export const services = {
  es: {
    kicker: 'Servicios',
    title: 'Qué hago por ti',
    intro: 'Trabajo con empresas y equipos que necesitan llevar una idea a producción, meter IA donde de verdad sirve o poner orden en un producto que creció rápido.',
    proof: 'Prueba',
    cta: 'Cuéntame tu proyecto',
    items: [
      {
        t: 'IA aplicada y agentes',
        d: 'Agentes que atienden, agendan y deciden; RAG sobre tus documentos; voz; automatizaciones. Con evaluaciones y observabilidad para que no sea una demo bonita sino algo que funciona en producción.',
        p: 'Triaje clínico con AWS Bedrock en Hoag · Sarai en Deus Rex',
        tags: ['Claude', 'Bedrock AgentCore', 'RAG', 'Evals', 'ElevenLabs'],
      },
      {
        t: 'Software para salud',
        d: 'Historia clínica, agendamiento, telemedicina e integraciones, cumpliendo HIPAA en EE. UU. y la normativa colombiana (facturación DIAN, RIPS, Habeas Data).',
        p: 'Hoag Health System · Deus Rex · Evercheck',
        tags: ['HIPAA', 'Epic EHR', 'DIAN', 'RIPS'],
      },
      {
        t: 'Producto de punta a punta',
        d: 'De la idea al lanzamiento: arquitectura, frontend, backend, infraestructura en la nube y salida al mercado. Un solo responsable que entiende el negocio y el código.',
        p: 'Deus Rex, Biblia de Estudio y Hoy Vemos en 2026',
        tags: ['React', 'Node · Bun', 'AWS', 'Terraform', 'Vercel'],
      },
      {
        t: 'Liderazgo y modernización',
        d: 'Reescribir sistemas legados, pasar a microservicios o tiempo real, definir estándares y acompañar al equipo para que entregue más rápido y con menos errores.',
        p: 'Reescritura de Videate: -30 % curva de aprendizaje, +25 % eficiencia',
        tags: ['Arquitectura', 'Mentoría', 'Code review', 'WebSockets'],
      },
    ],
  },
  en: {
    kicker: 'Services',
    title: 'How I can help',
    intro: 'I work with companies and teams that need to take an idea to production, put AI where it actually helps, or bring order to a product that grew fast.',
    proof: 'Proof',
    cta: 'Tell me about your project',
    items: [
      {
        t: 'Applied AI and agents',
        d: 'Agents that answer, book and decide; RAG over your documents; voice; automations. With evals and observability, so it is not a pretty demo but something that works in production.',
        p: 'Clinical triage on AWS Bedrock at Hoag · Sarai at Deus Rex',
        tags: ['Claude', 'Bedrock AgentCore', 'RAG', 'Evals', 'ElevenLabs'],
      },
      {
        t: 'Healthcare software',
        d: 'Medical records, scheduling, telemedicine and integrations, compliant with HIPAA in the US and Colombian regulation (DIAN e-invoicing, RIPS, Habeas Data).',
        p: 'Hoag Health System · Deus Rex · Evercheck',
        tags: ['HIPAA', 'Epic EHR', 'DIAN', 'RIPS'],
      },
      {
        t: 'End-to-end product',
        d: 'From idea to launch: architecture, frontend, backend, cloud infrastructure and go-to-market. One owner who understands both the business and the code.',
        p: 'Deus Rex, Biblia de Estudio and Hoy Vemos in 2026',
        tags: ['React', 'Node · Bun', 'AWS', 'Terraform', 'Vercel'],
      },
      {
        t: 'Leadership and modernization',
        d: 'Rewriting legacy systems, moving to microservices or real time, setting standards and coaching the team to ship faster with fewer bugs.',
        p: 'Videate rewrite: -30% learning curve, +25% efficiency',
        tags: ['Architecture', 'Mentoring', 'Code review', 'WebSockets'],
      },
    ],
  },
};
