import type { DeepPartial, Messages } from "@/i18n/schema";

export const enMessages = {
  head: {
    title: "Raf's Portfolio",
    description:
      "Brazilian computer science student focused on cybersecurity, systems architecture, and practical software engineering.",
  },
  navigation: {
    toggleNavigationLabel: "Toggle navigation",
    terminalPathLabel: "./Raf's Portfolio",
    overviewLabel: "Overview",
    writingLabel: "Writing",
    projectsLabel: "Projects",
    githubLabel: "GitHub",
    linkedinLabel: "LinkedIn",
    languageSwitcherLabel: "Switch language",
  },
  sidebar: {
    title: "File Explorer",
    closeSidebarLabel: "Close sidebar",
    menu: {
      overview: "overview.exe",
      writing: "writing",
      projects: "projects",
      profiles: "profiles",
      github: "github.exe",
      linkedin: "linkedin.exe",
    },
  },
  footer: {
    rightsReserved: "© 2026 Rafael. All rights reserved.",
  },
  contentFallback: {
    badge: "EN FALLBACK",
    title: "English content loaded",
    description: "This route is not localized yet, so you are seeing the English version.",
  },
  home: {
    hero: {
      title: "Overview",
      heading: "I'm Rafael Peixoto",
      description:
        "A Brazilian Computer Science student with expertise in cybersecurity and systems architecture. I combine modern security practices with efficient development to create performant solutions. Currently exploring ways to bridge classic computing principles with modern technology.",
      imageAlt: "Black hole animation",
    },
    featuredProjects: {
      title: "Featured Projects",
      eyebrow: "/work/featured",
      summary:
        "A compact view of the systems, security, and product experiments that best represent how I ship and document technical work.",
      browseLabel: "Open Projects Hub",
      repoLabel: "Repository",
      externalLabel: "Open Link",
      emptyLabel: "No featured projects are available yet.",
    },
    featuredWriting: {
      title: "Featured Writing",
      eyebrow: "/writing/featured",
      summary: "Write-ups, notes, and personal logs from the archive.",
      readMoreLabel: "Open Entry",
      browseLabel: "Browse Writing",
      emptyLabel: "No writing entries are available yet.",
    },
    motion: {
      first: [
        "security",
        "pentester",
        "graphics tinkerer",
        "curious",
        "quantum computing",
        "artificial intelligence",
        "software engineer",
        "cryptography",
      ],
      second: [
        "focus driven",
        "network",
        "low level systems",
        "music enjoyer",
        "problem solver",
        "OS enthusiast",
        "builder",
        "ricing admirer",
      ],
    },
    experience: {
      title: "Experience",
      eyebrow: "/sys/experience",
      places: [
        {
          company: "Freelance",
          role: "Software and Security Consultant",
          period: "2023 - Present",
          highlights: [
            "Built and maintained secure web features for small business clients.",
            "Performed vulnerability reviews and hardening for public-facing apps.",
            "Documented deployment playbooks and incident response checklists.",
          ],
        },
        {
          company: "Academic and CTF Teams",
          role: "Security Research Contributor",
          period: "2022 - Present",
          highlights: [
            "Researched exploit chains and mitigation patterns in controlled labs.",
            "Collaborated on CTF challenge solving and write-up publication.",
            "Presented security findings and practical defenses to peers.",
          ],
        },
      ],
    },
    skills: {
      title: "Skills",
      eyebrow: "/sys/skills",
      learningLabel: "Learning",
    },
    cta: {
      title: "Profiles",
      summary:
        "Open the public trails where I ship code, write publicly, and maintain professional context.",
      githubLabel: "GitHub",
      linkedinLabel: "LinkedIn",
    },
  },
  writing: {
    page: {
      title: "Writing",
      eyebrow: "/writing/index",
      summary:
        "Longer-form notes, technical write-ups, and personal entries spanning security, systems thinking, and practical engineering.",
      readMoreLabel: "Open Entry",
      emptyLabel: "No writing entries are available yet.",
      tagsLabel: "Tags",
    },
  },
  projects: {
    page: {
      title: "Projects",
      eyebrow: "/projects/index",
      summary:
        "External-first project cards that focus on problem space, technical role, stack choices, and where to inspect the work.",
      repoLabel: "Repository",
      externalLabel: "External Link",
      statusLabel: "Status",
      stackLabel: "Stack",
      yearLabel: "Year",
      roleLabel: "Role",
      emptyLabel: "No projects are available yet.",
    },
  },
} satisfies DeepPartial<Messages>;
