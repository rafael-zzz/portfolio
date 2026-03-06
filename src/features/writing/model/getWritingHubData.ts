import { getMessages } from "@/i18n";
import type { Locale } from "@/i18n";
import { buildStaticRouteMeta } from "@/i18n/routes";
import { getLocalizedWritingEntries } from "@/features/writing/lib/content";
import {
  buildWritingPreviews,
  type WritingPreview,
} from "@/features/writing/model/writingPreviews";
import { hasFallbackContent } from "@/shared/lib/localizedContent";

export interface WritingHubData {
  locale: Locale;
  messages: ReturnType<typeof getMessages>;
  routeMeta: ReturnType<typeof buildStaticRouteMeta>;
  entries: WritingPreview[];
  hasFallback: boolean;
}

export async function getWritingHubData(locale: Locale): Promise<WritingHubData> {
  const entries = await getLocalizedWritingEntries(locale);

  return {
    locale,
    messages: getMessages(locale),
    routeMeta: buildStaticRouteMeta(locale, "writing"),
    entries: buildWritingPreviews(locale, entries),
    hasFallback: hasFallbackContent(entries),
  };
}
