import { Module } from "@nestjs/common";
import { MailService } from "./mailer.service";
import { MailerModule } from "@nestjs-modules/mailer";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          service: "gmail",
          secure: false,
          auth: {
            user: configService.get("EMAIL_USERNAME"),
            pass: configService.get("EMAIL_PASSWORD"),
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
