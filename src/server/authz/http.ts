import { AuthzError } from "./index";

/**
 * Map an AuthzError to an HTTP response: "not_found" -> 404 (a non-member must not learn a
 * workspace exists), "forbidden" -> 403. Re-throws anything that is not an AuthzError so real
 * errors are not masked.
 */
export function authzErrorResponse(error: unknown): Response {
  if (error instanceof AuthzError) {
    return Response.json({ error: error.kind }, { status: error.kind === "forbidden" ? 403 : 404 });
  }
  throw error;
}
