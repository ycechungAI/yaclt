import { Arguments, CommandModule, Options } from "yargs";
import { ActionValidate, ActionValidateOptions } from "../../actions/validate";
import { Hook } from "../../utils/hook-handler";
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
    required: true,
  },
  preValidate: {
    describe:
      "A hook function to run before performing validation. Throw an error or return false to halt execution. Only usable from a Javascript configuration file. May be async.",
    required: false,
    hidden: true,
  },
  postValidate: {
    describe:
      "A hook function to run after performing validation. Only usable from a Javascript configuration file. May be async.",
    required: false,
    hidden: true,
  },
};

export const ValidateCommand: CommandModule<
  Record<string, unknown>,
  ValidateCommandOptions
> = {
  command: "validate",
  describe: "Validate existing changelogs against the specified format",
  builder: {
    ...ValidateCommandOptions,
    ...CliOptions,
  },
  handler: (argv: Arguments<ValidateCommandOptions>) => {
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
    }, argv.plumbing);
  },
};
