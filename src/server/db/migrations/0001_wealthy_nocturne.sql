CREATE TABLE `company_profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`capability_tags` text,
	`regions` text,
	`languages` text,
	`certifications` text,
	`exclusions` text,
	`profile_version` integer DEFAULT 1 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `company_profiles_workspace_id_unique` ON `company_profiles` (`workspace_id`);--> statement-breakpoint
CREATE TABLE `dossiers` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`source_item_id` text NOT NULL,
	`title` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_by` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`source_item_id`) REFERENCES `tender_source_items`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_dossiers_workspace` ON `dossiers` (`workspace_id`);--> statement-breakpoint
CREATE TABLE `tender_source_items` (
	`id` text PRIMARY KEY NOT NULL,
	`simap_project_id` text NOT NULL,
	`simap_publication_id` text NOT NULL,
	`simap_url` text NOT NULL,
	`authority` text,
	`title` text,
	`procedure_type` text,
	`publication_date` text,
	`raw_source` text NOT NULL,
	`fetched_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_tender_source_notice` ON `tender_source_items` (`simap_project_id`,`simap_publication_id`);