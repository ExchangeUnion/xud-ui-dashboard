import styled from "styled-components";
import {
  Grid,
  OutlinedInput
} from "@material-ui/core";

//types
type AddressContainerType = {
  item: any;
  container: any;
  direction: string;
}

type AddressFieldType = {
  fullWidth: any;
  color: string;
  readOnly: boolean
  value: any;
  onChange: any;
  endAdornment: any;
}

//styled
export const AddressContainer = styled(Grid)<AddressContainerType>`
  margin: ${p => p.theme.spacing(2)}px 0px;
`;

export const AddressField = styled(OutlinedInput)<AddressFieldType>`
  margin: ${p => p.theme.spacing(2)}px 0px;
  ${p => p.readOnly && `
    color: ${p.theme.palette.text.primary};
    margin-bottom: ${p.theme.spacing(2)}px;
    &.MuiOutlinedInput-root.Mui-focused fieldset {
      border-color: ${p.theme.palette.common.white};
      border-width: 1px;
    }
  `}
`;