import React, { useState, useEffect, useCallback } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';

import { FiTrash2 } from 'react-icons/fi';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import Header from '../../components/Header';

import { useToast } from '../../hooks/toast';

import formatCurrency from '../../utils/formatCurrency';
import formatValue from '../../utils/formatValue';

import {
  Container,
  CardContainer,
  DeleteCard,
  Card,
  TableContainer,
} from './styles';

import api from '../../services/api';

interface Asset {
  id: string;
  ticker: string;
  cotation: number;
  updated_at: Date;
}

interface Statement {
  id: string;
  user_id: string;
  asset_id: string;
  type: 'buy' | 'sell';
  date: string;
  quantity: number;
  value: number;
  cost: number;
  total_value: number;
  closed_id: string;
  created_at: Date;
  asset: Asset;
}

interface StatementClosedParams {
  closed_id: string;
}

const Import: React.FC = () => {
  const token = localStorage.getItem('@StocksLife:token');
  const parsedToken = `Bearer ${token}`;
  const history = useHistory();

  const [statement, setStatement] = useState<Statement[]>([]);
  const [profit, setProfit] = useState(0);
  const [wallet, setWallet] = useState(0);
  const [ticker, setTicker] = useState('');

  const { params } = useRouteMatch<StatementClosedParams>();
  const { closed_id } = params;

  const { addToast } = useToast();

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      try {
        const response = await api.get(
          `/transactions/statement/closed/${closed_id}`,
          {
            headers: {
              Authorization: parsedToken,
            },
          },
        );

        setStatement(response.data.statement);
        setWallet(response.data.asset.wallet);
        setProfit(response.data.asset.profit);
        setTicker(response.data.asset.ticker);
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro inesperado.',
          description:
            'Ocorreu um erro ao carregar o extrato. Tente novamente.',
        });
      }
    }

    loadTransactions();
  }, [closed_id, addToast, parsedToken]);

  const handleDelete = useCallback(async (): Promise<void> => {
    confirmAlert({
      title: `Deseja apagar todas as transações de ${ticker}?`,
      message: 'Essa ação é irreversível e apagará todos os registros.',
      buttons: [
        {
          label: 'Sim',
          onClick: () => {
            api
              .delete(`/transactions/delete/closed/${closed_id}`, {
                headers: {
                  Authorization: parsedToken,
                },
              })
              .then(response => {
                addToast({
                  type: 'sucess',
                  title: 'Operação realizada com sucesso',
                });
                history.push('/closedtrades');
              })
              .catch(err => {
                addToast({
                  type: 'error',
                  title: 'Erro ao tentar apagar as transações',
                  description: 'Tente novamente.',
                });
              });
          },
        },
        {
          label: 'Cancelar',
          onClick: () => {},
        },
      ],
    });
  }, [addToast, closed_id, history, ticker, parsedToken]);

  return (
    <>
      <Header redirect="statement" size="small" />
      <Container>
        <CardContainer>
          <button
            type="button"
            onClick={() => handleDelete()}
            style={{ border: 'none' }}
          >
            <DeleteCard>
              <p>{`Apagar todas transações ${ticker}`}</p>

              <FiTrash2 color="#fff" size={50} />
            </DeleteCard>
          </button>

          <Card wallet>
            <header>
              <p>{`Total investido - ${ticker}`}</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{formatCurrency(wallet)}</h1>
          </Card>

          <Card>
            <header>
              <p>{`Lucro da Carteira ${ticker}`}</p>
              {Number(profit) >= 0 ? (
                <img src={income} alt="Income" />
              ) : (
                <img src={outcome} alt="Outcome" />
              )}
            </header>
            <h1 data-testid="balance-outcome">{formatCurrency(profit)}</h1>
          </Card>
        </CardContainer>
        <TableContainer>
          <h1>{`Extrato - ${ticker}`}</h1>
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Operação</th>
                <th>Quantidade</th>
                <th>Valor</th>
                <th>Custo</th>
                <th>Valor Total</th>
              </tr>
            </thead>

            <tbody>
              {statement.map(item => (
                <tr key={item.id}>
                  <td className="ticker">{item.date}</td>
                  <td className={item.type === 'buy' ? 'profit' : 'loss'}>
                    {item.type}
                  </td>
                  <td className={item.type === 'buy' ? 'profit' : 'loss'}>
                    {Intl.NumberFormat().format(item.quantity)}
                  </td>
                  <td className="ticker">{formatValue(item.value)}</td>
                  <td className="quantity">{formatValue(item.cost)}</td>
                  <td className={item.type === 'buy' ? 'profit' : 'loss'}>
                    {item.type === 'buy'
                      ? formatValue(item.total_value)
                      : `-${formatValue(item.total_value)}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Import;
