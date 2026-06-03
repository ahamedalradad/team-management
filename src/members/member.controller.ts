import { CurrentTeam } from "src/decorators/current-team.decorator";
import { MemberService } from "./member.service";
import {
  BadRequestException,
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
import { ApiHeader, ApiOperation, ApiParam } from "@nestjs/swagger";

@Controller("memebers")
@UseGuards(JwtAuthGuard, RolesGuard)
export class MemberController {
  constructor(private readonly memberService: MemberService) {}
  @UseGuards(isOwnTeam)
  @Roles(["owner"])
  @Patch("/:teamId/:userId")
  @ApiHeader({
    name: "authorization",
    required: true,
    description: "access token (JWT Token)",
  })
  @ApiParam({
    name: "userId",
    required: true,
    description: "the ID of user that you want promote or reduce it ",
  })
  @ApiParam({
    name: "teamId",
    required: true,
    description: "the ID of team the user in it",
  })
  @ApiOperation({ description: "promote or reduce user" })
  updateMember(
    @Param("id", ParseIntPipe) id: number,
    @Body() data: UpdateMemberDto,
    @Param("teamId", ParseIntPipe) teamId: number,
    @CurrentTeam() teamUserId: number,
  ) {
    if (teamUserId !== teamId) {
      throw new BadRequestException("your team id is not same team id");
    }
    return this.memberService.updateMember(teamUserId, id, data);
  }
  @Delete("/:teamId")
  @Roles(["owner", "admin"])
  @UseGuards(isOwnTeam)
  @ApiHeader({
    name: "authorization",
    required: true,
    description: "access token (JWT Token)",
  })
  @ApiParam({
    name: "teamId",
    required: true,
    description: "the ID of team the user in it",
  })
  @ApiOperation({ description: "delete user" })
  deleteMembers(
    @Param("teamId", ParseIntPipe) teamId: number,
    @Body() id: number[],
    @CurrentTeam() teamUserId: number,
  ) {
    if (teamUserId !== teamId) {
      throw new BadRequestException("your team is not same team id");
    }
    return this.memberService.deleteMembers(id, teamUserId);
  }
}
