import HandlebarsHelpers from "handlebars-helpers";
import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";
import { CompletionFishCommand } from "./commands/completion-fish";
import { NewCommand } from "./commands/new";
import { PrepareReleaseCommand } from "./commands/prepare-release";
import { ValidateCommand } from "./commands/validate";
import { getConfig } from "./config-handler";

HandlebarsHelpers();

const config = getConfig();

export const RunCli = () =>
  yargs(hideBin(process.argv))
    .scriptName("yaclt")
    .command(NewCommand)
    .command(ValidateCommand)
    .command(PrepareReleaseCommand)
    .command(CompletionFishCommand)
    .completion()
    .demandCommand()
    .strictCommands()
    .config(config)
    .parse();
