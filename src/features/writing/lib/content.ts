import { getCollection, type CollectionEntry } from "astro:content";
import type { Locale } from "@/i18n";
import {
  createLocalizedContent,
  type LocalizedContent,
  resolveLocalizedEntries,
} from "@/shared/lib/localizedContent";
import { getContentSlug, getSourceSlug } from "@/shared/lib/contentSlug";

export type WritingEntry = CollectionEntry<"writing">;

function matchesRouteSlug(entrySlug: string, locale: Locale, routeSlug: string): boolean {
  if (getContentSlug(locale, entrySlug) === routeSlug) {
    return true;
  }

  return entrySlug === routeSlug;
}

function sortByDateDesc(left: WritingEntry, right: WritingEntry): number {
  return right.data.publishedAt.getTime() - left.data.publishedAt.getTime();
}

export async function getPublishedWritingEntries(locale: Locale): Promise<WritingEntry[]> {
  const entries = await getCollection(
    "writing",
    ({ data }) => data.locale === locale && !data.draft,
  );

  return entries.sort(sortByDateDesc);
}

export async function getCanonicalWritingEntries(): Promise<WritingEntry[]> {
  return getPublishedWritingEntries("en");
}

export async function getCanonicalWritingSlugs(): Promise<string[]> {
  const entries = await getCanonicalWritingEntries();
  return entries.map((entry) => getSourceSlug(entry));
}

export async function getWritingEntryBySlug(
  locale: Locale,
  slug: string,
): Promise<WritingEntry | undefined> {
  const entries = await getCollection(
    "writing",
    ({ data, slug: entrySlug }) =>
      data.locale === locale && !data.draft && matchesRouteSlug(entrySlug, locale, slug),
  );

  return entries[0];
}

export async function getLocalizedWritingEntry(
  locale: Locale,
  slug: string,
): Promise<LocalizedContent<WritingEntry> | undefined> {
  const localizedEntry = await getWritingEntryBySlug(locale, slug);

  if (localizedEntry) {
    return createLocalizedContent(locale, localizedEntry.data.locale, localizedEntry);
  }

  if (locale === "en") {
    return undefined;
  }

  const canonicalEntry = await getWritingEntryBySlug("en", slug);

  if (!canonicalEntry) {
    return undefined;
  }

  return createLocalizedContent(locale, canonicalEntry.data.locale, canonicalEntry);
}

export async function getLocalizedWritingEntries(
  locale: Locale,
): Promise<Array<LocalizedContent<WritingEntry>>> {
  const canonicalEntries = await getCanonicalWritingEntries();
  const localizedEntries =
    locale === "en" ? canonicalEntries : await getPublishedWritingEntries(locale);
  return resolveLocalizedEntries(locale, canonicalEntries, localizedEntries, getSourceSlug);
}
