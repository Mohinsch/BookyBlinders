CREATE INDEX "book_category_book_id_idx" ON "book_category" USING btree ("book_id");--> statement-breakpoint
CREATE INDEX "book_category_category_id_idx" ON "book_category" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "library_book_library_id_idx" ON "library_book" USING btree ("library_id");--> statement-breakpoint
CREATE INDEX "library_book_book_id_idx" ON "library_book" USING btree ("book_id");--> statement-breakpoint
CREATE INDEX "user_category_user_id_idx" ON "user_category" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_category_category_id_idx" ON "user_category" USING btree ("category_id");