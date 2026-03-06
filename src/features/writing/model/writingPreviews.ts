import { HTML_LANG_BY_LOCALE, type Locale } from "@/i18n/config";
import { getLocalizedWritingEntryPath } from "@/i18n/routes";
import type { LocalizedContent } from "@/shared/lib/localizedContent";
import { getSourceSlug as getSourceSlugFromEntry } from "@/shared/lib/contentSlug";

interface WritingPreviewEntryLike {
  slug: string;
  data: {
    locale: Locale;
    sourceSlug?: string;
    title: string;
    description: string;
    publishedAt: Date;
    tags: string[];
  };
}

export interface WritingPreview {
  title: string;
  description: string;
  publishedAt: Date;
  publishedDateLabel: string;
  href: string;
  tags: string[];
  isFallback: boolean;
}

export function buildWritingPreviews(
  locale: Locale,
  entries: Array<LocalizedContent<WritingPreviewEntryLike>>,
): WritingPreview[] {
  const formatter = new Intl.DateTimeFormat(HTML_LANG_BY_LOCALE[locale], {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });

  return entries.map((entry) => {
    const slug = getSourceSlugFromEntry(entry.entry);

    return {
      title: entry.entry.data.title,
      description: entry.entry.data.description,
      publishedAt: entry.entry.data.publishedAt,
      publishedDateLabel: formatter.format(entry.entry.data.publishedAt),
      href: getLocalizedWritingEntryPath(locale, slug),
      tags: entry.entry.data.tags,
      isFallback: entry.isFallback,
    };
  });
}
