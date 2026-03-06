import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/i18n/config";
import { deMessages } from "@/i18n/messages/de";
import { enMessages } from "@/i18n/messages/en";
import { esMessages } from "@/i18n/messages/es";
import { ptMessages } from "@/i18n/messages/pt";
import { messagesSchema, type DeepPartial, type Messages } from "@/i18n/schema";

const rawMessagesByLocale: Record<Locale, DeepPartial<Messages>> = {
  en: enMessages,
  pt: ptMessages,
  de: deMessages,
  es: esMessages,
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeMessages<T>(base: T, override: DeepPartial<T> | undefined): T {
  if (override === undefined) {
    return base;
  }

  if (Array.isArray(base)) {
    return (Array.isArray(override) ? override : base) as T;
  }

  if (isPlainObject(base) && isPlainObject(override)) {
    const merged: Record<string, unknown> = { ...base };

    for (const [key, value] of Object.entries(override)) {
      if (value === undefined) {
        continue;
      }

      const baseValue = merged[key];

      if (isPlainObject(baseValue) && isPlainObject(value)) {
        merged[key] = mergeMessages(baseValue, value);
        continue;
      }

      merged[key] = value;
    }

    return merged as T;
  }

  return override as T;
}

function findMissingKeys(base: unknown, candidate: unknown, path: string[] = []): string[] {
  if (Array.isArray(base)) {
    return candidate === undefined ? [path.join(".")] : [];
  }

  if (isPlainObject(base)) {
    const candidateObject = isPlainObject(candidate) ? candidate : {};

    return Object.entries(base).flatMap(([key, value]) =>
      findMissingKeys(value, candidateObject[key], [...path, key]),
    );
  }

  return candidate === undefined ? [path.join(".")] : [];
}

const defaultMessages = messagesSchema.parse(rawMessagesByLocale[DEFAULT_LOCALE]);

const messagesByLocale = LOCALES.reduce((accumulator, locale) => {
  const rawMessages = rawMessagesByLocale[locale];
  const mergedMessages = mergeMessages(defaultMessages, rawMessages);

  if (locale !== DEFAULT_LOCALE) {
    const missingKeys = findMissingKeys(defaultMessages, rawMessages);

    if (missingKeys.length > 0 && !import.meta.env.PROD) {
      console.warn(`[i18n] Missing ${locale} keys (fallback to en): ${missingKeys.join(", ")}`);
    }
  }

  accumulator[locale] = messagesSchema.parse(mergedMessages);
  return accumulator;
}, {} as Record<Locale, Messages>);

export function getMessages(locale: Locale): Messages {
  return messagesByLocale[locale] ?? messagesByLocale[DEFAULT_LOCALE];
}

export function getAllMessages(): Record<Locale, Messages> {
  return messagesByLocale;
}

export { LOCALES, DEFAULT_LOCALE, isLocale } from "@/i18n/config";
export type { Locale } from "@/i18n/config";
