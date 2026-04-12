import { describe, expect, it } from "vitest";
import type { LocalizedContent } from "@/shared/lib/localizedContent";
import { buildWritingPreviews } from "@/features/writing/model/writingPreviews";

type WritingPreviewEntry = {
  slug: string;
  data: {
    locale: "en" | "pt" | "de" | "es";
    sourceSlug?: string;
    sourceHash?: string;
    title: string;
    description: string;
    publishedAt: Date;
    draft: boolean;
    featured: boolean;
    tags: string[];
  };
};

function createLocalizedEntry(
  routeLocale: "en" | "pt" | "de" | "es",
  contentLocale: "en" | "pt" | "de" | "es",
  slug: string,
  title: string,
  description: string,
  publishedAt: string,
  tags: string[],
): LocalizedContent<WritingPreviewEntry> {
  return {
    routeLocale,
    contentLocale,
    isFallback: routeLocale !== contentLocale,
    entry: {
      slug: `${contentLocale}/${slug}`,
      data: {
        locale: contentLocale,
        title,
        description,
        publishedAt: new Date(publishedAt),
        draft: false,
        featured: true,
        tags,
        ...(contentLocale === "en" ? {} : { sourceSlug: slug, sourceHash: "hash" }),
      },
    } as LocalizedContent<WritingPreviewEntry>["entry"],
  };
}

describe("writing previews", () => {
  it("builds localized preview hrefs and keeps order", () => {
    const previews = buildWritingPreviews("pt", [
      createLocalizedEntry("pt", "pt", "third", "Terceiro", "third-desc", "2025-02-03", ["rust"]),
      createLocalizedEntry("pt", "pt", "second", "Segundo", "second-desc", "2025-02-02", [
        "systems",
      ]),
      createLocalizedEntry("pt", "pt", "first", "Primeiro", "first-desc", "2025-02-01", [
        "security",
      ]),
    ]);

    expect(previews).toHaveLength(3);
    expect(previews.map((entry) => entry.title)).toEqual(["Terceiro", "Segundo", "Primeiro"]);
    expect(previews.map((entry) => entry.href)).toEqual([
      "/pt/writing/third",
      "/pt/writing/second",
      "/pt/writing/first",
    ]);
  });

  it("marks fallback entries and uses canonical english slug paths", () => {
    const previews = buildWritingPreviews("de", [
      createLocalizedEntry(
        "de",
        "en",
        "systems-notes",
        "Systems Notes",
        "systems-desc",
        "2025-07-10",
        ["systems"],
      ),
    ]);

    expect(previews).toHaveLength(1);
    expect(previews[0]?.isFallback).toBe(true);
    expect(previews[0]?.href).toBe("/de/writing/systems-notes");
  });
});
