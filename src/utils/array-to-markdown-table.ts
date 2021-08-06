import prettier from "prettier";

/**
 * Humanize a string from camelCase,
 * cameCase becomes Camel Case
 */
const humanize = (input: string) =>
  input
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(" ");

export function arrayToMarkdownTable<T extends Record<string, any>>(
  input: T[]
): string {
  if (input.length < 1) {
    throw new Error("Need at least 1 item to generate a markdown table from.");
  }

  let markdown = "|";
  const headers = Object.keys(input[0]!);
  headers.forEach((header: string) => {
    markdown += ` ${humanize(header)} |`;
  });
  markdown += "\n|";
  headers.forEach((_: string) => {
    markdown += " --- |";
  });

  markdown += "\n";
  for (const line of input) {
    markdown += "|";
    for (const field of headers) {
      markdown += ` ${line[field]} |`;
    }
    markdown += "\n";
  }

  markdown = prettier.format(markdown, { parser: "markdown" });
  return markdown;
}
