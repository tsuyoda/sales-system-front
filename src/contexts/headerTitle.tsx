import React, { createContext, useContext, useState } from 'react';
import { IHeaderTitleContextData } from '../interfaces/IHeader';

const HeaderTitleContext = createContext<IHeaderTitleContextData>({} as IHeaderTitleContextData);

interface HeaderTitleProviderProps {
  children: React.ReactNode;
}

function HeaderTitleProvider({ children }: HeaderTitleProviderProps) {
  const [title, setTitle] = useState('');

  return <HeaderTitleContext.Provider value={{ title, setTitle }}>{children}</HeaderTitleContext.Provider>;
}

function useHeaderTitle() {
  return useContext(HeaderTitleContext);
}

export { HeaderTitleProvider, useHeaderTitle };
