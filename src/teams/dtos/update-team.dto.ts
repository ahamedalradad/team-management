import { PartialType } from "@nestjs/mapped-types";
import { CreateTeamDto } from "./add-team.dto";

export class UpdateTeamDto extends PartialType(CreateTeamDto){}