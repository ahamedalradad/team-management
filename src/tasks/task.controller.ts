import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { TaskService } from "./task.service";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { RolesGuard } from "src/guards/auth-roles.guard";
import { isOwnUser } from "src/guards/is-own.guard";
import { CurrentUser } from "src/decorators/current-user.decorator";
import { CreateTaskDto } from "./dtos/task.create";
import { Roles } from "src/decorators/roles.decorator";
import { CurrentTeam } from "src/decorators/current-team.decorator";
import { UpdateTaskDto } from "./dtos/task.update";
import { GetQueryDto } from "src/users/dtos/paginaion.dto";
import { ApiHeader, ApiParam, ApiOperation } from "@nestjs/swagger";

@Controller("task")
@UseGuards(JwtAuthGuard, RolesGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @UseGuards(isOwnUser)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiHeader({
    name: "authorization",
    required: true,
    description: "access token (JWT Token)",
  })
  @ApiOperation({ description: "find all you tasks" })
  findAll(@CurrentUser() user: any, @Query() query: GetQueryDto) {
    return this.taskService.findAll(user.id, query.limit || 1, query.page || 1);
  }

  @Get("id/:id")
  @UseGuards(isOwnUser)
  @ApiHeader({
    name: "authorization",
    required: true,
    description: "access token (JWT Token)",
  })
  @ApiOperation({ description: "find task by id" })
  @ApiParam({
    name: "taskId",
    required: true,
    description: "id of task to find it",
  })
  findOneById(@CurrentUser() user: any, @Param("id", ParseIntPipe) id: number) {
    return this.taskService.findOneById(user.id, id);
  }

  @Get("name/:name")
  @UseGuards(isOwnUser)
  @ApiHeader({
    name: "authorization",
    required: true,
    description: "access token (JWT Token)",
  })
  @ApiOperation({ description: "find task by name" })
  @ApiParam({
    name: "task Name",
    required: true,
    description: "name of task to find it",
  })
  findByName(@CurrentUser() user: any, @Param("name") name: string) {
    return this.taskService.findManyByName(name, user.id);
  }

  @Get("/currentTasks")
  @UseGuards(isOwnUser)
  @ApiHeader({
    name: "authorization",
    required: true,
    description: "access token (JWT Token)",
  })
  @ApiOperation({ description: "get all tasks is active" })
  getCurrentTasks(@CurrentUser() user: any) {
    return this.taskService.getCurrentTask(user.id);
  }

  @Post()
  @Roles(["owner", "admin"])
  @ApiHeader({
    name: "authorization",
    required: true,
    description: "access token (JWT Token)",
  })
  @ApiOperation({ description: "create task " })
  createTask(@Body() data: CreateTaskDto, @CurrentTeam() team: any) {
    return this.taskService.createTask(data, team);
  }

  @Patch("/:taskId")
  @Roles(["owner", "admin"])
  @ApiHeader({
    name: "authorization",
    required: true,
    description: "access token (JWT Token)",
  })
  @ApiParam({
    name: "task id",
    required: true,
    description: "task id to update it",
  })
  @ApiOperation({ description: "update task" })
  updateTask(
    @Param("taskId", ParseIntPipe) id: number,
    @Body() data: UpdateTaskDto,
    @CurrentTeam() teamId: number,
  ) {
    return this.taskService.updateTask(id, data, teamId);
  }

  @Delete("/:taskId")
  @Roles(["owner", "admin"])
  @ApiHeader({
    name: "authorization",
    required: true,
    description: "access token (JWT Token)",
  })
  @ApiParam({
    name: "task Id",
    required: true,
    description: "the ID of task to delete it",
  })
  @ApiOperation({ description: "delete task" })
  deleteTask(
    @CurrentTeam() teamId: number,
    @Param("taskId", ParseIntPipe) taskId: number,
  ) {
    return this.taskService.deleteTask(taskId, teamId);
  }

  @Post("/member/:taskId")
  @Roles(["owner", "admin"])
  @ApiHeader({
    name: "authorization",
    required: true,
    description: "access token (JWT Token)",
  })
  @ApiParam({
    name: "taskId",
    required: true,
    description: "the ID of task to add members to it",
  })
  @ApiOperation({ description: "add members to task" })
  addMembersToTask(
    @Param("taksId", ParseIntPipe) taskId: number,
    @CurrentTeam() teamId: number,
    @Body() usersId: number[],
  ) {
    return this.taskService.addMembersToTask(taskId, teamId, usersId);
  }

  @Delete("/member/:taskId")
  @Roles(["owner", "admin"])
  @ApiHeader({
    name: "authorization",
    required: true,
    description: "access token (JWT Token)",
  })
  @ApiParam({
    name: "task Id",
    required: true,
    description: "the ID of  task to remove memeber from it",
  })
  @ApiOperation({ description: "remove members from task" })
  removeMembersfromTask(
    @Param("taksId", ParseIntPipe) taskId: number,
    @CurrentTeam() teamId: number,
    @Body() usersId: number[],
  ) {
    return this.taskService.removeMembersfromTask(taskId, teamId, usersId);
  }
}
