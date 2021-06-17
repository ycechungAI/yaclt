import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";
import { CliOptions } from "./options";

export const RunCli = () => {
  const argv = yargs(hideBin(process.argv)).options(CliOptions).argv;
  console.log(argv);
};
