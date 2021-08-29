import fs from "fs";
import path from "path";
import yargs from "yargs";
import { readLines } from "../utils/file-utils";
import { handleHooks, Hook } from "../utils/hook-handler";
import { Logger } from "../utils/logger";
import { formatToChangeTypeTemplate } from "../utils/string-utils";
import { ActionOptions } from "./action-options";

export interface ActionValidateOptions extends ActionOptions {
  changeTypes: string[];
  validationPattern: string;
  preValidate?: Hook;
  postValidate?: Hook;
}

const actionValidateHandler = (options: ActionValidateOptions): boolean => {
  const noneFoundWarning = `No changelog entries found in ${options.logsDir}`;
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
          `Malformed changelog entry found in file ${filePath}: ${line}`
        );

        hasInvalidEntries = true;
      }

      // only validate changeTypes if format includes the changeType Handlebars variable
      if (changeTypePattern) {
        const changeType = options.changeTypes.find((changeType: string) =>
          line.includes(changeTypePattern({ changeType }))
        );
        if (!changeType || changeType === "UNCATEGORIZED") {
          Logger.error(
            `Invalid change type found in changelog file ${filePath}: ${line}`
          );
          hasInvalidEntries = true;
        }
      }
    }
  }

  if (hasInvalidEntries) {
    const message = "Malformed changelog entries found.";
    Logger.value(false);
    Logger.error(message);
    yargs.exit(1, new Error(message));
    return false;
  }

  Logger.value(true);
  Logger.success("All changelog entries formatted correctly!");
  return true;
};

export const ActionValidate = handleHooks(
  actionValidateHandler,
  "preValidate",
  "postValidate"
);
