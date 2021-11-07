import { TextFieldProps, TextField } from '@material-ui/core';
import InputMask from 'react-input-mask';
import React, { ChangeEvent, useState } from 'react';

type TelFieldProps = TextFieldProps & {
  value: string;
};

function TelField({ onBlur, onChange, onFocus, value, ...props }: TelFieldProps) {
  const [mask, setMask] = useState('(99) 9999-99999');

  const onlyNumbers = (text: string) => text.replace(/[^0-9]/g, '');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (onlyNumbers(event.target.value).length === 11) {
      setMask('(99) 99999-9999');
    } else {
      setMask('(99) 9999-99999');
    }

    if (onChange) onChange(event);
  };

  return (
    <InputMask
      mask={mask}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore:next-line
      maskChar=' '
      onBlur={onBlur}
      onChange={handleChange}
      onFocus={onFocus}
      value={value}
      disabled={props.disabled}
    >
      {() => <TextField type='tel' {...props} />}
    </InputMask>
  );
}

export default TelField;
