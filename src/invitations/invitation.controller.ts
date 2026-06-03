import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { InvitationService } from "./invitation.service";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { RolesGuard } from "src/guards/auth-roles.guard";
import { Roles } from "src/decorators/roles.decorator";
import { CurrentTeam } from "src/decorators/current-team.decorator";
import { CurrentUser } from "src/decorators/current-user.decorator";
import { CreateInvitationDto } from "./dtos/create-invitation.dto";
import { ApiHeader, ApiOperation, ApiParam } from "@nestjs/swagger";

@Controller("invitations")
@UseGuards(JwtAuthGuard)
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Post("/send")
  @Roles(["owner", "admin"])
  @UseGuards(RolesGuard)
  @ApiHeader({
    name: "authorization",
    required: true,
    description: "access token (JWT Token)",
  })
  @ApiOperation({ description: "send an initaion" })
  sendInvitation(@Body() dto: CreateInvitationDto, @CurrentTeam() team: any) {
    const teamId = team.id || team;
    return this.invitationService.sendInvitation(dto, teamId);
  }

  @Get("/my-requests")
  @ApiOperation({ description: "get all requests" })
  @ApiHeader({
    name: "authorization",
    required: true,
    description: "access token (JWT Token)",
  })
  getMyInvitations(@CurrentUser() user: any) {
    return this.invitationService.getMyInvitations(user.id);
  }

  @Patch("/accept/:id")
  @ApiHeader({
    name: "authorization",
    required: true,
    description: "access token (JWT Token)",
  })
  @ApiParam({
    name: "invitaion id",
    required: true,
    description: "the ID of invetaion",
  })
  @ApiOperation({ description: "accept an invitaion" })
  acceptInvitation(
    @Param("id", ParseIntPipe) invitationId: number,
    @CurrentUser() user: any,
  ) {
    return this.invitationService.acceptInvitation(invitationId, user.id);
  }

  @Patch("/reject/:id")
  @ApiHeader({
    name: "authorization",
    required: true,
    description: "access token (JWT Token)",
  })
  @ApiParam({
    name: "invitaion id",
    required: true,
    description: "the ID of invetaion",
  })
  @ApiOperation({ description: "reject an invitaion" })
  rejectInvitation(
    @Param("id", ParseIntPipe) invitationId: number,
    @CurrentUser() user: any,
  ) {
    return this.invitationService.rejectInvitation(invitationId, user.id);
  }
}
