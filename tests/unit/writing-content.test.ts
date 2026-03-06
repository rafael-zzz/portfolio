import { describe, expect, it } from "vitest";
import { getContentSlugFromEntry } from "@/shared/lib/contentSlug";

describe("content slug helpers", () => {
  it("derives route slug from locale-prefixed content slug", () => {
    const localizedEntry = {
      slug: "de/introduction",
      data: { locale: "de" as const },
    };

    expect(getContentSlugFromEntry(localizedEntry)).toBe("introduction");
  });

  it("keeps plain slug when no locale prefix is present", () => {
    const plainEntry = {
      slug: "systems-notes",
      data: { locale: "en" as const },
    };

    expect(getContentSlugFromEntry(plainEntry)).toBe("systems-notes");
  });
});
