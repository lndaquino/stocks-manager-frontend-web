import React, {
  useState,
  useEffect,
  useMemo,
  FormEvent,
  useCallback,
} from 'react';
import { Link } from 'react-router-dom';

import { useToast } from '../../hooks/toast';
import Header from '../../components/Header';
import Input from '../../components/Input';

import formatValue from '../../utils/formatValue';

import {
  Container,
  RegisterContainer,
  TickerRegisterContainer,
  TotalInfosContainer,
  TableContainer,
  InputContainer,
  ButtonContainer,
  DataContainer,
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

const Transactions: React.FC = () => {
  const token = localStorage.getItem('@StocksLife:token');
  const assetsAsString = localStorage.getItem('@StocksLife:assets');
  const parsedToken = `Bearer ${token}`;
  const { addToast } = useToast();
  let assets: Asset[] = [];

  if (assetsAsString) {
    assets = JSON.parse(assetsAsString);
  }

  const [ticker, setTicker] = useState('');
  const [transactionType, setTransactionType] = useState('buy');
  const [transactionDate, setTransactionDate] = useState('');
  const [tickerQuantity, setTickerQuantity] = useState(0);
  const [tickerValue, setTickerValue] = useState(0);
  const [transactionCost, setTransactionCost] = useState(0);

  const [tickerInputError, setTickerInputError] = useState(false);
  const [transactionDateError, setTransactionDateError] = useState(false);
  const [tickerQuantityError, setTickerQuantityError] = useState(false);
  const [tickerValueError, setTickerValueError] = useState(false);

  const [statement, setStatement] = useState<Statement[]>([]);
  const [hasStatement, setHasStatement] = useState(false);

  const tickers = assets.map(asset => asset.ticker);

  useEffect(() => {
    async function loadStatement(): Promise<void> {
      try {
        const response = await api.get('/transactions/statement/user', {
          headers: {
            Authorization: parsedToken,
          },
        });

        setStatement(response.data);
        setHasStatement(true);
      } catch (err) {
        setHasStatement(false);
      }
    }

    loadStatement();
  }, [parsedToken]);

  function checkTickerInput(value: string): void {
    if (tickers.find(item => item.includes(value))) {
      setTicker(value);
      if (tickers.find(item => item === value)) {
        setTickerInputError(false);
      }
    }
  }

  function validateTickerInput(): void {
    if (tickers.find(item => item === ticker)) {
      setTickerInputError(false);
    } else {
      setTickerInputError(true);
    }
  }

  function validateTransactionDate(value: string): void {
    setTransactionDate(value);
    if (!value) {
      setTransactionDateError(true);
    } else {
      const data = new Date(value);
      if (data > new Date()) {
        setTransactionDateError(true);
      } else {
        setTransactionDateError(false);
      }
    }
  }

  function validateTickerQuantity(): void {
    tickerQuantity <= 0
      ? setTickerQuantityError(true)
      : setTickerQuantityError(false);
  }

  function validateTickerValue(): void {
    tickerValue <= 0 ? setTickerValueError(true) : setTickerValueError(false);
  }

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      let validatedForm = true;

      if (tickerInputError || !ticker) {
        // Tooltip error Selecione um ticker válido
        setTickerInputError(true);
        validatedForm = false;

        addToast({
          type: 'error',
          title: 'Ticker inválido',
          description: 'Selecione um ticker válido no campo Ticker.',
        });
      }

      if (transactionDateError || !transactionDate) {
        // Tooltip error Selecione uma data válida até a data atual
        setTransactionDateError(true);
        validatedForm = false;

        addToast({
          type: 'error',
          title: 'Data Inválida',
          description: 'Data não pode ser no futuro ou vazia',
        });
      }

      if (tickerQuantity <= 0) {
        // Tooltip error Campo quantidade deve conter valor maior que zero
        setTickerQuantityError(true);
        validatedForm = false;

        addToast({
          type: 'error',
          title: 'Quantidade inválida',
          description: 'Insira um valor maior que zero no campo Quantidade',
        });
      } else {
        setTickerQuantityError(false);
      }

      if (tickerValue <= 0) {
        // Tooltip error Valor unitário deve ser maior que zero
        setTickerValueError(true);
        validatedForm = false;

        addToast({
          type: 'error',
          title: 'Valor unitário inválido',
          description: 'Insira um valor maior que zero no campo Valor unitário',
        });
      } else {
        setTickerValueError(false);
      }

      if (!validatedForm) {
        return;
      }

      // submete formulário
      const choosedAsset = assets.find(asset => asset.ticker === ticker);
      try {
        await api.post(
          '/transactions/add',
          {
            asset_id: choosedAsset?.id,
            quantity: tickerQuantity,
            value: tickerValue / 100,
            cost: transactionCost / 100,
            type: transactionType,
            date: transactionDate,
          },
          {
            headers: {
              Authorization: parsedToken,
            },
          },
        );

        setTickerQuantity(0);
        setTickerValue(0);
        setTransactionCost(0);

        addToast({
          type: 'sucess',
          title: 'Transação cadastrada com sucesso',
        });
      } catch (err) {
        if (err.response.status === 401) {
          addToast({
            type: 'error',
            title: 'Transação não permitida',
            description:
              'O cadastro dessa transação gerará um saldo negativo na quantidade desse ticker.',
          });
        } else {
          addToast({
            type: 'error',
            title: 'Erro inesperado',
            description:
              'Ocorreu um erro ao tentar cadastrar essa transação. Tente novamente.',
          });
        }

        return;
      }

      try {
        const response = await api.get('/transactions/statement/user', {
          headers: {
            Authorization: parsedToken,
          },
        });

        setStatement(response.data);
        setHasStatement(true);
      } catch (err) {
        setHasStatement(false);
      }
    },
    [
      addToast,
      ticker,
      tickerInputError,
      tickerQuantity,
      tickerValue,
      transactionCost,
      transactionDate,
      transactionDateError,
      transactionType,
      parsedToken,
      assets,
    ],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await api.delete(`/transactions/delete/${id}`, {
          headers: {
            Authorization: parsedToken,
          },
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

      try {
        const response = await api.get('/transactions/statement/user', {
          headers: {
            Authorization: parsedToken,
          },
        });

        setStatement(response.data);
        setHasStatement(true);
      } catch (err) {
        setHasStatement(false);
      }
    },
    [addToast, parsedToken],
  );

  const totalValue = useMemo(() => {
    const tempCost =
      (transactionType === 'buy' ? transactionCost : -transactionCost) / 100;

    return ((tickerQuantity * tickerValue) / 100 + tempCost).toLocaleString(
      'pt-BR',
      {
        style: 'currency',
        currency: 'BRL',
      },
    );
  }, [tickerQuantity, tickerValue, transactionCost, transactionType]);

  return (
    <>
      <Header size="small" />
      <Container>
        <RegisterContainer>
          <TickerRegisterContainer onSubmit={handleSubmit}>
            <InputContainer>
              <DataContainer>
                <label>Ticker:</label>
                <input
                  type="text"
                  spellCheck="false"
                  maxLength={6}
                  value={ticker}
                  onChange={e => checkTickerInput(e.target.value.toUpperCase())}
                  onBlur={validateTickerInput}
                  style={
                    tickerInputError
                      ? { borderStyle: 'solid', borderColor: 'red' }
                      : {}
                  }
                  list="Tickers"
                  placeholder="Digite o ticker"
                />
                <datalist id="Tickers">
                  {tickers.map(ticker => (
                    <option value={ticker} />
                  ))}
                </datalist>
              </DataContainer>
              <DataContainer>
                <label>Tipo de transação:</label>
                <div>
                  <input
                    type="radio"
                    id="buy"
                    name="transactionType"
                    value="buy"
                    defaultChecked
                    onChange={e => setTransactionType(e.target.value)}
                  />
                  <label>Compra</label>
                  <input
                    type="radio"
                    id="sell"
                    name="transactionType"
                    value="sell"
                    onChange={e => setTransactionType(e.target.value)}
                  />
                  <label>Venda</label>
                </div>
              </DataContainer>
              <DataContainer>
                <label>Data da transação:</label>

                <input
                  type="date"
                  onChange={e => validateTransactionDate(e.target.value)}
                  onBlur={e => validateTransactionDate(e.target.value)}
                  value={transactionDate}
                  style={
                    transactionDateError
                      ? { borderStyle: 'solid', borderColor: 'red' }
                      : {}
                  }
                />
              </DataContainer>
            </InputContainer>
            <InputContainer>
              <DataContainer>
                <label>Quantidade:</label>
                <Input
                  mask="number"
                  onValueChange={setTickerQuantity}
                  onBlur={validateTickerQuantity}
                  value={tickerQuantity}
                  style={
                    tickerQuantityError
                      ? { borderStyle: 'solid', borderColor: 'red' }
                      : {}
                  }
                />
              </DataContainer>
              <DataContainer>
                <label>Valor unitário (R$):</label>
                <Input
                  mask="currency"
                  onValueChange={setTickerValue}
                  onBlur={validateTickerValue}
                  value={tickerValue}
                  style={
                    tickerValueError
                      ? { borderStyle: 'solid', borderColor: 'red' }
                      : {}
                  }
                />
              </DataContainer>
              <DataContainer>
                <label>Custo (R$):</label>
                <Input
                  mask="currency"
                  onValueChange={setTransactionCost}
                  value={transactionCost}
                />
              </DataContainer>
            </InputContainer>
            <ButtonContainer>
              <button type="submit">Cadastrar transação</button>
            </ButtonContainer>
          </TickerRegisterContainer>
          <TotalInfosContainer>
            <h2>Valor total</h2>
            <p>{totalValue}</p>
          </TotalInfosContainer>
        </RegisterContainer>

        <TableContainer>
          <h1>Últimas transações cadastradas</h1>
          {!hasStatement ? (
            <>
              <br />
              <p>Você ainda não possui nenhuma transação cadastrada.</p>
            </>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Ticker</th>
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
                    <td className="ticker">{item.asset.ticker}</td>
                    <td className="ticker">{item.date}</td>
                    <td className={item.type === 'buy' ? 'profit' : 'loss'}>
                      {item.type}
                    </td>
                    <td className={item.type === 'buy' ? 'profit' : 'loss'}>
                      {Intl.NumberFormat().format(item.quantity)}
                    </td>
                    <td className="ticker">{formatValue(item.value)}</td>
                    <td className="loss">{formatValue(item.cost)}</td>
                    <td className={item.type === 'buy' ? 'profit' : 'loss'}>
                      {item.type === 'buy'
                        ? formatValue(item.total_value)
                        : `-${formatValue(item.total_value)}`}
                    </td>
                    <td>
                      {!item.closed_id ? (
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                        >
                          Excluir
                        </button>
                      ) : (
                        <Link to={`/statement/closed/${item.closed_id}`}>
                          Detalhes
                        </Link>
                      )}
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

export default Transactions;
