export const getErrorMsg = (err: unknown): string => {
  if (typeof err == "string") {
    return err;
  }
  const message = (err as any)["message"];
  return message ? message : JSON.stringify(err);
};
