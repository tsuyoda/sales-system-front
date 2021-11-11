import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { AuthProvider } from './contexts/auth';
import 'react-toastify/dist/ReactToastify.css';
import Routes from './routes';
import { HeaderTitleProvider } from './contexts/headerTitle';
import { useColorMode } from './contexts/colorMode';

function App() {
  const { theme } = useColorMode();

  return (
    <ThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <AuthProvider>
          <HeaderTitleProvider>
            <BrowserRouter>
              <Routes />
            </BrowserRouter>
          </HeaderTitleProvider>
        </AuthProvider>
        <ToastContainer />
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
}

export default App;
