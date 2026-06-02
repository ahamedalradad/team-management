import { CurrentTeam } from "src/decorators/current-team.decorator";
import { MemberService } from "./member.service";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { isOwnTeam } from "src/guards/is-own.guard";
import { UpdateMemberDto } from "./dtos/update-member.dto";
import { RolesGuard } from "src/guards/auth-roles.guard";
import { Roles } from "src/decorators/roles.decorator";

@Controller("memebers")
@UseGuards(JwtAuthGuard, RolesGuard)
export class MemberController {
  constructor(private readonly memberService: MemberService) {}
  @Get("/:teamId")
  findAll(@Param("teamId", ParseIntPipe) teamId: number) {
    return this.memberService.findAll(teamId);
  }
  @Get("/:teamId/:name")
  findByName(
    @Param("teamId", ParseIntPipe) teamId: number,
    @Param("name") name: string,
  ) {
    return this.memberService.findManyByName(name, teamId);
  }
  @UseGuards(isOwnTeam)
  @Get()
  getCurrentTeamMembers(@CurrentTeam() user: any) {
    return this.memberService.getCurrentTeamMembers(user.teamId);
  }
  @UseGuards(isOwnTeam)
  @Roles(["owner", "admin"])
  @Patch("/:teamId/:id")
  updateMember(
    @Param("id", ParseIntPipe) id: number,
    @Body() data: UpdateMemberDto,
    @Param("teamId", ParseIntPipe) teamId: number,
  ) {
    return this.memberService.updateMember(teamId, id, data);
  }
  @Delete("/:teamId")
  @Roles(["owner", "admin"])
  @UseGuards(isOwnTeam)
  deleteMembers(
    @Param("teamId", ParseIntPipe) teamId: number,
    @Body() id: number[],
  ) {
    return this.memberService.deleteMembers(id, teamId);
  }
}
