-- AlterEnum
ALTER TYPE "RegistrationStatus" ADD VALUE 'PENDING_PAYMENT';

-- AlterTable
ALTER TABLE "registrations" ADD COLUMN     "phone" TEXT;

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "event_id" TEXT;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
