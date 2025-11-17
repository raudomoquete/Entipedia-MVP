CREATE TABLE "files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"file_type" text NOT NULL,
	"file_path" text NOT NULL,
	"mime_type" text NOT NULL,
	"size" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
