import styled from 'styled-components';
import { Grid } from '@material-ui/core';

//types
type RowType = {
  item: any;
  container: any;
}

//styled
export const Row = styled(Grid)<RowType>`
  padding-top: ${p => p.theme.spacing(1)}px;
`;