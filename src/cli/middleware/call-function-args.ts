import yargs from "yargs";
import { isFunction } from "../../utils/type-utils";

export function callFunctionArgs(argv: Record<string, any>) {
  for (const key of Object.keys(argv)) {
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
}
