import { JwtService } from "@nestjs/jwt";
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateTeamDto } from "./dtos/update-team.dto";
import { CreateTeamDto } from "./dtos/add-team.dto";

@Injectable()
export class TeamService {
  constructor(private readonly prisma: PrismaService) {}
  /* 
 this is for finding teams,
finding is allowed to all, 

*/

  async findOneById(id: number) {
    const team = await this.prisma.team.findUnique({
      where: { id, public: true },
      include: { members: true },
    });
    if (!team) {
      throw new NotFoundException("this id in not existing");
    }
    return team;
  }

  async findAll(pageSize: number, page: number) {
    const skip = (page - 1) * pageSize;
    const teams = await this.prisma.team.findMany({
      where: { public: true },
      skip,
      take: pageSize,
    });
    return teams;
  }

  async findManyByName(name: string) {
    return this.prisma.team.findMany({
      where: { name, public: true },
      include: { members: true },
    });
  }
  async getCurrentTeam(id: number) {
    return this.findOneById(id);
  }

  async createTeam(data: CreateTeamDto, id: number) {
    const team = await this.prisma.team.create({
      data: { ...data, ownerId: id },
    });
    await this.prisma.user.update({
      where: { id },
      data: { teamId: team.id, role: "owner" },
    });

    return team;
  }
  async updateTeam(id: number, data: UpdateTeamDto) {
    return await this.prisma.team.update({
      where: { id },
      data,
    });
  }

  async deleteTeam(id: number) {
    return await this.prisma.team.delete({ where: { id } });
  }
}
