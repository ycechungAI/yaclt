import { MiddlewareFunction } from "yargs";

export interface MiddlewareHandler {
  handler: MiddlewareFunction<Record<string, any>>;
  preValidation: boolean;
}
