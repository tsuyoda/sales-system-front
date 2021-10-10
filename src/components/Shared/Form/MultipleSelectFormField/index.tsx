import { FormControl, InputLabel, Select, MenuItem, ListItemText, Checkbox } from '@material-ui/core';
import { FieldProps } from 'formik';
import React from 'react';

interface ISelectOption {
  label: string;
  value: string | number;
}

interface MultipleSelectFormFieldProps extends FieldProps {
  label: string;
  options: ISelectOption[];
  isLoading: boolean;
  totalOptions: number;
  onMoreOptinsClick(): void;
}

function MultipleSelectFormField({
  options = [],
  isLoading,
  field,
  label,
  totalOptions = 0,
  onMoreOptinsClick,
  ...props
}: MultipleSelectFormFieldProps) {
  const renderValues = (selected: unknown) => {
    if (isLoading) {
      return 'Carregando...';
    }

    return (selected as string[]).join(', ');
  };

  return (
    <FormControl fullWidth>
      <InputLabel shrink>{label}</InputLabel>
      <Select
        multiple
        fullWidth
        value={field.value}
        renderValue={renderValues}
        MenuProps={{
          getContentAnchorEl: null,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left'
          }
        }}
        {...props}
      >
        {isLoading ? (
          <MenuItem disabled>Carregando...</MenuItem>
        ) : (
          options.map(op => (
            <MenuItem key={op.value} value={op.value}>
              <Checkbox checked={field.value.indexOf(op.value as string) > -1} />
              <ListItemText primary={op.label} />
            </MenuItem>
          ))
        )}
        {options.length < totalOptions && <MenuItem onClick={onMoreOptinsClick}>Mais...</MenuItem>}
      </Select>
    </FormControl>
  );
}

export default MultipleSelectFormField;
