import { FormControl, FormControlLabel, FormLabel, RadioGroup, Radio, RadioGroupProps } from '@material-ui/core';
import React from 'react';
import { IOption } from '../../../../interfaces/IForm';

interface RadioFormButtonsProps extends RadioGroupProps {
  disabled?: boolean;
  label: string;
  options: IOption[];
  row?: boolean;
}

function RadioFormButtons({ label, options = [], row = false, ...props }: RadioFormButtonsProps) {
  return (
    <FormControl component='fieldset' disabled={props.disabled}>
      <FormLabel component='legend'>{label}</FormLabel>
      <RadioGroup row={row} {...props}>
        {options.map(option => (
          <FormControlLabel value={option.value} label={option.label} control={<Radio />} />
        ))}
      </RadioGroup>
    </FormControl>
  );
}

export default RadioFormButtons;
