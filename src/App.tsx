import CssBaseline from "@material-ui/core/CssBaseline";
import { Theme, withStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import React, { ReactElement } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import ConnectionFailed from "./common/ConnectionFailed";
import NotFound from "./common/NotFound";
import Dashboard from "./dashboard/Dashboard";
import { Path } from "./router/Path";
import { darkTheme } from "./themes";

const GlobalCss = withStyles((theme: Theme) => {
  const background = theme.palette.background;
  return {
    "@global": {
      "*": {
        "scrollbar-width": "thin",
        "scrollbar-color": `${background.paper} ${background.default}`,
      },
      "::-webkit-scrollbar": {
        width: 8,
      },
      "::-webkit-scrollbar-track": {
        background: background.default,
      },
      "::-webkit-scrollbar-thumb": {
        borderRadius: "4px",
        background: background.paper,
      },
      "::-webkit-scrollbar-thumb:hover": {
        background: theme.palette.grey[700],
      },
      "::-webkit-scrollbar-corner": {
        backgroundColor: "transparent",
      },
    },
  };
})(() => null);

function App(): ReactElement {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <GlobalCss />
      <Router>
        <Switch>
          <Route path={Path.CONNECTION_FAILED}>
            <ConnectionFailed />
          </Route>
          <Route path={Path.DASHBOARD}>
            <Dashboard />
          </Route>
          <Route exact path={Path.HOME}>
            <Redirect to={Path.DASHBOARD} />
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
