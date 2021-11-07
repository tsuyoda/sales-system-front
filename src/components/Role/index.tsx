import { Typography, Grid, Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useHeaderTitle } from '../../contexts/headerTitle';
import TableRole from './List/Table';
import { useStyles } from './styles';

function Role() {
  const classes = useStyles();

  const history = useHistory();
  const { setTitle } = useHeaderTitle();

  useEffect(() => {
    setTitle('Nível de acesso');
  }, []);

  const handleCreateButton = () => {
    history.push('/role/register');
  };

  return (
    <>
      <Grid container>
        <Grid item xs={12} md={11}>
          <Typography variant='subtitle1' className={classes.subtitle}>
            Gerencie o controle de acessos do seu sistema
          </Typography>
        </Grid>
        <Grid item xs={12} md={1} className={classes.addButtonGrid}>
          <Button color='primary' variant='contained' fullWidth onClick={handleCreateButton} startIcon={<AddIcon />}>
            Criar
          </Button>
        </Grid>
      </Grid>
      <TableRole />
    </>
  );
}

export default Role;
