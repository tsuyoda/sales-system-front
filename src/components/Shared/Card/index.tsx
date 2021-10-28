import React, { HTMLAttributes } from 'react';
import { Paper, makeStyles, Grid } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  card: {
    borderBottomStyle: 'solid',
    borderBottomWidth: 5,
    borderBottomColor: theme.palette.primary.main,
    maxWidth: 400
  },
  icon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 25
  },
  subTitle: {
    fontSize: 15
  }
}));

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  subTitle: string;
  icon: React.ReactNode;
}

function Card({ icon, title, subTitle, ...props }: CardProps) {
  const classes = useStyles();

  return (
    <Grid container spacing={4} component={Paper} className={classes.card} {...props}>
      <Grid item xs={3} className={classes.icon}>
        {icon}
      </Grid>
      <Grid item xs={9} className={classes.content}>
        <div className={classes.title}>{title}</div>
        <div className={classes.subTitle}>{subTitle}</div>
      </Grid>
    </Grid>
  );
}

export default Card;
