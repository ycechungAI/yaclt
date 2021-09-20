import fs from "fs";
import { Options } from "yargs";
import { Commands } from "./src/cli/commands";
import { arrayToMarkdownTable } from "./src/utils/array-to-markdown-table";

const escapeDefault = (value: string | unknown): string | unknown => {
  if (!value || typeof value !== "string") {
    return value;
  }

  return value.replace(/\n/g, "\\n");
};

const formatLongOption = (option: [string, Options]): string => {
  if (option[1].hidden === true) {
    return `JS: \`${option[0]}\``;
  }

  return `\`--${option[0]}\``;
};

const sortByHidden = (
  option1: [string, Options],
  option2: [string, Options]
): number => {
  if (option1[1].hidden === option2[1].hidden) {
    return 0;
  }

  if (option1[1].hidden) {
    return 1;
  }

  if (option2[1].hidden) {
    return -1;
  }

  return 0;
};

let contents = "# `yaclt` Command Documentation\n";
for (const command of Commands) {
  const options = Object.entries(command.builder ?? {}).sort(sortByHidden);
  if (options.length === 0) {
    continue;
  }

  contents += `\n## \`yaclt ${command.command ?? ""}\`\n\n`;
  contents += `${command.describe ?? ""}\n\n`;
  const optionsData = options.map((option: [string, Options]) => ({
    option: formatLongOption(option),
    alias: option[1].alias ? `\`-${option[1].alias}\`` : "",
    description: option[1].describe,
    type: option[0].endsWith("Hook") ? "`function`" : `\`${option[1].type}\``,
    required: option[1].demandOption ? "`true`" : "`false`",
    defaultValue: `\`${escapeDefault(option[1].default)}\``,
    requiresJsConfig: option[1].hidden === true ? "✅" : "",
  }));
  contents += arrayToMarkdownTable(optionsData);
  contents += "\n";
}

fs.writeFileSync("./docs/COMMANDS.md", contents);
