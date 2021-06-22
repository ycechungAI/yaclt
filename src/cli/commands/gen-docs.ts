import fs from "fs";
import { Arguments, CommandModule } from "yargs";
import { AllCommands } from "../../cli";

export interface GenDocsCommandOptions {
  outFile: string;
}

export const GenDocsCommand: CommandModule<{}, GenDocsCommandOptions> = {
  command: "gen-docs",
  describe: "Generate markdown documentation for this CLI.",
  builder: {
    o: {
      alias: "outFile",
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
      contents += `${command.describe!}\n`;
      // prettier-ignore
      contents += `
| Option | Option Alias | Description | Type  | Required | Default Value |
| :---   | :----------- | :---:       | :---: | :---:    | :---:         |`;
      for (const option of Object.entries(command.builder ?? {})) {
        // prettier-ignore
        contents += `
| \`-${option[0]!}\` | \`--${option[1]!.alias!}\` | ${option[1]!.describe!} | \`${option[1]!.type!}\` | \`${option[1]!.required ?? false}\` | \`${option[1]!.default?.toString()?.replace(/(?:\r\n|\r|\n)/g, "\\n")}\` |`;
        fs.writeFileSync(argv.outFile, contents);
      }
      contents += "\n";
    }
  },
};
