import yargs from "yargs";
import { nameof } from "../../utils/nameof";
import { isFunction } from "../../utils/type-utils";
import { GlobalArgv } from "../options";
import { MiddlewareHandler } from "./middleware-handler";

// Record<string, any> allows for any option set whatsoever
export const CallFunctionArgsMiddleware: MiddlewareHandler = {
  handler: function callFunctionArgs(
    argv: Record<string, any>
  ): Record<string, any> {
    for (const key of Object.keys(argv)) {
      // skip hook args because they need to be executed just-in-time
      if (
        key === nameof<GlobalArgv>("preHook") ||
        key === nameof<GlobalArgv>("postHook")
      ) {
        continue;
      }
      if (isFunction(argv[key])) {
        try {
          argv[key] = argv[key]();
        } catch (error) {
          console.error(
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
