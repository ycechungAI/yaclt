import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";
import { NewCommand } from "./commands/new";
import { ValidateCommand } from "./commands/validate";
import { CliOptions } from "./options";

export const RunCli = () =>
  yargs(hideBin(process.argv))
    .scriptName("")
    .options(CliOptions)
    .command(NewCommand)
    .command(ValidateCommand);
