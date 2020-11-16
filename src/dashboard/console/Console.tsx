import React, { Component, ReactElement } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";

type PropsType = RouteComponentProps<{ param1: string }>;

class Console extends Component<PropsType> {
  render(): ReactElement {
    return <div>Here comes the console...</div>;
  }
}

export default withRouter(Console);
