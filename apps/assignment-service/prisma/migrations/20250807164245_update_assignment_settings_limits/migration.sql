-- AlterTable
ALTER TABLE "assignment_settings" ALTER COLUMN "timeout" SET DEFAULT 2000,
ALTER COLUMN "maxAttempts" DROP NOT NULL,
ALTER COLUMN "maxAttempts" DROP DEFAULT;
