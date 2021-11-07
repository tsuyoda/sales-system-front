import { Grid, Paper } from '@material-ui/core';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPercent } from '@fortawesome/free-solid-svg-icons';
import TextFormField from '../../../Shared/FormFields/TextFormField';
import CheckboxFormField from '../../../Shared/FormFields/CheckboxFormField/index';
import { IProfileForm } from '../../../../interfaces/IProfile';

const useStyles = makeStyles({
  block: {
    marginBottom: 30
  },
  percentIcon: {
    marginLeft: 10
  }
});

interface SellerInfoProps {
  values: IProfileForm;
}

function SellerInfo({ values }: SellerInfoProps) {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.block}>
        <h2>Dados de Vendedor</h2>
        <Grid container spacing={4} component={Paper}>
          <Grid item xs={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckboxFormField label='É vendedor' checked={values.profile_is_seller} disabled />
          </Grid>
          <Grid item xs={10}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <TextFormField
                  variant='outlined'
                  label='Comissão'
                  type='number'
                  InputProps={{
                    endAdornment: <FontAwesomeIcon icon={faPercent} className={classes.percentIcon} />
                  }}
                  value={`${values.profile_seller_comission}`}
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <TextFormField
                  variant='outlined'
                  label='Desconto máximo'
                  type='number'
                  InputProps={{
                    endAdornment: <FontAwesomeIcon icon={faPercent} className={classes.percentIcon} />
                  }}
                  value={`${values.profile_seller_max_discount}`}
                  disabled
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default SellerInfo;
