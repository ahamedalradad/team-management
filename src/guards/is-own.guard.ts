import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class isOwnUser implements CanActivate {
  canActivate(
    ctx: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    if (!user) throw new UnauthorizedException("you must login first");
    if (user.id === Number(request.params.id)) {
      return true;
    } else throw new ForbiddenException("you can't edit another account");
  }
}

@Injectable()
export class isOwnTeam implements CanActivate {
  canActivate(
    ctx: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    if (!user) throw new UnauthorizedException("you must login first");
    if (user.teamId === Number(request.params.id)) {
      return true;
    } else {
      throw new ForbiddenException("you can't edit another team");
    }
  }
}
