-- Add parentId column to Comment for threading support

ALTER TABLE "Comment" ADD COLUMN IF NOT EXISTS "parentId" TEXT;

-- Add self-referencing foreign key
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey"
  FOREIGN KEY ("parentId") REFERENCES "Comment"(id)
  ON DELETE SET NULL
  ON UPDATE CASCADE;

-- Create index for faster reply lookups
CREATE INDEX IF NOT EXISTS "Comment_parentId_idx" ON "Comment"("parentId");
