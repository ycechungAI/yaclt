import yargs, { Arguments, CommandModule } from "yargs";
import { ActionNew, ActionNewOptions } from "../../actions/new";
import { CliOptions, GlobalArgv } from "../../cli/options";
import { runAction } from "../../utils/run-action";
import { StringFormatParams } from "../../utils/string-format";

export interface NewCommandOptions extends GlobalArgv {
  issueId?: string;
  message?: string;
  changeType?: string;
  edit?: boolean;
}

export const NewCommand: CommandModule<{}, NewCommandOptions> = {
  command: "new",
  describe: "Generate a new changelog entry",
  builder: {
    issueId: {
      describe:
        "The issue ID to be interpolated into the new changelog. Takes precedence over parsing from git branch based on --branchFormat",
      type: "string",
      required: false,
    },
    message: {
      alias: "m",
      describe: "The change log message, defaults to a placeholder message",
      type: "string",
      required: false,
    },
    lastCommit: {
      describe:
        "Use the first line of the most recent git commit message as the message for the new changelog entry",
      type: "boolean",
      required: false,
      conflicts: "message",
    },
    changeType: {
      describe:
        "The change type tag to use, defaults to the first one defined in --changeTypes",
      type: "string",
      required: false,
    },
    edit: {
      describe:
        "After generating the changelog file, open it in $EDITOR, if $EDITOR is defined",
      type: "boolean",
      default: false,
      required: false,
    },
    ...CliOptions,
  },
  handler: (argv: Arguments<NewCommandOptions>) => {
    runAction(() => {
      if (argv.preHook) {
        const preResult = argv.preHook("new");
        if (!preResult) {
          throw new Error(`preHook returned a falsy value: ${preResult}`);
        }
      }

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
        edit: argv.edit ?? false,
      };

      ActionNew(options);

      if (argv.postHook) {
        const postResult = argv.postHook("new");
        if (!postResult) {
          throw new Error(`postHook returned a falsy value: ${postResult}`);
        }
      }
    });
  },
};
