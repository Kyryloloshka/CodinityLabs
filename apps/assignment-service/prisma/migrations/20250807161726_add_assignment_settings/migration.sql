-- CreateTable
CREATE TABLE "assignment_settings" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "timeout" INTEGER NOT NULL DEFAULT 5000,
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,
    "passingThreshold" DOUBLE PRECISION NOT NULL DEFAULT 80.0,
    "allowPartialScore" BOOLEAN NOT NULL DEFAULT true,
    "strictMode" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assignment_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "assignment_settings_assignmentId_key" ON "assignment_settings"("assignmentId");

-- AddForeignKey
ALTER TABLE "assignment_settings" ADD CONSTRAINT "assignment_settings_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
