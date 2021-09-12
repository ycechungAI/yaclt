import { CommandModule } from "yargs";
import { CompletionFishCommand } from "./completion-fish";
import { NewCommand } from "./new";
import { PrepareReleaseCommand } from "./prepare-release";
import { ValidateCommand } from "./validate";

// idk a way around this
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Commands: CommandModule<any, any>[] = [
  NewCommand,
  ValidateCommand,
  PrepareReleaseCommand,
  CompletionFishCommand,
];
