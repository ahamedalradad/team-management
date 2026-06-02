import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { SKIP_JSEND_KEY } from "src/decorators/skip-jsend.decorator";

@Injectable()
export class JsendInterceptor implements NestInterceptor {
  reflector: any;
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isSkipped = this.reflector.getAllAndOverride(SKIP_JSEND_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // ↩️ الـ Bypass: إذا كان المسار مستثنى، يتم تمرير الـ Response خام كما هو دون تغليفه بالـ JSON
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
