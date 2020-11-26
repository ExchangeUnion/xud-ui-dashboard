import {
  Button,
  createStyles,
  FormControl,
  InputAdornment,
  InputLabel,
  makeStyles,
  OutlinedInput,
  Theme,
  Typography,
} from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import React, { ReactElement, useEffect, useState } from "react";
import { GetServiceInfoResponse } from "../../models/GetServiceInfoResponse";

type WithdrawAmountProps = {
  currency: string;
  serviceInfo: GetServiceInfoResponse;
  onNext: (amount: number) => void;
  initialAmount?: number;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    row: {
      padding: `${theme.spacing(2)}px 0px`,
    },
  })
);

const WithdrawAmount = (props: WithdrawAmountProps): ReactElement => {
  const { currency, serviceInfo, onNext, initialAmount } = props;
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const inputId = `withdraw-${currency}-amount`;
  const classes = useStyles();

  useEffect(() => {
    setAmount(initialAmount);
  }, [initialAmount]);

  return (
    <>
      <FormControl variant="outlined">
        <InputLabel htmlFor={inputId}>Amount</InputLabel>
        <OutlinedInput
          id={inputId}
          labelWidth={60}
          value={amount || ""}
          onChange={(event) => {
            event.preventDefault();
            const numberValue = Number.parseInt(
              event.target.value.replace(/[^0-9]/g, "")
            );
            const newValue = Number.isNaN(numberValue)
              ? undefined
              : numberValue;
            setAmount(newValue);
          }}
          endAdornment={<InputAdornment position="end">sats</InputAdornment>}
        />
      </FormControl>
      <Typography className={classes.row} variant="body2">
        Range: {<strong>{serviceInfo.limits.minimal}</strong>} to{" "}
        {<strong>{serviceInfo.limits.maximal}</strong>} sats
      </Typography>
      <Button
        endIcon={<ArrowForwardIcon />}
        color="primary"
        disableElevation
        variant="contained"
        onClick={() => onNext(amount!)}
        disabled={
          !amount ||
          amount < Number.parseInt(serviceInfo.limits.minimal) ||
          amount > Number.parseInt(serviceInfo.limits.maximal)
        }
      >
        Next
      </Button>
    </>
  );
};

export default WithdrawAmount;
