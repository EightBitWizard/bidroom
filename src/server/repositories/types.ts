import type { Role } from "@/shared/roles";

/** Row shapes returned by the repositories. Timestamps are ISO-8601 strings. */

export interface Account {
  id: string;
  email: string;
  name: string | null;
  locale: string | null;
  sessionVersion: number;
  createdAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  workingLanguage: string;
  createdBy: string;
  createdAt: string;
}

export interface WorkspaceWithRole extends Workspace {
  role: Role;
}

export interface Membership {
  workspaceId: string;
  accountId: string;
  role: Role;
  createdAt: string;
}

export interface Invitation {
  id: string;
  workspaceId: string;
  email: string;
  role: Role;
  expiresAt: string;
  acceptedAt: string | null;
  invitedBy: string;
  createdAt: string;
}
