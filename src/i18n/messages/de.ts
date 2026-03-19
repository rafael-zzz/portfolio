import type { DeepPartial, Messages } from "@/i18n/schema";

export const deMessages = {
  head: {
    title: "Rafs Portfolio",
    description:
      "Brasilianischer Informatikstudent mit Fokus auf Cybersicherheit, Systemarchitektur und praxisnahe Softwareentwicklung.",
  },
  navigation: {
    toggleNavigationLabel: "Navigation umschalten",
    terminalPathLabel: "./Rafs Portfolio",
    overviewLabel: "Ubersicht",
    writingLabel: "Texte",
    projectsLabel: "Projekte",
    githubLabel: "GitHub",
    linkedinLabel: "LinkedIn",
    languageSwitcherLabel: "Sprache wechseln",
  },
  sidebar: {
    title: "Datei-Explorer",
    closeSidebarLabel: "Seitenleiste schließen",
    menu: {
      overview: "./ubersicht.sh",
      writing: "texte",
      projects: "projekte",
      profiles: "profile",
      github: "./github.sh",
      linkedin: "./linkedin.sh",
    },
  },
  footer: {
    rightsReserved: "© 2026 Rafael. Alle Rechte vorbehalten.",
  },
  contentFallback: {
    badge: "EN FALLBACK",
    title: "Englischer Inhalt geladen",
    description: "Diese Route ist noch nicht lokalisiert, daher wird die englische Version angezeigt.",
  },
  home: {
    hero: {
      title: "Ubersicht",
      heading: "Ich bin Rafael Peixoto",
      description:
        "Ich bin ein brasilianischer Informatikstudent mit Schwerpunkt auf Cybersicherheit und Systemarchitektur. Ich kombiniere moderne Sicherheitspraktiken mit effizienter Entwicklung, um leistungsstarke Lösungen zu bauen. Aktuell erforsche ich Wege, klassische Computing-Prinzipien mit moderner Technologie zu verbinden.",
      imageAlt: "Animation eines Schwarzen Lochs",
    },
    featuredProjects: {
      title: "Ausgewahlte Projekte",
      eyebrow: "/work/featured",
      summary: "Ein kompakter Blick auf die Experimente und Systeme, die meine technische Arbeit am besten zeigen.",
      browseLabel: "Projekt Hub offnen",
      repoLabel: "Repository",
      externalLabel: "Link offnen",
      emptyLabel: "Noch keine hervorgehobenen Projekte verfugbar.",
    },
    featuredWriting: {
      title: "Ausgewahlte Texte",
      eyebrow: "/writing/featured",
      summary: "Neueste Notizen, Write-ups und persönliche Einträge aus dem Archiv.",
      readMoreLabel: "Eintrag Offnen",
      browseLabel: "Texte durchsuchen",
      emptyLabel: "Noch keine Texte verfugbar.",
    },
    motion: {
      first: [
        "sicherheit",
        "pentester",
        "grafik-tuftler",
        "neugierig",
        "quantencomputing",
        "kunstliche intelligenz",
        "softwareingenieur",
        "kryptographie",
      ],
      second: [
        "fokusgetrieben",
        "netzwerke",
        "low-level-systeme",
        "musikfan",
        "problemloser",
        "betriebssystem-enthusiast",
        "builder",
        "ricing-fan",
      ],
    },
    experience: {
      title: "Erfahrung",
      eyebrow: "/sys/experience",
      places: [
        {
          company: "CISSA",
          role: "Praktikant als Sicherheitsforscher",
          period: "2026 - 2026",
          highlights: [
            "Mitarbeit an der Entwicklung eines technischen Papiers",
            "Entwickelte ein skalierbares Tool zur Messung der Robustheit von KI-Modellen gegen verschiedene gegnerische Angriffe.",
            "Dokumentierte robuste Bedrohungsmodellierung möglicher Angriffsvektoren gegen kritische Infrastruktur.",
          ],
        },
        {
          company: "0xBit CTF-Team",
          role: "Leiter, Rekrutierer, Aktives Mitglied",
          period: "2023 - Heute",
          highlights: [
            "Exploit-Ketten und Mitigationsmuster in kontrollierten Labs analysiert.",
            "An CTF-Losungen und der Veroffentlichung Sie zu sein: THM Advent of Cyber'24, srdnlen'25, srdnlen'26.",
            "Sicherheitsbefunde und praktische Abwehrstrategien vorgestellt.",
          ],
        },
      ],
    },
    skills: {
      title: "Fahigkeiten",
      eyebrow: "/sys/skills",
      learningLabel: "Lerne gerade",
    },
    cta: {
      title: "Profile",
      summary: "Offentliche Profile mit Code, Texten und professionellem Kontext.",
      githubLabel: "GitHub",
      linkedinLabel: "LinkedIn",
    },
  },
  writing: {
    page: {
      title: "Texte",
      eyebrow: "/writing/index",
      summary: "Langere Notizen, technische Write-ups und personliche Eintrage uber Sicherheit, Systeme und Engineering.",
      readMoreLabel: "Eintrag Offnen",
      emptyLabel: "Noch keine Texte verfugbar.",
      tagsLabel: "Tags",
    },
  },
  projects: {
    page: {
      title: "Projekte",
      eyebrow: "/projects/index",
      summary: "Externe Projektkarten mit Fokus auf Problemraum, technische Rolle, Stack und Zugriff auf das Ergebnis.",
      repoLabel: "Repository",
      externalLabel: "Externer Link",
      statusLabel: "Status",
      stackLabel: "Stack",
      yearLabel: "Jahr",
      roleLabel: "Rolle",
      emptyLabel: "Noch keine Projekte verfugbar.",
    },
  },
} satisfies DeepPartial<Messages>;
