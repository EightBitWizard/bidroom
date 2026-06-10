// Workspace roles, shared between the authz module, repositories, and the UI. Kept in
// src/shared so the domain layer can use them without importing server code.
export const ROLES = ["owner", "member"] as const;
export type Role = (typeof ROLES)[number];

export function isRole(value: string): value is Role {
  return (ROLES as readonly string[]).includes(value);
}

/** Whether a role is allowed to administer a workspace (invite, rename, delete). */
export function canAdminister(role: Role): boolean {
  return role === "owner";
}
