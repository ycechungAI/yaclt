import fs from "fs";
import path from "path";
import { readLines } from "../utils/file-utils";
import { Icons } from "../utils/icons";
import { StringFormatParams } from "../utils/string-format";
import { ActionOptions } from "./action-options";

export interface ActionValidateOptions extends ActionOptions {
  changeTypes: string[];
}

export const ActionValidate = (options: ActionValidateOptions) => {
  const noneFoundWarning = `${Icons.warning} No changelog entries found in ${options.logsDir}`;
  if (!fs.existsSync(options.logsDir)) {
    console.warn(noneFoundWarning);
    return;
  }

  const filePaths = fs.readdirSync(options.logsDir);
  if (filePaths.length === 0) {
    console.warn(noneFoundWarning);
    return;
  }

  let hasInvalidEntries = false;

  const pattern = options.format
    .replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") // escape regex special characters
    .replace(
      StringFormatParams.changeType,
      `(${options.changeTypes.join("|")})`
    )
    .replace(StringFormatParams.message, ".*")
    .replace(StringFormatParams.issueId, ".*");
  const regex = new RegExp(`^${pattern}$`);

  for (const filePath of filePaths) {
    const lines = readLines(path.join(options.logsDir, filePath));

    for (const line of lines) {
      if (!regex.test(line)) {
        console.error(
          `${Icons.error} Malformed changelog entry found in file ${filePath}: ${line}`
        );

        hasInvalidEntries = true;
      }
    }
  }

  if (hasInvalidEntries) {
    throw new Error(`${Icons.error} Malformed changelog entries found.`);
  } else {
    console.log(`${Icons.success} All changelog entries formatted correctly!`);
  }
};
