import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  async sendLogin(email: string) {
    const today = new Date();
    await this.mailerService.sendMail({
      to: email,
      from: `Team management <${process.env.EMAIL_USERNAME}>`,
      subject: "Log in",
      html: `Hi , you logged in ${today}  if you didn't log change your ppassword`,
      context: { email, today },
    });
  }
  async sendEmailVerification(email: string, link: string, token: number) {
    await this.mailerService.sendMail({
      to: email,
      from: `Team management <${process.env.EMAIL_USERNAME}>`,
      subject: "verify token",
      html: `please verify your token here ${link} and this is the token ${token}`,
      context: { email, link },
    });
  }
  async sendResetPsswordToken(email: string, link: string, token: string) {
    await this.mailerService.sendMail({
      to: email,
      from: "team managemet community",
      subject: "reset Password token",
      html: `to reset your Password click here ${link} the token: ${token}`,
      context: { email, link },
    });
  }
  generateLink(id: number, service: string) {
    return `${process.env.HOST}/auth/${service}/${id}`;
  }
}
