export function isFunction(subject: unknown): subject is Function {
  return !!(
    subject &&
    (subject as any).constructor &&
    (subject as any).call &&
    (subject as any).apply
  );
}
