import React from 'react';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { AuthProvider } from './contexts/auth';
import 'react-toastify/dist/ReactToastify.css';
import Routes from './routes';

function App() {
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          type: 'dark'
        }
      }),
    undefined
  );

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </AuthProvider>
      <ToastContainer />
    </ThemeProvider>
  );
}

export default App;
