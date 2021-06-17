import { CliOptions } from "src/cli/options";
import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";

const argv = yargs(hideBin(process.argv)).options(CliOptions).argv;

console.log(argv);
