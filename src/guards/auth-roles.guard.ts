import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Roles } from "./decorators/roles.decorator";
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
) {}
  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride<string[]>(Roles, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) throw new UnauthorizedException("you must login first");
    if (!roles.includes(user.role))
      throw new ForbiddenException("your role is not allowed to it");
    return true;
  }
}
