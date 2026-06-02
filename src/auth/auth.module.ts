import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "src/users/user.module";
import { MailService } from "src/mailer/mailer.service";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, MailService, PrismaService],
})
export class AuthModule {}
