import React, { useState, useEffect, useCallback } from 'react';
import { useRouteMatch, Link } from 'react-router-dom';

import { FiPlusCircle } from 'react-icons/fi';

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
  AddCard,
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

interface StatementActiveParams {
  asset_id: string;
}

const Import: React.FC = () => {
  const token = localStorage.getItem('@StocksLife:token');
  const parsedToken = `Bearer ${token}`;

  const [statement, setStatement] = useState<Statement[]>([]);
  const [hasStatement, setHasStatement] = useState(true);
  const [profit, setProfit] = useState(0);
  const [wallet, setWallet] = useState(0);
  const [ticker, setTicker] = useState('');

  const { params } = useRouteMatch<StatementActiveParams>();
  const { asset_id } = params;

  const { addToast } = useToast();

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      try {
        const response = await api.get(
          `transactions/statement/active/${asset_id}`,
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
  }, [asset_id, addToast, parsedToken]);

  const handleDelete = useCallback(
    async (id: string): Promise<void> => {
      console.log({ id, asset_id });

      try {
        await api.delete(`/transactions/delete/${id}`, {
          headers: {
            Authorization: parsedToken,
          },
        });

        addToast({
          type: 'sucess',
          title: 'Transação deletada com sucesso',
        });
      } catch (err) {
        if (err.response.status === 401) {
          addToast({
            type: 'error',
            title: 'Erro ao apagar a transação',
            description:
              'Apagar essa transação gerará uma quantidade negativa nesse ticker',
          });
        } else {
          addToast({
            type: 'error',
            title: 'Ocorreu um erro inesperado',
            description: 'Tente novamente.',
          });
        }
      }

      // atualiza lista de transações
      try {
        const response = await api.get(
          `transactions/statement/active/${asset_id}`,
          {
            headers: {
              Authorization: parsedToken,
            },
          },
        );
        // se possui transações atualiza listagem
        setStatement(response.data.statement);
        setWallet(response.data.asset.wallet);
        setProfit(response.data.asset.profit);
        setTicker(response.data.asset.ticker);
      } catch (err) {
        // se não possui mais transação exibe mensagem
        setHasStatement(false);
        setWallet(0);
        setProfit(0);
      }
    },
    [asset_id, addToast, parsedToken],
  );

  return (
    <>
      <Header redirect="statement" size="small" />
      <Container>
        <CardContainer>
          <Link to="/transactions" style={{ textDecoration: 'none' }}>
            <AddCard>
              <p>{`Adicionar transação ${ticker}`}</p>

              <FiPlusCircle color="#FF872C" size={50} />
            </AddCard>
          </Link>

          <Card wallet>
            <header>
              <p>{`Carteira - ${ticker}`}</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">
              {formatCurrency(Number(wallet))}
            </h1>
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
            <h1 data-testid="balance-outcome">
              {formatCurrency(Number(profit))}
            </h1>
          </Card>
        </CardContainer>
        <TableContainer>
          <h1>{`Extrato - ${ticker}`}</h1>
          {!hasStatement ? (
            <p>{`Você não possui mais nenhum transação de ${ticker}`}</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Operação</th>
                  <th>Quantidade</th>
                  <th>Valor</th>
                  <th>Custo</th>
                  <th>Valor Total</th>
                  <th />
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
                    <td>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </TableContainer>
      </Container>
    </>
  );
};

export default Import;
