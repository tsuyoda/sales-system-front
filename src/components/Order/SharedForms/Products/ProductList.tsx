import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import { IOrderItem } from '../../../../interfaces/IOrder';

interface ProductListProps {
  items: IOrderItem[];
  removeItem(index: number): () => void;
}

function ProductList({ items, removeItem }: ProductListProps) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>SKU</TableCell>
            <TableCell align='left'>Título</TableCell>
            <TableCell align='left'>Valor</TableCell>
            <TableCell align='left'>Quantidade</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, index) => (
            <TableRow>
              <TableCell component='th' scope='row'>
                {item.product.sku}
              </TableCell>
              <TableCell align='left'>{item.product.title}</TableCell>
              <TableCell align='left'>{`R$ ${item.product.value.toFixed(2)}`.replace('.', ',')}</TableCell>
              <TableCell align='left'>{item.quantity}</TableCell>
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

export default ProductList;
