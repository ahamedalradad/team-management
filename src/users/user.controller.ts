import { UpdateUser } from "./update-user.dto";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Headers,
  ParseIntPipe,
  UseGuards,
  Req,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { CurrentUser } from "src/guards/decorators/current-user.decorator";
import { isOwnUser } from "src/guards/is-own.guard";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get("id/:id")
  findByid(@Param("id", ParseIntPipe) id: number) {
    return this.userService.findOneById(id);
  }

  @Get("email/:email")
  findByEmail(@Param("email") email: string) {
    return this.userService.findOneByEmail(email);
  }

  @Get("name/:name")
  findByName(@Param("name") name: string) {
    return this.userService.findManyByName(name);
  }

  @Get("/profile")
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@CurrentUser() user: any) {
    return user;
  }
  @UseGuards(JwtAuthGuard, isOwnUser)
  @Patch("/:id")
  updateUser(@Param("id", ParseIntPipe) id: number, @Body() data: UpdateUser) {
    return this.userService.updateUser(id, data);
  }
  @UseGuards(JwtAuthGuard, isOwnUser)
  @Delete("/:id")
  deleteUser(@Param("id", ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }
}
