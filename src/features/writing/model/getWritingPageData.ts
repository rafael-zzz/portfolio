import { getMessages } from "@/i18n";
import type { Locale } from "@/i18n";
import { buildWritingRouteMeta } from "@/i18n/routes";
import {
  getCanonicalWritingEntries,
  getLocalizedWritingEntry,
} from "@/features/writing/lib/content";
import { getSourceSlug } from "@/shared/lib/contentSlug";

export interface WritingPageData {
  locale: Locale;
  messages: ReturnType<typeof getMessages>;
  routeMeta: ReturnType<typeof buildWritingRouteMeta>;
  entry: NonNullable<Awaited<ReturnType<typeof getLocalizedWritingEntry>>>;
  issueNumber: number;
}

export async function getWritingPageData(
  locale: Locale,
  slug: string,
): Promise<WritingPageData | undefined> {
  const entry = await getLocalizedWritingEntry(locale, slug);

  if (!entry) {
    return undefined;
  }

  const canonicalEntries = await getCanonicalWritingEntries();
  const canonicalOldestFirst = [...canonicalEntries].reverse();
  const sourceSlug = getSourceSlug(entry.entry);
  const issueIndex = canonicalOldestFirst.findIndex(
    (canonicalEntry) => getSourceSlug(canonicalEntry) === sourceSlug,
  );
  const issueNumber = issueIndex >= 0 ? issueIndex + 1 : 0;

  return {
    locale,
    messages: getMessages(locale),
    routeMeta: buildWritingRouteMeta(locale, slug),
    entry,
    issueNumber,
  };
}
