export const LOCALES = ["en", "pt", "de", "es"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const HTML_LANG_BY_LOCALE: Record<Locale, string> = {
  en: "en",
  pt: "pt-BR",
  de: "de",
  es: "es-419",
};

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  pt: "PT",
  de: "DE",
  es: "ES",
};

export function isLocale(value: string | undefined): value is Locale {
  return value !== undefined && LOCALES.includes(value as Locale);
}
