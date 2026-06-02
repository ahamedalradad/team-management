import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error("DATABASE_URL is not defined in your .env file");
    }

    // 💡 الحل الجذري: نمرر نص الاتصال (string) مباشرة والـ Adapter سيقوم بإنشاء الـ Pool وإدارته تلقائياً
    const adapter = new PrismaMariaDb(connectionString);

    // تمرير الـ adapter إلى كلاس الـ PrismaClient الرئيسي
    super({ adapter });
  }

  // فتح الاتصال فور تشغيل التطبيق
  async onModuleInit() {
    await this.$connect();
  }

  // إغلاق الاتصال بأمان عند إيقاف السيرفر
  async onModuleDestroy() {
    await this.$disconnect();
  }
}