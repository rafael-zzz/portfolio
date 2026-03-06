import type { Locale } from "@/i18n/config";

export type LocalizableCollection = "writing" | "projects";

export interface TranslateContentInput {
  collection: LocalizableCollection;
  slug: string;
  targetLocale: Exclude<Locale, "en">;
  glossaryTerms: string[];
  fields: Record<string, string>;
  body?: string;
}

export interface TranslateContentResult {
  fields: Record<string, string>;
  body?: string;
}

export interface TranslationProvider {
  translate(input: TranslateContentInput): Promise<TranslateContentResult>;
}

const localeDirective: Record<Exclude<Locale, "en">, string> = {
  pt: "Brazilian Portuguese",
  de: "German",
  es: "Neutral Latin American Spanish",
};

export class OpenAITranslationProvider implements TranslationProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is required for content translation.");
    }

    this.apiKey = apiKey;
  }

  async translate(input: TranslateContentInput): Promise<TranslateContentResult> {
    const glossaryText = input.glossaryTerms.length
      ? `Do not translate these terms: ${input.glossaryTerms.join(", ")}.`
      : "";

    const prompt = [
      `Translate the following ${input.collection} metadata into ${localeDirective[input.targetLocale]}.`,
      "Return valid JSON with exactly these keys: fields, body.",
      "The fields object must preserve the same keys it received.",
      "Preserve markdown structure and heading levels in body.",
      "Keep technical terms precise and natural for the target locale.",
      glossaryText,
      `Slug: ${input.slug}`,
      `Fields: ${JSON.stringify(input.fields)}`,
      `Body: ${input.body ?? ""}`,
    ].join("\n\n");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content: "You are a precise localization assistant for static websites.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: {
          type: "json_object",
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI translation failed with status ${response.status}.`);
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string | null } }>;
    };

    const rawContent = payload.choices?.[0]?.message?.content;

    if (!rawContent) {
      throw new Error("OpenAI translation did not return content.");
    }

    const parsed = JSON.parse(rawContent) as Partial<TranslateContentResult>;

    if (!parsed.fields || typeof parsed.fields !== "object") {
      throw new Error("OpenAI translation response is missing translated fields.");
    }

    return {
      fields: parsed.fields,
      body: parsed.body,
    };
  }
}
