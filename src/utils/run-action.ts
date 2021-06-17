import yargs from "yargs";

export const runAction = (action: () => any) => {
  try {
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
