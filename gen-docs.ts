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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatLongOption = (option: [string, any]): string => {
  if (option[1].hidden === true) {
    return `JS: \`${option[0]}\``;
  }

  return `\`--${option[0]}\``;
};

let contents = "# `yaclt` Command Documentation\n";
for (const command of Commands) {
  if (!command.builder || Object.entries(command.builder).length === 0) {
    continue;
  }

  contents += `\n## \`yaclt ${command.command ?? ""}\`\n\n`;
  contents += `${command.describe ?? ""}\n\n`;
  const optionsData = Object.entries(command.builder ?? {}).map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (option: [string, Options]) => ({
      option: formatLongOption(option),
      alias: option[1].alias ? `\`-${option[1].alias}\`` : "",
      description: option[1].describe,
      type: option[0].endsWith("Hook") ? "`function`" : `\`${option[1].type}\``,
      required: option[1].demandOption ? "`true`" : "`false`",
      defaultValue: `\`${escapeDefault(option[1].default)}\``,
      requiresJsConfig: option[1].hidden === true ? "✅" : "",
    })
  );
  contents += arrayToMarkdownTable(optionsData);
  contents += "\n";
}

fs.writeFileSync("./docs/COMMANDS.md", contents);
