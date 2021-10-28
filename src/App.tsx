import React from 'react';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ptPT } from '@material-ui/core/locale';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { AuthProvider } from './contexts/auth';
import 'react-toastify/dist/ReactToastify.css';
import Routes from './routes';

function App() {
  const theme = React.useMemo(
    () =>
      createTheme(
        {
          palette: {
            type: 'dark'
          }
        },
        ptPT
      ),
    undefined
  );

  return (
    <ThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <AuthProvider>
          <BrowserRouter>
            <Routes />
          </BrowserRouter>
        </AuthProvider>
        <ToastContainer />
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
}

export default App;
