export function isFunction(
  subject: unknown
): subject is () => string | boolean | number {
  return !!(
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
}
