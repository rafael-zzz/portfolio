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
    const label = locale.toUpperCase();
    await expect(page.locator(".lang-dropdown summary")).toContainText(label);
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
  await page.locator(".lang-dropdown summary").click();
  await page.locator(".lang-menu a").filter({ hasText: "ES" }).first().click();
  await expect(page).toHaveURL(/\/es\/writing\/introduction\/?$/);

  await page.locator(".lang-dropdown summary").click();
  await expect(page.locator(".lang-menu a").filter({ hasText: "ES" }).first()).toHaveAttribute(
    "aria-current",
    "page",
  );
});

test("homepage featured writing cards link to the namespaced writing route", async ({ page }) => {
  await page.goto("/en/");
  const entryLink = page.getByRole("link", { name: "Open Entry" }).first();
  await expect(entryLink).toHaveAttribute("href", "/en/writing/valdoria_ctf");
  await entryLink.click();
  await expect(page).toHaveURL(/\/en\/writing\/valdoria_ctf\/?$/);
});

test("english fallback notice appears for untranslated writing entries", async ({ page }) => {
  await page.goto("/de/writing/valdoria_ctf");
  await expect(page.getByText(/Englischer Inhalt geladen/i)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Valdoria CTF" })).toBeVisible();
});

test("projects hub exposes fallback content and external links", async ({ page }) => {
  await page.goto("/pt/projects");
  // Projects hub currently has only English content, so it should show fallback.
  await expect(page.getByText(/Conteúdo em inglês carregado/i)).toBeVisible();
  await expect(page.getByRole("link", { name: /Repositório/i }).first()).toHaveAttribute(
    "href",
    /github\.com/,
  );
});

test("music player switches between electronic and nu metal modes", async ({ page }) => {
  await page.goto("/en/");

  await page.waitForFunction(() => {
    const select = document.getElementById("stereo-genre");
    return Boolean(select && select.querySelectorAll("option").length > 0);
  });

  const genreSelect = page.locator("#stereo-genre");
  await genreSelect.selectOption("nuMetal");

  await expect
    .poll(async () => page.locator("#stereo-track").textContent())
    .toContain("Tool - Lateralus");

  await genreSelect.selectOption("electronic");

  await expect
    .poll(async () => page.locator("#stereo-track").textContent())
    .toContain("Daft Punk - Get Lucky");
});

test("player remains mounted when navigating from home to a writing entry", async ({ page }) => {
  await page.goto("/en/");
  await page.waitForSelector(".stereo-player");

  await page.evaluate(() => {
    window.__persistedStereoNode = document.querySelector(".stereo-player");
  });

  await page.getByRole("link", { name: "Open Entry" }).first().click();
  await expect(page).toHaveURL(/\/en\/writing\/valdoria_ctf\/?$/);

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
    const hasPlayer = Boolean(window.__stereoPlayer?.player);
    const hasCalls =
      (window.__ytLoadCalls?.length ?? 0) > 0 || (window.__ytCueCalls?.length ?? 0) > 0;
    return hasPlayer && hasCalls;
  });

  await page.evaluate(() => {
    const store = window.__stereoPlayer;
    store.player.currentTime = 137;
    store.state.isPlaying = true;
  });

  await page.getByRole("link", { name: "Open Entry" }).first().click();
  await expect(page).toHaveURL(/\/en\/writing\/valdoria_ctf\/?$/);

  const continuity = await page.evaluate(() => ({
    currentTime: window.__stereoPlayer?.player?.getCurrentTime?.(),
    playerCreations: window.__ytPlayerCreations ?? 0,
    lastLoad: window.__ytLoadCalls?.at(-1) ?? window.__ytCueCalls?.at(-1) ?? null,
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
  await page.waitForFunction(() => Boolean(window.__stereoPlayer?.player));

  await page.locator("#stereo-volume").evaluate((node) => {
    node.value = "0";
    node.dispatchEvent(new Event("input", { bubbles: true }));
  });

  await page.waitForFunction(() => {
    const rawPreference = window.localStorage.getItem("stereoPlayerState");
    if (!rawPreference) {
      return false;
    }

    const parsedPreference = JSON.parse(rawPreference);
    return parsedPreference.volume === 0;
  });

  await page.reload();
  await page.waitForFunction(() => Boolean(window.__stereoPlayer?.player));

  const playbackState = await page.evaluate(() => ({
    sliderValue: document.getElementById("stereo-volume")?.value,
    isPlaying: window.__stereoPlayer?.state.isPlaying,
    volumeLevel: window.__stereoPlayer?.state.volume,
    loadCalls: window.__ytLoadCalls?.length ?? 0,
    cueCalls: window.__ytCueCalls?.length ?? 0,
  }));

  expect(playbackState.sliderValue).toBe("0");
  expect(playbackState.isPlaying).toBe(false);
  expect(playbackState.volumeLevel).toBe(0);
  expect(playbackState.loadCalls).toBe(0);
  expect(playbackState.cueCalls).toBeGreaterThan(0);
});
