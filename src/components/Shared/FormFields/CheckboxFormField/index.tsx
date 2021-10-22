import { CheckboxProps, FormControl, FormControlLabel, FormGroup, Checkbox } from '@material-ui/core';
import React from 'react';

interface CheckboxFormFieldProps extends CheckboxProps {
  label: string;
}

function CheckboxFormField({ label, ...props }: CheckboxFormFieldProps) {
  return (
    <FormControl>
      <FormGroup>
        <FormControlLabel control={<Checkbox {...props} />} label={label} />
      </FormGroup>
    </FormControl>
  );
}

export default CheckboxFormField;
