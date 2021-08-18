export const toValidFilename = (input: string): string =>
  input.replace(/["%*/:<>?\\|]/g, "-");
