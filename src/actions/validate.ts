import fs from "fs";
import Handlebars from "handlebars";
import path from "path";
import yargs from "yargs";
import { readLines } from "../utils/file-utils";
import { Icons } from "../utils/icons";
import { StringFormatParams } from "../utils/string-format";
import { ActionOptions } from "./action-options";

export interface ActionValidateOptions extends ActionOptions {
  changeTypes: string[];
  requireIssueIds: boolean;
}

export const ActionValidate = (options: ActionValidateOptions): boolean => {
  const noneFoundWarning = `${Icons.warning} No changelog entries found in ${options.logsDir}`;
  if (!fs.existsSync(options.logsDir)) {
    console.warn(noneFoundWarning);
    return false;
  }

  const filePaths = fs.readdirSync(options.logsDir);
  if (filePaths.length === 0) {
    console.warn(noneFoundWarning);
    return false;
  }

  let hasInvalidEntries = false;

  // escape regex special characters except {{ }} and whitespace so we can still compile handlebars
  const patternTemplate = Handlebars.compile(
    options.format.replace(/[-[\]()*+?.,\\^$|#]/g, "\\$&")
  );
  const pattern = patternTemplate({
    [StringFormatParams.changeType]: `(${options.changeTypes.join("|")})`,
    [StringFormatParams.message]: "(.*)",
    [StringFormatParams.issueId]: "(.*)",
  })
    .replace(/{}/g, "\\$&")
    .replace(/\s/g, "\\s*"); // escape any remaining { } or whitespace characters for regex

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

      if (options.requireIssueIds) {
        const issueIdMatch = line.match(regex)?.[3];
        if (!issueIdMatch) {
          hasInvalidEntries = true;
        }
      }
    }
  }

  if (hasInvalidEntries) {
    const message = `${Icons.error} Malformed changelog entries found.`;
    yargs.exit(1, new Error(message));
    return false;
  }

  console.log(`${Icons.success} All changelog entries formatted correctly!`);
  return true;
};
