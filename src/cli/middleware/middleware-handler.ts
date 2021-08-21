import { MiddlewareFunction } from "yargs";

export interface MiddlewareHandler {
  handler: MiddlewareFunction<
    Record<
      string,
      string | boolean | number | (() => string | boolean | number)
    >
  >;
  preValidation: boolean;
}
