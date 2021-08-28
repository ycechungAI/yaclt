import path from "path";
import yargs from "yargs";
import { Logger } from "./logger";

const relativeize = (configPath: string): string => {
  const pathRelativeToCwd = path.relative(process.cwd(), configPath);
  // if config path is under current path, use path relative to cwd
  if (!pathRelativeToCwd.includes("..")) {
    return `./${pathRelativeToCwd}`;
  }

  const home = process.env["HOME"];
  if (home && configPath.includes(home)) {
    return configPath.replace(home, "~");
  }

  return configPath;
};

export const runAction = <T>(action: () => T): T => {
  try {
    const configPath = process.env["YACLT_CONFIG_PATH"];
    if (configPath) {
      Logger.info(`Using configuration file at ${relativeize(configPath)}`);
    }

    return action();
  } catch (error) {
    if (error.message) {
      Logger.error(error.message);
    } else {
      Logger.error("An unknown error ocurred.");
    }
    yargs.exit(1, error);
    process.exit(1);
  }
};
