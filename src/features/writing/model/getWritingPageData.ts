import { getMessages } from "@/i18n";
import type { Locale } from "@/i18n";
import { buildWritingRouteMeta } from "@/i18n/routes";
import { getLocalizedWritingEntry } from "@/features/writing/lib/content";

export interface WritingPageData {
  locale: Locale;
  messages: ReturnType<typeof getMessages>;
  routeMeta: ReturnType<typeof buildWritingRouteMeta>;
  entry: NonNullable<Awaited<ReturnType<typeof getLocalizedWritingEntry>>>;
}

export async function getWritingPageData(
  locale: Locale,
  slug: string,
): Promise<WritingPageData | undefined> {
  const entry = await getLocalizedWritingEntry(locale, slug);

  if (!entry) {
    return undefined;
  }

  return {
    locale,
    messages: getMessages(locale),
    routeMeta: buildWritingRouteMeta(locale, slug),
    entry,
  };
}
