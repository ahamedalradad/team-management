import { UpdateUser } from "./dtos/update-user.dto";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Headers,
  ParseIntPipe,
  UseGuards,
  Req,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { CurrentUser } from "src/decorators/current-user.decorator";
import { isOwnUser } from "src/guards/is-own.guard";
import { CurrentTeam } from "src/decorators/current-team.decorator";
import { RolesGuard } from "src/guards/auth-roles.guard";
import { Roles } from "src/decorators/roles.decorator";
import { ApiHeader, ApiOperation, ApiParam } from "@nestjs/swagger";
import { GetQueryDto } from "./dtos/paginaion.dto";

@UseGuards(RolesGuard)
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ description: "find all users" })
  @UsePipes(new ValidationPipe({ transform: true }))
  findAll(@Query() query: GetQueryDto) {
    return this.userService.findAll(query.limit || 1, query.page || 1);
  }

  @Get("id/:id")
  @ApiParam({
    name: "userID",
    required: true,
    description: "the ID of user to find it",
  })
  @ApiOperation({ description: "find user by id" })
  findById(@Param("id", ParseIntPipe) id: number) {
    return this.userService.findOneById(id);
  }

  @ApiParam({
    name: "email",
    required: true,
    description: "email of user that you want to find it",
  })
  @Get("email/:email")
  @ApiOperation({ description: "find user by email" })
  findByEmail(@Param("email") email: string) {
    return this.userService.findOneByEmail(email);
  }
  @ApiParam({ name: "name", required: true, description: "the name of user" })
  @Get("name/:name")
  @ApiOperation({ description: "find user by his name" })
  findByName(@Param("name") name: string) {
    return this.userService.findManyByName(name);
  }

  @ApiHeader({
    name: "authorization",
    required: true,
    description: "access token (JWT Token)",
  })
  @Get("/profile")
  @ApiOperation({ description: "to see your account" })
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@CurrentUser() user: any) {
    return user;
  }

  @ApiHeader({
    name: "authorization",
    required: true,
    description: "access token (JWT Token)",
  })
  @ApiParam({
    name: "userId",
    required: true,
    description: "the ID of user(You) to update id",
  })
  @UseGuards(JwtAuthGuard, isOwnUser)
  @Patch("/:id")
  @ApiOperation({ description: "to update your account" })
  updateUser(@Param("id", ParseIntPipe) id: number, @Body() data: UpdateUser) {
    return this.userService.updateUser(id, data);
  }

  @ApiHeader({
    name: "authorization",
    required: true,
    description: "access token (JWT Token)",
  })
  @ApiParam({
    name: "userId",
    required: true,
    description: "the ID of user(You) to update id",
  })
  @ApiOperation({ description: "to delete your account" })
  @UseGuards(JwtAuthGuard, isOwnUser)
  @Delete("/:id")
  deleteUser(@Param("id", ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }

  @ApiHeader({
    name: "authorization",
    required: true,
    description: "access token (JWT Token)",
  })
  @ApiOperation({ description: "to leave team" })
  @UseGuards(JwtAuthGuard)
  @Delete("/leave-team")
  @Roles(["member", "admin"])
  leaveTeam(@CurrentUser() user: any, @CurrentTeam() teamId: number) {
    return this.userService.leaveTeam(teamId, user.id);
  }

  @ApiHeader({
    name: "authorization",
    required: true,
    description: "access token (JWT Token)",
  })
  @ApiParam({
    name: "userId",
    required: true,
    description: "the ID of team which you want to join to it",
  })
  @ApiOperation({ description: "to join to Team" })
  @Post("/join/:id")
  @UseGuards(JwtAuthGuard)
  @Roles(["member", "admin"])
  joinTeam(@Param("id", ParseIntPipe) id: number, @CurrentUser() user: any) {
    return this.userService.joinTeam(user.id, id);
  }
}
