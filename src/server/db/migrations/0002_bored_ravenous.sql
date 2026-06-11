CREATE TABLE `uploaded_files` (
	`id` text PRIMARY KEY NOT NULL,
	`dossier_id` text NOT NULL,
	`workspace_id` text NOT NULL,
	`filename` text NOT NULL,
	`mime` text,
	`size` integer NOT NULL,
	`sha256` text,
	`category` text DEFAULT 'tender' NOT NULL,
	`scan_status` text DEFAULT 'pending' NOT NULL,
	`status` text NOT NULL,
	`created_by` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`dossier_id`) REFERENCES `dossiers`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_uploaded_files_dossier` ON `uploaded_files` (`dossier_id`);