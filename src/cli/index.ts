import Helpers from "handlebars-helpers";
import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";
import { NewCommand } from "./commands/new";
import { PrepareReleaseCommand } from "./commands/prepare-release";
import { ValidateCommand } from "./commands/validate";

Helpers();

export const RunCli = () =>
  yargs(hideBin(process.argv))
    .scriptName("yaclt")
    .command(NewCommand)
    .command(ValidateCommand)
    .command(PrepareReleaseCommand)
    .demandCommand()
    .strict()
    .parse();
