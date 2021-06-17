import fs from "fs";
import { Options } from "yargs";
import { StringFormatParams } from "../utils/string-format";

const coerceFileArg =
  (options = { createIfNotExist: true }) =>
  (filePath: string) => {
    if (options.createIfNotExist) {
      // see https://remarkablemark.org/blog/2017/12/17/touch-file-nodejs/#touch-file
      const date = new Date();
      try {
        fs.utimesSync(filePath, date, date);
      } catch (_) {
        fs.closeSync(fs.openSync(filePath, "w"));
      }
    }

    return filePath;
  };

export interface GlobalArgv {
  logsDir: string;
  branchFormat?: string;
  changelogFile: string;
  changeTypes: string[];
  requireIssueIds: boolean;
  format: string;
}

export const CliOptions: { [key: string]: Options } = {
  d: {
    alias: "logsDir",
    type: "string",
    normalize: true,
    default: "changelogs/",
    describe: "The directory to find and place individual changelog entries",
    global: true,
  },
  b: {
    alias: "branchFormat",
    type: "string",
    describe:
      "Regular expression with a capturing group to parse the issue ID out of your git branch. Implies --requireIssueIds and assumes that --format includes %issueid%",
    global: true,
  },
  c: {
    alias: "changelogFile",
    type: "string",
    normalize: true,
    default: "CHANGELOG.md",
    describe: "The name of the global changelog file to collect entries into",
    coerce: coerceFileArg({ createIfNotExist: true }),
    global: true,
  },
  t: {
    alias: "changeTypes",
    type: "array",
    default: ["NEW", "IMPROVED", "FIXED"],
    describe: "The allowed change type tags",
    global: true,
  },
  r: {
    alias: "requireIssueIds",
    type: "boolean",
    default: true,
    describe: "Require issue IDs in changelog entries",
    global: true,
  },
  f: {
    alias: "format",
    type: "string",
    default: `[{{${StringFormatParams.changeType}}}] {{${StringFormatParams.message}}} {{append "" "{"}}#{{${StringFormatParams.issueId}}}{{append "" "}"}}\n`,
    describe: "Changelog entry format, as a Handlebars template",
    global: true,
  },
};
