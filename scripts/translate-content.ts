import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { translationGlossary } from "../src/i18n/glossary.ts";
import { sha256 } from "../src/shared/lib/hash.ts";
import {
  OpenAITranslationProvider,
  type LocalizableCollection,
  type TranslateContentInput,
  type TranslationProvider,
} from "../src/shared/lib/localization/translation.ts";

type Locale = "en" | "pt" | "de" | "es";
type TargetLocale = Exclude<Locale, "en">;
type FrontmatterValue = string | boolean | number | string[];
type FrontmatterRecord = Record<string, FrontmatterValue | undefined>;

interface MarkdownDocument {
  frontmatter: FrontmatterRecord;
  body: string;
}

interface CollectionConfig {
  translatableFields: string[];
  orderedKeys: string[];
}

const COLLECTIONS: Record<LocalizableCollection, CollectionConfig> = {
  writing: {
    translatableFields: ["title", "description"],
    orderedKeys: [
      "locale",
      "sourceSlug",
      "sourceHash",
      "title",
      "description",
      "publishedAt",
      "fontScale",
      "draft",
      "featured",
      "tags",
    ],
  },
  projects: {
    translatableFields: ["title", "summary", "role", "status"],
    orderedKeys: [
      "locale",
      "sourceSlug",
      "sourceHash",
      "title",
      "summary",
      "role",
      "status",
      "stack",
      "year",
      "featured",
      "sortOrder",
      "repoUrl",
      "externalUrl",
    ],
  },
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const sourceLocale: Locale = "en";
const targetLocales: TargetLocale[] = ["pt", "de", "es"];
const localeSet = new Set<Locale>(["en", "pt", "de", "es"]);
const requestedCollection = (process.argv[2] ?? "writing") as LocalizableCollection;

if (!(requestedCollection in COLLECTIONS)) {
  throw new Error(`Unsupported collection: ${process.argv[2] ?? "undefined"}`);
}

function parseScalar(rawValue: string): FrontmatterValue {
  const value = rawValue.trim();

  if (value.startsWith("[") && value.endsWith("]")) {
    const inner = value.slice(1, -1).trim();
    if (!inner) {
      return [];
    }

    return inner.split(",").map((item) => item.trim().replace(/^"(.*)"$/, "$1"));
  }

  if (value === "true" || value === "false") {
    return value === "true";
  }

  if (/^-?\d+$/.test(value)) {
    return Number(value);
  }

  return value.replace(/^"(.*)"$/, "$1");
}

function parseFrontmatter(raw: string): MarkdownDocument {
  if (!raw.startsWith("---\n")) {
    throw new Error("Invalid markdown: missing frontmatter start marker.");
  }

  const endIndex = raw.indexOf("\n---\n", 4);

  if (endIndex === -1) {
    throw new Error("Invalid markdown: missing frontmatter end marker.");
  }

  const rawFrontmatter = raw.slice(4, endIndex);
  const body = raw.slice(endIndex + 5).trimStart();
  const values: FrontmatterRecord = {};

  rawFrontmatter.split("\n").forEach((line) => {
    const separator = line.indexOf(":");

    if (separator === -1) {
      return;
    }

    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    values[key] = parseScalar(value);
  });

  if (
    !values.locale ||
    typeof values.locale !== "string" ||
    !localeSet.has(values.locale as Locale)
  ) {
    throw new Error(`Invalid locale in markdown frontmatter: ${String(values.locale)}`);
  }

  return { frontmatter: values, body };
}

function stringifyValue(value: FrontmatterValue): string {
  if (Array.isArray(value)) {
    return `[${value.map((item) => JSON.stringify(item)).join(", ")}]`;
  }

  if (typeof value === "boolean" || typeof value === "number") {
    return String(value);
  }

  return JSON.stringify(value);
}

function stringifyFrontmatter(
  collection: LocalizableCollection,
  frontmatter: FrontmatterRecord,
): string {
  const orderedKeys = COLLECTIONS[collection].orderedKeys;
  const lines = ["---"];

  orderedKeys.forEach((key) => {
    const value = frontmatter[key];
    if (value === undefined) {
      return;
    }

    lines.push(`${key}: ${stringifyValue(value)}`);
  });

  lines.push("---");
  return `${lines.join("\n")}\n`;
}

async function getSourceDocuments(
  collection: LocalizableCollection,
): Promise<Array<{ slug: string; filePath: string }>> {
  const directory = path.join(projectRoot, "src", "content", collection, sourceLocale);
  const files = await fs.readdir(directory);

  return files
    .filter((file) => file.endsWith(".md"))
    .map((file) => ({
      slug: file.replace(/\.md$/, ""),
      filePath: path.join(directory, file),
    }));
}

function buildSourceHash(slug: string, document: MarkdownDocument): string {
  const sourceData = { ...document.frontmatter };
  delete sourceData.locale;
  delete sourceData.sourceSlug;
  delete sourceData.sourceHash;

  return sha256(
    JSON.stringify({
      slug,
      sourceData,
      body: document.body,
    }),
  );
}

async function readDocument(filePath: string): Promise<MarkdownDocument> {
  const raw = await fs.readFile(filePath, "utf8");
  return parseFrontmatter(raw);
}

async function writeDocument(
  collection: LocalizableCollection,
  filePath: string,
  document: MarkdownDocument,
): Promise<void> {
  const markdown = `${stringifyFrontmatter(collection, document.frontmatter)}\n${document.body.trim()}\n`;
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, markdown, "utf8");
}

