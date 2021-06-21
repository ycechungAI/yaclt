import yargs from "yargs";
import { Icons } from "./icons";

export const runAction = (action: () => any) => {
  try {
    if (process.env["YACLT_CONFIG_PATH"]) {
      console.log(
        `${Icons.info} Found configuration file at ${process.env["YACLT_CONFIG_PATH"]}`
      );
    }

    action();
  } catch (error) {
    if (error.message) {
      console.error(error.message);
    } else {
      console.error("An unknown error ocurred.");
    }
    yargs.exit(1, error);
  }
};
