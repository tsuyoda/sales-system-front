import { Dispatch, SetStateAction } from 'react';

export interface IHeaderTitleContextData {
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
}
