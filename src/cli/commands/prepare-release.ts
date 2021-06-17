import fs from "fs";
import { Arguments, CommandModule } from "yargs";
import {
  ActionPrepareRelease,
  ActionPrepareReleaseOptions,
} from "../../actions/prepare-release";
import { CliOptions, GlobalArgv } from "../options";

export interface PrepareReleaseCommandOptions extends GlobalArgv {
  changelogTemplate: string;
  releaseNumber: string;
}

export const PrepareReleaseCommand: CommandModule<
  {},
  PrepareReleaseCommandOptions
> = {
  command: "prepare-release",
  describe:
    "Gather the changelogs from --logsDir and compile them into --changelogFile using --changelogTemplate",
  builder: {
    a: {
      alias: "changelogTemplate",
      type: "string",
      describe:
        "The Handlebars template to use to generate the changelog additions. Can be a filepath to read the template from, or a template literal string.",
      required: false,
      default: `# {{releaseNumber}} - {{moment "YYYY-MM-DD"}}\n\n{{#each entryGroups}}## {{capitalize label}}\n\n{{#each items}}- {{this}}\n{{/each}}{{/each}}`,
    },
    n: {
      alias: "releaseNumber",
      type: "string",
      describe: "A label for the release",
      required: true,
    },
    ...CliOptions,
  },
  handler: (argv: Arguments<PrepareReleaseCommandOptions>) => {
    let template: string;

    if (fs.existsSync(argv.changelogTemplate)) {
      template = fs.readFileSync(argv.changelogTemplate).toString();
    } else {
      template = argv.changelogTemplate;
    }

    const options: ActionPrepareReleaseOptions = {
      changeTypes: argv.changeTypes,
      changelogFile: argv.changelogFile,
      releaseNumber: argv.releaseNumber,
      logsDir: argv.logsDir,
      format: argv.format,
      template,
    };

    ActionPrepareRelease(options);
  },
};
