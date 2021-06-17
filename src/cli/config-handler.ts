import findUp from "find-up";
import fs from "fs";
import yaml from "js-yaml";
import yargs from "yargs";
import { Icons } from "../utils/icons";

export const getConfig = (): Record<string, any> => {
  const configPath = findUp.sync([
    "yacltrc.yaml",
    "yacltrc.yml",
    "yacltrc.json",
    "yacltrc.js",
  ]);

  if (!configPath) {
    return {};
  }

  console.log(`${Icons.info} Found config file at ${configPath}`);

  const configContents = fs.readFileSync(configPath).toString();
  if (configPath.endsWith("json")) {
    return JSON.parse(configContents);
  }

  if (configPath.endsWith("yml") || configPath.endsWith("yaml")) {
    const config = yaml.load(configContents);
    if (!config || typeof config !== "object") {
      const message = `${Icons.error} Invalid yml configuration`;
      console.error(message);
      yargs.exit(1, new Error(message));
      process.exit(1);
    }

    return config;
  }

  if (configPath.endsWith("js")) {
    return require(configPath.replace(".js", ""));
  }

  const message = `Unsupported config format '${configPath}'. Only 'yacltrc.yaml', 'yacltrc.yml', 'yacltrc.json', and 'yacltrc.js'`;
  console.error(message);
  yargs.exit(1, new Error(message));
  process.exit(1);
};
