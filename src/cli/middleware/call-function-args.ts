import yargs from "yargs";
import { Logger } from "../../utils/logger";
import { isFunction } from "../../utils/type-utils";
import { MiddlewareHandler } from "./middleware-handler";

// Record<string, any> allows for any option set whatsoever
export const CallFunctionArgsMiddleware: MiddlewareHandler = {
  handler: function callFunctionArgs(
    argv: Record<string, any>
  ): Record<string, any> {
    for (const key of Object.keys(argv)) {
      if (isFunction(argv[key])) {
        try {
          argv[key] = argv[key]();
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

    return argv;
  },
  preValidation: true,
};
