import { z } from "zod";

const experienceEntrySchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  period: z.string().min(1),
  highlights: z.array(z.string().min(1)).min(1),
});

const sectionOverviewSchema = z.object({
  title: z.string().min(1),
  eyebrow: z.string().min(1),
  summary: z.string().min(1),
});

export const messagesSchema = z.object({
  head: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
  }),
  navigation: z.object({
    toggleNavigationLabel: z.string().min(1),
    terminalPathLabel: z.string().min(1),
    overviewLabel: z.string().min(1),
    writingLabel: z.string().min(1),
    projectsLabel: z.string().min(1),
    githubLabel: z.string().min(1),
    linkedinLabel: z.string().min(1),
    languageSwitcherLabel: z.string().min(1),
  }),
  sidebar: z.object({
    title: z.string().min(1),
    closeSidebarLabel: z.string().min(1),
    menu: z.object({
      overview: z.string().min(1),
      writing: z.string().min(1),
      projects: z.string().min(1),
      profiles: z.string().min(1),
      github: z.string().min(1),
      linkedin: z.string().min(1),
    }),
  }),
  footer: z.object({
    rightsReserved: z.string().min(1),
  }),
  contentFallback: z.object({
    badge: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
  }),
  home: z.object({
    hero: z.object({
      title: z.string().min(1),
      heading: z.string().min(1),
      description: z.string().min(1),
      imageAlt: z.string().min(1),
    }),
    featuredProjects: sectionOverviewSchema.extend({
      browseLabel: z.string().min(1),
      repoLabel: z.string().min(1),
      externalLabel: z.string().min(1),
      emptyLabel: z.string().min(1),
    }),
    featuredWriting: sectionOverviewSchema.extend({
      readMoreLabel: z.string().min(1),
      browseLabel: z.string().min(1),
      emptyLabel: z.string().min(1),
    }),
    motion: z.object({
      first: z.array(z.string().min(1)).min(1),
      second: z.array(z.string().min(1)).min(1),
    }),
    experience: z.object({
      title: z.string().min(1),
      eyebrow: z.string().min(1),
      places: z.array(experienceEntrySchema).min(1),
    }),
    skills: z.object({
      title: z.string().min(1),
      eyebrow: z.string().min(1),
      learningLabel: z.string().min(1),
    }),
    cta: z.object({
      title: z.string().min(1),
      summary: z.string().min(1),
      githubLabel: z.string().min(1),
      linkedinLabel: z.string().min(1),
    }),
  }),
  writing: z.object({
    page: sectionOverviewSchema.extend({
      readMoreLabel: z.string().min(1),
      emptyLabel: z.string().min(1),
      tagsLabel: z.string().min(1),
    }),
  }),
  projects: z.object({
    page: sectionOverviewSchema.extend({
      repoLabel: z.string().min(1),
      externalLabel: z.string().min(1),
      statusLabel: z.string().min(1),
      stackLabel: z.string().min(1),
      yearLabel: z.string().min(1),
      roleLabel: z.string().min(1),
      emptyLabel: z.string().min(1),
    }),
  }),
});

export type Messages = z.infer<typeof messagesSchema>;

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K];
};
