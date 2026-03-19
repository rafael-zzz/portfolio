import type { DeepPartial, Messages } from "@/i18n/schema";

export const ptMessages = {
  head: {
    title: "Portfólio do Raf",
    description:
      "Estudante brasileiro de ciência da computação focado em cibersegurança, arquitetura de sistemas e engenharia de software prática.",
  },
  navigation: {
    toggleNavigationLabel: "Alternar navegação",
    terminalPathLabel: "./Portfólio do Raf",
    overviewLabel: "Visão Geral",
    writingLabel: "Textos",
    projectsLabel: "Projetos",
    githubLabel: "GitHub",
    linkedinLabel: "LinkedIn",
    languageSwitcherLabel: "Trocar idioma",
  },
  sidebar: {
    title: "Explorador de Arquivos",
    closeSidebarLabel: "Fechar barra lateral",
    menu: {
      overview: "./visao_geral.sh",
      writing: "textos",
      projects: "projetos",
      profiles: "perfis",
      github: "./github.sh",
      linkedin: "./linkedin.sh",
    },
  },
  footer: {
    rightsReserved: "© 2026 Rafael. Todos os direitos reservados.",
  },
  contentFallback: {
    badge: "FALLBACK EN",
    title: "Conteúdo em inglês carregado",
    description: "Esta rota ainda não foi localizada, então você está vendo a versão em inglês.",
  },
  home: {
    hero: {
      title: "Visão Geral",
      heading: "Sou Rafael Peixoto",
      description:
        "Sou um estudante brasileiro de Ciência da Computação com foco em cibersegurança e arquitetura de sistemas. Combino práticas modernas de segurança com desenvolvimento eficiente para criar soluções de alto desempenho. Atualmente exploro formas de conectar princípios clássicos da computação com tecnologia moderna.",
      imageAlt: "Animação de buraco negro",
    },
    featuredProjects: {
      title: "Projetos em Destaque",
      eyebrow: "/work/featured",
      summary: "Uma amostra compacta dos experimentos e sistemas que melhor representam meu trabalho técnico.",
      browseLabel: "Abrir Hub de Projetos",
      repoLabel: "Repositório",
      externalLabel: "Abrir Link",
      emptyLabel: "Nenhum projeto em destaque disponível.",
    },
    featuredWriting: {
      title: "Textos em Destaque",
      eyebrow: "/writing/featured",
      summary: "Notas, write-ups e entradas pessoais mais recentes do arquivo.",
      readMoreLabel: "Abrir Entrada",
      browseLabel: "Ver Textos",
      emptyLabel: "Nenhum texto disponível ainda.",
    },
    motion: {
      first: [
        "segurança",
        "pentester",
        "entusiasta de gráficos",
        "curioso",
        "computação quântica",
        "inteligência artificial",
        "engenheiro de software",
        "criptografia",
      ],
      second: [
        "foco em resultado",
        "redes",
        "sistemas de baixo nível",
        "apreciador de música",
        "resolvedor de problemas",
        "entusiasta de SO",
        "builder",
        "admirador de ricing",
      ],
    },
    experience: {
      title: "Experiência",
      eyebrow: "/sys/experience",
      places: [
        {
          company: "CISSA",
          role: "Estágio como Pesquisador de Segurança",
          period: "2026 - 2026",
          highlights: [
            "Colaboração no desenvolvimento de um paper técnico.",
            "Desenvolvimento de ferramenta escalável para medição de robustez contra diferentes ataques adversariais em modelos de IA.",
            "Documentação de modelagem de ameaças robusta contra possíveis vetores de ataque à infraestrutura crítica.",
          ],
        },
        {
          company: "Time de CTF 0xBit",
          role: "Líder, Recrutador, Membro Ativo",
          period: "2023 - Presente",
          highlights: [
            "Pesquisa de cadeias de exploit e mitigação em laboratórios controlados.",
            "Colaboração em resolução de desafios CTF. Sendo eles: THM Advent of Cyber'24, srdnlen'25, srdnlen'26.",
            "Apresentação de achados de segurança e defesas práticas para colegas.",
          ],
        },
      ],
    },
    skills: {
      title: "Habilidades",
      eyebrow: "/sys/skills",
      learningLabel: "Aprendendo",
    },
    cta: {
      title: "Perfis",
      summary: "Abra os perfis públicos onde eu mantenho código, escrita e contexto profissional.",
      githubLabel: "GitHub",
      linkedinLabel: "LinkedIn",
    },
  },
  writing: {
    page: {
      title: "Textos",
      eyebrow: "/writing/index",
      summary: "Notas longas, write-ups técnicos e registros pessoais sobre segurança, sistemas e engenharia prática.",
      readMoreLabel: "Abrir Entrada",
      emptyLabel: "Nenhum texto disponível ainda.",
      tagsLabel: "Tags",
    },
  },
  projects: {
    page: {
      title: "Projetos",
      eyebrow: "/projects/index",
      summary: "Cartões externos de projetos com foco no problema, papel técnico, stack e onde inspecionar o trabalho.",
      repoLabel: "Repositório",
      externalLabel: "Link Externo",
      statusLabel: "Status",
      stackLabel: "Stack",
      yearLabel: "Ano",
      roleLabel: "Papel",
      emptyLabel: "Nenhum projeto disponível ainda.",
    },
  },
} satisfies DeepPartial<Messages>;
