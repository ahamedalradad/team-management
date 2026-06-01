import { Injectable } from "@nestjs/common";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";
@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const adapter = new PrismaMariaDb({ database: "teams' management" });
    super({ adapter });
  }
}
