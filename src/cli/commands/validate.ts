import { Arguments, CommandModule, Options } from "yargs";
import { ActionValidate, ActionValidateOptions } from "../../actions/validate";
import { runAction } from "../../utils/run-action";
import { CliOptions, GlobalArgv } from "../options";

export interface ValidateCommandOptions extends GlobalArgv {
  validationPattern: string;
}

export const ValidationPatternOption: { [key: string]: Options } = {
  validationPattern: {
    describe:
      "A regular expression used to validate each individual changelog entry",
    type: "string",
    required: true,
  },
};

export const ValidateCommand: CommandModule<{}, ValidateCommandOptions> = {
  command: "validate",
  describe: "Validate existing changelogs against the specified format",
  builder: {
    ...ValidationPatternOption,
    ...CliOptions,
  },
  handler: (argv: Arguments<ValidateCommandOptions>) => {
    runAction(() => {
      if (argv.preHook) {
        const preResult = argv.preHook("validate");
        if (!preResult) {
          throw new Error(`preHook returned a falsy value: ${preResult}`);
        }
      }

      const options: ActionValidateOptions = {
        plumbing: argv.plumbing,
        logsDir: argv.logsDir,
        format: argv.format,
        changeTypes: argv.changeTypes,
        validationPattern: argv.validationPattern,
      };

      ActionValidate(options);

      if (argv.postHook) {
        const postResult = argv.postHook("validate");
        if (!postResult) {
          throw new Error(`postHook returned a falsy value: ${postResult}`);
        }
      }
    }, argv.plumbing);
  },
};
