import colors from "colors";

function colorStrings(
  colorFunc: (str: string) => string,
  data: unknown[]
): unknown[] | string {
  if (data == undefined) {
    return "";
  }

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (typeof item === "string") {
      data[i] = colorFunc(item);
    }
  }

  return data;
}

const logger = {
  log: console.log,
  error: (...data: unknown[]): void =>
    console.error(...colorStrings(colors.red, data)),
  warn: (...data: unknown[]): void =>
    console.warn(...colorStrings(colors.yellow, data)),
};

export const Logger = Object.freeze(logger);
