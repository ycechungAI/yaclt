import HandlebarsHelpers from "handlebars-helpers";
import { Argv, CommandModule } from "yargs";
import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";
import { CompletionFishCommand } from "./commands/completion-fish";
import { NewCommand } from "./commands/new";
import { PrepareReleaseCommand } from "./commands/prepare-release";
import { ValidateCommand } from "./commands/validate";
import { getConfig } from "./config-handler";
import { CallFunctionArgsMiddleware } from "./middleware/call-function-args";
import { LastCommitMessageMiddleware } from "./middleware/last-commit-message-middleware";
import { TemplatesFromFilesMiddleware } from "./middleware/templates-from-files";

HandlebarsHelpers();

const config = getConfig();

// idk a way around this
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AllCommands: CommandModule<any, any>[] = [
  NewCommand,
  ValidateCommand,
  PrepareReleaseCommand,
  CompletionFishCommand,
];

export const BuildCli = (): Argv => {
  const cli = yargs(hideBin(process.argv)).scriptName("yaclt");

  // register middlewares
  cli
    .middleware(
      CallFunctionArgsMiddleware.handler,
      CallFunctionArgsMiddleware.preValidation
    )
    .middleware(
      TemplatesFromFilesMiddleware.handler,
      TemplatesFromFilesMiddleware.preValidation
    )
    .middleware(
      LastCommitMessageMiddleware.handler,
      LastCommitMessageMiddleware.preValidation
    );

  for (const command of AllCommands) {
    cli.command(command);
  }

  cli
    .completion()
    .demandCommand()
    .recommendCommands()
    .strictCommands()
    .config(config);

  return cli;
};
