import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { TaskService } from "./task.service";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { RolesGuard } from "src/guards/auth-roles.guard";
import { isOwnTeam, isOwnUser } from "src/guards/is-own.guard";
import { CurrentUser } from "src/decorators/current-user.decorator";
import { CreateTaskDto } from "./dtos/task.create";
import { Roles } from "src/decorators/roles.decorator";
import { CurrentTeam } from "src/decorators/current-team.decorator";
import { UpdateTaskDto } from "./dtos/task.update";

@Controller("task")
@UseGuards(JwtAuthGuard, RolesGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @UseGuards(isOwnUser)
  findAll(@CurrentUser() user: any) {
    return this.taskService.findAll(user.id);
  }

  @Get("id/:id")
  @UseGuards(isOwnUser)
  findOneById(@CurrentUser() user: any, @Param("id", ParseIntPipe) id: number) {
    return this.taskService.findOneById(user.id, id);
  }

  @Get("name/:name")
  @UseGuards(isOwnUser)
  findByName(@CurrentUser() user: any, @Param("name") name: string) {
    return this.taskService.findManyByName(name, user.id);
  }

  @Get("/currentTasks")
  @UseGuards(isOwnUser)
  getCurrentTasks(@CurrentUser() user: any) {
    return this.taskService.getCurrentTask(user.id);
  }

  @Post()
  @Roles(["owner", "admin"])
  createTask(@Body() data: CreateTaskDto, @CurrentTeam() team: any) {
    return this.taskService.createTask(data, team);
  }

  @Patch("/:taskId")
  @Roles(["owner", "admin"])
  updateTask(
    @Param("taskId", ParseIntPipe) id: number,
    @Body() data: UpdateTaskDto,
    @CurrentTeam() teamId: number,
  ) {
    return this.taskService.updateTask(id, data, teamId);
  }

  @Delete("/:taskId")
  @Roles(["owner", "admin"])
  deleteTask(
    @CurrentTeam() teamId: number,
    @Param("taskId", ParseIntPipe) taskId: number,
  ) {
    return this.taskService.deleteTask(taskId, teamId);
  }

  @Post("/member/:taskId")
  @Roles(["owner", "admin"])
  addMembersToTask(
    @Param("taksId", ParseIntPipe) taskId: number,
    @CurrentTeam() teamId: number,
    @Body() usersId: number[],
  ) {
    return this.taskService.addMembersToTask(taskId, teamId, usersId);
  }

  @Delete("/member/:taskId")
  @Roles(["owner", "admin"])
  removeMembersfromTask(
    @Param("taksId", ParseIntPipe) taskId: number,
    @CurrentTeam() teamId: number,
    @Body() usersId: number[],
  ) {
    return this.taskService.removeMembersfromTask(taskId, teamId, usersId);
  }
}
