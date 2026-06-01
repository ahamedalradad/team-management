import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { MailModule } from "./mailer/mailer.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./users/user.module";
import { TeamModule } from "./teams/team.module";
import { TaskModule } from "./tasks/task.module";
import { MemberModule } from "./members/member.module";
@Module({
  imports: [
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: "60d" },
      secret: process.env.JWT_SECRET,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    MailModule,
    AuthModule,
    UserModule,
    TeamModule,
    TaskModule,
    MemberModule,
  ],
})
export class AppModule {}
