export const error = (message: string) => {
  console.error(message);
  throw new Error(message);
};
