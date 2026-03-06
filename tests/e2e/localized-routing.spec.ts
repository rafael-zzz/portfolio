import { expect, test } from "@playwright/test";

const locales = ["en", "pt", "de", "es"] as const;

test("root redirects to english home", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/en\/$/);
});

test("legacy blog route redirects to the writing hub", async ({ page }) => {
  await page.goto("/blog");
  await expect(page).toHaveURL(/\/en\/writing\/$/);
});

test("legacy introduction route redirects to the canonical writing path", async ({ page }) => {
  await page.goto("/introduction");
  await expect(page).toHaveURL(/\/en\/writing\/introduction\/?$/);
});

for (const locale of locales) {
  test(`${locale} home route renders`, async ({ page }) => {
    await page.goto(`/${locale}/`);
    await expect(page).toHaveURL(new RegExp(`/${locale}/$`));
    await expect(page.getByRole("link", { name: "EN", exact: true }).first()).toBeVisible();
  });

  test(`${locale} writing hub route renders`, async ({ page }) => {
    await page.goto(`/${locale}/writing`);
    await expect(page).toHaveURL(new RegExp(`/${locale}/writing/?$`));
  });

  test(`${locale} projects route renders`, async ({ page }) => {
    await page.goto(`/${locale}/projects`);
    await expect(page).toHaveURL(new RegExp(`/${locale}/projects/?$`));
  });
}

test("legacy flat localized writing route redirects to the namespaced route", async ({ page }) => {
  await page.goto("/de/introduction");
  await expect(page).toHaveURL(/\/de\/writing\/introduction\/?$/);
});

test("language switcher preserves the writing slug", async ({ page }) => {
  await page.goto("/de/writing/introduction");
  await page.getByRole("link", { name: "ES", exact: true }).first().click();
  await expect(page).toHaveURL(/\/es\/writing\/introduction\/?$/);
  await expect(page.getByRole("link", { name: "ES", exact: true }).first()).toHaveAttribute(
    "aria-current",
    "page",
  );
});

test("homepage featured writing cards link to the namespaced writing route", async ({ page }) => {
  await page.goto("/en/");
  const entryLink = page.getByRole("link", { name: "Open Entry" }).first();
  await expect(entryLink).toHaveAttribute("href", "/en/writing/ctf-lab-notes");
  await entryLink.click();
  await expect(page).toHaveURL(/\/en\/writing\/ctf-lab-notes\/?$/);
});

test("english fallback notice appears for untranslated writing entries", async ({ page }) => {
  await page.goto("/pt/writing/ctf-lab-notes");
  await expect(page.getByText("Conteúdo em inglês carregado")).toBeVisible();
  await expect(page.getByText("CTF Lab Notes")).toBeVisible();
});

test("projects hub exposes fallback content and external links", async ({ page }) => {
  await page.goto("/pt/projects");
  await expect(page.getByText("Conteúdo em inglês carregado")).toBeVisible();
  await expect(page.getByRole("link", { name: "Link Externo" }).first()).toHaveAttribute(
    "href",
    /github\.com/,
  );
});

test("music player switches between electronic and nu metal modes", async ({ page }) => {
  await page.goto("/en/");

  await page.waitForFunction(() => {
    const select = document.getElementById("stereo-song");
    return Boolean(select && select.querySelectorAll("option").length > 0);
  });

  await page.getByRole("button", { name: "Nu Metal" }).click();
  await expect(page.getByRole("button", { name: "Nu Metal" })).toHaveAttribute("aria-pressed", "true");

  await expect
    .poll(async () => page.locator("#stereo-song option").allTextContents())
    .toContain("Linkin Park - Numb");

  const nuMetalOptions = await page.locator("#stereo-song option").allTextContents();
  expect(nuMetalOptions).toContain("Linkin Park - Numb");
  expect(nuMetalOptions).toContain("Tool - Lateralus");

  await page.getByRole("button", { name: "Electronic" }).click();
  await expect(page.getByRole("button", { name: "Electronic" })).toHaveAttribute("aria-pressed", "true");

  const electronicOptions = await page.locator("#stereo-song option").allTextContents();
  expect(electronicOptions).toContain("Daft Punk - Get Lucky");
  expect(electronicOptions).toContain("The Strokes - Reptilia");
});

test("player remains mounted when navigating from home to a writing entry", async ({ page }) => {
  await page.goto("/en/");
  await page.waitForSelector(".stereo-player");

  await page.evaluate(() => {
    window.__persistedStereoNode = document.querySelector(".stereo-player");
  });

  await page.getByRole("link", { name: "Open Entry" }).first().click();
  await expect(page).toHaveURL(/\/en\/writing\/ctf-lab-notes\/?$/);

  const sameNode = await page.evaluate(
    () => window.__persistedStereoNode === document.querySelector(".stereo-player"),
  );

  expect(sameNode).toBe(true);
});

