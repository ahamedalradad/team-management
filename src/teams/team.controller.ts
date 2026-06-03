import { UpdateTeamDto } from "./dtos/update-team.dto";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  ParseIntPipe,
  UseGuards,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
  Query,
} from "@nestjs/common";
import { TeamService } from "./team.service";
import { isOwnTeam } from "src/guards/is-own.guard";
import { Roles } from "src/decorators/roles.decorator";
import { CreateTeamDto } from "./dtos/add-team.dto";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { CurrentTeam } from "src/decorators/current-team.decorator";
import { RolesGuard } from "src/guards/auth-roles.guard";
import { ApiHeader,ApiParam, ApiOperation } from "@nestjs/swagger";
import { CurrentUser } from "src/decorators/current-user.decorator";
import { GetQueryDto } from "src/users/dtos/paginaion.dto";

@Controller("teams")
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeamController {
  constructor(private readonly teamService: TeamService) {}
  @Get()
  @ApiHeader({
    name: "authorization",
    required: true,
    description: "access token (JWT Token)",
  })
  @ApiOperation({description:"find all teams"})
  @UsePipes(new ValidationPipe({ transform: true }))
  findAll(@Query() query: GetQueryDto) {
    return this.teamService.findAll(query.limit || 1, query.page || 1);
  }
  @Get("id/:id")
  @ApiOperation({description: "find team by id and his members"})
  @ApiHeader({
    name: "authorization",
    required: true,
    description: "access token (JWT Token)",
  })
  @ApiParam({
    name: "teamId",
    required: true,
    description: "id of team",
  })
  findById(@Param("id", ParseIntPipe) id: number) {
    return this.teamService.findOneById(id);
  }
  @Get("name/:name")
  @ApiOperation({description: "find team by name and his members"})
  @ApiParam({
    name: "name",
    required: true,
    description: "the name of team",
  })
  @ApiHeader({
    name: "authorization",
    required: true,
    description: "access token (JWT Token)",
  })
  findByName(@Param("name") name: string) {
    return this.teamService.findManyByName(name);
  }

  @Get("/profile")
  @ApiHeader({
    name: "authorization",
    required: true,
    description: "access token (JWT Token)",
  })
  @ApiOperation({description: "get current team and his members"})
  getCurrentTeam(@CurrentTeam() teamId: number) {
    return this.teamService.getCurrentTeam(teamId);
  }
  @Post()
  @ApiOperation({description: "create team"})
  @ApiHeader({
    name: "authorization",
    required: true,
    description: "access token (JWT Token)",
  })
  createTeam(@Body() data: CreateTeamDto, @CurrentUser() user: any) {
    return this.teamService.createTeam(data, user.id);
  }

  @UseGuards(isOwnTeam)
  @Roles(["owner", "admin"])
  @Patch("/:id")
  @ApiHeader({
    name: "authorization",
    required: true,
    description: "access token (JWT Token)",
  })
  @ApiParam({
    name: "teamId",
    required: true,
    description: "your teamId to update it",
  })
  @ApiOperation({description: "update team by id"})
  updateTeam(
    @Param("id", ParseIntPipe) id: number,
    @Body() data: UpdateTeamDto,
  ) {
    return this.teamService.updateTeam(id, data);
  }

  @Roles(["owner"])
  @UseGuards(isOwnTeam)
  @Delete("/:id")
  @ApiHeader({
    name: "authorization",
    required: true,
    description: "access token (JWT Token)",
  })
  @ApiParam({
    name: "teamId",
    required: true,
    description: "your teamID to delete it",
  })
  @ApiOperation({description: "delet team by id"})
  deleteTeam(@Param("id", ParseIntPipe) id: number) {
    return this.teamService.deleteTeam(id);
  }
}
