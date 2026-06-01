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
} from "@nestjs/common";
import { TeamService } from "./team.service";
import { isOwnTeam } from "src/guards/is-own.guard";
import { Roles } from "src/guards/decorators/roles.decorator";
import { CreateTeamDto } from "./dtos/add-team.dto";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { CurrentTeam } from "src/guards/decorators/current-team.decorator";
import { RolesGuard } from "src/guards/auth-roles.guard";

@Controller("teams")
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeamController {
  constructor(private readonly teamService: TeamService) {}
  @Get()
  findAll() {
    return this.teamService.findAll();
  }
  @Get("id/:id")
  findByid(@Param("id", ParseIntPipe) id: number) {
    return this.teamService.findOneById(id);
  }
  @Get("name/:name")
  findByName(@Param("name") name: string) {
    return this.teamService.findManyByName(name);
  }

  @Get("/profile")
  getCurrentteam(@CurrentTeam() teamId: number) {
    return this.teamService.getCurrentTeam(teamId);
  }
  @Post()
  createTeam(@Body() data: CreateTeamDto, @Req() req: any) {
    return this.teamService.createTeam(data, req.user.id);
  }

  @UseGuards(isOwnTeam)
  @Roles(["owner", "admin"])
  @Patch("/:id")
  updateTeam(
    @Param("id", ParseIntPipe) id: number,
    @Body() data: UpdateTeamDto,
  ) {
    return this.teamService.updateTeam(id, data);
  }

  @Roles(["owner"])
  @UseGuards(isOwnTeam)
  @Delete("/:id")
  deleteTeam(@Param("id", ParseIntPipe) id: number) {
    return this.teamService.deleteTeam(id);
  }
}
