export type FunctionArg = (
  ...args: unknown[]
) =>
  | string
  | boolean
  | number
  | Promise<string>
  | Promise<boolean>
  | Promise<number>;

// we can't know the return type of the function
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isFunction = (subject: unknown): subject is FunctionArg =>
  !!(
    (
      subject &&
      // need to cast as any to implement the type guard
      /* eslint-disable @typescript-eslint/no-explicit-any */
      (subject as any).constructor &&
      (subject as any).call &&
      (subject as any).apply
    )
    /* eslint-enable @typescript-eslint/no-explicit-any */
  );
