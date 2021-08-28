import chalk from "chalk";

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

export const enum LogLevel {
  none = -1,
  values = 0,
  normal = 1,
  verbose = 2,
}

let _logLevel = LogLevel.normal;
const setLogLevel = (logLevel: LogLevel): LogLevel => (_logLevel = logLevel);

const value = (...data: unknown[]): void => {
  // this one is primarily used for plumbing, so require exactly this log level
  if (_logLevel !== LogLevel.values) {
    return;
  }

  console.log(...data);
};

const info = (...data: unknown[]): void => {
  if (_logLevel < LogLevel.verbose) {
    return;
  }

  console.info(
    chalk.bgBlue(chalk.black(chalk.bold("INFO"))),
    ...colorStrings(chalk.blue, data)
  );
};

const warn = (...data: unknown[]): void => {
  if (_logLevel < LogLevel.normal) {
    return;
  }

  console.warn(
    chalk.bgYellow(chalk.black(chalk.bold("WARN"))),
    ...colorStrings(chalk.yellow, data)
  );
};

const error = (...data: unknown[]): void => {
  if (_logLevel < LogLevel.normal) {
    return;
  }

  console.error(
    chalk.bgRed(chalk.black(chalk.bold("ERROR"))),
    ...colorStrings(chalk.red, data)
  );
};

const success = (...data: unknown[]): void => {
  if (_logLevel < LogLevel.normal) {
    return;
  }

  console.log(
    chalk.bgGreenBright(chalk.black(chalk.bold("SUCCESS"))),
    ...colorStrings(chalk.greenBright, data)
  );
};

export const Logger = Object.freeze({
  setLogLevel,
  value,
  info,
  warn,
  error,
  success,
});
