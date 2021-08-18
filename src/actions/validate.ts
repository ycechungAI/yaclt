import fs from "fs";
import path from "path";
import yargs from "yargs";
import { readLines } from "../utils/file-utils";
import { handleHooks, Hook } from "../utils/hook-handler";
import { Icons } from "../utils/icons";
import { Logger } from "../utils/logger";
import { formatToChangeTypeTemplate } from "../utils/string-format";
import { ActionOptions } from "./action-options";

export interface ActionValidateOptions extends ActionOptions {
  changeTypes: string[];
  validationPattern: string;
  preValidate?: Hook;
  postValidate?: Hook;
}

const actionValidateHandler = (options: ActionValidateOptions): boolean => {
  const noneFoundWarning = `${Icons.warning} No changelog entries found in ${options.logsDir}`;
  if (!fs.existsSync(options.logsDir)) {
    Logger.warn(noneFoundWarning);
    return false;
  }

  const filePaths = fs.readdirSync(options.logsDir);
  if (filePaths.length === 0) {
    Logger.warn(noneFoundWarning);
    return false;
  }

  let hasInvalidEntries = false;

  const regex = new RegExp(`^${options.validationPattern}$`);
  const changeTypePattern = formatToChangeTypeTemplate(options.format);
  for (const filePath of filePaths) {
    const lines = readLines(path.join(options.logsDir, filePath));

    for (const line of lines) {
      if (!regex.test(line)) {
        Logger.error(
          `${Icons.error} Malformed changelog entry found in file ${filePath}: ${line}`
        );

        hasInvalidEntries = true;
      }

      const changeType = options.changeTypes.find((changeType: string) =>
        line.includes(changeTypePattern({ changeType }))
      );
      if (!changeType || changeType === "UNCATEGORIZED") {
        Logger.error(
          `${Icons.error} Invalid change type found in changelog file ${filePath}: ${line}`
        );
        hasInvalidEntries = true;
      }
    }
  }

  if (hasInvalidEntries) {
    const message = `${Icons.error} Malformed changelog entries found.`;
    Logger.error(options.plumbing ? "false" : message);
    yargs.exit(1, new Error(message));
    return false;
  }

  if (options.plumbing) {
    Logger.log("true");
    return true;
  }

  Logger.log(`${Icons.success} All changelog entries formatted correctly!`);
  return true;
};

export const ActionValidate = handleHooks(
  actionValidateHandler,
  "preValidate",
  "postValidate"
);
