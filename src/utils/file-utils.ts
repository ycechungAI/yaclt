import fs from "fs";

export const readLines = (filePath: string): string[] =>
  fs
    .readFileSync(filePath)
    .toString()
    .replace(/\r\n/g, "\n")
    .split("\n")
    .filter(Boolean);

export const touchFile = (filePath: string): void => {
  // see https://remarkablemark.org/blog/2017/12/17/touch-file-nodejs/#touch-file
  const time = new Date();

  try {
    fs.utimesSync(filePath, time, time);
  } catch (err) {
    fs.closeSync(fs.openSync(filePath, "w"));
  }
};
