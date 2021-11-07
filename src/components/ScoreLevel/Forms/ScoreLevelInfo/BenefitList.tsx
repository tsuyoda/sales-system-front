import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import { IBenefit } from '../../../../interfaces/IBenefit';

interface BenefitListProps {
  rows: IBenefit[];
  removeItem(index: number): () => void;
}

function BenefitList({ rows, removeItem }: BenefitListProps) {
  const benefitTypeDict: { [key: string]: string } = {
    purchase_discount: 'Desconto em valor de compra',
    shipping_discount: 'Desconto em frete'
  };

  return (
    <TableContainer style={{ maxHeight: 300 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell align='left'>Tipo</TableCell>
            <TableCell align='left'>Valor</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow>
              <TableCell component='th' scope='row'>
                {row.name}
              </TableCell>
              <TableCell align='left'>{benefitTypeDict[row.type]}</TableCell>
              <TableCell align='left'>{`${(row.value * 100).toFixed(2)}%`}</TableCell>
              <TableCell align='right'>
                <IconButton onClick={removeItem(index)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default BenefitList;
