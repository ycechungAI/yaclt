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
  plumbing: boolean;
  logsDir: string;
  branchFormat?: string;
  changelogFile: string;
  changeTypes: string[];
  requireIssueIds: boolean;
  format: string;
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
  plumbing: {
    type: "boolean",
    default: false,
    describe:
      "Reduce output to just the relevant data, e.g. filepaths for `new` and `prepare-release`, `true/false` for `validate`, for scripting purposes. Also disables opening `$EDITOR`.",
    global: true,
  },
};
