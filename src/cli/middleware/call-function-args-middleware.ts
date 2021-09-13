import { DateTime } from "luxon";
import yargs from "yargs";
import { ActionNewOptions } from "../../actions/new";
import { ActionPrepareReleaseOptions } from "../../actions/prepare-release";
import { ActionValidateOptions } from "../../actions/validate";
import { Logger } from "../../utils/logger";
import { nameof } from "../../utils/nameof";
import { camelToKebabCase } from "../../utils/string-utils";
import { FunctionArg, isFunction } from "../../utils/type-utils";
import { MiddlewareHandler } from "./middleware-handler";

const hookArgs = new Set<string>([
  nameof<ActionNewOptions>("preNew"),
  nameof<ActionNewOptions>("postNew"),
  nameof<ActionValidateOptions>("preValidate"),
  nameof<ActionValidateOptions>("postValidate"),
  nameof<ActionPrepareReleaseOptions>("prePrepare"),
  nameof<ActionPrepareReleaseOptions>("postPrepare"),
]);

// because of the way yargs operates, we'll have both, for example,
// preNew and pre-new in the Object.keys result below in the loop
[...hookArgs].forEach((key: string) => hookArgs.add(camelToKebabCase(key)));

export const CallFunctionArgsMiddleware: MiddlewareHandler = {
  handler: (
    argv: Record<string, string | boolean | number | FunctionArg>
  ): Record<string, string | boolean | number> => {
    for (const key of Object.keys(argv)) {
      if (hookArgs.has(key)) {
        continue;
      }

      const arg = argv[key];
      if (isFunction(arg)) {
        try {
          if (key === "entryFileName" || key === "entry-file-name") {
            argv[key] = arg(DateTime.now());
          } else {
            argv[key] = arg();
          }
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