async function translateDocument(
  provider: TranslationProvider,
  collection: LocalizableCollection,
  sourceSlug: string,
  source: MarkdownDocument,
  targetLocale: TargetLocale,
): Promise<MarkdownDocument> {
  const config = COLLECTIONS[collection];
  const translatedFields = Object.fromEntries(
    config.translatableFields.map((field) => {
      const value = source.frontmatter[field];

      if (typeof value !== "string") {
        throw new Error(`Expected string field "${field}" in ${collection}/${sourceSlug}.`);
      }

      return [field, value];
    }),
  );

  const input: TranslateContentInput = {
    collection,
    slug: sourceSlug,
    targetLocale,
    glossaryTerms: translationGlossary[targetLocale],
    fields: translatedFields,
    body: source.body,
  };

  const translated = await provider.translate(input);
  const sourceHash = buildSourceHash(sourceSlug, source);

  return {
    frontmatter: {
      ...source.frontmatter,
      locale: targetLocale,
      sourceSlug,
      sourceHash,
      ...translated.fields,
    },
    body: translated.body ?? source.body,
  };
}

async function syncTranslations(
  collection: LocalizableCollection,
  provider: TranslationProvider,
): Promise<void> {
  const sourceDocuments = await getSourceDocuments(collection);
  const contentRoot = path.join(projectRoot, "src", "content", collection);

  for (const sourceDocumentMeta of sourceDocuments) {
    const sourceDocument = await readDocument(sourceDocumentMeta.filePath);
    const sourceHash = buildSourceHash(sourceDocumentMeta.slug, sourceDocument);

    for (const targetLocale of targetLocales) {
      const targetPath = path.join(contentRoot, targetLocale, `${sourceDocumentMeta.slug}.md`);
      let existingHash: string | undefined;

      try {
        const existingDocument = await readDocument(targetPath);
        existingHash =
          typeof existingDocument.frontmatter.sourceHash === "string"
            ? existingDocument.frontmatter.sourceHash
            : undefined;
      } catch {
        existingHash = undefined;
      }

      if (existingHash === sourceHash) {
        console.log(
          `skip ${collection}/${targetLocale}/${sourceDocumentMeta.slug}.md (up to date)`,
        );
        continue;
      }

      const translatedDocument = await translateDocument(
        provider,
        collection,
        sourceDocumentMeta.slug,
        sourceDocument,
        targetLocale,
      );

      await writeDocument(collection, targetPath, translatedDocument);
      console.log(`updated ${collection}/${targetLocale}/${sourceDocumentMeta.slug}.md`);
    }
  }
}

async function main(): Promise<void> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set.");
  }

  const provider = new OpenAITranslationProvider(apiKey);
  await syncTranslations(requestedCollection, provider);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
