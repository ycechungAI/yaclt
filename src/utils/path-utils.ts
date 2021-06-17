export const toValidFilename = (input: string) =>
  input.replace(/[/\\?%*:|"<>]/g, "-");
