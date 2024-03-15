CREATE TABLE IF NOT EXISTS "feedback-board_suggestions" (
	"id" serial PRIMARY KEY NOT NULL,
	"boardId" integer NOT NULL,
	"content" text NOT NULL,
	"createdBy" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp,
	"upVotes" integer DEFAULT 0
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "boardId_idx" ON "feedback-board_suggestions" ("boardId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "createdBy_idx" ON "feedback-board_suggestions" ("createdBy");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "feedback-board_suggestions" ADD CONSTRAINT "feedback-board_suggestions_boardId_feedback-board_boards_id_fk" FOREIGN KEY ("boardId") REFERENCES "feedback-board_boards"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "feedback-board_suggestions" ADD CONSTRAINT "feedback-board_suggestions_createdBy_feedback-board_user_id_fk" FOREIGN KEY ("createdBy") REFERENCES "feedback-board_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
