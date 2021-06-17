import { execSync } from "child_process";
import fs from "fs";
import Path from "path";
import { StringFormatParams } from "../constants/string-format";
import { toValidFilename } from "../utils/path-utils";

export interface ActionNewOptions {
  dir: string;
  format: string;
  changeType: string;
  issueId?: string;
  gitBranchFormat?: string;
  message?: string;
}

export const ActionNew = async (options: ActionNewOptions) => {
  const ouputPath = Path.join(
    options.dir,
    toValidFilename(
      `${new Date()
        .toISOString()
        .replace(".", "-")
        .replace(/[a-zA-Z]/g, "")}.md`
    )
  );

  let issueId: string | undefined;
  if (options.issueId) {
    issueId = options.issueId;
  } else if (options.gitBranchFormat) {
    const branch = execSync("git branch --show-current").toString();
    if (branch) {
      const pattern = new RegExp(options.gitBranchFormat);
      issueId = branch.match(pattern)?.[0];
    }
  }

  const entryText = options.format
    .replace(StringFormatParams.changeType, options.changeType)
    .replace(
      StringFormatParams.message,
      options.message ?? "A user-friendly description of your change"
    )
    .replace(StringFormatParams.issueId, issueId ?? "0000")
    .concat("\n");

  if (!fs.existsSync(options.dir)) {
    fs.mkdirSync(options.dir);
  }

  fs.writeFileSync(ouputPath, entryText);
  console.log(`✅ Changelog entry placeholder generated at ${ouputPath}!`);
};
