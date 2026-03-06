import { describe, expect, it } from "vitest";
import {
  buildStaticRouteMeta,
  buildWritingRouteMeta,
  getLocalizedPath,
  getLocalizedWritingEntryPath,
} from "@/i18n/routes";

describe("i18n routes", () => {
  it("builds localized static paths", () => {
    expect(getLocalizedPath("en", "home")).toBe("/en/");
    expect(getLocalizedPath("pt", "writing")).toBe("/pt/writing");
    expect(getLocalizedPath("de", "projects")).toBe("/de/projects");
    expect(getLocalizedPath("es", "home")).toBe("/es/");
  });

  it("builds static route metadata with x-default", () => {
    const meta = buildStaticRouteMeta("de", "projects");
    expect(meta.canonicalPath).toBe("/de/projects");
    expect(meta.languagePaths.en).toBe("/en/projects");
    expect(meta.languagePaths.pt).toBe("/pt/projects");
    expect(meta.languagePaths.de).toBe("/de/projects");
    expect(meta.languagePaths.es).toBe("/es/projects");
    expect(meta.xDefaultPath).toBe("/en/projects");
  });

  it("builds writing route metadata with locale alternates", () => {
    const meta = buildWritingRouteMeta("pt", "systems-notes");
    expect(meta.canonicalPath).toBe("/pt/writing/systems-notes");
    expect(meta.languagePaths.es).toBe("/es/writing/systems-notes");
    expect(meta.xDefaultPath).toBe("/en/writing/systems-notes");
  });

  it("builds localized writing entry paths", () => {
    expect(getLocalizedWritingEntryPath("en", "introduction")).toBe("/en/writing/introduction");
  });
});
