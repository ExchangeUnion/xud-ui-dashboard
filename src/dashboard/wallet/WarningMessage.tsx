import {
  Card,
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import WarningIcon from "@material-ui/icons/Warning";
import React, { ReactElement } from "react";

type WarningMessageProps = {
  message: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    warningMessage: {
      backgroundColor: theme.palette.warning.dark,
      color: theme.palette.warning.contrastText,
      marginBottom: theme.spacing(3),
      padding: theme.spacing(1),
    },
    iconContainer: {
      display: "flex",
    },
  })
);

const WarningMessage = (props: WarningMessageProps): ReactElement => {
  const { message } = props;
  const classes = useStyles();

  return (
    <Grid item>
      <Card elevation={0} className={classes.warningMessage}>
        <Grid
          item
          container
          spacing={1}
          justify="center"
          alignItems="center"
          wrap="nowrap"
        >
          <Grid item className={classes.iconContainer}>
            <WarningIcon fontSize="small" />
          </Grid>
          <Grid item>
            <Typography variant="body2" align="center">
              {message}
            </Typography>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
};

export default WarningMessage;
