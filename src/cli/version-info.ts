import chalk from "chalk";

// need to require this since it's outside the typescript project
// eslint-disable-next-line unicorn/prefer-module, @typescript-eslint/no-var-requires
const version = require("../../package.json").version;

export const versionInfo = chalk.blueBright.bold(`
                                                             /((((/     /(((((/
                                                            /((((/     /(((((/
                                                          (((((((     /(((((/
                                                         ((((((((    /(((((/////
           /((((((/       //(((((/          /((((((((   ((((((( //(((((((((((((/
 (((((/  /((((((((/    /((((((((((((    ((((((((((((/   ((((((/ /(//((((((/
 (((((/ ((((((((/   /(((((((((((((((   /((((((((/      /(((((/    /((((((/
 ((((/ /((((((/    /((((((/ \\(((((((  /((((((         /(((((/     /(((((/
/(((/,/((((((/     /((((    /((((((/  /((((((        /((((((/    /(((((/
\\(((((((((((/      /(((((((((((((((/  \\((((((((((((  /(((((/     /((((/
   ((///(((/        \\(((((((// (((//   \\((((((((/   /(((((/      /(((/
     /(((((/
    /(((((/
    (((((/
     (///

yaclt v${version}
`);
