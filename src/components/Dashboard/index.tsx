import { Grid } from '@material-ui/core';
import React, { useEffect } from 'react';
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import AllInboxIcon from '@material-ui/icons/AllInbox';
import PeopleIcon from '@material-ui/icons/People';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import { useHeaderTitle } from '../../contexts/headerTitle';
import Card from '../Shared/Card';
import Chart from '../Shared/Chart';

function Dashboard() {
  const { setTitle } = useHeaderTitle();

  useEffect(() => {
    setTitle('Dashboard');
  }, []);

  return (
    <Grid container spacing={6}>
      <Grid item xs={4} style={{ display: 'flex', justifyContent: 'center' }}>
        <Card icon={<LoyaltyIcon fontSize='large' />} title='R$ 100.752,25' subTitle='Valor do estoque' />
      </Grid>
      <Grid item xs={4} style={{ display: 'flex', justifyContent: 'center' }}>
        <Card icon={<AllInboxIcon fontSize='large' />} title='200' subTitle='Itens no estoque' />
      </Grid>
      <Grid item xs={4} style={{ display: 'flex', justifyContent: 'center' }}>
        <Card icon={<PeopleIcon fontSize='large' />} title='500' subTitle='Total de clientes' />
      </Grid>
      <Grid item xs={4} style={{ display: 'flex', justifyContent: 'center' }}>
        <Card icon={<AttachMoneyIcon fontSize='large' />} title='R$ 50.120,50' subTitle='Vendas no ano' />
      </Grid>
      <Grid item xs={4} style={{ display: 'flex', justifyContent: 'center' }}>
        <Card icon={<EqualizerIcon fontSize='large' />} title='R$ 2.245,54' subTitle='Vendas no mês' />
      </Grid>
      <Grid item xs={4} style={{ display: 'flex', justifyContent: 'center' }}>
        <Card icon={<LocalOfferIcon fontSize='large' />} title='R$ 30,00' subTitle='Ticket médio' />
      </Grid>
      <Grid item xs={12}>
        <div style={{ height: 240 }}>
          <Chart />
        </div>
      </Grid>
    </Grid>
  );
}

export default Dashboard;
