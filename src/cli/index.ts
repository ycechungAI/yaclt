import HandlebarsHelpers from "handlebars-helpers";
import { CommandModule } from "yargs";
import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";
import { CompletionFishCommand } from "./commands/completion-fish";
import { NewCommand } from "./commands/new";
import { PrepareReleaseCommand } from "./commands/prepare-release";
import { ValidateCommand } from "./commands/validate";
import { getConfig } from "./config-handler";

HandlebarsHelpers();

const config = getConfig();

export const AllCommands: CommandModule<any, any>[] = [
  NewCommand,
  ValidateCommand,
  PrepareReleaseCommand,
  CompletionFishCommand,
];

export const BuildCli = () => {
  const cli = yargs(hideBin(process.argv)).scriptName("yaclt");

  for (const command of AllCommands) {
    cli.command(command);
  }

  cli.completion().demandCommand().strictCommands().config(config);

  return cli;
};
