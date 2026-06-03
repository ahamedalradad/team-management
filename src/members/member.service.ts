import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdateMemberDto } from "./dtos/update-member.dto";

@Injectable()
export class MemberService {
  constructor(private readonly prisma: PrismaService) {}
  async updateMember(teamId: number, id: number, data: UpdateMemberDto) {
    return await this.prisma.user.update({
      where: { id, teamId },
      data: { role: data.role },
    });
  }

  async deleteMembers(usersId: number[], teamId: number) {
    await this.prisma.user.updateMany({
      where: {
        id: { in: usersId },
        teamId,
      },
      data: { teamId: null },
    });
  }
}
