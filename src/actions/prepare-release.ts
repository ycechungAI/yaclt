import fs from "fs";
import fsExtra from "fs-extra";
import Handlebars from "handlebars";
import path from "path";
import yargs from "yargs";
import { readLines, touchFile } from "../utils/file-utils";
import { Icons } from "../utils/icons";
import { StringFormatParams } from "../utils/string-format";
import { ActionOptions } from "./action-options";
import { ActionValidate } from "./validate";

export interface ActionPrepareReleaseOptions extends ActionOptions {
  changelogFile: string;
  releaseNumber: string;
  template: string;
  changeTypes: string[];
  requireIssueIds: boolean;
}

export interface EntryGroup {
  label: string;
  items: string[];
}

export const ActionPrepareRelease = (options: ActionPrepareReleaseOptions) => {
  touchFile(options.changelogFile);

  ActionValidate({
    logsDir: options.logsDir,
    format: options.format,
    changeTypes: options.changeTypes,
    requireIssueIds: options.requireIssueIds,
  });

  if (!fs.existsSync(options.logsDir)) {
    const message = `${Icons.error} Cannot prepare a release because no changelogs were found in ${options.logsDir}`;
    console.error(message);
    yargs.exit(1, new Error(message));
    return;
  }

  const fileNames = fs.readdirSync(options.logsDir);

  const entryGroups: EntryGroup[] = [];
  const changeTypeTemplatePattern = /\{\{\s*changeType\s*\}\}/;
  const hasChangeType = changeTypeTemplatePattern.test(options.format);
  const indexOfChangeType = options.format.search(changeTypeTemplatePattern);
  const changeTypeHandlebars = hasChangeType
    ? options.format.substring(
        Math.max(0, indexOfChangeType - 2),
        Math.min(
          options.format.length,
          indexOfChangeType +
            StringFormatParams.changeType.length +
            Math.max(
              options.format
                .slice(indexOfChangeType + StringFormatParams.changeType.length)
                .indexOf("}}") + 3,
              0
            )
        )
      )
    : "UNCATEGORIZED";
  console.log(changeTypeHandlebars);
  const changeTypeCompiledTemplate = Handlebars.compile(changeTypeHandlebars);

  for (const fileName of fileNames) {
    const filePath = path.join(options.logsDir, fileName);
    const lines = readLines(filePath);

    for (const line of lines) {
      let lineChangeType: string | undefined;
      options.changeTypes.forEach((changeType: string) => {
        if (line.includes(changeTypeCompiledTemplate({ changeType }))) {
          lineChangeType = changeType;
        }
      });

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
  fsExtra.emptyDirSync(options.logsDir);
  console.log(
    `${Icons.success} ${options.changelogFile} updated! Be sure to review the changes before comitting.`
  );
};
