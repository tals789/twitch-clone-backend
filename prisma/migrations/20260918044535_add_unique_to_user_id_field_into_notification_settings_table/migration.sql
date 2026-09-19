/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `notification_settings` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "notification_settings_userId_key" ON "notification_settings"("userId");
