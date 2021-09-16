import { MiddlewareFunction } from "yargs";
import { FunctionArg } from "../../utils/type-utils";

export interface MiddlewareHandler {
  handler: MiddlewareFunction<
    Record<string, string | boolean | number | FunctionArg>
  >;
  preValidation: boolean;
}
