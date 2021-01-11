import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, Theme, withStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "styled-components";
import React, { ReactElement } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import ConnectionFailed from "./common/connectionFailed";
import NotFound from "./common/notFound";
import Dashboard from "./dashboard";
import { Path } from "./router/Path";

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

const GlobalCss = withStyles((theme: Theme) => {
  return {
    "@global": {
      "::-webkit-scrollbar": {
        width: 8,
      },
      "::-webkit-scrollbar-track": {
        background: theme.palette.background.default,
      },
      "::-webkit-scrollbar-thumb": {
        borderRadius: "4px",
        background: theme.palette.background.paper,
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
