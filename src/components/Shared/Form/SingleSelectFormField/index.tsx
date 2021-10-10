import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { FieldProps } from 'formik';
import React from 'react';

interface ISelectOption {
  label: string;
  value: string | number;
}

interface SelectFormFieldProps extends FieldProps {
  label: string;
  options: ISelectOption[];
}

function SelectFormField({ options = [], field, label, ...props }: SelectFormFieldProps) {
  return (
    <FormControl fullWidth>
      <InputLabel shrink>{label}</InputLabel>
      <Select
        fullWidth
        value={field.value}
        MenuProps={{
          getContentAnchorEl: null,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left'
          }
        }}
        {...props}
      >
        {options.map(op => (
          <MenuItem value={op.value}>{op.label}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default SelectFormField;
