import { LOCALES, type Locale } from "@/i18n/config";

export type RouteKey = "home" | "writing" | "projects";

export interface LocalizedRouteMeta {
  canonicalPath: string;
  languagePaths: Record<Locale, string>;
  xDefaultPath: string;
}

export function getLocalizedPath(locale: Locale, routeKey: RouteKey): string {
  return routeKey === "home" ? `/${locale}/` : `/${locale}/${routeKey}`;
}

export function getLocalizedWritingEntryPath(locale: Locale, slug: string): string {
  return `/${locale}/writing/${slug}`;
}

function buildRouteMeta(
  locale: Locale,
  getPath: (language: Locale) => string,
): LocalizedRouteMeta {
  const languagePaths = LOCALES.reduce((accumulator, language) => {
    accumulator[language] = getPath(language);
    return accumulator;
  }, {} as Record<Locale, string>);

  return {
    canonicalPath: languagePaths[locale],
    languagePaths,
    xDefaultPath: languagePaths.en,
  };
}

export function buildStaticRouteMeta(locale: Locale, routeKey: RouteKey): LocalizedRouteMeta {
  return buildRouteMeta(locale, (language) => getLocalizedPath(language, routeKey));
}

export function buildWritingRouteMeta(locale: Locale, slug: string): LocalizedRouteMeta {
  return buildRouteMeta(locale, (language) => getLocalizedWritingEntryPath(language, slug));
}
