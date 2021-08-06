import fs from "fs";
import { Arguments, CommandModule } from "yargs";
import { AllCommands } from "../../cli";
import { arrayToMarkdownTable } from "../../utils/array-to-markdown-table";

export interface GenDocsCommandOptions {
  outFile: string;
}

const escapeDefault = (value: any) => {
  if (!value || typeof value !== "string") {
    return value;
  }

  return value.replace(/\n/g, "\\n");
};

export const GenDocsCommand: CommandModule<{}, GenDocsCommandOptions> = {
  command: "gen-docs",
  describe: "Generate markdown documentation for this CLI.",
  builder: {
    outFile: {
      alias: "o",
      describe:
        "The file to write the documentation to. Documentation will be formatted as markdown.",
      type: "string",
      default: "COMMANDS.md",
    },
  },
  handler: (argv: Arguments<GenDocsCommandOptions>) => {
    let contents = `# \`yaclt\` Command Documentation\n`;
    for (const command of AllCommands) {
      if (!command.builder || Object.entries(command.builder).length === 0) {
        continue;
      }

      contents += `\n## \`yaclt ${command.command!}\`\n\n`;
      contents += `${command.describe!}\n\n`;
      const optionsData = Object.entries(command.builder ?? {}).map(
        (option: { [key: string]: any }) => ({
          option: `\`--${option[0]}\``,
          alias: option[1].alias ? `\`-${option[1].alias}\`` : "",
          description: option[1].describe,
          type: option[0].endsWith("Hook")
            ? "`function`"
            : `\`${option[1].type}\``,
          required: option[1].required ? "`true`" : "`false`",
          defaultValue: `\`${escapeDefault(option[1].default)}\``,
        })
      );
      contents += arrayToMarkdownTable(optionsData);
      contents += "\n";
    }
    fs.writeFileSync(argv.outFile, contents);
  },
};
