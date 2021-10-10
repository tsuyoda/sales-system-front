import { TextField } from '@material-ui/core';
import { FieldProps, getIn } from 'formik';
import React, { ChangeEvent, useCallback } from 'react';

interface TextFormFieldProps extends FieldProps {
  helperText: string;
}

function TextFormField({ field, form, helperText, ...props }: TextFormFieldProps) {
  const errorText = !!form.errors[field.name] && getIn(form.errors, field.name);

  const handleSearchTextChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      return form.setFieldValue(field.name, event.target.value);
    },
    [form, field.name]
  );

  return (
    <TextField value={field.value} helperText={errorText || helperText} onChange={handleSearchTextChange} {...props} />
  );
}

export default TextFormField;
