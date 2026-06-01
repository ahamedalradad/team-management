-- CreateTable
CREATE TABLE `Team` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `profile` VARCHAR(191) NOT NULL DEFAULT 'images/team-profile/profile.jpg',
    `ownerId` INTEGER NOT NULL,

    UNIQUE INDEX `Team_name_key`(`name`),
    UNIQUE INDEX `Team_ownerId_key`(`ownerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'memeber',
    `profile` VARCHAR(191) NOT NULL DEFAULT 'images/user-profile/profile.jpg',
    `skills` VARCHAR(191) NULL,
    `teamId` INTEGER NULL,
    `taskId` INTEGER NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Verification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `isAccountVerified` BOOLEAN NOT NULL DEFAULT false,
    `verificationToken` INTEGER NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `Verification_verificationToken_key`(`verificationToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ResetPassword` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `allowed` BOOLEAN NOT NULL DEFAULT false,
    `resetPasswordToken` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `ResetPassword_resetPasswordToken_key`(`resetPasswordToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Task` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `skillsNeeds` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_tasks` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_tasks_AB_unique`(`A`, `B`),
    INDEX `_tasks_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Team` ADD CONSTRAINT `Team_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Verification` ADD CONSTRAINT `Verification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ResetPassword` ADD CONSTRAINT `ResetPassword_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_tasks` ADD CONSTRAINT `_tasks_A_fkey` FOREIGN KEY (`A`) REFERENCES `Task`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_tasks` ADD CONSTRAINT `_tasks_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
