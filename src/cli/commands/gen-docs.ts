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
      default: "DOCS.md",
    },
  },
  handler: (argv: Arguments<GenDocsCommandOptions>) => {
    let contents = `# \`yaclt\`\n\n`;
    for (const command of AllCommands) {
      contents += `## \`yaclt ${command.command!}\`\n\n`;
      // prettier-ignore
      contents += `
| Option | Option Alias | Description | Type  | Required | Default Value |
| :---   | :----------- | :---:       | :---: | :---:    | :---:         |
`
      for (const option of Object.entries(command.builder)) {
        // prettier-ignore
        contents += `
| ${option[0]!} | ${option[1]!.alias!} | ${option[1]!.describe!} | ${option[1]!.type!} | ${option[1]!.required ?? false} | ${option[1]!.default} |\n\n
`;
      }
    }
  },
};
