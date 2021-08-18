import yargs from "yargs";
import { Logger } from "../../utils/logger";
import { isFunction } from "../../utils/type-utils";
import { MiddlewareHandler } from "./middleware-handler";

export const CallFunctionArgsMiddleware: MiddlewareHandler = {
  handler: function callFunctionArgs(
    argv: Record<
      string,
      string | boolean | number | (() => string | boolean | number)
    >
  ): Record<string, string | boolean | number> {
    for (const key of Object.keys(argv)) {
      const arg = argv[key];
      if (isFunction(arg)) {
        try {
          argv[key] = arg();
        } catch (error) {
          Logger.error(
            `An error occurred evaluating function argument '${key}': `,
            error
          );
          yargs.exit(1, error);
          process.exit(1);
        }
      }
    }

    return argv as Record<string, string | boolean | number>;
  },
  preValidation: true,
};
