import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateTaskDto } from "./dtos/task.create";
import { UpdateTaskDto } from "./dtos/task.update";

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async findOneById(userId: number, id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id: id, participateds: { some: { id: userId } } },
    });

    if (!task) throw new NotFoundException("Task not found or access denied");

    return task;
  }

  async findAll(userId: number, pageSize: number, page: number) {
    const skip = (page - 1) * pageSize;
    return await this.prisma.task.findMany({
      where: { participateds: { some: { id: userId } } },
      skip,
      take: pageSize,
    });
  }

  async findManyByName(name: string, userId: number) {
    return await this.prisma.task.findMany({
      where: { name, participateds: { some: { id: userId } } },
    });
  }

  async getCurrentTask(userId: number) {
    return await this.prisma.task.findMany({
      where: { participateds: { some: { id: userId } }, active: true },
    });
  }

  async createTask(data: CreateTaskDto, teamId: number) {
    data.teamId = teamId;
    data.active = true;
    return await this.prisma.task.create({ data });
  }

  async addMembersToTask(taskId: number, teamId: number, usersId: number[]) {
    const users = await this.prisma.user.findMany({
      where: { id: { in: usersId } },
    });

    if (users.length !== usersId.length) {
      throw new NotFoundException("One or more users not found");
    }

    const hasExternalUser = users.some((user) => user.teamId !== teamId);
    if (hasExternalUser) {
      throw new BadRequestException("You can't add members from another team");
    }

    return await this.prisma.task.update({
      where: { id: taskId },
      data: {
        participateds: {
          connect: usersId.map((id) => ({ id })),
        },
      },
    });
  }

  async removeMembersfromTask(
    taskId: number,
    teamId: number,
    usersId: number[],
  ) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { participateds: true },
    });

    if (!task) {
      throw new NotFoundException("Task not found");
    }

    const participatedsId = task.participateds.map((p) => p.id);

    const hasNonParticipant = usersId.some(
      (id) => !participatedsId.includes(id),
    );

    if (hasNonParticipant) {
      throw new BadRequestException(
        "One or more users are not assigned to this task",
      );
    }

    const hasExternalUser = task.participateds
      .filter((p) => usersId.includes(p.id))
      .some((p) => p.teamId !== teamId);

    if (hasExternalUser) {
      throw new BadRequestException(
        "You can't remove members from another team",
      );
    }

    return await this.prisma.task.update({
      where: { id: taskId },
      data: {
        participateds: {
          disconnect: usersId.map((id) => ({ id })),
        },
      },
    });
  }

  async updateTask(id: number, data: UpdateTaskDto, teamId: number) {
    return await this.prisma.task.update({
      where: { id, teamId },
      data,
    });
  }

  async deleteTask(id: number, teamId: number) {
    return await this.prisma.task.delete({ where: { id, teamId } });
  }
}
