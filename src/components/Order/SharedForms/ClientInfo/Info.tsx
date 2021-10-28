import { Grid, Paper } from '@material-ui/core';
import React from 'react';

import { ICustomer } from '../../../../interfaces/ICustomer';

interface InfoProps {
  customer: ICustomer;
}

function Info({ customer }: InfoProps) {
  return (
    <Grid container spacing={4} component={Paper}>
      <Grid item xs={4}>
        <strong>Nome</strong>: {customer.fullName}
      </Grid>
      <Grid item xs={4}>
        <strong>Tipo</strong>: {customer.doc.type}
      </Grid>
      <Grid item xs={4}>
        <strong>Documento</strong>: {customer.doc.id}
      </Grid>
      <Grid item xs={4}>
        <strong>Email de Contato</strong>: {customer.contact.email}
      </Grid>
      <Grid item xs={4}>
        <strong>Telefone de Contato</strong>: {customer.contact.tel}
      </Grid>
      <Grid item xs={4} />
      <Grid item xs={4}>
        <strong>Rua</strong>: {customer.address.street}
      </Grid>
      <Grid item xs={4}>
        <strong>Número</strong>: {customer.address.number}
      </Grid>
      <Grid item xs={4}>
        <strong>Complemento</strong>: {customer.address.complement || '-'}
      </Grid>
      <Grid item xs={4}>
        <strong>Cidade</strong>: {customer.address.city}
      </Grid>
      <Grid item xs={4}>
        <strong>Estado</strong>: {customer.address.state}
      </Grid>
      <Grid item xs={4}>
        <strong>CEP</strong>: {customer.address.postalCode}
      </Grid>
    </Grid>
  );
}

export default Info;
