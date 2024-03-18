CREATE TABLE IF NOT EXISTS "feedback-board_suggestionsUpVotes" (
	"id" serial PRIMARY KEY NOT NULL,
	"boardId" integer NOT NULL,
	"suggestionId" integer NOT NULL,
	"userId" varchar(255) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "feedback-board_suggestionsUpVotes" ADD CONSTRAINT "feedback-board_suggestionsUpVotes_boardId_feedback-board_boards_id_fk" FOREIGN KEY ("boardId") REFERENCES "feedback-board_boards"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "feedback-board_suggestionsUpVotes" ADD CONSTRAINT "feedback-board_suggestionsUpVotes_suggestionId_feedback-board_suggestions_id_fk" FOREIGN KEY ("suggestionId") REFERENCES "feedback-board_suggestions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "feedback-board_suggestionsUpVotes" ADD CONSTRAINT "feedback-board_suggestionsUpVotes_userId_feedback-board_user_id_fk" FOREIGN KEY ("userId") REFERENCES "feedback-board_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
