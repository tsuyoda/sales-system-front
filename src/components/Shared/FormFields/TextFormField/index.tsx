import { TextField, TextFieldProps } from '@material-ui/core';
import InputMask from 'react-input-mask';
import React from 'react';
import TelField from './TelField';

type TextFormFieldProps = TextFieldProps & {
  value: string;
  mask?: string;
};

function TextFormField({ mask, onBlur, onChange, onFocus, value, type, ...props }: TextFormFieldProps) {
  if (mask) {
    return (
      <InputMask
        mask={mask}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore:next-line
        maskChar=' '
        onBlur={onBlur}
        onChange={onChange}
        onFocus={onFocus}
        value={value}
        disabled={props.disabled}
      >
        {() => <TextField type={type} {...props} />}
      </InputMask>
    );
  }

  return type === 'tel' ? (
    <TelField onBlur={onBlur} onChange={onChange} onFocus={onFocus} value={value} {...props} />
  ) : (
    <TextField onBlur={onBlur} onChange={onChange} onFocus={onFocus} value={value} type={type} {...props} />
  );
}

export default TextFormField;
