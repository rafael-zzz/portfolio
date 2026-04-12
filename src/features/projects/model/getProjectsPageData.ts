import { getMessages } from "@/i18n";
import type { Locale } from "@/i18n";
import { buildStaticRouteMeta } from "@/i18n/routes";
import { getLocalizedProjectEntries } from "@/features/projects/lib/content";
import { buildProjectCards, type ProjectCard } from "@/features/projects/model/projectCards";
import { hasFallbackContent } from "@/shared/lib/localizedContent";

export interface ProjectsPageData {
  locale: Locale;
  messages: ReturnType<typeof getMessages>;
  routeMeta: ReturnType<typeof buildStaticRouteMeta>;
  cards: ProjectCard[];
  hasFallback: boolean;
}

export async function getProjectsPageData(locale: Locale): Promise<ProjectsPageData> {
  const entries = await getLocalizedProjectEntries(locale);

  return {
    locale,
    messages: getMessages(locale),
    routeMeta: buildStaticRouteMeta(locale, "projects"),
    cards: buildProjectCards(entries),
    hasFallback: hasFallbackContent(entries),
  };
}
