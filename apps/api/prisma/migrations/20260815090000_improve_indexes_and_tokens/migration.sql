-- AlterTable
ALTER TABLE "Subscriber" ADD COLUMN "unsubToken" TEXT;
CREATE UNIQUE INDEX "Subscriber_unsubToken_key" ON "Subscriber"("unsubToken");

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN "approved" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "Article_status_updatedAt_idx" ON "Article"("status", "updatedAt");
CREATE INDEX "Product_status_updatedAt_idx" ON "Product"("status", "updatedAt");
CREATE INDEX "Course_status_updatedAt_idx" ON "Course"("status", "updatedAt");
CREATE INDEX "KajianEvent_status_startsAt_idx" ON "KajianEvent"("status", "startsAt");
CREATE INDEX "ContactMessage_createdAt_idx" ON "ContactMessage"("createdAt");
