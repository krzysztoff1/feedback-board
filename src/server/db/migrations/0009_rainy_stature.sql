CREATE TABLE IF NOT EXISTS "feedback-board_Comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"boardId" integer NOT NULL,
	"suggestionId" integer NOT NULL,
	"createdBy" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "comment_boardId_idx" ON "feedback-board_Comments" ("boardId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "comment_suggestionId_idx" ON "feedback-board_Comments" ("suggestionId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "comment_userId_idx" ON "feedback-board_Comments" ("createdBy");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "feedback-board_Comments" ADD CONSTRAINT "feedback-board_Comments_boardId_feedback-board_boards_id_fk" FOREIGN KEY ("boardId") REFERENCES "feedback-board_boards"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "feedback-board_Comments" ADD CONSTRAINT "feedback-board_Comments_suggestionId_feedback-board_suggestions_id_fk" FOREIGN KEY ("suggestionId") REFERENCES "feedback-board_suggestions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "feedback-board_Comments" ADD CONSTRAINT "feedback-board_Comments_createdBy_feedback-board_user_id_fk" FOREIGN KEY ("createdBy") REFERENCES "feedback-board_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
