import fs from "fs";
import path from "path";
import { Icons } from "../utils/icons";
import { StringFormatParams } from "../utils/string-format";
import { ActionOptions } from "./action-options";

export interface ActionValidateOptions extends ActionOptions {}

export const ActionValidate = (options: ActionValidateOptions) => {
  const noneFoundWarning = `${Icons.warning} No changelog entries found in ${options.dir}`;
  if (!fs.existsSync(options.dir)) {
    console.warn(noneFoundWarning);
    return;
  }

  const filePaths = fs.readdirSync(options.dir);
  if (filePaths.length === 0) {
    console.warn(noneFoundWarning);
    return;
  }

  let hasInvalidEntries = false;

  const pattern = options.format
    .replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") // escape regex special characters
    .replace(StringFormatParams.changeType, ".*")
    .replace(StringFormatParams.message, ".*")
    .replace(StringFormatParams.issueId, ".*");
  const regex = new RegExp(`^${pattern}$`);

  for (const filePath of filePaths) {
    const lines = fs
      .readFileSync(path.join(options.dir, filePath))
      .toString()
      .replace(/\r\n/g, "\n")
      .split("\n");

    for (const line of lines) {
      if (line && !regex.test(line)) {
        console.error(
          `${Icons.error} Malformed changelog entry found in file ${filePath}: ${line}`
        );

        hasInvalidEntries = true;
      }
    }
  }

  if (hasInvalidEntries) {
    throw new Error(`${Icons.error} Malformed changelog entries found.`);
  }
};
