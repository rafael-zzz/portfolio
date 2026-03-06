import { defineCollection, z } from "astro:content";

const localeSchema = z.enum(["en", "pt", "de", "es"]);
const baseLocalizedSchema = z.object({
  locale: localeSchema,
  sourceSlug: z.string().min(1).optional(),
  sourceHash: z.string().min(1).optional(),
});

function withLocalizedSourceValidation<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
  entryLabel: string,
) {
  return schema.superRefine((value: z.infer<typeof schema>, context: z.RefinementCtx) => {
    if (value.locale === "en") {
      return;
    }

    if (!value.sourceSlug) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["sourceSlug"],
        message: `sourceSlug is required for localized ${entryLabel} entries.`,
      });
    }

    if (!value.sourceHash) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["sourceHash"],
        message: `sourceHash is required for localized ${entryLabel} entries.`,
      });
    }
  });
}

const writingCollection = defineCollection({
  type: "content",
  schema: withLocalizedSourceValidation(
    baseLocalizedSchema.extend({
      title: z.string().min(1),
      description: z.string().min(1),
      publishedAt: z.coerce.date(),
      fontScale: z.coerce.number().min(0.85).max(1.45).default(1),
      draft: z.boolean().default(false),
      featured: z.boolean().default(false),
      tags: z.array(z.string().min(1)).default([]),
    }),
    "writing",
  ),
});

const projectsCollection = defineCollection({
  type: "content",
  schema: withLocalizedSourceValidation(
    baseLocalizedSchema.extend({
      title: z.string().min(1),
      summary: z.string().min(1),
      role: z.string().min(1),
      status: z.string().min(1),
      stack: z.array(z.string().min(1)).min(1),
      year: z.coerce.number().int(),
      featured: z.boolean().default(false),
      sortOrder: z.coerce.number().int().default(0),
      repoUrl: z.string().url().optional(),
      externalUrl: z.string().url(),
    }),
    "project",
  ),
});

export const collections = {
  writing: writingCollection,
  projects: projectsCollection,
};
