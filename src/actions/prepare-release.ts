import fs from "fs";
import git from "isomorphic-git";
import path from "path";
import yargs from "yargs";
import { readLines, touchFile } from "../utils/file-utils";
import { handleHooks, Hook } from "../utils/hook-handler";
import { Logger } from "../utils/logger";
import { formatToChangeTypeTemplate } from "../utils/string-utils";
import { compileTemplate } from "../utils/template-utils";
import { ActionOptions } from "./action-options";
import { ActionValidate } from "./validate";

export interface ActionPrepareReleaseOptions extends ActionOptions {
  changelogFile: string;
  releaseNumber: string;
  template: string;
  changeTypes: string[];
  validationPattern: string;
  releaseBranchPattern?: string;
  preValidate?: Hook;
  postValidate?: Hook;
  prePrepare?: Hook;
  postPrepare?: Hook;
}

export interface EntryGroup {
  label: string;
  items: string[];
}

const actionPrepareReleaseHandler = async (
  options: ActionPrepareReleaseOptions
): Promise<void> => {
  touchFile(options.changelogFile);

  const valid = ActionValidate({
    plumbing: options.plumbing,
    logsDir: options.logsDir,
    format: options.format,
    changeTypes: options.changeTypes,
    validationPattern: options.validationPattern,
    preValidate: options.preValidate,
    postValidate: options.postValidate,
  });

  if (!valid) {
    yargs.exit(1, new Error("Invalid changelog entries found."));
    process.exit(1);
  }

  if (!fs.existsSync(options.logsDir)) {
    const message = `Cannot prepare a release because no changelogs were found in ${options.logsDir}`;
    Logger.error(message);
    yargs.exit(1, new Error(message));
    return;
  }

  if (options.releaseBranchPattern) {
    const branchTemplate = compileTemplate(options.releaseBranchPattern);
    const branchName = branchTemplate({ releaseNumber: options.releaseNumber });
    try {
      await git.branch({ fs, ref: branchName, dir: process.cwd() });
    } catch {
      const message = `Failed to checkout release branch: ${branchName}`;
      Logger.error(message);
      yargs.exit(1, new Error(message));
      return;
    }
  }

  const fileNames = fs.readdirSync(options.logsDir);

  const entryGroups: EntryGroup[] = [];
  const changeTypeCompiledTemplate = formatToChangeTypeTemplate(options.format);

  for (const fileName of fileNames) {
    const filePath = path.join(options.logsDir, fileName);
    const lines = readLines(filePath);

    for (const line of lines) {
      const lineChangeType: string | undefined = options.changeTypes.find(
        (changeType: string) =>
          line.includes(changeTypeCompiledTemplate({ changeType }))
      );

      if (!lineChangeType) {
        throw new Error("unable to parse change type");
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

  const template = compileTemplate(options.template);
  const changelogAddition = template(handlebarsContext);
  const existingContents = fs.readFileSync(options.changelogFile).toString();
  const newContents = `${changelogAddition}\n${existingContents}`;
  fs.writeFileSync(options.changelogFile, newContents);

  // remove all markdown files in logsDir
  fs.readdirSync(options.logsDir)
    .filter((fileName: string) => fileName.endsWith(".md"))
    .map((file: string) => fs.unlinkSync(path.join(options.logsDir, file)));

  if (options.plumbing) {
    return;
  }

  Logger.value(options.changelogFile);
  Logger.success(
    `${options.changelogFile} updated! Be sure to review the changes before comitting.`
  );
};

export const ActionPrepareRelease = handleHooks(
  actionPrepareReleaseHandler,
  "prePrepare",
  "postPrepare"
);
