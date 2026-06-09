import { PartialType } from "@nestjs/swagger";
import { CreateTaskDto } from "./task.create";

export class UpdateTaskDto extends PartialType(CreateTaskDto) { }
