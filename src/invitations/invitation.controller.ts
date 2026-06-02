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
import { Roles } from "src/guards/decorators/roles.decorator";
import { CurrentTeam } from "src/guards/decorators/current-team.decorator";
import { CurrentUser } from "src/guards/decorators/current-user.decorator";
import { CreateInvitationDto } from "./dtos/create-invitation.dto";

@Controller("invitations")
@UseGuards(JwtAuthGuard) 
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Post("/send")
  @Roles(["owner", "admin"])
  @UseGuards(RolesGuard)
  sendInvitation(
    @Body() dto: CreateInvitationDto,
    @CurrentTeam() team: any,
  ) {
    const teamId = team.id || team;
    return this.invitationService.sendInvitation(dto, teamId);
  }

  @Get("/my-requests")
  getMyInvitations(@CurrentUser() user: any) {
    return this.invitationService.getMyInvitations(user.id);
  }

  @Patch("/accept/:id")
  acceptInvitation(
    @Param("id", ParseIntPipe) invitationId: number,
    @CurrentUser() user: any,
  ) {
    return this.invitationService.acceptInvitation(invitationId, user.id);
  }

  @Patch("/reject/:id")
  rejectInvitation(
    @Param("id", ParseIntPipe) invitationId: number,
    @CurrentUser() user: any,
  ) {
    return this.invitationService.rejectInvitation(invitationId, user.id);
  }
}