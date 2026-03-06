import type { Locale } from "@/i18n";

interface LocalizedSlugEntryLike {
  slug: string;
  data: {
    locale: Locale;
    sourceSlug?: string;
  };
}

export function getContentSlug(locale: Locale, entrySlug: string): string {
  const prefix = `${locale}/`;
  return entrySlug.startsWith(prefix) ? entrySlug.slice(prefix.length) : entrySlug;
}

export function getContentSlugFromEntry(entry: LocalizedSlugEntryLike): string {
  return getContentSlug(entry.data.locale, entry.slug);
}

export function getSourceSlug(entry: LocalizedSlugEntryLike): string {
  return entry.data.sourceSlug ?? getContentSlugFromEntry(entry);
}
