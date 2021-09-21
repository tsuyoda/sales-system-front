import React, { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import {
  Avatar,
  Container,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
  CssBaseline,
  Button,
  makeStyles
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Loader from 'react-loader-spinner';
import { useAuth } from '../../contexts/auth';

const useStyles = makeStyles(theme => ({
  main: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  form: {
    marginTop: theme.spacing(1),
    width: '100%'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.light
  },
  submit: {
    margin: theme.spacing(2, 0, 3)
  }
}));

function SignIn() {
  const classes = useStyles();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const history = useHistory();
  const { signed, signIn } = useAuth();

  useEffect(() => {
    if (signed()) {
      history.push('/');
    }
  });

  const handleUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      try {
        setLoading(true);
        await signIn({ username, password });
        toast.success('Autenticado com sucesso!');
        history.push('/');
      } catch (err) {
        setLoading(false);
        if ([404, 401].includes(err.response?.status)) {
          toast.error(`Falha na autenticação: Verifique seu usuário ou senha.`);
        } else {
          toast.error(`Falha na autenticação: Erro no servidor.`);
        }
      }
    },
    [username, password]
  );

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline>
        <div className={classes.main}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant='h5' component='h1'>
            Entrar
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              id='user'
              name='user'
              type='text'
              label='Usuário'
              variant='outlined'
              margin='normal'
              autoFocus
              fullWidth
              onChange={handleUsername}
              required
            />
            <TextField
              id='password'
              name='password'
              type='password'
              label='Senha'
              variant='outlined'
              margin='normal'
              fullWidth
              onChange={handlePassword}
              required
            />
            <FormControlLabel control={<Switch name='rememberMe' />} label='Lembrar de mim' />
            <Button type='submit' variant='contained' color='primary' fullWidth className={classes.submit}>
              {loading ? <Loader type='TailSpin' color='#FF4081' height={16} /> : <div>Entrar</div>}
            </Button>
          </form>
        </div>
      </CssBaseline>
    </Container>
  );
}

export default SignIn;
