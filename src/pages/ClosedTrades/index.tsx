import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Header from '../../components/Header';

import { Container, TableContainer } from './styles';

import formatCurrency from '../../utils/formatCurrency';

import api from '../../services/api';

interface Asset {
  id: string;
  ticker: string;
  cotation: number;
  updated_at: Date;
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

const Import: React.FC = () => {
  const [closedTrades, setClosedTrades] = useState<ClosedTrade[]>([]);
  const [hasClosedTrades, setHasClosedTrades] = useState(false);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const token = localStorage.getItem('@StocksLife:token');
      const parsedToken = `Bearer ${token}`;

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
      <Header size="small" />
      <Container>
        <TableContainer>
          {!hasClosedTrades ? (
            <p>Você não possui nenhum trade encerrado para ser listado.</p>
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

export default Import;
