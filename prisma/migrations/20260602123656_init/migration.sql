/*
  Warnings:

  - You are about to drop the column `accepted` on the `invitation` table. All the data in the column will be lost.
  - Made the column `skills` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `id` to the `invitation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `invitation` DROP FOREIGN KEY `invitation_invitedId_fkey`;

-- DropForeignKey
ALTER TABLE `invitation` DROP FOREIGN KEY `invitation_teamId_fkey`;

-- DropIndex
DROP INDEX `invitation_invitedId_key` ON `invitation`;

-- DropIndex
DROP INDEX `invitation_teamId_fkey` ON `invitation`;

-- AlterTable
ALTER TABLE `User` MODIFY `skills` JSON NOT NULL;

-- AlterTable
ALTER TABLE `invitation` DROP COLUMN `accepted`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `invitation` ADD CONSTRAINT `invitation_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invitation` ADD CONSTRAINT `invitation_invitedId_fkey` FOREIGN KEY (`invitedId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
