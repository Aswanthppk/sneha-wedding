CREATE TABLE "rsvps" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"attending" boolean NOT NULL,
	"guest_count" integer DEFAULT 0 NOT NULL,
	"selected_events" jsonb DEFAULT '[]' NOT NULL,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"key" text PRIMARY KEY,
	"value" text NOT NULL
);
