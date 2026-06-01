/*
  Warnings:

  - You are about to drop the column `skillsNeeds` on the `Task` table. All the data in the column will be lost.
  - Added the required column `skillsRequired` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Task` DROP COLUMN `skillsNeeds`,
    ADD COLUMN `skillsRequired` JSON NOT NULL,
    ADD COLUMN `teamId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
