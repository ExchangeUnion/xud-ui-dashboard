import { Grid, Typography } from "@material-ui/core";
import React, { ReactElement } from "react";

type ErrorMessageProps = {
  mainMessage?: string;
  details: string;
};

const ErrorMessage = (props: ErrorMessageProps): ReactElement => {
  const { details, mainMessage } = props;

  return (
    <Grid
      item
      container
      direction="column"
      justify="center"
      alignItems="center"
    >
      <Typography variant="body1" color="error" align="center">
        {mainMessage || "Failed to fetch data"}
      </Typography>
      <Typography variant="body2" color="textSecondary" align="center">
        {details}
      </Typography>
    </Grid>
  );
};

export default ErrorMessage;
