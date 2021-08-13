import colors from "colors";

function colorStrings(colorFunc: (str: string) => string, data: any[]) {
  if (data == null) {
    return "";
  }

  for (let i = 0; i < data.length; i++) {
    if (typeof data[i] === "string") {
      data[i] = colorFunc(data[i]);
    }
  }

  return data;
}

const logger = {
  log: console.log,
  error: (...data: any[]) => console.error(...colorStrings(colors.red, data)),
  warn: (...data: any[]) => console.warn(...colorStrings(colors.yellow, data)),
};

export const Logger = Object.freeze(logger);
