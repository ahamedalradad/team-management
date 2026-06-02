-- CreateTable
CREATE TABLE `invitation` (
    `invitedId` INTEGER NOT NULL,
    `teamId` INTEGER NOT NULL,
    `accepted` BOOLEAN NOT NULL,

    UNIQUE INDEX `invitation_invitedId_key`(`invitedId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `invitation` ADD CONSTRAINT `invitation_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invitation` ADD CONSTRAINT `invitation_invitedId_fkey` FOREIGN KEY (`invitedId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
