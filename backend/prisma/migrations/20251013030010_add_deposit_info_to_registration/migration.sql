/*
  Warnings:

  - The values [PENDING_PAYMENT] on the enum `RegistrationStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `event_id` on the `transactions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[transaction_id]` on the table `registrations` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RegistrationStatus_new" AS ENUM ('REGISTERED', 'CANCELLED', 'DEPOSITED');
ALTER TABLE "public"."registrations" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "registrations" ALTER COLUMN "status" TYPE "RegistrationStatus_new" USING ("status"::text::"RegistrationStatus_new");
ALTER TYPE "RegistrationStatus" RENAME TO "RegistrationStatus_old";
ALTER TYPE "RegistrationStatus_new" RENAME TO "RegistrationStatus";
DROP TYPE "public"."RegistrationStatus_old";
ALTER TABLE "registrations" ALTER COLUMN "status" SET DEFAULT 'REGISTERED';
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."transactions" DROP CONSTRAINT "transactions_event_id_fkey";

-- AlterTable
ALTER TABLE "registrations" ADD COLUMN     "transaction_id" TEXT;

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "event_id";

-- CreateIndex
CREATE UNIQUE INDEX "registrations_transaction_id_key" ON "registrations"("transaction_id");

-- AddForeignKey
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
