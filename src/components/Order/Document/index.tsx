import React from 'react';
import {
  makeStyles,
  Typography,
  Paper,
  Grid,
  TableContainer,
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableFooter
} from '@material-ui/core';
import logo from '../../../assets/logo.png';
import { IOrder } from '../../../interfaces/IOrder';
import { formatDoc, formatTel } from '../../../utils/utiltsFunctions';
import './styles.css';

const useStyles = makeStyles(theme => ({
  root: {
    padding: 50
  },
  header: {
    display: 'flex'
  },
  title: {
    flex: 1,
    justifyContent: 'center'
  }
}));

interface OrderDocumentProps {
  order: IOrder;
}

function OrderDocument({ order }: OrderDocumentProps) {
  const classes = useStyles();

  const { customer, seller } = order;

  const statusDict: { [key: string]: string } = {
    new: 'Novo',
    pending: 'Pendente',
    processed: 'Processado',
    canceled: 'Cancelado'
  };

  return (
    <Paper className={classes.root} id='document_order'>
      <div className={classes.header}>
        <div className={classes.title}>
          <Typography variant='h1' component='h1'>
            PEDIDO
          </Typography>
        </div>
        <div>
          <img src={logo} alt='Sales System' width={200} height={100} />
        </div>
      </div>
      <div style={{ marginTop: 30 }}>
        <Typography style={{ fontWeight: 'bold' }}>Sales System</Typography>
        <Typography>Rua Better Street, 1234</Typography>
        <Typography>Sorocaba - SP</Typography>
      </div>
      <div style={{ marginTop: 30 }}>
        <Grid container spacing={4}>
          <Grid item xs={3}>
            <Typography style={{ fontWeight: 'bold' }}>CLIENTE</Typography>
            <Typography>{customer.fullName}</Typography>
            <Typography>{formatDoc(customer.doc.id, customer.doc.type)}</Typography>
            <Typography>{formatTel(customer.contact.tel)}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography style={{ fontWeight: 'bold' }}>ENDEREÇO</Typography>
            <Typography>
              {customer.address.street}, {customer.address.number}
            </Typography>
            <Typography>
              {customer.address.city} - {customer.address.state}
            </Typography>
            <Typography>{customer.address.postalCode}</Typography>
          </Grid>

          <Grid item xs={2}>
            <Typography style={{ fontWeight: 'bold' }}>PEDIDO</Typography>
            <Typography style={{ fontWeight: 'bold' }}>VENDEDOR</Typography>
            <Typography style={{ fontWeight: 'bold' }}>STATUS</Typography>
            <Typography style={{ fontWeight: 'bold' }}>DATA</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography>{order.cod}</Typography>
            <Typography>{seller.user.fullName}</Typography>
            <Typography>{statusDict[order.status]}</Typography>
            <Typography>{new Date(order.createdAt).toLocaleDateString()}</Typography>
          </Grid>
        </Grid>
      </div>
      <div style={{ marginTop: 30 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Quantidade</TableCell>
                <TableCell>Valor Unitário</TableCell>
                <TableCell>Valor Total</TableCell>
              </TableRow>
            </TableHead>
            {order.items.map((item, index) => (
              <TableRow>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.product.title}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>
                  {item.value.unitary.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 3
                  })}
                </TableCell>
                <TableCell>
                  {item.value.subtotal.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 3
                  })}
                </TableCell>
              </TableRow>
            ))}

            <TableRow>
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell>FRETE</TableCell>
              <TableCell>
                {order.value.delivery.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 3
                })}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell style={{ fontWeight: 'bold' }}>SUBTOTAL</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>
                {(order.value.totalItems + order.value.delivery).toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 3
                })}
              </TableCell>
            </TableRow>

            {order.value.totalDiscount ? (
              <TableRow>
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell>Descontos</TableCell>
                <TableCell>
                  -
                  {order.value.totalDiscount.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 3
                  })}
                </TableCell>
              </TableRow>
            ) : null}

            <TableFooter>
              <TableRow>
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell style={{ fontSize: 26, fontWeight: 'bold' }}>TOTAL</TableCell>
                <TableCell style={{ fontSize: 26, fontWeight: 'bold' }}>
                  {order.value.total.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 3
                  })}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </div>
    </Paper>
  );
}

export default OrderDocument;
