import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlusCircle } from 'react-icons/fi';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import dollarSign from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatCurrency from '../../utils/formatCurrency';

import {
  Container,
  CardContainer,
  Card,
  AddCard,
  TableContainer,
} from './styles';

interface Asset {
  id: string;
  ticker: string;
  cotation: number;
  updated_at: Date;
}

interface ActiveTrade {
  id: string;
  user_id: string;
  asset_id: string;
  total_quantity: number;
  total_value: number;
  total_invested: number;
  profit: number;
  updated_at: Date;
  asset: Asset;
}

interface ClosedTrade {
  id: string;
  user_id: string;
  asset_id: string;
  total_invested: number;
  profit: number;
  created_at: Date;
  asset: Asset;
}

const Dashboard: React.FC = () => {
  const [activeTrades, setActiveTrades] = useState<ActiveTrade[]>([]);
  const [hasActiveTrades, setHasActiveTrades] = useState(false);
  const [closedTrades, setClosedTrades] = useState<ClosedTrade[]>([]);
  const [hasClosedTrades, setHasClosedTrades] = useState(false);
  const [wallet, setWallet] = useState(0);
  const [profit, setProfit] = useState(0);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const token = localStorage.getItem('@StocksLife:token');
      const parsedToken = `Bearer ${token}`;

      try {
        const getActiveTrades = await api.get('/transactions/active', {
          headers: {
            Authorization: parsedToken,
          },
        });
        console.log(getActiveTrades);
        setHasActiveTrades(true);
        setActiveTrades(getActiveTrades.data.balance);
        setWallet(getActiveTrades.data.wallet.wallet);
        setProfit(getActiveTrades.data.wallet.profit);
      } catch (err) {
        setHasActiveTrades(false);
      }

      try {
        const getClosedTrades = await api.get('/transactions/closed', {
          headers: {
            Authorization: parsedToken,
          },
        });
        setHasClosedTrades(true);

        setClosedTrades(getClosedTrades.data);
      } catch (err) {
        setHasClosedTrades(false);
      }
    }

    loadTransactions();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Link to="/transactions" style={{ textDecoration: 'none' }}>
            <AddCard>
              <p>Cadastrar nova transação</p>

              <FiPlusCircle color="#FF872C" size={50} />
            </AddCard>
          </Link>

          <Card wallet>
            <header>
              <p>Carteira Atual</p>
              <img src={dollarSign} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{formatCurrency(wallet)}</h1>
          </Card>

          <Card>
            <header>
              <p>Rentabilidade consolidada</p>
              {profit >= 0 ? (
                <img src={income} alt="Income" />
              ) : (
                <img src={outcome} alt="Outcome" />
              )}
            </header>
            <h1 data-testid="balance-outcome">{formatCurrency(profit)}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <h1>Negócios Ativos</h1>
          {!hasActiveTrades ? (
            <p>
              Você não possui nenhum trade ativo no momento! Inicie através da
              opção Cadastrar Transação
            </p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Ticker</th>
                  <th title="Quantidade de ativos atualmente em carteira">
                    Quantidade
                  </th>
                  <th />
                  <th title="Valor dos ativos em carteira (quantidade x cotação)">
                    Valor
                  </th>
                  <th />
                  <th />
                  <th title="Rentabilidade de posição">Rentabilidade</th>
                  <th />
                  <th title="Cotação do ativo (fechamento do último dia)">
                    Cotação
                  </th>
                  <th title="Preço médio de aquisição da carteira">
                    Preço médio
                  </th>
                  <th />
                </tr>
              </thead>

              <tbody>
                {activeTrades.map(item => (
                  <tr key={item.id}>
                    <td className="ticker">{item.asset.ticker}</td>
                    <td className="quantity">
                      {Intl.NumberFormat().format(item.total_quantity)}
                    </td>
                    <td className="quantity" colSpan={3}>
                      {formatCurrency(
                        item.total_quantity * item.asset.cotation,
                      )}
                    </td>
                    <td
                      className={item.profit >= 0 ? 'profit' : 'loss'}
                      colSpan={3}
                    >
                      {formatCurrency(item.profit)}
                    </td>
                    <td>{formatCurrency(item.asset.cotation)}</td>
                    <td>
                      {formatCurrency(item.total_value / item.total_quantity)}
                    </td>
                    <td>
                      <Link to={`/statement/active/${item.asset_id}`}>
                        Extrato
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </TableContainer>

        <TableContainer>
          <h1>Trades Encerrados</h1>
          {!hasClosedTrades ? (
            <p>Você não possui nenhum trade encerrado até o momento!</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Ticker</th>
                  <th title="Valor total investido no ativo">
                    Valor Investido
                  </th>
                  <th title="Resultado final das compras e vendas realizadas">
                    Lucro
                  </th>
                  <th />
                </tr>
              </thead>

              <tbody>
                {closedTrades.map(item => (
                  <tr key={item.id}>
                    <td className="ticker">{item.asset.ticker}</td>
                    <td className="quantity">
                      {formatCurrency(item.total_invested)}
                    </td>
                    <td className={item.profit >= 0 ? 'profit' : 'loss'}>
                      {formatCurrency(item.profit)}
                    </td>
                    <td>
                      <Link to={`/statement/closed/${item.id}`}>
                        Ver histórico
                      </Link>
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

export default Dashboard;
