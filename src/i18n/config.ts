// Bidroom ships English-first; German is next (PRD NFR-I18N-002). Source documents in
// DE/FR/IT/EN are accepted by the pipeline, but the UI launches in English.
export const locales = ["en", "de"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
