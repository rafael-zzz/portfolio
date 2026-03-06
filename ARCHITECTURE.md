# Architecture

## Goals
- Preserve the retro visual language.
- Keep routes stable while page modules stay thin orchestration layers.
- Favor feature ownership, predictable content models, and locale-safe growth.

## Folder Structure
- `src/pages`: route orchestration and redirects only.
- `src/features/chrome`: shell, metadata, navigation, sidebar, footer, music player.
- `src/features/home`: overview page composition.
- `src/features/writing`: writing hub/detail components, content access, preview models.
- `src/features/projects`: projects hub components, content access, card models.
- `src/i18n`: locale config, route helpers, schema, glossary, and message modules.
- `src/shared/ui`: reusable presentation primitives (`SectionFrame`, `SectionHeader`, `RetroCard`, `LocalizedFallbackNotice`).
- `src/shared/lib`: cross-feature helpers, hashing, localized-content utilities, translation provider contracts.
- `src/content`: canonical content collections.
- `scripts`: authoring and localization tooling.

## Routing
- Canonical pages:
  - `/en/`, `/pt/`, `/de/`, `/es/`
  - `/{lang}/writing/`
  - `/{lang}/writing/{slug}/`
  - `/{lang}/projects/`
- Legacy compatibility:
  - `/` -> `/en/`
  - `/blog` -> `/en/writing/`
  - `/introduction` -> `/en/writing/introduction/`
  - `/{lang}/{slug}` -> `/{lang}/writing/{slug}/` for legacy writing entry paths

## i18n Model
- Canonical locale type: `Locale = "en" | "pt" | "de" | "es"`.
- Locale metadata in `src/i18n/config.ts`.
- Route helpers in `src/i18n/routes.ts`.
- Message schema in `src/i18n/schema.ts`.
- Locale copy split per file under `src/i18n/messages/*.ts`.
- Runtime message loading in `src/i18n/index.ts`:
  - schema-validated via zod
  - deep fallback to English for missing locale keys

## Content Model
- Astro collections are declared in `src/content.config.ts`.
- Writing:
  - canonical source entries: `src/content/writing/en/*.md`
  - localized entries: `src/content/writing/{pt,de,es}/*.md`
  - localized entries require `sourceSlug` and `sourceHash`
- Projects:
  - canonical source entries: `src/content/projects/en/*.md`
  - localized entries can later live in `src/content/projects/{pt,de,es}/*.md`
  - localized entries require `sourceSlug` and `sourceHash`
- Fallback policy:
  - English is canonical
  - missing localized writing/project content renders on the requested locale route with an explicit fallback notice

## Interactivity
- Scoped client islands:
  - `SidebarTree.tsx`
  - `LearningToggle.tsx`
- Persistent shell behavior:
  - `MusicPlayer.astro` remains mounted across route transitions
- Hub pages stay static and low-JS.

## Quality Gates
- Linting: ESLint (`npm run lint`)
- Formatting: Prettier (`npm run format`)
- Unit tests: Vitest (`npm run test`)
- E2E smoke: Playwright (`npm run test:e2e`)
- Aggregate gate: `npm run check:all`
- CI: `.github/workflows/ci.yml`
