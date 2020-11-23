import { Fees } from "./BoltzFees";
import { Limits } from "./BoltzLimits";

export type DepositResponse = {
  address: string;
  timeoutBlockHeight: number;
  fees: Fees;
  limits: Limits;
};
