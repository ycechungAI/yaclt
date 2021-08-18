import yargs from "yargs";
import { isFunction } from "./type-utils";

const handleHookFailure = (error: Error | boolean, hookName: string): void => {
  const message =
    error === false
      ? `Hook ${hookName} returned false.`
      : `An error occurred evaluating hook ${hookName}`;
  yargs.exit(1, new Error(message));
  process.exit(1);
};

const doPostHook = (hook: unknown, postName: string): void => {
  if (hook) {
    if (!isFunction(hook)) {
      const message = `Hook ${postName} is not defined as a function.`;
      yargs.exit(1, new Error(message));
      process.exit(1);
    }

    try {
      const result = hook();
      if (result === false) {
        handleHookFailure(result, postName.toString());
      }
    } catch (error) {
      handleHookFailure(error, postName.toString());
    }
  }
};

export type Hook = () => void | boolean;

export const handleHooks =
  <TArgs, TReturn>(
    handler: (argv: TArgs) => TReturn,
    preName: keyof TArgs,
    postName: keyof TArgs
  ): ((argv: TArgs) => TReturn | Promise<TReturn>) =>
  (argv: TArgs): TReturn | Promise<TReturn> => {
    const preHook = argv[preName];
    if (preHook) {
      if (!isFunction(preHook)) {
        const message = `Hook ${preName} is not defined as a function.`;
        yargs.exit(1, new Error(message));
        process.exit(1);
      }

      try {
        const result = preHook();
        if (result === false) {
          handleHookFailure(result, preName.toString());
        }
      } catch (error) {
        handleHookFailure(error, preName.toString());
      }
    }

    const handlerResult = handler(argv);
    if (handlerResult instanceof Promise) {
      return handlerResult.then((result: TReturn) => {
        doPostHook(argv[postName], postName.toString());
        return result;
      });
    }
    doPostHook(argv[postName], postName.toString());
    return handlerResult;
  };
