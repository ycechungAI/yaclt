import fs from "fs";
import { Options } from "yargs";

const coerceFileArg = (filePath: string) => fs.readFileSync(filePath);

export const CliOptions: { [key: string]: Options } = {
  d: {
    alias: "logsDir",
    type: "string",
    normalize: true,
    default: "changelogs/",
    describe:
      "The directory to find and place individual changelog entries, defaults to changelogs/",
  },
  c: {
    alias: "changelogFile",
    type: "string",
    normalize: true,
    default: "CHANGELOG.md",
    describe:
      "The name of the global changelog file to collect entries into, defaults to CHANGELOG.md",
    coerce: coerceFileArg,
  },
  t: {
    alias: "types",
    type: "array",
    default: ["NEW", "IMPROVED", "FIXED"],
    describe:
      "The allowed change type tags, defaults to 'NEW' 'IMPROVED' 'FIXED'",
  },
  i: {
    alias: "requireIssueIds",
    type: "boolean",
    default: true,
    describe: "Require issue IDs in changelog entries, defaults to true",
  },
  f: {
    alias: "format",
    type: "string",
    default: "[%type%] %message% {%issueid%}",
    describe:
      "Changelog entry format, defaults to '[%changetype%] %message% {%issueid%}'.",
  },
};
