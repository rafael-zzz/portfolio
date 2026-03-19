import type { DeepPartial, Messages } from "@/i18n/schema";

export const esMessages = {
  head: {
    title: "Portafolio de Raf",
    description:
      "Estudiante brasileño de ciencias de la computación enfocado en ciberseguridad, arquitectura de sistemas e ingeniería de software práctica.",
  },
  navigation: {
    toggleNavigationLabel: "Alternar navegación",
    terminalPathLabel: "./Portafolio de Raf",
    overviewLabel: "Resumen",
    writingLabel: "Escritos",
    projectsLabel: "Proyectos",
    githubLabel: "GitHub",
    linkedinLabel: "LinkedIn",
    languageSwitcherLabel: "Cambiar idioma",
  },
  sidebar: {
    title: "Explorador de Archivos",
    closeSidebarLabel: "Cerrar barra lateral",
    menu: {
      overview: "./resumen",
      writing: "escritos",
      projects: "proyectos",
      profiles: "perfiles",
      github: "./github",
      linkedin: "./linkedin",
    },
  },
  footer: {
    rightsReserved: "© 2026 Rafael. Todos los derechos reservados.",
  },
  contentFallback: {
    badge: "FALLBACK EN",
    title: "Contenido en inglés cargado",
    description: "Esta ruta aún no está localizada, así que estás viendo la versión en inglés.",
  },
  home: {
    hero: {
      title: "Resumen",
      heading: "Soy Rafael Peixoto",
      description:
        "Soy un estudiante brasileño de Ciencias de la Computación con enfoque en ciberseguridad y arquitectura de sistemas. Combino prácticas modernas de seguridad con desarrollo eficiente para crear soluciones de alto rendimiento. Actualmente exploro formas de conectar principios clásicos de computación con tecnología moderna.",
      imageAlt: "Animación de agujero negro",
    },
    featuredProjects: {
      title: "Proyectos Destacados",
      eyebrow: "/work/featured",
      summary: "Una vista compacta de los sistemas y experimentos que mejor representan mi trabajo técnico.",
      browseLabel: "Abrir Hub de Proyectos",
      repoLabel: "Repositorio",
      externalLabel: "Abrir Enlace",
      emptyLabel: "No hay proyectos destacados disponibles.",
    },
    featuredWriting: {
      title: "Escritos Destacados",
      eyebrow: "/writing/featured",
      summary: "Las notas, write-ups y entradas personales más recientes del archivo.",
      readMoreLabel: "Abrir Entrada",
      browseLabel: "Ver Escritos",
      emptyLabel: "No hay escritos disponibles todavía.",
    },
    motion: {
      first: [
        "seguridad",
        "pentester",
        "curioso de graficos",
        "curioso",
        "computacion cuantica",
        "inteligencia artificial",
        "ingeniero de software",
        "criptografia",
      ],
      second: [
        "enfoque total",
        "redes",
        "sistemas de bajo nivel",
        "amante de la musica",
        "solucionador de problemas",
        "entusiasta de SO",
        "builder",
        "admirador del ricing",
      ],
    },
    experience: {
      title: "Experiencia",
      eyebrow: "/sys/experience",
      places: [
        {
          company: "CISSA",
          role: "Investigador en Seguridad en Prácticas",
          period: "2026 - 2026",
          highlights: [
            "Colaboración en el desarrollo de un artículo técnico.",
            "Desarrollo de una herramienta escalable para medir la robustez frente a diferentes ataques adversariales en modelos de IA.",
            "Documentación robusta de modelado de amenazas frente a posibles vectores de ataque en infraestructuras críticas.",
          ],
        },
        {
          company: "Equipo de CTF 0xBit",
          role: "Líder, Reclutador, Miembro Activo",
          period: "2023 - Presente",
          highlights: [
            "Analisis de cadenas de exploit y patrones de mitigacion en laboratorios controlados.",
            "Colaboracion en resolucion de retos CTF. Siendo ellos: THM Advent of Cyber'24, srdnlen'25, srdnlen'26.",
            "Presentacion de hallazgos de seguridad y defensas practicas.",
          ],
        },
      ],
    },
    skills: {
      title: "Habilidades",
      eyebrow: "/sys/skills",
      learningLabel: "Aprendiendo",
    },
    cta: {
      title: "Perfiles",
      summary: "Abre los perfiles públicos donde mantengo código, escritura y contexto profesional.",
      githubLabel: "GitHub",
      linkedinLabel: "LinkedIn",
    },
  },
  writing: {
    page: {
      title: "Escritos",
      eyebrow: "/writing/index",
      summary: "Notas largas, write-ups técnicos y entradas personales sobre seguridad, sistemas e ingeniería práctica.",
      readMoreLabel: "Abrir Entrada",
      emptyLabel: "No hay escritos disponibles todavía.",
      tagsLabel: "Etiquetas",
    },
  },
  projects: {
    page: {
      title: "Proyectos",
      eyebrow: "/projects/index",
      summary: "Tarjetas externas de proyectos con foco en el problema, el rol técnico, la stack y dónde inspeccionar el trabajo.",
      repoLabel: "Repositorio",
      externalLabel: "Enlace Externo",
      statusLabel: "Estado",
      stackLabel: "Stack",
      yearLabel: "Ano",
      roleLabel: "Rol",
      emptyLabel: "No hay proyectos disponibles todavía.",
    },
  },
} satisfies DeepPartial<Messages>;
