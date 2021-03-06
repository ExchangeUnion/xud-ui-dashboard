import {
  createStyles,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Theme,
} from "@material-ui/core";
import { inject, observer } from "mobx-react";
import React, { ReactElement, useEffect, useState } from "react";
import {
  NavLink,
  Redirect,
  Route,
  Switch,
  useLocation,
  useRouteMatch,
} from "react-router-dom";
import { timer } from "rxjs";
import { exhaustMap } from "rxjs/operators";
import api from "../api";
import ErrorMessage from "../common/ErrorMessage";
import { getErrorMsg } from "../common/errorUtil";
import Loader from "../common/Loader";
import { isXudLocked, isXudReady } from "../common/serviceUtil";
import ViewDisabled from "../dashboard/ViewDisabled";
import { Status } from "../models/Status";
import { Path } from "../router/Path";
import { BackupStore, BACKUP_STORE } from "../stores/backupStore";
import BackupDirectory from "./BackupDirectory";
import ChangePassword from "./ChangePassword";
import Setup from "./Setup";

type SettingsProps = {
  backupStore?: BackupStore;
};

type MenuItem = {
  text: string;
  path: Path;
  component: ReactElement;
  isDisabled?: boolean;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      height: "100%",
      width: "100%",
    },
    content: {
      height: "60%",
      width: "80%",
      maxHeight: "900px",
      maxWidth: "1500px",
      minHeight: "350px",
      minWidth: "600px",
    },
    menu: {
      width: "100%",
    },
    divider: {
      marginRight: theme.spacing(2),
    },
  })
);

const Settings = inject(BACKUP_STORE)(
  observer(
    (props?: SettingsProps): ReactElement => {
      const { backupStore } = props!;
      const [xudStatus, setXudStatus] = useState<Status | undefined>(undefined);
      const [xudStatusError, setXudStatusError] = useState("");
      const classes = useStyles();
      const { path, url } = useRouteMatch();
      const { pathname } = useLocation();

      useEffect(() => {
        const sub = timer(0, 5000)
          .pipe(exhaustMap(() => api.statusByService$("xud")))
          .subscribe({
            next: (resp) => setXudStatus(resp),
            error: (err) => setXudStatusError(getErrorMsg(err)),
          });

        return () => sub.unsubscribe();
      }, []);

      /**
       * In case a component needs xud to be ready and unlocked,
       * information from xud status is displayed when those conditions are not met.
       *
       * @param comp
       * a component to display when xud is ready and unlocked
       */
      const showXudDependentComponent = (comp: ReactElement): ReactElement => {
        if (xudStatus) {
          return !isXudLocked(xudStatus) && isXudReady(xudStatus) ? (
            comp
          ) : (
            <ViewDisabled
              xudLocked={isXudLocked(xudStatus)}
              xudStatus={xudStatus.status}
            />
          );
        }
        return xudStatusError ? (
          <ErrorMessage mainMessage={"Error"} details={xudStatusError} />
        ) : (
          <Loader />
        );
      };

      const initialSetupFinished =
        backupStore!.backupInfoLoaded &&
        !backupStore!.defaultPassword &&
        backupStore!.mnemonicShown &&
        !backupStore!.defaultBackupDirectory;

      const menuItems: MenuItem[] = [
        {
          text: "Initial Setup",
          path: Path.INITIAL_SETUP,
          component:
            !backupStore!.defaultPassword && backupStore!.mnemonicShown ? (
              <Setup />
            ) : (
              showXudDependentComponent(<Setup />)
            ),
          isDisabled: !backupStore!.backupInfoLoaded || initialSetupFinished,
        },
        {
          text: "Backup",
          path: Path.BACKUP,
          component: <BackupDirectory />,
          isDisabled: !initialSetupFinished,
        },
        {
          text: "Change Password",
          path: Path.CHANGE_PASSWORD,
          component: showXudDependentComponent(<ChangePassword />),
          isDisabled: !initialSetupFinished,
        },
      ];

      const firstEnabledMenuItem = menuItems.find((item) => !item.isDisabled);

      return (
        <Grid
          container
          alignItems="center"
          justify="center"
          className={classes.wrapper}
        >
          <Grid item container className={classes.content}>
            <Grid
              item
              container
              direction="column"
              justify="center"
              alignItems="center"
              xs={4}
              lg={3}
            >
              <List className={classes.menu}>
                {menuItems
                  .filter((item) => !item.isDisabled)
                  .map((item) => {
                    const navigateTo = `${url}${item.path}`;
                    return (
                      <ListItem
                        key={item.text}
                        button
                        component={NavLink}
                        to={navigateTo}
                        selected={navigateTo === pathname}
                      >
                        <ListItemText
                          primary={item.text}
                          primaryTypographyProps={{ variant: "overline" }}
                        />
                      </ListItem>
                    );
                  })}
              </List>
            </Grid>
            <Divider
              orientation="vertical"
              flexItem
              className={classes.divider}
            />
            <Grid
              item
              container
              alignItems="center"
              justify="space-between"
              xs={7}
              lg={8}
            >
              <Switch>
                {menuItems
                  .filter((item) => !item.isDisabled)
                  .map((item) => {
                    return (
                      <Route exact path={`${path}${item.path}`} key={item.text}>
                        {item.component}
                      </Route>
                    );
                  })}
                {!!firstEnabledMenuItem && (
                  <Route exact path={path}>
                    <Redirect to={`${path}${firstEnabledMenuItem?.path}`} />
                  </Route>
                )}
              </Switch>
            </Grid>
          </Grid>
        </Grid>
      );
    }
  )
);

export default Settings;
