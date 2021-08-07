import { Options } from "yargs";
import { touchFile } from "../utils/file-utils";
import { StringFormatParams } from "../utils/string-format";

const coerceFileArg =
  (options = { createIfNotExist: true }) =>
  (filePath: string) => {
    if (options.createIfNotExist) {
      touchFile(filePath);
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
  preHook?: (commandName: string) => boolean;
  postHook?: (commandName: string) => boolean;
}

export const CliOptions: { [key: string]: Options } = {
  logsDir: {
    type: "string",
    normalize: true,
    default: "changelogs/",
    describe: "The directory to find and place individual changelog entries",
    global: true,
  },
  branchFormat: {
    type: "string",
    describe:
      "Regular expression with a capturing group to parse the issue ID out of your git branch. Implies --requireIssueIds and assumes that --format includes %issueid%",
    global: true,
  },
  changelogFile: {
    type: "string",
    normalize: true,
    default: "CHANGELOG.md",
    describe: "The name of the global changelog file to collect entries into",
    coerce: coerceFileArg({ createIfNotExist: true }),
    global: true,
  },
  changeTypes: {
    type: "array",
    default: ["NEW", "IMPROVED", "FIXED"],
    describe: "The allowed change type tags",
    global: true,
  },
  requireIssueIds: {
    type: "boolean",
    default: true,
    describe: "Require issue IDs in changelog entries",
    global: true,
  },
  format: {
    type: "string",
    default: `[{{${StringFormatParams.changeType}}}] {{${StringFormatParams.message}}} {{append "" "{"}}#{{${StringFormatParams.issueId}}}{{append "" "}"}}\n`,
    describe: "Changelog entry format, as a Handlebars template",
    global: true,
  },
  preHook: {
    describe:
      "A hook to allow arbitrary validation code to be executed pre-command execution. If a falsy value is returned, command is aborted. Hook functions get the command name being executed as a parameter; you must guard against `undefined` because the config parser attempts to run them to ensure it is a valid function.",
    global: true,
    hidden: true,
  },
  postHook: {
    describe:
      "A hook to allow arbitrary post-command code to be executed. In the case where one command runs another (e.g. prepare-release implies validate), hooks for both are respected. Hook functions get the command name being executed as a parameter; you must guard against `undefined` because the config parser attempts to run them to ensure it is a valid function.",
    global: true,
    hidden: true,
  },
};
