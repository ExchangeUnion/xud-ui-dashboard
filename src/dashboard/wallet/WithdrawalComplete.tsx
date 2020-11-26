import {
  Button,
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import React, { ReactElement } from "react";

type WithdrawalCompleteProps = {
  amount: number;
  address: string;
  onClose: () => void;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonContainer: {
      marginTop: theme.spacing(3),
    },
  })
);

const WithdrawalComplete = (props: WithdrawalCompleteProps): ReactElement => {
  const { amount, address, onClose } = props;
  const classes = useStyles();

  return (
    <>
      <Grid item container alignItems="center" justify="center">
        <Typography variant="body2" component="div">
          Withdrawal of <strong>{amount}</strong> sats to{" "}
          <strong>{address}</strong> was successful!
        </Typography>
      </Grid>
      <Grid
        item
        container
        alignItems="center"
        justify="center"
        className={classes.buttonContainer}
      >
        <Button
          variant="contained"
          color="primary"
          disableElevation
          onClick={onClose}
        >
          Close
        </Button>
      </Grid>
    </>
  );
};

export default WithdrawalComplete;
