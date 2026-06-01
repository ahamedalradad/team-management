import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  sendLogin(email: string) {
    const today = new Date();
    this.mailerService.sendMail({
      to: email,
      from: "team managemet community",
      subject: 'Log in',
      html: `Hi , you logged in ${today}  if you didn't log change your ppassword`,
      context: { email, today },
    });
  }
  sendEmailVerification(email: string, link: string, token: number) {
    this.mailerService.sendMail({
      to: email,
      from: "team managemet community",
      subject: 'verify token',
      html: `please verify your token here ${link} and this is the token ${token}`,
      context: { email, link },
    });
  }
  sendResetPsswordToken(email: string, link: string, token: string) {
    this.mailerService.sendMail({
      to: email,
      from: "team managemet community",
      subject: 'reset Password token',
      html: `to reset your Password click here ${link} the token: ${token}`,
      context: { email, link },
    });
  }
  generateLink(id: number, service: string) {
    return `${process.env.host}/${service}/${id}`;
  }
}
