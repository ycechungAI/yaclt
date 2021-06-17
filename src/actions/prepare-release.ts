import fs from "fs";
import path from "path";
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
}

export interface EntryGroup {
  label: string;
  items: string[];
}

export const ActionPrepareRelease = (options: ActionPrepareReleaseOptions) => {
  touchFile(options.changelogFile);
  const fileNames = fs.readdirSync(options.logsDir);

  ActionValidate({
    logsDir: options.logsDir,
    format: options.format,
    changeTypes: options.changeTypes,
  });

  const entryGroups: EntryGroup[] = [];
  const changeTypePattern = options.format.replace(
    new RegExp(`{{\s*${StringFormatParams.changeType}\s*}}`, "g"),
    "(.*)"
  );
  const changeTypeRegex = new RegExp(changeTypePattern);

  for (const fileName of fileNames) {
    const filePath = path.join(options.logsDir, fileName);
    const lines = readLines(filePath);

    for (const line of lines) {
      const changeType = line.match(changeTypeRegex)[1] ?? "Uncategorized";
      if (entryGroups.find((group: EntryGroup) => group.label === changeType)) {
        entryGroups
          .find((group: EntryGroup) => group.label === changeType)
          .items.push(line);
      } else {
        entryGroups.push({ label: changeType, items: [line] });
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
  console.log(
    `${Icons.success} ${options.changelogFile} updated! Be sure to review the changes before comitting.`
  );
};
