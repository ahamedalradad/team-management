import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { JsendInterceptor } from "./interceptors/Jsend.interceptor";
import cookieParser from "cookie-parser";
import { doubleCsrf } from "csrf-csrf";
import helmet from "helmet";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const config = new DocumentBuilder()
    .setTitle("Cats example")
    .setDescription("The cats API description")
    .setVersion("1.0")
    .addTag("cats")
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, documentFactory);
  SwaggerModule.setup("swagger", app, documentFactory, {
    jsonDocumentUrl: "swagger/json",
  });
  app.use(cookieParser('294b464c06d852b6c211bb4da341298da7af0fb5951d5143ab9ccc7f966965b1'))

  const { doubleCsrfProtection } = doubleCsrf({
    getSecret: () => 'your-secret-key', 
    cookieName: '__Host-psn-csrf', 
    cookieOptions: {
      sameSite: 'lax',
      path: '/',
      secure: true, 
      httpOnly: true,
    },
    size: 64,
    ignoredMethods: ['GET', 'HEAD', 'OPTIONS'], 
    getCsrfTokenFromRequest: (req) => req.headers['x-csrf-token'], 

getSessionIdentifier: (req) => {
    return req.cookies['connect.sid'] || 'anonymous-session';
  },

  });
  app.use(helmet())
  app.useGlobalInterceptors(new JsendInterceptor)
  app.use(doubleCsrfProtection)
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
