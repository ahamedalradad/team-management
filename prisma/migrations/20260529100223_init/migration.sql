/*
  Warnings:

  - You are about to drop the column `taskId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `_tasks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_tasks` DROP FOREIGN KEY `_tasks_A_fkey`;

-- DropForeignKey
ALTER TABLE `_tasks` DROP FOREIGN KEY `_tasks_B_fkey`;

-- AlterTable
ALTER TABLE `Task` MODIFY `description` TEXT NOT NULL,
    MODIFY `skillsNeeds` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `taskId`,
    MODIFY `role` VARCHAR(191) NOT NULL DEFAULT 'member',
    MODIFY `skills` TEXT NULL;

-- DropTable
DROP TABLE `_tasks`;

-- CreateTable
CREATE TABLE `_UserTasks` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_UserTasks_AB_unique`(`A`, `B`),
    INDEX `_UserTasks_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_UserTasks` ADD CONSTRAINT `_UserTasks_A_fkey` FOREIGN KEY (`A`) REFERENCES `Task`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserTasks` ADD CONSTRAINT `_UserTasks_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
