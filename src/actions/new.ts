import { spawn } from "child_process";
import fs from "fs";
import git from "isomorphic-git";
import moment from "moment";
import path from "path";
import { handleHooks, Hook } from "../utils/hook-handler";
import { Icons } from "../utils/icons";
import { Logger } from "../utils/logger";
import { toValidFilename } from "../utils/path-utils";
import { StringFormatParams } from "../utils/string-format";
import { compileTemplate } from "../utils/template-utils";
import { ActionOptions } from "./action-options";

export interface ActionNewOptions extends ActionOptions {
  changeType: string;
  issueId?: string;
  gitBranchFormat?: string;
  message?: string;
  edit: boolean;
  preNew?: Hook;
  postNew?: Hook;
}

const actionNewHandler = async (options: ActionNewOptions): Promise<void> => {
  const outputPath = path.join(
    options.logsDir,
    toValidFilename(`${moment().format("YYYY-MM-DD_HH-mm-ss")}.md`)
  );

  let issueId: string | undefined;
  if (options.issueId) {
    issueId = options.issueId;
  } else if (options.gitBranchFormat) {
    const branch = await git.currentBranch({ fs, dir: process.cwd() });
    if (branch) {
      const pattern = new RegExp(options.gitBranchFormat);
      issueId = branch.match(pattern)?.[1];
    }
  }

  const template = compileTemplate(options.format);
  const entryText = template({
    [StringFormatParams.changeType]: options.changeType,
    [StringFormatParams.message]:
      options.message ?? "A user-friendly description of your change",
    [StringFormatParams.issueId]: issueId ?? "0000",
  });

  if (!fs.existsSync(options.logsDir)) {
    fs.mkdirSync(options.logsDir);
  }

  fs.writeFileSync(outputPath, entryText);
  if (options.plumbing) {
    Logger.log(outputPath);
    return;
  }

  Logger.log(
    `${Icons.success} Changelog entry placeholder generated at ${outputPath}!`
  );

  if (process.env["EDITOR"] && options.edit) {
    spawn(process.env["EDITOR"], [outputPath], { stdio: "inherit" });
  }
};

export const ActionNew = handleHooks(actionNewHandler, "preNew", "postNew");
