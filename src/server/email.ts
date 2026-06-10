/**
 * Transactional email sender for magic links. An interface so the business logic is
 * testable and the concrete provider (Resend) is wired only in production. The magic-link
 * URL contains a one-time token; never log it in production. Ported from moola (ADR 0003).
 */
export interface MagicLinkEmail {
  email: string;
  url: string;
  locale: string;
}

export interface EmailSender {
  sendMagicLink(message: MagicLinkEmail): Promise<void>;
}

/**
 * Development-only sender that prints the magic link to the console so a developer can sign
 * in locally. Not for production (it would put the token in logs); a real provider is used
 * when the email credentials are configured.
 */
export class ConsoleEmailSender implements EmailSender {
  async sendMagicLink(message: MagicLinkEmail): Promise<void> {
    console.info(`[dev] magic link for ${message.email}: ${message.url}`);
  }
}

/**
 * Fail-safe sender used when no real provider is configured: it does nothing (and never
 * logs the token). Magic links are simply not delivered until a transactional provider is
 * wired, so no login token ever reaches the logs.
 */
export class NoopEmailSender implements EmailSender {
  async sendMagicLink(): Promise<void> {
    // Intentionally empty.
  }
}

/** Captures sent messages for tests. */
export class CapturingEmailSender implements EmailSender {
  readonly sent: MagicLinkEmail[] = [];
  async sendMagicLink(message: MagicLinkEmail): Promise<void> {
    this.sent.push(message);
  }
}
