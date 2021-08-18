import yargs from "yargs";
import { Icons } from "./icons";
import { Logger } from "./logger";

export const runAction = <T>(action: () => T, plumbing: boolean): T => {
  try {
    if (!plumbing && process.env["YACLT_CONFIG_PATH"]) {
      Logger.log(
        `${Icons.info} Found configuration file at ${process.env["YACLT_CONFIG_PATH"]}`
      );
    }

    return action();
  } catch (error) {
    if (error.message) {
      Logger.error(error.message);
    } else {
      Logger.error("An unknown error ocurred.");
    }
    yargs.exit(1, error);
    process.exit(1);
  }
};
