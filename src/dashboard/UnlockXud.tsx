import {
  createStyles,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  makeStyles,
  OutlinedInput,
  Theme,
  Typography,
} from "@material-ui/core";
import React, { ReactElement, useState } from "react";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import ButtonWithLoading from "../common/ButtonWithLoading";
import api from "../api";
import { getErrorMsg, XUD_ERROR_MESSAGES } from "../common/errorUtil";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      height: "50vh",
      maxHeight: 500,
    },
    errorMessageContainer: {
      minHeight: 50,
      marginTop: theme.spacing(2),
    },
  })
);

const UnlockXud = (): ReactElement => {
  const classes = useStyles();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [queryInProgress, setQueryInProgress] = useState(false);
  const passwordInputId = "xudPassword";

  const unlock = () => {
    setQueryInProgress(true);
    setError("");
    api.unlock$(password).subscribe({
      next: () => {},
      error: (err) => {
        const errorMessage = getErrorMsg(err);
        setError(XUD_ERROR_MESSAGES[errorMessage] || errorMessage);
        setQueryInProgress(false);
      },
    });
  };

  return (
    <form
      noValidate
      autoComplete="off"
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          unlock();
          return false;
        }
      }}
    >
      <Grid container justify="space-around" className={classes.container}>
        <Grid item container justify="center" alignItems="center">
          <FormControl variant="outlined">
            <InputLabel htmlFor={passwordInputId}>Password</InputLabel>
            <OutlinedInput
              id={passwordInputId}
              labelWidth={70}
              value={password}
              onChange={(event) => {
                setError("");
                setPassword(event.target.value);
              }}
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </Grid>
        <Grid
          item
          container
          direction="column"
          alignItems="center"
          justify="center"
        >
          <Grid item container justify="center">
            <ButtonWithLoading
              text="Unlock"
              disabled={queryInProgress || !password}
              loading={queryInProgress}
              onClick={unlock}
            />
          </Grid>
          <Grid
            item
            container
            direction="column"
            alignItems="center"
            className={classes.errorMessageContainer}
          >
            {!!error && (
              <>
                <Typography variant="body1" color="error" align="center">
                  Failed to unlock
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  align="center"
                >
                  {error}
                </Typography>
              </>
            )}
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};

export default UnlockXud;
