import { getCollection, type CollectionEntry } from "astro:content";
import type { Locale } from "@/i18n";
import { getSourceSlug } from "@/shared/lib/contentSlug";
import {
  type LocalizedContent,
  resolveLocalizedEntries,
} from "@/shared/lib/localizedContent";
import { compareProjectEntries } from "@/features/projects/model/projectOrdering";

export type ProjectEntry = CollectionEntry<"projects">;

export async function getProjectEntries(locale: Locale): Promise<ProjectEntry[]> {
  const entries = await getCollection("projects", ({ data }) => data.locale === locale);
  return entries.sort(compareProjectEntries);
}

export async function getLocalizedProjectEntries(
  locale: Locale,
): Promise<Array<LocalizedContent<ProjectEntry>>> {
  const canonicalEntries = await getProjectEntries("en");
  const localizedEntries = locale === "en" ? canonicalEntries : await getProjectEntries(locale);
  return resolveLocalizedEntries(locale, canonicalEntries, localizedEntries, getSourceSlug);
}
