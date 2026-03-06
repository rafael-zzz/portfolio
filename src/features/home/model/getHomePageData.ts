import { getMessages } from "@/i18n";
import type { Locale } from "@/i18n";
import { buildStaticRouteMeta } from "@/i18n/routes";
import { getLocalizedWritingEntries } from "@/features/writing/lib/content";
import {
  buildWritingPreviews,
  type WritingPreview,
} from "@/features/writing/model/writingPreviews";
import { getLocalizedProjectEntries } from "@/features/projects/lib/content";
import {
  buildProjectCards,
  type ProjectCard,
} from "@/features/projects/model/projectCards";

export interface HomePageData {
  locale: Locale;
  messages: ReturnType<typeof getMessages>;
  routeMeta: ReturnType<typeof buildStaticRouteMeta>;
  writingEntries: WritingPreview[];
  projectCards: ProjectCard[];
}

export async function getHomePageData(locale: Locale): Promise<HomePageData> {
  const writingEntries = await getLocalizedWritingEntries(locale);
  const projectEntries = await getLocalizedProjectEntries(locale);

  return {
    locale,
    messages: getMessages(locale),
    routeMeta: buildStaticRouteMeta(locale, "home"),
    writingEntries: buildWritingPreviews(
      locale,
      writingEntries.filter((entry) => entry.entry.data.featured).slice(0, 3),
    ),
    projectCards: buildProjectCards(
      projectEntries.filter((entry) => entry.entry.data.featured).slice(0, 3),
    ),
  };
}
