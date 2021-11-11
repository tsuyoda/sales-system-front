import React from 'react';
import { withStyles, createStyles, Theme, WithStyles } from '@material-ui/core/styles';
import './styles.css';
import { IInvoice } from '../../../interfaces/IInvoice';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.common.white,
      color: theme.palette.common.black,
      maxWidth: 1200,
      margin: 'auto'
    }
  });

interface InvoiceDocumentProps extends WithStyles<typeof styles> {
  invoice: IInvoice;
}

// eslint-disable-next-line react/prefer-stateless-function
class InvoiceDocument extends React.Component<InvoiceDocumentProps> {
  render() {
    const { invoice, classes } = this.props;

    return (
      <div id='document_invoice' className={classes.root} style={{ padding: 10 }}>
        <div>
          <table style={{ width: '100%' }}>
            <tbody>
              <tr>
                <td>
                  <div>
                    <span style={{ fontSize: 'x-small' }}>
                      RECEBEMOS DE SALES SYSTEM OS PRODUTOS CONSTANTES DA NOTA FISCAL INDICADA ABAIXO
                      <br />
                      &nbsp;
                    </span>
                  </div>
                </td>
                <td>
                  <div>
                    <span>
                      DATA DE RECEBIMENTO
                      <br />
                      &nbsp;
                    </span>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div>
                    <span style={{ fontSize: 'x-small' }}>
                      IDENTIFICAÇÃO E ASSINATURA DO RECEBEDOR
                      <br />
                      &nbsp;
                    </span>
                  </div>
                </td>
                <td>
                  <div>
                    <div>NF-e</div>
                    <div>Nº {invoice.order.cod}</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <hr style={{ borderTop: '1px dashed black' }} />
        <table style={{ width: '100%' }}>
          <tbody>
            <tr>
              <td>
                <div>
                  <div>
                    <b>DANFE</b>
                  </div>
                  <br />
                  &nbsp;
                </div>
              </td>
              <td>
                <div>
                  <br />
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <img
                      alt='Barcode'
                      width={300}
                      height={60}
                      src='https://th.bing.com/th/id/R.f9761f87d22db3e3a641376e370dbc93?rik=s2t1axtitYfSwA&riu=http%3a%2f%2f1.bp.blogspot.com%2f_I646rDniKDk%2fSsyLwwNHjKI%2fAAAAAAAAAJo%2fL1UnFp8MgMM%2fw1200-h630-p-k-no-nu%2fCODIGO.gif&ehk=rl5uS81Ig0IojWiFOXREl9nP4EFZlOiEiawrDVwyYJ8%3d&risl=&pid=ImgRaw&r=0'
                    />
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div>
                  Consulta de autenticidade no portal nacional da NF-e www.nfe. fazenda.gov.br/portal ou no site da
                  Sefaz Autorizadora
                </div>
              </td>
              <td>
                <div>
                  <span style={{ fontSize: 'x-small' }}>CHAVE DE ACESSO</span>
                  <div>
                    <b>1234 1234 9609 5009 1330 5501 2000 8599 5010 3167 3538</b>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div style={{ border: '1px solid black' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <b>SALES SYSTEM</b>
          </div>
          <div style={{ color: 'red' }}>Os dados contidos neste documentos não são reais. Documento de exemplo!</div>
          <br />
          &nbsp;
        </div>
        <div style={{ border: '1px solid black' }}>
          <div>
            <span style={{ fontSize: 'x-small' }}>NATUREZA DE OPERAÇÃO</span>
          </div>
          VENDA MERCADORIA ADQUIR/RECEB TERCEIROS TP:51
        </div>
        <div style={{ border: '1px solid black' }}>
          <div>
            <span style={{ fontSize: 'x-small' }}>PROTOCOLO DE AUTORIZAÇÃO DE USO</span>
          </div>
          1111111111111111 {new Date().toLocaleString()};
        </div>
        <h6>DESTINATÁRIO / REMETENTE</h6>
        <table style={{ width: '100%' }}>
          <tbody>
            <tr>
              <td colSpan={2}>
                <div>
                  <div>
                    <span style={{ fontSize: 'x-small' }}>NOME / RAZÃO SOCIAL</span>
                  </div>
                  {invoice.recipient.name}
                </div>
              </td>
              <td>
                <div>
                  <div>
                    <span style={{ fontSize: 'x-small' }}>CPF / CNPJ</span>
                  </div>
                  {invoice.recipient.cpfCnpj}
                </div>
              </td>
              <td>
                <div>
                  <div>
                    <span style={{ fontSize: 'x-small' }}>DATA DE EMISSÃO</span>
                  </div>
                  {new Date(invoice.createdAt).toLocaleDateString()}
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div>
                  <div>
                    <span style={{ fontSize: 'x-small' }}>ENDEREÇO</span>
                  </div>
                  {invoice.recipient.address.street} - {invoice.recipient.address.complement}
                </div>
              </td>
              <td>
                <div>
                  <div>
                    <span style={{ fontSize: 'x-small' }}>NÚMERO</span>
                  </div>
                  {invoice.recipient.address.number}
                </div>
              </td>
              <td>
                <div>
                  <div>
                    <span style={{ fontSize: 'x-small' }}>CEP</span>
                  </div>
                  {invoice.recipient.address.postalCode}
                </div>
              </td>
              <td>
                <div>
                  <div>
                    <span style={{ fontSize: 'x-small' }}>DATA DE SAÍDA / ENTRADA</span>
                  </div>
                  {new Date(invoice.dispatchedAt).toLocaleDateString()}
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div>
                  <div>
                    <span style={{ fontSize: 'x-small' }}>MUNÍCIPIO</span>
                  </div>
                  {invoice.recipient.address.city}
                </div>
              </td>
              <td>
                <div>
                  <div>
                    <span style={{ fontSize: 'x-small' }}>UF</span>
                  </div>
                  {invoice.recipient.address.state}
                </div>
              </td>
              <td>
                <div>
                  <div>
                    <span style={{ fontSize: 'x-small' }}>FONE / FAX</span>
                  </div>
                  {invoice.recipient.contact.tel}
                </div>
              </td>
              <td>
                <div>
                  <div>
                    <span style={{ fontSize: 'x-small' }}>HORA DE SAÍDA/ENTRADA</span>
                  </div>
                  {new Date().toLocaleTimeString()}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <h6>CÁLCULO DO IMPOSTO</h6>
        <table style={{ width: '100%' }}>
          <tbody>
            <tr>
              <td>
                <div>
                  <div>
                    <span style={{ fontSize: 'x-small' }}>BASE DE CÁLCULO DO ICMS </span>
                  </div>
                  {`${invoice.value.baseICMS.toFixed(2)}`.replace('.', ',')}
                </div>
              </td>
              <td>
                <div>
                  <div>
                    <span style={{ fontSize: 'x-small' }}>VALOR DO ICMS</span>
                  </div>
                  {`${invoice.value.totalICMS.toFixed(2)}`.replace('.', ',')}
                </div>
              </td>
              <td>
                <div>
                  <div>
                    <span style={{ fontSize: 'x-small' }}>BASE DE CÁLCULO DO ICMS ST</span>
                  </div>
                  0,00
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div>
                  <div>
                    <span style={{ fontSize: 'x-small' }}>VALOR DO ICMS ST </span>
                  </div>
                  0,00
                </div>
              </td>
              <td>
                <div>
                  <div>
                    <span style={{ fontSize: 'x-small' }}>VALOR APROXIMADO DOS TRIBUTOS</span>
                  </div>
                  0,00
                </div>
              </td>
              <td>
                <div>
                  <div>
                    <span style={{ fontSize: 'x-small' }}>VALOR TOTAL DOS PRODUTOS</span>
                  </div>
                  {`${invoice.value.totalItems.toFixed(2)}`.replace('.', ',')}
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div>
                  <div>
                    <span style={{ fontSize: 'x-small' }}>VALOR DO FRETE</span>
                  </div>
                  {`${invoice.value.freight.toFixed(2)}`.replace('.', ',')}
                </div>
              </td>
              <td>
                <div>
                  <div>
                    <span style={{ fontSize: 'x-small' }}>VALOR DO SEGURO</span>
                  </div>
                  0,00
                </div>
              </td>
              <td>
                <div>
                  <div>
                    <span style={{ fontSize: 'x-small' }}>DESCONTO</span>
                  </div>
                  {`${invoice.value.totalDiscount.toFixed(2)}`.replace('.', ',')}
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div>
                  <div>
                    <span style={{ fontSize: 'x-small' }}>OUTRAS DESPESAS ACESSÓRIAS</span>
                  </div>
                  0,00
                </div>
              </td>
              <td>
                <div style={{ gridArea: 'item32' }}>
                  <div>
                    <span style={{ fontSize: 'x-small' }}>VALOR DO IPI</span>
                  </div>
                  0,00
                </div>
              </td>
              <td>
                <div style={{ gridArea: 'item33' }}>
                  <div>
                    <span style={{ fontSize: 'x-small' }}>VALOR TOTAL DA NOTA</span>
                  </div>
                  {`${invoice.value.total.toFixed(2)}`.replace('.', ',')}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <h6>DADOS DO PRODUTO / SERVIÇO</h6>
        <table style={{ width: '100%' }}>
          <tbody>
            <tr>
              <th>#</th>
              <th>DESCRIÇÃO DO PRODUTO / SERVIÇO</th>
              <th>QTDE</th>
              <th>VL. UNITÁRIO</th>
              <th>VL. TOTAL</th>
              <th>BC.ICMS</th>
              <th>VL.ICMS</th>
            </tr>
            {invoice.items.map((item, index) => (
              <tr>
                <td>{index + 1}</td>
                <td>{item.title}</td>
                <td>{item.quantity}</td>
                <td>{`${item.value.unitary.toFixed(2)}`.replace('.', ',')}</td>
                <td>{`${item.value.subtotal.toFixed(2)}`.replace('.', ',')}</td>
                <td>0,00</td>
                <td>0,00</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(InvoiceDocument);
