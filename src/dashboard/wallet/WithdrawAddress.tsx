import {
  Button,
  CircularProgress,
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import React, { ReactElement, useState } from "react";
import api from "../../api";
import { getErrorMsg } from "../../common/errorUtil";
import QrCode from "../../common/QrCode";
import { GetServiceInfoResponse } from "../../models/GetServiceInfoResponse";
import Address from "./Address";
import ErrorMessage from "./ErrorMessage";

type WithdrawAddressProps = {
  currency: string;
  amount: number;
  serviceInfo: GetServiceInfoResponse;
  onComplete: (address: string) => void;
  changeAmount: (address?: string) => void;
  currencyFullName?: string;
  initialAddress?: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    row: {
      padding: `${theme.spacing(2)}px 0px`,
    },
    buttonContainer: {
      marginTop: theme.spacing(2),
    },
    buttonWrapper: {
      margin: theme.spacing(1),
      position: "relative",
    },
    buttonProgress: {
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: -12,
      marginLeft: -12,
    },
  })
);

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
  const [address, setAddress] = useState<string>(initialAddress || "");
  const [qrOpen, setQrOpen] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [error, setError] = useState("");
  const classes = useStyles();

  return (
    <>
      {!qrOpen ? (
        <Grid item container justify="center" direction="column">
          <Typography variant="body2" align="center">
            Paste an on-chain {currencyFullName || currency} address to receive{" "}
            {<strong>{amount} sats</strong>}
          </Typography>
          <Address
            address={address}
            openQr={() => setQrOpen(true)}
            readOnly={false}
            setAddress={setAddress}
          />
          <Grid item container direction="column" alignItems="center">
            <Typography variant="body2">
              Boltz swap fee:{" "}
              <strong>
                {(amount * serviceInfo.fees.percentage) / 100} sats (
                {serviceInfo.fees.percentage}%)
              </strong>
            </Typography>
            <Typography variant="body2">
              Miner fee: <strong>{serviceInfo.fees.miner.normal} sats</strong>
            </Typography>
          </Grid>
          <Grid
            item
            container
            justify="center"
            spacing={4}
            className={classes.buttonContainer}
          >
            <Grid item className={classes.buttonWrapper}>
              <Button
                startIcon={<ArrowBackIcon />}
                variant="outlined"
                onClick={() => changeAmount(address)}
              >
                Change Amount
              </Button>
            </Grid>
            <Grid item className={classes.buttonWrapper}>
              <Button
                color="primary"
                disableElevation
                variant="contained"
                onClick={() => {
                  setWithdrawing(true);
                  setError("");
                  api.boltzWithdraw$(currency, { amount, address }).subscribe({
                    next: () => {
                      setWithdrawing(false);
                      onComplete(address!);
                    },
                    error: (err) => {
                      setWithdrawing(false);
                      setError(getErrorMsg(err));
                    },
                  });
                }}
                disabled={!address || withdrawing}
              >
                Confirm Withdraw
              </Button>
              {withdrawing && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                />
              )}
            </Grid>
          </Grid>
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
