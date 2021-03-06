import { Checkbox, TextField, CircularProgress, BaseTextFieldProps } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { AxiosRequestConfig } from 'axios';
import React, { useEffect, useState } from 'react';
import { IOption } from '../../../../interfaces/IForm';

function sleep(delay = 0) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

interface MultipleSelectFormFieldProps {
  sort: string;
  limit: number;
  options: IOption[];
  textFieldProps: BaseTextFieldProps;
  getOptions(config: AxiosRequestConfig): Promise<IOption[]>;
}

function MultipleSelectFormField({
  getOptions,
  textFieldProps,
  options: fixedOptions = [],
  sort = 'asc',
  limit = 1000,
  ...props
}: MultipleSelectFormFieldProps) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<IOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setOptions([]);
    setLoading(true);
  }, [getOptions]);

  useEffect(() => {
    let active = true;

    if (!loading || !open) {
      return undefined;
    }

    if (getOptions) {
      (async () => {
        const response = await getOptions({ params: { sort, limit } });
        await sleep(5e2);

        if (active) {
          setOptions(response);
          setLoading(false);
        }
      })();
    } else {
      setOptions(fixedOptions);
      setLoading(false);
    }

    return () => {
      active = false;
    };
  }, [open]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Autocomplete
      {...props}
      multiple
      options={options}
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      loading={loading}
      getOptionSelected={(option, value) => option.value === value.value}
      getOptionLabel={option => option.label}
      renderOption={(option, state) => {
        return (
          <>
            <Checkbox checked={state.selected} />
            {option.label}
          </>
        );
      }}
      renderInput={params => {
        return (
          <TextField
            {...params}
            {...textFieldProps}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading && open ? <CircularProgress color='inherit' size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              )
            }}
          />
        );
      }}
    />
  );
}

export default MultipleSelectFormField;
