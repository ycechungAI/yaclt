import fs from "fs";
import git from "isomorphic-git";
import yargs from "yargs";
import { Logger } from "../../utils/logger";
import { MiddlewareHandler } from "./middleware-handler";

const getFirstLine = (paragraph?: string): string | undefined => {
  if (!paragraph) {
    return paragraph;
  }

  let index: number | undefined = paragraph.indexOf("\n");
  if (index === -1) {
    // make undefined so we can pass it cleverly to .substring(start, end)
    index = undefined;
  }
  return paragraph.substring(0, index);
};

export const LastCommitMessageMiddleware: MiddlewareHandler = {
  preValidation: true,
  handler: async function parseMessageFromLastCommit(
    argv: Record<string, any>
  ) {
    if (!argv["lastCommit"]) {
      return;
    }

    try {
      const branch = await git.currentBranch({ fs, dir: process.cwd() });
      if (!branch) {
        const message = "An error occurred determining the current git branch.";
        Logger.error(message);
        yargs.exit(1, new Error(message));
        process.exit(1);
      }
      // first line only of last commit message
      const gitLogResult = await git.log({
        fs,
        dir: process.cwd(),
        depth: 1,
        ref: branch,
      });
      if (gitLogResult.length !== 1) {
        const message = "An error occurred running `git log`.";
        Logger.error(message);
        yargs.exit(1, new Error(message));
        process.exit(1);
      }

      const gitLogMessage = getFirstLine(gitLogResult[0]!.commit.message);

      if (!gitLogMessage) {
        const message =
          "An error occurred parsing the last git commit message: received empty value.";
        Logger.error(message);
        yargs.exit(1, new Error(message));
        process.exit(1);
      }

      argv["message"] = gitLogMessage;
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