/**
 * Pipeline Worker entry (ADR 0002). Stub in Phase 0. From WP-013 onward this hosts the
 * dossier Workflow, the email queue consumer, and the retention/reminders cron handlers,
 * and invokes the parsing Container. It imports only from @/server and @/domain, never the
 * web app. Pipeline step functions stay plain and portable.
 */
const pipelineWorker = {
  async fetch(): Promise<Response> {
    return new Response("bidroom pipeline worker", { status: 200 });
  },
};

export default pipelineWorker;
