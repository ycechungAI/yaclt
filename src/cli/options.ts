import { Options } from "yargs";
import { touchFile } from "../utils/file-utils";
import { StringFormatParams } from "../utils/string-utils";

const coerceFileArg =
  (createIfNotExist = true) =>
  (filePath: string): string => {
    if (createIfNotExist) {
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
  quiet: boolean;
  verbose: boolean;
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
    coerce: coerceFileArg(true),
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
    describe:
      "Changelog entry format, as a Handlebars template. To make change type tags optional, simply don't include the Handlebars variable for it.",
    global: true,
  },
  plumbing: {
    type: "boolean",
    default: false,
    describe:
      "Reduce output to just the relevant data, e.g. filepaths for `new` and `prepare-release`, `true/false` for `validate`, for scripting purposes. Also disables opening `$EDITOR`. Passing this option will override --quiet or --verbose.",
    global: true,
  },
  quiet: {
    type: "boolean",
    default: false,
    describe: "Silence all output.",
    global: true,
  },
  verbose: {
    type: "boolean",
    default: false,
    describe: "Output additional command logs and information.",
    global: true,
  },
};
