import Handlebars from "handlebars";
import { Argv } from "yargs";
import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";
import {
  capitalizeHelper,
  currentDateTimeHelper,
  echoHelper,
} from "../utils/handlebars-helpers";
import { Commands } from "./commands";
import { getConfig } from "./config-handler";
import { CallFunctionArgsMiddleware } from "./middleware/call-function-args-middleware";
import { LastCommitMessageMiddleware } from "./middleware/last-commit-message-middleware";
import { LogLevelMiddleware } from "./middleware/loglevel-middleware";
import { TemplatesFromFilesMiddleware } from "./middleware/templates-from-files-middleware";
import { ValidateArgvMiddleware } from "./middleware/validate-argv-middleware";

Handlebars.registerHelper("currentDateTime", currentDateTimeHelper);
Handlebars.registerHelper("capitalize", capitalizeHelper);
Handlebars.registerHelper("echo", echoHelper);

const config = getConfig();

export const BuildCli = (): Argv => {
  const cli = yargs(hideBin(process.argv)).scriptName("yaclt");

  // register middlewares
  cli
    .middleware(
      ValidateArgvMiddleware.handler,
      ValidateArgvMiddleware.preValidation
    )
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
    )
    .middleware(LogLevelMiddleware.handler, LogLevelMiddleware.preValidation);

  for (const command of Commands) {
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
