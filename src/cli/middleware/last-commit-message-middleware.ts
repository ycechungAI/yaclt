import { execSync } from "child_process";
import yargs from "yargs";
import { Logger } from "../../utils/logger";
import { MiddlewareHandler } from "./middleware-handler";

export const LastCommitMessageMiddleware: MiddlewareHandler = {
  preValidation: true,
  handler: function parseMessageFromLastCommit(argv: Record<string, any>) {
    if (!argv["lastCommit"]) {
      return;
    }

    try {
      // first line only of last commit message
      const gitLogResult = execSync(
        "git log -n 1 --pretty=format:%s"
      ).toString();

      if (!gitLogResult) {
        const message =
          "An error occurred parsing the last git commit message: received empty value.";
        Logger.error(message);
        yargs.exit(1, new Error(message));
        process.exit(1);
      }

      argv["message"] = gitLogResult;
      delete argv["lastCommit"];
      return argv;
    } catch (error) {
      Logger.error(
        "An error occurred parsing the last git commit message: ",
        error
      );
      yargs.exit(1, error);
      process.exit(1);
    }
  },
};
