import {
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import ReportProblemOutlinedIcon from "@material-ui/icons/ReportProblemOutlined";
import React, { ReactElement } from "react";
import UnlockXud from "./UnlockXud";

export type ViewDisabledProps = {
  xudLocked?: boolean;
  xudStatus?: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    row: {
      padding: theme.spacing(3),
    },
  })
);

function ViewDisabled(props: ViewDisabledProps): ReactElement {
  const classes = useStyles();
  const { xudLocked, xudStatus } = props;
  return (
    <Grid container direction="column" alignItems="center" justify="center">
      <Grid
        container
        item
        alignItems="center"
        justify="center"
        spacing={2}
        className={classes.row}
      >
        <Grid item>
          <Grid item container alignItems="center">
            <ReportProblemOutlinedIcon fontSize="large" />
          </Grid>
        </Grid>
        <Grid item>
          <Typography variant="h4" component="h1">
            {xudLocked ? "XUD is locked" : "XUD is not ready"}
          </Typography>
        </Grid>
      </Grid>
      <Grid container item justify="center" className={classes.row}>
        {xudLocked ? (
          <UnlockXud />
        ) : (
          <Grid item>
            <Typography variant="h6" component="h2">
              {xudStatus || ""}
            </Typography>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}

export default ViewDisabled;
