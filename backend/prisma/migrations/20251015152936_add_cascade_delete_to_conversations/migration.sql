-- DropForeignKey
ALTER TABLE "public"."conversations" DROP CONSTRAINT "conversations_eventId_fkey";

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
