import fs from "fs";
import { Arguments, CommandModule } from "yargs";
import {
  ActionPrepareRelease,
  ActionPrepareReleaseOptions,
} from "../../actions/prepare-release";
import { runAction } from "../../utils/run-action";
import { CliOptions, GlobalArgv } from "../options";
import { ValidationPatternOption } from "./validate";

export interface PrepareReleaseCommandOptions extends GlobalArgv {
  changelogTemplate: string;
  releaseNumber: string | (() => string);
  validationPattern: string;
}

export const PrepareReleaseCommand: CommandModule<
  {},
  PrepareReleaseCommandOptions
> = {
  command: "prepare-release",
  describe:
    "Gather the changelogs from --logsDir and compile them into --changelogFile using --changelogTemplate",
  builder: {
    ...ValidationPatternOption,
    a: {
      alias: "changelogTemplate",
      type: "string",
      describe:
        "The Handlebars template to use to generate the changelog additions. Can be a filepath to read the template from, or a template literal string. If configured via `yacltrc.js`, it can be a function that returns a string.",
      required: false,
      default: `# Release {{releaseNumber}} - {{moment "YYYY-MM-DD"}}\n\n{{#each entryGroups}}## {{capitalize label}}\n\n{{#each items}}- {{this}}\n{{/each}}{{/each}}\n---`,
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

    let releaseNumber: string;

    if (typeof argv.releaseNumber === "string") {
      releaseNumber = argv.releaseNumber;
    } else {
      releaseNumber = argv.releaseNumber();
    }

    const options: ActionPrepareReleaseOptions = {
      changeTypes: argv.changeTypes,
      changelogFile: argv.changelogFile,
      logsDir: argv.logsDir,
      format: argv.format,
      validationPattern: argv.validationPattern,
      releaseNumber,
      template,
    };

    runAction(() => ActionPrepareRelease(options));
  },
};
