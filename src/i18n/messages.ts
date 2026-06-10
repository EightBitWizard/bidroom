import de from "../../messages/de.json";
import en from "../../messages/en.json";
import type { Locale } from "./config";

/**
 * All user-facing strings are externalized into the message catalogs so the app can ship
 * in several languages and so copy can be reviewed in one place. The English catalog
 * defines the shape; other catalogs must match it. This is the typed dictionary pattern
 * (ADR 0002), mirroring moola; no runtime i18n library.
 */
export type Messages = typeof en;

const catalogs: Record<Locale, Messages> = {
  en,
  de: de as Messages,
};

export function getMessages(locale: Locale): Messages {
  return catalogs[locale];
}
