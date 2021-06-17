import { Arguments, CommandModule } from "yargs";
import { ActionNew, ActionNewOptions } from "../../actions/new";
import { GlobalArgv } from "../../cli/options";
import { StringFormatParams } from "../../constants/string-format";

export interface NewCommandOptions {
  issueId?: string;
  message?: string;
  changeType?: string;
}

export const NewCommand: CommandModule<{}, NewCommandOptions & GlobalArgv> = {
  command: "new",
  describe: "Generate a new changelog entry",
  builder: {
    i: {
      alias: "issueId",
      describe:
        "The issue ID to be interpolated into the new changelog. Takes precedence over parsing from git branch based on --branchFormat",
      required: false,
    },
    m: {
      alias: "message",
      describe: "The change log message, defaults to a placeholder message",
      required: false,
    },
    p: {
      alias: "changeType",
      describe:
        "The change type tag to use, defaults to the first one defined in --changeTypes",
      required: false,
    },
  },
  handler: (argv: Arguments<GlobalArgv & NewCommandOptions>) => {
    if (
      argv.changeType &&
      !argv.changeTypes.find((t: string) => t === argv.changeType)
    ) {
      throw new Error(`Invalid change type: ${argv.changeType}`);
    }

    const options: ActionNewOptions = {
      dir: argv.logsDir,
      format: argv.format,
      changeType:
        argv.changeType ?? argv.changeTypes[0] ?? StringFormatParams.changeType,
      issueId: argv.issueId,
      gitBranchFormat: argv.branchFormat,
      message: argv.message,
    };

    ActionNew(options);
  },
};
