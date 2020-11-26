import { XUD_NOT_READY } from "../constants";
import { Status } from "../models/Status";

export const isServiceReady = (status: Status): boolean => {
  return (
    status.status.startsWith("Ready") ||
    (status.service === "xud" &&
      !XUD_NOT_READY.some((str) => status.status.startsWith(str))) ||
    (status.service === "boltz" &&
      [...status.status.matchAll(new RegExp("down", "g"))].length === 1)
  );
};
