import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdateMemberDto } from "./dtos/update-member.dto";

@Injectable()
export class MemberService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(teamId: number) {
    const memebers = await this.prisma.user.findMany({ where: { teamId } });
    return memebers;
  }

  async findManyByName(name: string, teamId: number) {
    return await this.prisma.user.findMany({ where: { name, teamId } });
  }

  async getCurrentTeamMembers(id: number) {
    const team = await this.prisma.team.findUnique({ where: { id } });
    if (!team) throw new NotFoundException("Invalid token");
    const memebers = await this.prisma.user.findMany({
      where: { teamId: team.id },
    });
    if (memebers.length === 0) {
      return { message: "you didn't have any memeber" };
    }
    return memebers;
  }
  async updateMember(teamId: number,id: number, data: UpdateMemberDto) {
    return await this.prisma.user.update({
      where: { id , teamId},
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
