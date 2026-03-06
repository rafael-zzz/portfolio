# Content Authoring

## English-First Workflow

1. Create or update the canonical English entry in one of these locations:
   - `src/content/writing/en/<slug>.md`
   - `src/content/projects/en/<slug>.md`
2. Keep frontmatter aligned with the collection schema in `src/content.config.ts`.
3. Run the localization pipeline when you want generated translations:
   - `OPENAI_API_KEY=... npm run content:translate -- writing`
   - `OPENAI_API_KEY=... npm run content:translate -- projects`
4. Commit any generated locale files under:
   - `src/content/writing/{pt,de,es}/`
   - `src/content/projects/{pt,de,es}/`

Runtime serves static localized markdown only.

## Translation Pipeline

- Script: `scripts/translate-content.ts`
- Provider contract: `src/shared/lib/localization/translation.ts`
- Glossary: `src/i18n/glossary.ts`
- Idempotency:
  - a `sourceHash` is computed from canonical English metadata/body
  - localized files store `sourceHash` in frontmatter
  - re-running skips unchanged entries automatically

## Frontmatter Contracts

### Writing

- `locale: en | pt | de | es`
- `sourceSlug?: string`
- `sourceHash?: string`
- `title: string`
- `description: string`
- `publishedAt: YYYY-MM-DD`
- `fontScale: number` (optional, between `0.85` and `1.45`, default `1`)
- `draft: boolean`
- `featured: boolean`
- `tags: [string, ...]`

### Projects

- `locale: en | pt | de | es`
- `sourceSlug?: string`
- `sourceHash?: string`
- `title: string`
- `summary: string`
- `role: string`
- `status: string`
- `stack: [string, ...]`
- `year: number`
- `featured: boolean`
- `sortOrder: number`
- `repoUrl?: string`

## Notes

- Keep brand and product names stable (`GitHub`, `LinkedIn`, `Krypto`, `MyRetroGameList`, `Inje.X`).
- Do not translate content at request/runtime.
- Projects are external-first in this phase; the hub summarizes them and links out.

## Writing Formatting Extras

- Monochrome terminal mode with CRT texture is the default rendering style for all writing posts.
- Use `fontScale` in writing frontmatter to tune readability per post.
- GitHub-flavored markdown features are supported in posts: tables, task lists, strikethrough, and footnotes.
- Use callouts with blockquotes:
  - `> [!TIP]`
  - `> Keep this section practical and concise.`
- Use inline HTML when you want precise control:
  - `<span data-size="sm">small</span>`, `<span data-size="lg">large</span>`, `<span data-size="xl">extra large</span>`
  - `<p class="md-lead">lead paragraph</p>`
  - `<p class="zine-pull">pull quote / highlighted statement</p>`
  - `<p class="zine-gloss">editor note or tiny annotation</p>`
  - `<span class="md-chip">Label</span>`
  - `<div data-align="center">Centered block</div>`
