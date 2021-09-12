import yargs, { Arguments, CommandModule } from "yargs";
import { ActionNew, ActionNewOptions } from "../../actions/new";
import { CliOptions, GlobalArgv } from "../../cli/options";
import { Hook } from "../../utils/hook-handler";
import { Logger } from "../../utils/logger";
import { runAction } from "../../utils/run-action";
import { StringFormatParams } from "../../utils/string-utils";

export interface NewCommandOptions extends GlobalArgv {
  issueId?: string;
  message?: string;
  changeType?: string;
  edit?: boolean;
  preNew?: Hook;
  postNew?: Hook;
}

export const NewCommand: CommandModule<
  Record<string, unknown>,
  NewCommandOptions
> = {
  command: "new",
  describe: "Generate a new changelog entry",
  builder: {
    issueId: {
      describe:
        "The issue ID to be interpolated into the new changelog. Takes precedence over parsing from git branch based on --branchFormat",
      type: "string",
      demandOption: false,
    },
    message: {
      alias: "m",
      describe: "The change log message, defaults to a placeholder message",
      type: "string",
      demandOption: false,
    },
    lastCommit: {
      describe:
        "Use the first line of the most recent git commit message as the message for the new changelog entry",
      type: "boolean",
      demandOption: false,
      conflicts: "message",
    },
    changeType: {
      describe:
        "The change type tag to use, defaults to the first one defined in --changeTypes",
      type: "string",
      demandOption: false,
    },
    edit: {
      describe:
        "After generating the changelog file, open it in `$EDITOR`, if `$EDITOR` is defined",
      type: "boolean",
      default: false,
      demandOption: false,
    },
    preNew: {
      describe:
        "A hook function to run before generating the changelog. Throw an error or return false to halt execution. Only usable from a Javascript config file. May be async.",
      demandOption: false,
      hidden: true,
    },
    postNew: {
      describe:
        "A hook function to run after generating the changelog. Only usable from a Javascript config file. May be async.",
      demandOption: false,
      hidden: true,
    },
    ...CliOptions,
  },
  handler: async (argv: Arguments<NewCommandOptions>) => {
    await runAction(async () => {
      if (argv.changeType && !argv.changeTypes.includes(argv.changeType)) {
        const message = `Invalid change type: ${argv.changeType}`;
        Logger.error(message);
        yargs.exit(1, new Error(message));
        return;
      }

      const options: ActionNewOptions = {
        plumbing: argv.plumbing,
        logsDir: argv.logsDir,
        format: argv.format,
        changeType:
          argv.changeType ??
          argv.changeTypes[0] ??
          StringFormatParams.changeType,
        issueId: argv.issueId,
        gitBranchFormat: argv.branchFormat,
        message: argv.message,
        edit: argv.edit ?? false,
        preNew: argv.preNew,
        postNew: argv.postNew,
      };

      await ActionNew(options);
    });
  },
};
