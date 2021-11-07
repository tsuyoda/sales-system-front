import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@material-ui/core';
import { useFormikContext } from 'formik';
import React from 'react';
import { IBenefit } from '../../../../interfaces/IBenefit';
import { IOrderEditForm } from '../../../../interfaces/IOrder';

function BenefitList() {
  const { values } = useFormikContext<IOrderEditForm>();

  const {
    order_value_delivery: deliveryValue,
    order_value_total_items: totalValue,
    order_customer_score: score
  } = values;

  const filterBenefits = score?.scoreLevel.benefits
    ? score.scoreLevel.benefits.filter(benefit => {
        if (benefit.type === 'shipping_discount' && !values.order_value_delivery) {
          return false;
        }

        if (benefit.type === 'purchase_discount' && !values.order_value_total_items) {
          return false;
        }

        return true;
      })
    : [];

  return filterBenefits.length ? (
    <TableContainer style={{ maxHeight: 300 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell width='75%'>Benefício</TableCell>
            <TableCell align='left'>Desconto</TableCell>
            <TableCell align='left'>Valor aplicado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody component={Paper}>
          {filterBenefits.map(benefit => (
            <TableRow>
              <TableCell component='th' scope='row'>
                {benefit.name}
              </TableCell>
              <TableCell align='left'>{`${(benefit.value * 100).toFixed(2)}%`}</TableCell>
              <TableCell align='left'>
                {`R$ ${(benefit.type === 'purchase_discount'
                  ? benefit.value * totalValue
                  : benefit.value * deliveryValue
                ).toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 3
                })}`}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ) : (
    <div style={{ padding: '20px' }}>Sem benefícios para aplicar</div>
  );
}

export default BenefitList;
