import yargs from "yargs";
import { Logger } from "./logger";
import { isFunction } from "./type-utils";

const handleHookFailure = (error: Error | boolean, hookName: string): void => {
  const message =
    error === false
      ? `Hook ${hookName} returned false.`
      : `An error occurred evaluating hook ${hookName}`;
  Logger.error(message, error);
  yargs.exit(1, new Error(message));
  process.exit(1);
};

export type Hook = () => void | boolean | Promise<void> | Promise<boolean>;

export const handleHooks =
  <TArgs, TReturn>(
    handler: (argv: TArgs) => TReturn,
    preName: keyof TArgs,
    postName: keyof TArgs
  ): ((argv: TArgs) => Promise<TReturn>) =>
  async (argv: TArgs): Promise<TReturn> => {
    const preHook = argv[preName];
    if (preHook) {
      if (!isFunction(preHook)) {
        const message = `Hook ${preName} is not defined as a function.`;
        yargs.exit(1, new Error(message));
        process.exit(1);
      }

      try {
        const result = preHook();
        if (result instanceof Promise) {
          const promiseResult = await result;
          if (promiseResult === false) {
            handleHookFailure(promiseResult, preName.toString());
          }
        } else if (result === false) {
          handleHookFailure(result, preName.toString());
        }
      } catch (error) {
        handleHookFailure(error, preName.toString());
      }
    }

    let handlerResult = handler(argv);
    if (handlerResult instanceof Promise) {
      handlerResult = await handlerResult;
    }

    const postHook = argv[postName];
    if (postHook) {
      if (!isFunction(postHook)) {
        const message = `Hook ${postName} is not defined as a function.`;
        yargs.exit(1, new Error(message));
        process.exit(1);
      }

      try {
        const result = postHook();
        if (result instanceof Promise) {
          const promiseResult = await result;
          if (promiseResult === false) {
            handleHookFailure(promiseResult, postName.toString());
          }
        } else if (result === false) {
          handleHookFailure(result, postName.toString());
        }
      } catch (error) {
        handleHookFailure(error, postName.toString());
      }
    }

    return handlerResult;
  };
