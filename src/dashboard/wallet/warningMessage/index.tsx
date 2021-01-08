import {
  Grid,
  Typography
} from "@material-ui/core";
import WarningIcon from "@material-ui/icons/Warning";
import React, { ReactElement } from "react";

//styles
import {
  StyledWarningMessage,
  IconContainer
} from "./styles";

type WarningMessageProps = {
  message: string;
};

const WarningMessage = (props: WarningMessageProps): ReactElement => {
  const { message } = props;

  return (
    <Grid item>
      <StyledWarningMessage elevation={0}>
        <Grid
          item
          container
          spacing={1}
          justify="center"
          alignItems="center"
          wrap="nowrap"
        >
          <IconContainer item>
            <WarningIcon fontSize="small" />
          </IconContainer>
          <Grid item>
            <Typography variant="body2" align="center">
              {message}
            </Typography>
          </Grid>
        </Grid>
      </StyledWarningMessage>
    </Grid>
  );
};

export default WarningMessage;
