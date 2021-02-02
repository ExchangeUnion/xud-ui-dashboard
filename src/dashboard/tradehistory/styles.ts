import styled from "styled-components";
import { Grid, IconButton } from "@material-ui/core";

//types
type TableCellType = {
  key: any;
  item: boolean;
  container: boolean;
  xs: number;
  xl: number;
}

type TableCellIconType = {
  size: string;
  onClick: () => void;
}

//styled
export const TableCell = styled(Grid)<TableCellType>`
  padding: ${p => p.theme.spacing(2)}px;
`;

export const TableCellIcon = styled(IconButton)<TableCellIconType>`
  margin-left: ${p => p.theme.spacing(1)}px;
`;