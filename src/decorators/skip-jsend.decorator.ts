import { Reflector } from "@nestjs/core";
export const SkipJsend = Reflector.createDecorator<boolean>();
