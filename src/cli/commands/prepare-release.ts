import { Arguments, CommandModule } from "yargs";
import {
  ActionPrepareRelease,
  ActionPrepareReleaseOptions,
} from "../../actions/prepare-release";
import { Hook } from "../../utils/hook-handler";
import { runAction } from "../../utils/run-action";
import { CliOptions, GlobalArgv } from "../options";
import { ValidateCommandOptions } from "./validate";

export interface PrepareReleaseCommandOptions extends GlobalArgv {
  changelogTemplate: string;
  releaseNumber: string;
  validationPattern: string;
  releaseBranchPattern?: string;
  preValidate?: Hook;
  postValidate?: Hook;
  prePrepare?: Hook;
  postPrepare?: Hook;
}

export const PrepareReleaseCommand: CommandModule<
  Record<string, unknown>,
  PrepareReleaseCommandOptions
> = {
  command: "prepare-release",
  describe:
    "Gather the changelogs from --logsDir and compile them into --changelogFile using --changelogTemplate",
  builder: {
    changelogTemplate: {
      type: "string",
      describe:
        "The Handlebars template to use to generate the changelog additions. Can be a filepath to read the template from, or a template literal string.",
      required: false,
      default:
        "# Release {{releaseNumber}} - {{currentDateTime}}\n\n{{#each entryGroups}}## {{capitalize label}}\n\n{{#each items}}- {{this}}\n{{/each}}\n\n{{/each}}\n---\n",
    },
    releaseNumber: {
      type: "string",
      describe: "A label for the release",
      required: true,
    },
    releaseBranchPattern: {
      type: "string",
      describe:
        "A pattern to generate a release branch name which will be automatically checked out before preparing the release.",
      required: false,
    },
    ...ValidateCommandOptions,
    prePrepare: {
      describe:
        "A hook function to run before preparing the release changes. Throw an error or return false to halt execution. Only usable from a Javascript configuration file. May be async.",
      required: false,
      hidden: true,
    },
    postPrepare: {
      describe:
        "A hook function to run after preparing the release changes. Only usable from a Javascript configuration file. May be async.",
      required: false,
      hidden: true,
    },
    ...CliOptions,
  },
  handler: async (argv: Arguments<PrepareReleaseCommandOptions>) => {
    await runAction(async () => {
      const options: ActionPrepareReleaseOptions = {
        plumbing: argv.plumbing,
        changeTypes: argv.changeTypes,
        changelogFile: argv.changelogFile,
        logsDir: argv.logsDir,
        format: argv.format,
        validationPattern: argv.validationPattern,
        releaseBranchPattern: argv.releaseBranchPattern,
        preValidate: argv.preValidate,
        postValidate: argv.postValidate,
        prePrepare: argv.prePrepare,
        postPrepare: argv.postPrepare,
        releaseNumber: argv.releaseNumber,
        template: argv.changelogTemplate,
      };

      await ActionPrepareRelease(options);
    });
  },
};
