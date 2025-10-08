/*
  Warnings:

  - You are about to drop the `post_tags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."post_tags" DROP CONSTRAINT "post_tags_post_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."post_tags" DROP CONSTRAINT "post_tags_tag_id_fkey";

-- DropTable
DROP TABLE "public"."post_tags";

-- CreateTable
CREATE TABLE "forum_tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "forum_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_forum_tags" (
    "post_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,

    CONSTRAINT "post_forum_tags_pkey" PRIMARY KEY ("post_id","tag_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "forum_tags_name_key" ON "forum_tags"("name");

-- AddForeignKey
ALTER TABLE "post_forum_tags" ADD CONSTRAINT "post_forum_tags_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_forum_tags" ADD CONSTRAINT "post_forum_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "forum_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
