import { describe, expect, it } from "vitest";
import { compareProjectEntries } from "@/features/projects/model/projectOrdering";

function createProjectEntry(
  slug: string,
  featured: boolean,
  year: number,
  sortOrder: number,
): {
  slug: string;
  data: {
    featured: boolean;
    year: number;
    sortOrder: number;
    title: string;
  };
} {
  return {
    slug,
    data: {
      title: slug,
      year,
      featured,
      sortOrder,
    },
  };
}

describe("project content helpers", () => {
  it("orders projects by featured, newest year, and sort order", () => {
    const ordered = [
      createProjectEntry("older-featured", true, 2023, 1),
      createProjectEntry("newer-featured", true, 2025, 5),
      createProjectEntry("newer-non-featured", false, 2026, 0),
      createProjectEntry("older-non-featured", false, 2024, 0),
      createProjectEntry("same-year-later", true, 2025, 8),
    ].sort(compareProjectEntries);

    expect(ordered.map((entry) => entry.slug)).toEqual([
      "newer-featured",
      "same-year-later",
      "older-featured",
      "newer-non-featured",
      "older-non-featured",
    ]);
  });
});
