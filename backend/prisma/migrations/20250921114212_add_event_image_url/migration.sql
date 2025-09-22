/*
  Warnings:

  - You are about to drop the column `image` on the `events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."events" DROP COLUMN "image",
ADD COLUMN     "image_url" TEXT;
