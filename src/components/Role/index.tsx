import { Typography, Grid, Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import React from 'react';
import { useHistory } from 'react-router-dom';
import TableRole from './List/Table';
import { useStyles } from './styles';

function Role() {
  const classes = useStyles();

  const history = useHistory();

  const handleCreateButton = () => {
    history.push('/role/register');
  };

  return (
    <>
      <Grid container>
        <Grid item xs={12} md={11}>
          <Typography paragraph variant='h5' component='h1'>
            Nível de acesso
            <Typography variant='subtitle1' className={classes.subtitle}>
              Gerencie o controle de acessos do seu sistema
            </Typography>
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
