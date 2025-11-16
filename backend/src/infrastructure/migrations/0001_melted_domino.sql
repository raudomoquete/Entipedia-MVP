CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"email" text,
	"phone" text,
	"lifetime_value" numeric(12, 2),
	"created_at" timestamp DEFAULT now() NOT NULL
);
