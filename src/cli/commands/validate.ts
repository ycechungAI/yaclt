import { Arguments, CommandModule, Options } from "yargs";
import { ActionValidate, ActionValidateOptions } from "../../actions/validate";
import { Hook } from "../../utils/hook-handler";
import { Logger } from "../../utils/logger";
import { runAction } from "../../utils/run-action";
import { CliOptions, GlobalArgv } from "../options";

export interface ValidateCommandOptions extends GlobalArgv {
  validationPattern: string;
  preValidate?: Hook;
  postValidate?: Hook;
}

export const ValidateCommandOptions: { [key: string]: Options } = {
  validationPattern: {
    describe:
      "A regular expression used to validate each individual changelog entry",
    type: "string",
    default: "\\[.*\\]\\s+.*\\s{#[\\d]+}",
  },
  preValidate: {
    describe:
      "A hook function to run before performing validation. Throw an error or return false to halt execution. Only usable from a Javascript configuration file. May be async.",
    demandOption: false,
    hidden: true,
  },
  postValidate: {
    describe:
      "A hook function to run after performing validation. Only usable from a Javascript configuration file. May be async.",
    demandOption: false,
    hidden: true,
  },
};

const options = {
  ...ValidateCommandOptions,
  ...CliOptions,
};

export const ValidateCommand: CommandModule<
  Record<string, unknown>,
  ValidateCommandOptions
> = {
  command: "validate",
  describe: "Validate existing changelogs against the specified format",
  builder: options,
  handler: (argv: Arguments<ValidateCommandOptions>) => {
    if (
      argv.format === options["format"]?.default &&
      argv.validationPattern !== options["validationPattern"]?.default
    ) {
      Logger.warn(
        "Using default value for --format but not for --validationPattern. Most likely you want to use a custom value for --format."
      );
    }

    if (
      argv.validationPattern === options["validationPattern"]?.default &&
      argv.format !== options["format"]?.default
    ) {
      Logger.warn(
        "Using default value for --validationPattern but not --format. Most likely you want to use a custom value for --validationPattern."
      );
    }

    runAction(() => {
      const options: ActionValidateOptions = {
        plumbing: argv.plumbing,
        logsDir: argv.logsDir,
        format: argv.format,
        changeTypes: argv.changeTypes,
        validationPattern: argv.validationPattern,
        preValidate: argv.preValidate,
        postValidate: argv.postValidate,
      };

      ActionValidate(options);
    });
  },
};
