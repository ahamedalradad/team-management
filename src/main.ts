import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { JsendInterceptor } from "./interceptors/Jsend.interceptor";
import helmet from "helmet";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle("team management API")
    .setDescription("The team API description")
    .setVersion("1.0")
    .addTag("team management")
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/api", app, documentFactory);
  SwaggerModule.setup("swagger", app, documentFactory, {
    jsonDocumentUrl: "swagger/json",
  });
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:"],
          fontSrc: ["'self'", "https:", "data:"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
        },
      },
    }),
  );
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
