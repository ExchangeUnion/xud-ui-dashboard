import styled from "styled-components";
import { Grid } from "@material-ui/core";

//types
type ItemsContainerType = {
  container: boolean;
  spacing: number;
}

//styled
export const ItemsContainer = styled(Grid)<ItemsContainerType>`
  padding-bottom: 45px;
`;