/*
  Warnings:

  - A unique constraint covering the columns `[apiKey]` on the table `ApiKey` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Provider` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_email_idx";

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_apiKey_key" ON "ApiKey"("apiKey");

-- CreateIndex
CREATE UNIQUE INDEX "Provider_name_key" ON "Provider"("name");

-- CreateIndex
CREATE INDEX "Provider_id_name_idx" ON "Provider"("id", "name");

-- CreateIndex
CREATE INDEX "User_id_email_idx" ON "User"("id", "email");
