import { execSync, spawnSync } from "child_process";
import fs from "fs";
import Handlebars from "handlebars";
import path from "path";
import yargs from "yargs";
import { readLines, touchFile } from "../utils/file-utils";
import { Icons } from "../utils/icons";
import { formatToChangeTypeRegex } from "../utils/string-format";
import { ActionOptions } from "./action-options";
import { ActionValidate } from "./validate";

export interface ActionPrepareReleaseOptions extends ActionOptions {
  changelogFile: string;
  releaseNumber: string;
  template: string;
  changeTypes: string[];
  validationPattern: string;
  releaseBranchPattern?: string;
}

export interface EntryGroup {
  label: string;
  items: string[];
}

export const ActionPrepareRelease = (options: ActionPrepareReleaseOptions) => {
  touchFile(options.changelogFile);

  const valid = ActionValidate({
    logsDir: options.logsDir,
    format: options.format,
    changeTypes: options.changeTypes,
    validationPattern: options.validationPattern,
  });

  if (!valid) {
    yargs.exit(1, new Error());
    process.exit(1);
  }

  if (!fs.existsSync(options.logsDir)) {
    const message = `${Icons.error} Cannot prepare a release because no changelogs were found in ${options.logsDir}`;
    console.error(message);
    yargs.exit(1, new Error(message));
    return;
  }

  if (options.releaseBranchPattern) {
    const branchTemplate = Handlebars.compile(options.releaseBranchPattern);
    const branchName = branchTemplate({ releaseNumber: options.releaseNumber });
    try {
      execSync(`git checkout -b ${branchName}`);
    } catch (_) {
      const message = `${Icons.error} Failed to checkout release branch: ${branchName}`;
      console.error(message);
      yargs.exit(1, new Error(message));
      return;
    }
  }

  const fileNames = fs.readdirSync(options.logsDir);

  const entryGroups: EntryGroup[] = [];
  const changeTypeCompiledTemplate = formatToChangeTypeRegex(options.format);

  for (const fileName of fileNames) {
    const filePath = path.join(options.logsDir, fileName);
    const lines = readLines(filePath);

    for (const line of lines) {
      const lineChangeType: string | undefined = options.changeTypes.find(
        (changeType: string) =>
          line.includes(changeTypeCompiledTemplate({ changeType }))
      );

      if (!lineChangeType) {
        throw new Error(`unable to parse change type`);
      }

      const existingGroup = entryGroups.find(
        (group: EntryGroup) => group.label === lineChangeType
      );
      if (existingGroup) {
        existingGroup.items.push(line);
      } else {
        entryGroups.push({ label: lineChangeType, items: [line] });
      }
    }
  }

  const handlebarsContext = {
    releaseNumber: options.releaseNumber,
    entryGroups,
  };

  const template = Handlebars.compile(options.template);
  const changelogAddition = template(handlebarsContext);
  const existingContents = fs.readFileSync(options.changelogFile).toString();
  const newContents = `${changelogAddition}\n${existingContents}`;
  fs.writeFileSync(options.changelogFile, newContents);

  // remove all markdown files in logsDir via globbing pattern
  let globbingPattern = options.logsDir;
  if (!globbingPattern.endsWith("/")) {
    globbingPattern = `${globbingPattern}/`;
  }
  globbingPattern = `${globbingPattern}**.md`;
  spawnSync("rm", [globbingPattern]);

  console.log(
    `${Icons.success} ${options.changelogFile} updated! Be sure to review the changes before comitting.`
  );
};
