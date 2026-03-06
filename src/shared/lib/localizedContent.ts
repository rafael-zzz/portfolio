import type { Locale } from "@/i18n";

export interface LocalizedContent<T> {
  routeLocale: Locale;
  contentLocale: Locale;
  isFallback: boolean;
  entry: T;
}

interface LocaleEntryLike {
  data: {
    locale: Locale;
  };
}

export function createLocalizedContent<T>(
  routeLocale: Locale,
  contentLocale: Locale,
  entry: T,
): LocalizedContent<T> {
  return {
    routeLocale,
    contentLocale,
    isFallback: routeLocale !== contentLocale,
    entry,
  };
}

export function hasFallbackContent<T>(entries: LocalizedContent<T>[]): boolean {
  return entries.some((entry) => entry.isFallback);
}

export function resolveLocalizedEntries<T extends LocaleEntryLike>(
  routeLocale: Locale,
  canonicalEntries: T[],
  localizedEntries: T[],
  getSourceSlug: (entry: T) => string,
): Array<LocalizedContent<T>> {
  if (routeLocale === "en") {
    return canonicalEntries.map((entry) =>
      createLocalizedContent(routeLocale, entry.data.locale, entry),
    );
  }

  const localizedEntryMap = new Map(
    localizedEntries.map((entry) => [getSourceSlug(entry), entry]),
  );

  return canonicalEntries.map((entry) => {
    const localizedEntry = localizedEntryMap.get(getSourceSlug(entry)) ?? entry;
    return createLocalizedContent(routeLocale, localizedEntry.data.locale, localizedEntry);
  });
}
