-- CreateTable
CREATE TABLE "event_images" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "event_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "event_images_event_id_idx" ON "event_images"("event_id");

-- AddForeignKey
ALTER TABLE "event_images" ADD CONSTRAINT "event_images_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
