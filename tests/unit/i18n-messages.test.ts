import { describe, expect, it } from "vitest";
import { getMessages } from "@/i18n";

describe("localized messages", () => {
  it("returns complete messages for every locale", () => {
    const en = getMessages("en");
    const pt = getMessages("pt");
    const de = getMessages("de");
    const es = getMessages("es");

    expect(en.home.hero.heading.length).toBeGreaterThan(0);
    expect(en.home.featuredWriting.readMoreLabel.length).toBeGreaterThan(0);
    expect(pt.navigation.languageSwitcherLabel.length).toBeGreaterThan(0);
    expect(pt.home.featuredWriting.title.length).toBeGreaterThan(0);
    expect(de.sidebar.closeSidebarLabel.length).toBeGreaterThan(0);
    expect(de.contentFallback.title.length).toBeGreaterThan(0);
    expect(es.footer.rightsReserved.length).toBeGreaterThan(0);
    expect(es.projects.page.summary.length).toBeGreaterThan(0);
  });
});
