import { createTheme } from '@material-ui/core';
import React, { createContext, useContext, useState, useMemo } from 'react';
import { ptPT } from '@material-ui/core/locale';
import { ColorMode, IColorModeContextData } from '../interfaces/IApp';

const ColorModeContext = createContext<IColorModeContextData>({} as IColorModeContextData);

interface ColorModeProviderProps {
  children: React.ReactNode;
}

function ColorModeProvider({ children }: ColorModeProviderProps) {
  const cachedMode = localStorage.getItem('@SalesSystem:colorMode') as ColorMode | null;
  const [mode, setMode] = useState<ColorMode>(cachedMode || 'dark');
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode(prevMode => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';

          localStorage.setItem('@SalesSystem:colorMode', newMode);

          return newMode;
        });
      }
    }),
    []
  );

  const theme = React.useMemo(
    () =>
      createTheme(
        {
          palette: {
            type: mode
          }
        },
        ptPT
      ),
    [mode]
  );

  return <ColorModeContext.Provider value={{ theme, colorMode }}>{children}</ColorModeContext.Provider>;
}

function useColorMode() {
  return useContext(ColorModeContext);
}

export { ColorModeProvider, useColorMode };
