import styled from "styled-components";
import {
  Card,
  Grid
} from "@material-ui/core";

//types
type StyledWarningMessageType = {
  elevation: number;
}

type IconContainerType = {
  item: boolean;
}

export const StyledWarningMessage = styled(Card)<StyledWarningMessageType>`
  background-color: ${p => p.theme.palette.warning.dark}
  color: ${p => p.theme.palette.warning.contrastText}
  margin-bottom: ${p => p.theme.spacing(2)}px;
  padding: ${p => p.theme.spacing(1)}px;
`;

export const IconContainer = styled(Grid)<IconContainerType>`
  display: flex;
`;