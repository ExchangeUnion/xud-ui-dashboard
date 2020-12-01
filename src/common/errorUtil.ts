export const getErrorMsg = (err: unknown): string => {
  if (typeof err == "string") {
    return err;
  }
  const message = (err as any)["message"];
  return message ? message : JSON.stringify(err);
};

/**
 * Maps Boltz errors to user-friendly messages
 */
export const BOLTZ_ERROR_MESSAGES: { [error: string]: string } = {
  "rpc error: code = Unknown desc = checksum mismatch": "Invalid address",
  "rpc error: code = Unknown desc = decoded address is of unknown format":
    "Unknown address format",
};
