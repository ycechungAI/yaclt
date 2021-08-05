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
  releaseBranchPattern?: string;
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
      default: `# Release {{releaseNumber}} - {{moment "YYYY-MM-DD"}}\n\n{{#each entryGroups}}## {{capitalize label}}\n\n{{#each items}}- {{this}}\n{{/each}}\n\n{{/each}}\n---\n`,
    },
    n: {
      alias: "releaseNumber",
      type: "string",
      describe: "A label for the release",
      required: true,
    },
    o: {
      alias: "releaseBranchPattern",
      type: "string",
      describe:
        "A pattern to generate a release branch name which will be automatically checked out before preparing the release.",
      required: false,
    },
    ...CliOptions,
  },
  handler: (argv: Arguments<PrepareReleaseCommandOptions>) => {
    runAction(() => {
      if (argv.preHook) {
        const preResult = argv.preHook("prepare-release");
        if (!preResult) {
          throw new Error(`preHook returned a falsy value: ${preResult}`);
        }
      }

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
        releaseBranchPattern: argv.releaseBranchPattern,
        releaseNumber,
        template,
      };

      ActionPrepareRelease(options);

      if (argv.postHook) {
        const postResult = argv.postHook("prepare-release");
        if (!postResult) {
          throw new Error(`postHook returned a falsy value: ${postResult}`);
        }
      }
    });
  },
};
