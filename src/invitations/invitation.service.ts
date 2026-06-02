import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateInvitationDto } from "./dtos/create-invitation.dto";

@Injectable()
export class InvitationService {
  constructor(private readonly prisma: PrismaService) {}

  async sendInvitation(dto: CreateInvitationDto, teamId: number) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new NotFoundException("User with this email not found");

    if (user.teamId) throw new BadRequestException("This user is already a member of a team");

    const existingInvitation = await this.prisma.invitation.findFirst({
      where: { invitedId: user.id, teamId, status: "pending" },
    });
    if (existingInvitation) throw new BadRequestException("Invitation already sent to this user");

    return await this.prisma.invitation.create({
      data: {
        invitedId: user.id,
        teamId,
        status: "pending",
      },
    });
  }

  async getMyInvitations(userId: number) {
    return await this.prisma.invitation.findMany({
      where: { invitedId: userId, status: "pending" },
      include: { team: { select: { id: true, name: true, profile: true } } },
    });
  }

  async acceptInvitation(invitationId: number, userId: number) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { id: invitationId },
    });

    if (!invitation || invitation.invitedId !== userId || invitation.status !== "pending") {
      throw new NotFoundException("Invitation not found or unauthorized");
    }

    return await this.prisma.$transaction(async (tx) => {
      await tx.invitation.update({
        where: { id: invitationId },
        data: { status: "accepted" },
      });
 return await tx.user.update({
        where: { id: userId },
        data: { teamId: invitation.teamId, role: "member" },
      });
    });
  }

  async rejectInvitation(invitationId: number, userId: number) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { id: invitationId },
    });

    if (!invitation || invitation.invitedId !== userId || invitation.status !== "pending") {
      throw new NotFoundException("Invitation not found or unauthorized");
    }

    return await this.prisma.invitation.update({
      where: { id: invitationId },
      data: { status: "rejected" },
    });
  }
}