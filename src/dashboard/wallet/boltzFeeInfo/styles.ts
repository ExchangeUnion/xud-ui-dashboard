import styled from "styled-components";
import { Grid } from "@material-ui/core";

//types
type IconContainerType = {
  item: any;
}

//styled
export const IconContainer = styled(Grid)<IconContainerType>`
  display: flex;
  align-items: center;
`;