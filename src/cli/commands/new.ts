import yargs, { Arguments, CommandModule } from "yargs";
import { ActionNew, ActionNewOptions } from "../../actions/new";
import { CliOptions, GlobalArgv } from "../../cli/options";
import { runAction } from "../../utils/run-action";
import { StringFormatParams } from "../../utils/string-format";

export interface NewCommandOptions extends GlobalArgv {
  issueId?: string;
  message?: string;
  changeType?: string;
}

export const NewCommand: CommandModule<{}, NewCommandOptions> = {
  command: "new",
  describe: "Generate a new changelog entry",
  builder: {
    i: {
      alias: "issueId",
      describe:
        "The issue ID to be interpolated into the new changelog. Takes precedence over parsing from git branch based on --branchFormat",
      type: "string",
      required: false,
    },
    m: {
      alias: "message",
      describe: "The change log message, defaults to a placeholder message",
      type: "string",
      required: false,
    },
    p: {
      alias: "changeType",
      describe:
        "The change type tag to use, defaults to the first one defined in --changeTypes",
      type: "string",
      required: false,
    },
    ...CliOptions,
  },
  handler: (argv: Arguments<NewCommandOptions>) => {
    runAction(() => {
      if (
        argv.changeType &&
        !argv.changeTypes.find((t: string) => t === argv.changeType)
      ) {
        const message = `Invalid change type: ${argv.changeType}`;
        console.error(message);
        yargs.exit(1, new Error(message));
        return;
      }

      const options: ActionNewOptions = {
        logsDir: argv.logsDir,
        format: argv.format,
        changeType:
          argv.changeType ??
          argv.changeTypes[0] ??
          StringFormatParams.changeType,
        issueId: argv.issueId,
        gitBranchFormat: argv.branchFormat,
        message: argv.message,
      };

      ActionNew(options);
    });
  },
};
