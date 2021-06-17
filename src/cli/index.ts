import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";
import { NewCommand } from "./commands/new";
import { CliOptions } from "./options";

export const RunCli = () => {
  const argv = yargs(hideBin(process.argv))
    .scriptName("")
    .options(CliOptions)
    .command(NewCommand).argv;
  console.log(argv);
};
