import { PartialType } from "@nestjs/mapped-types";
import { CreateTaskDto } from "./task.create";

export class UpdateTaskDto extends PartialType(CreateTaskDto){}