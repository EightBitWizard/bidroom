import { describe, expect, it } from "vitest";
import { canAdminister, isRole, ROLES } from "./roles";

describe("roles", () => {
  it("recognizes valid roles", () => {
    expect(isRole("owner")).toBe(true);
    expect(isRole("member")).toBe(true);
    expect(isRole("admin")).toBe(false);
  });

  it("only owners administer", () => {
    expect(canAdminister("owner")).toBe(true);
    expect(canAdminister("member")).toBe(false);
  });

  it("exposes the canonical role list", () => {
    expect([...ROLES]).toEqual(["owner", "member"]);
  });
});
