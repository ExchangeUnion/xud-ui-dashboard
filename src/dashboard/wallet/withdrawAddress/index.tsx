import {
  Button,
  Grid,
  Typography
} from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import React, { ReactElement, useState } from "react";
import { satsToCoinsStr } from "../../../common/currencyUtil";
import ErrorMessage from "../../../common/ErrorMessage";
import { BOLTZ_ERROR_MESSAGES, getErrorMsg } from "../../../common/errorUtil";
import ButtonWithLoading from "../../../common/buttonWithLoading";
import QrCode from "../../../common/qrCode";
import { Fees } from "../../../models/BoltzFees";
import { CreateReverseSwapResponse } from "../../../models/CreateReverseSwapResponse";
import { GetServiceInfoResponse } from "../../../models/GetServiceInfoResponse";
import Address from "../address";
import BoltzFeeInfo from "../boltzFeeInfo";
import { withdraw } from "../walletUtil";
import WarningMessage from "../../../common/WarningMessage";

//styles
import { ButtonContainer } from "./styles";

type WithdrawAddressProps = {
  currency: string;
  amount: number;
  serviceInfo: GetServiceInfoResponse;
  onComplete: (address: string, id: string) => void;
  changeAmount: (address?: string) => void;
  currencyFullName?: string;
  initialAddress?: string;
};

const WithdrawAddress = (props: WithdrawAddressProps): ReactElement => {
  const {
    currency,
    amount,
    serviceInfo,
    currencyFullName,
    onComplete,
    changeAmount,
    initialAddress,
  } = props;
  const [address, setAddress] = useState(initialAddress || "");
  const [fees, setFees] = useState(serviceInfo.fees);
  const [qrOpen, setQrOpen] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");

  const errorHandler = (err: any) => {
    setWithdrawing(false);
    const errorMsg = getErrorMsg(err);
    setError(BOLTZ_ERROR_MESSAGES[errorMsg] || errorMsg);
  };

  const feesChangedHandler = {
    next: (resp: Fees) => {
      setFees(resp);
      setWarning(
        "Fees have changed. Please revisit the fees and confirm withdrawal."
      );
      setWithdrawing(false);
    },
    error: errorHandler,
  };

  const invalidAmountHandler = {
    next: () => {
      setError(
        "Withdrawal cannot be completed with desired amount. Please see details and change the amount in the previous step."
      );
      setWithdrawing(false);
    },
    error: errorHandler,
  };

  const withdrawHandler = {
    next: (resp: CreateReverseSwapResponse) => {
      setWithdrawing(false);
      onComplete(address!, resp.id);
    },
    error: errorHandler,
  };

  const handleWithdrawal = (): void => {
    setWithdrawing(true);
    setError("");
    setWarning("");

    withdraw(
      currency,
      amount,
      address,
      serviceInfo.fees,
      feesChangedHandler,
      invalidAmountHandler,
      withdrawHandler
    );
  };

  return (
    <>
      {!qrOpen ? (
        <Grid item container justify="center" direction="column">
          {!!warning && !error && <WarningMessage message={warning} />}
          <Typography variant="body2" align="center">
            Paste an on-chain {currencyFullName || currency} address to receive{" "}
            {<strong>{satsToCoinsStr(amount, currency)}</strong>}
          </Typography>
          <Address
            address={address}
            showQr={false}
            readOnly={false}
            setAddress={setAddress}
          />
          <BoltzFeeInfo fees={fees} currency={currency} amount={amount} isReverse/>
          <ButtonContainer
            item
            container
            justify="center"
            spacing={4}
          >
            <Grid item>
              <Button
                startIcon={<ArrowBackIcon />}
                variant="outlined"
                onClick={() => changeAmount(address)}
              >
                Change Amount
              </Button>
            </Grid>
            <Grid item>
              <ButtonWithLoading
                text="Confirm Withdraw"
                disabled={!address || withdrawing}
                loading={withdrawing}
                onClick={handleWithdrawal}
              />
            </Grid>
          </ButtonContainer>
          {!!error && (
            <ErrorMessage details={error} mainMessage="Failed to withdraw" />
          )}
        </Grid>
      ) : (
        <Grid item container>
          <QrCode value={address} handleClose={() => setQrOpen(false)} />
        </Grid>
      )}
    </>
  );
};

export default WithdrawAddress;
