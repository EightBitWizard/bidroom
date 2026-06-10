import { describe, expect, it } from "vitest";
import { AuthzError } from "./index";
import { authzErrorResponse } from "./http";

describe("authzErrorResponse", () => {
  it("maps not_found to 404", () => {
    expect(authzErrorResponse(new AuthzError("not_found")).status).toBe(404);
  });

  it("maps forbidden to 403", () => {
    expect(authzErrorResponse(new AuthzError("forbidden")).status).toBe(403);
  });

  it("re-throws non-authz errors", () => {
    const boom = new Error("boom");
    expect(() => authzErrorResponse(boom)).toThrow(boom);
  });
});
