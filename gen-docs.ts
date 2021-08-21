import fs from "fs";
import { AllCommands } from "./src/cli";
import { arrayToMarkdownTable } from "./src/utils/array-to-markdown-table";

const escapeDefault = (value: string | unknown): string | unknown => {
  if (!value || typeof value !== "string") {
    return value;
  }

  return value.replace(/\n/g, "\\n");
};

let contents = "# `yaclt` Command Documentation\n";
for (const command of AllCommands) {
  if (!command.builder || Object.entries(command.builder).length === 0) {
    continue;
  }

  contents += `\n## \`yaclt ${command.command ?? ""}\`\n\n`;
  contents += `${command.describe ?? ""}\n\n`;
  const optionsData = Object.entries(command.builder ?? {}).map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (option: { [key: string]: any }) => ({
      option: `\`--${option[0]}\``,
      alias: option[1].alias ? `\`-${option[1].alias}\`` : "",
      description: option[1].describe,
      type: option[0].endsWith("Hook") ? "`function`" : `\`${option[1].type}\``,
      required: option[1].required ? "`true`" : "`false`",
      defaultValue: `\`${escapeDefault(option[1].default)}\``,
    })
  );
  contents += arrayToMarkdownTable(optionsData);
  contents += "\n";
}

fs.writeFileSync("./COMMANDS.md", contents);
