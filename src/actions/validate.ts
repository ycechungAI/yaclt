import fs from "fs";
import { Icons } from "../utils/icons";
import { StringFormatParams } from "../utils/string-format";
import { ActionOptions } from "./action-options";

export interface ActionValidateOptions extends ActionOptions {}

export const ActionValidate = (options: ActionValidateOptions) => {
  const filePaths = fs.readdirSync(options.dir);
  if (filePaths.length === 0) {
    console.log(
      `${Icons.warning} No changelog entries found in ${options.dir}`
    );
    return;
  }

  let hasInvalidEntries = false;

  for (const filePath of filePaths) {
    const lines = fs
      .readFileSync(filePath)
      .toString()
      .replace(/\r\n/g, "\n")
      .split("\n");

    for (const line of lines) {
      const pattern = options.format
        .replace(StringFormatParams.changeType, ".*")
        .replace(StringFormatParams.message, ".*")
        .replace(StringFormatParams.issueId, ".*")
        .replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"); // escape regex special characters
      const regex = new RegExp(`^${pattern}$`);

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
  }
};
