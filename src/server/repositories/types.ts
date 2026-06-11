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

export interface CompanyProfile {
  id: string;
  workspaceId: string;
  capabilityTags: string[];
  regions: string[];
  languages: string[];
  certifications: string[];
  exclusions: string[];
  profileVersion: number;
  createdAt: string;
  updatedAt: string;
}

export interface TenderSourceItem {
  id: string;
  simapProjectId: string;
  simapPublicationId: string;
  simapUrl: string;
  authority: string | null;
  title: string | null;
  procedureType: string | null;
  publicationDate: string | null;
  /** The verbatim SIMAP API JSON, never edited (LEG-002). */
  rawSource: string;
  fetchedAt: string;
}

export interface Dossier {
  id: string;
  workspaceId: string;
  sourceItemId: string;
  title: string;
  status: string;
  createdBy: string;
  createdAt: string;
}

export interface UploadedFile {
  id: string;
  dossierId: string;
  workspaceId: string;
  filename: string;
  mime: string | null;
  size: number;
  sha256: string | null;
  category: string;
  /** Fail-closed malware scan state: pending, clean, infected, error. */
  scanStatus: string;
  /** Outcome: stored, unsupported, too_large, failed. */
  status: string;
  createdBy: string;
  createdAt: string;
}
