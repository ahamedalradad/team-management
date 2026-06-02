import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateUser } from "./update-user.dto";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  /* 
 this is for finding users,
finding is allowed to all,

*/
  async findOneByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email },
    });
    if (!user) {
      throw new NotFoundException("Invalid email");
    }
    return user;
  }

  async findOneById(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException("Invalid ID");
    }
    return user;
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async findManyByName(name: string) {
    return this.prisma.user.findMany({ where: { name } });
  }
  /* 
 this is for user management,
 finding is allowed  to current user 
*/

  async updateUser(id: number, data: UpdateUser) {
    return await this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id: number) {
    return await this.prisma.user.delete({ where: { id } });
  }
  async leaveTeam(teamId: number, userId: number) {
    return await this.prisma.user.update({
      where: {
        id: userId,
        teamId: teamId,
      },
      data: {
        teamId: null,
        role: "member",
      },
    });
  }
  async joinTeam(userId: number, teamId: number) {
    const team = await this.prisma.team.findUnique({ where: { id: teamId } });
    if (!team) throw new NotFoundException("this team is not found");
    if (!team.public) throw new ForbiddenException("this team is private");
    return await this.prisma.user.update({
      where: { id: userId },
      data: { teamId },
    });
  }
}
