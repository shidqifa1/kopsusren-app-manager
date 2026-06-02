CREATE TABLE "app_state" (
	"id" serial PRIMARY KEY,
	"data" jsonb NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
