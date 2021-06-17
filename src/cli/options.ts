import fs from "fs";
import { Options } from "yargs";

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

    return fs.readFileSync(filePath);
  };

export const CliOptions: { [key: string]: Options } = {
  d: {
    alias: "logsDir",
    type: "string",
    normalize: true,
    default: "changelogs/",
    describe: "The directory to find and place individual changelog entries",
  },
  c: {
    alias: "changelogFile",
    type: "string",
    normalize: true,
    default: "CHANGELOG.md",
    describe: "The name of the global changelog file to collect entries into",
    coerce: coerceFileArg({ createIfNotExist: true }),
  },
  t: {
    alias: "types",
    type: "array",
    default: ["NEW", "IMPROVED", "FIXED"],
    describe: "The allowed change type tags",
  },
  i: {
    alias: "requireIssueIds",
    type: "boolean",
    default: true,
    describe: "Require issue IDs in changelog entries",
  },
  f: {
    alias: "format",
    type: "string",
    default: "[%type%] %message% {%issueid%}",
    describe: "Changelog entry format",
  },
};