test("music playback position survives client-side navigation", async ({ page }) => {
  await page.addInitScript(() => {
    class FakePlayer {
      constructor(node, config) {
        this.node = node;
        this.events = config.events;
        this.state = 5;
        this.currentTime = 0;
        this.volume = 30;
        this.videoId = config.videoId;

        const iframe = document.createElement("iframe");
        iframe.setAttribute("title", "fake-youtube-player");
        node.replaceChildren(iframe);

        window.__ytPlayerCreations = (window.__ytPlayerCreations ?? 0) + 1;
        window.__ytLoadCalls = window.__ytLoadCalls ?? [];
        window.__ytCueCalls = window.__ytCueCalls ?? [];

        setTimeout(() => {
          this.events?.onReady?.({ target: this });
        }, 0);
      }

      loadVideoById(request) {
        this.videoId = typeof request === "string" ? request : request.videoId;
        this.currentTime = typeof request === "string" ? 0 : (request.startSeconds ?? 0);
        this.state = 1;
        window.__ytLoadCalls.push(request);
      }

      cueVideoById(request) {
        this.videoId = typeof request === "string" ? request : request.videoId;
        this.currentTime = typeof request === "string" ? 0 : (request.startSeconds ?? 0);
        this.state = 5;
        window.__ytCueCalls.push(request);
      }

      playVideo() {
        this.state = 1;
      }

      pauseVideo() {
        this.state = 2;
      }

      seekTo(seconds) {
        this.currentTime = seconds;
      }

      setVolume(volume) {
        this.volume = volume;
      }

      getVolume() {
        return this.volume;
      }

      getCurrentTime() {
        return this.currentTime;
      }

      getPlayerState() {
        return this.state;
      }
    }

    window.YT = {
      Player: FakePlayer,
      PlayerState: {
        ENDED: 0,
        PLAYING: 1,
        PAUSED: 2,
        CUED: 5,
      },
    };
  });

  await page.goto("/en/");
  await page.waitForFunction(() => {
    return Boolean(window.__stereoDeckStore?.player) && (window.__ytLoadCalls?.length ?? 0) > 0;
  });

  await page.evaluate(() => {
    const store = window.__stereoDeckStore;
    store.player.currentTime = 137;
    store.isPlaying = true;
  });

  await page.getByRole("link", { name: "Open Entry" }).first().click();
  await expect(page).toHaveURL(/\/en\/writing\/ctf-lab-notes\/?$/);

  const continuity = await page.evaluate(() => ({
    currentTime: window.__stereoDeckStore?.player?.getCurrentTime?.(),
    playerCreations: window.__ytPlayerCreations ?? 0,
    lastLoad: window.__ytLoadCalls?.at(-1) ?? null,
  }));

  expect(continuity.currentTime).toBe(137);

  if (continuity.playerCreations > 1) {
    expect(continuity.lastLoad).toMatchObject({ startSeconds: 137 });
  }
});

test("muted volume preference survives reload and prevents autoplay", async ({ page }) => {
  await page.addInitScript(() => {
    class FakePlayer {
      constructor(node, config) {
        this.node = node;
        this.events = config.events;
        this.state = 5;
        this.currentTime = 0;
        this.volume = 30;
        this.videoId = config.videoId;

        const iframe = document.createElement("iframe");
        iframe.setAttribute("title", "fake-youtube-player");
        node.replaceChildren(iframe);

        window.__ytLoadCalls = [];
        window.__ytCueCalls = [];

        setTimeout(() => {
          this.events?.onReady?.({ target: this });
        }, 0);
      }

      loadVideoById(request) {
        this.videoId = typeof request === "string" ? request : request.videoId;
        this.currentTime = typeof request === "string" ? 0 : (request.startSeconds ?? 0);
        this.state = 1;
        window.__ytLoadCalls.push(request);
      }

      cueVideoById(request) {
        this.videoId = typeof request === "string" ? request : request.videoId;
        this.currentTime = typeof request === "string" ? 0 : (request.startSeconds ?? 0);
        this.state = 5;
        window.__ytCueCalls.push(request);
      }

      playVideo() {
        this.state = 1;
      }

      pauseVideo() {
        this.state = 2;
      }

      setVolume(volume) {
        this.volume = volume;
      }

      getVolume() {
        return this.volume;
      }

      getCurrentTime() {
        return this.currentTime;
      }

      getPlayerState() {
        return this.state;
      }
    }

    window.YT = {
      Player: FakePlayer,
      PlayerState: {
        ENDED: 0,
        PLAYING: 1,
        PAUSED: 2,
        CUED: 5,
      },
    };
  });

  await page.goto("/en/");
  await page.waitForFunction(() => Boolean(window.__stereoDeckStore?.player));

  await page.locator("#stereo-volume").evaluate((node) => {
    node.value = "0";
    node.dispatchEvent(new Event("input", { bubbles: true }));
  });

  await page.waitForFunction(() => {
    const rawPreference = window.localStorage.getItem("stereoDeckVolumePreference");
    if (!rawPreference) {
      return false;
    }

    const parsedPreference = JSON.parse(rawPreference);
    return parsedPreference.volumeLevel === 0 && parsedPreference.isMuted === true;
  });

  await page.reload();
  await page.waitForFunction(() => Boolean(window.__stereoDeckStore?.player));

  const playbackState = await page.evaluate(() => ({
    sliderValue: document.getElementById("stereo-volume")?.value,
    isPlaying: window.__stereoDeckStore?.isPlaying,
    volumeLevel: window.__stereoDeckStore?.volumeLevel,
    isMutedPreference: window.__stereoDeckStore?.isMutedPreference,
    loadCalls: window.__ytLoadCalls?.length ?? 0,
    cueCalls: window.__ytCueCalls?.length ?? 0,
  }));

  expect(playbackState.sliderValue).toBe("0");
  expect(playbackState.isPlaying).toBe(false);
  expect(playbackState.volumeLevel).toBe(0);
  expect(playbackState.isMutedPreference).toBe(true);
  expect(playbackState.loadCalls).toBe(0);
  expect(playbackState.cueCalls).toBeGreaterThan(0);
});
