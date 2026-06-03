import { Reflector } from "@nestjs/core";
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { SkipJsend } from "src/decorators/skip-jsend.decorator";

@Injectable()
export class JsendInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isSkipped = this.reflector.getAllAndOverride(SkipJsend, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isSkipped) {
      return next.handle();
    }
    return next.handle().pipe(
      map((data) => {
        return {
          status: "success",
          data: data,
        };
      }),
    );
  }
}
