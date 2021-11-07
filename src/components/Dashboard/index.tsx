import { Typography } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useHeaderTitle } from '../../contexts/headerTitle';

function Dashboard() {
  const { setTitle } = useHeaderTitle();

  useEffect(() => {
    setTitle('Dashboard');
  }, []);

  return <Typography paragraph>Dashboard</Typography>;
}

export default Dashboard;
