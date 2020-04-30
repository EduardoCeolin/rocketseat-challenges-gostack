import React, { useState, useEffect } from 'react';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';
import formatDate from '../../utils/formatDate';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

interface ResponseAPI {
  transactions: Transaction[];
  balance: Balance;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const response: ResponseAPI = (await api.get('transactions')).data;

      const balanceFormatted: Balance = {
        income: formatValue(parseFloat(response.balance.income)).toString(),
        outcome: formatValue(parseFloat(response.balance.outcome)).toString(),
        total: formatValue(parseFloat(response.balance.total)).toString(),
      };

      const transactionsFormatted: Transaction[] = response.transactions.map(
        (transaction: Transaction) => ({
          id: transaction.id,
          title: transaction.title,
          value: transaction.value,
          formattedValue: formatValue(transaction.value),
          formattedDate: formatDate(transaction.created_at),
          type: transaction.type,
          category: { title: transaction.category.title },
          // eslint-disable-next-line @typescript-eslint/camelcase
          created_at: transaction.created_at,
        }),
      );

      setBalance(balanceFormatted);
      setTransactions(transactionsFormatted);
    }
    loadTransactions();
  }, transactions);

  async function handleDeleteTransaction(transactionID: string): Promise<void> {
    await api.delete(`transactions/${transactionID}`);
    setTransactions(
      transactions.filter((transaction) => {
        return transaction.id !== transactionID;
      }),
    );
  }

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{balance.income}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">{balance.outcome}</h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{balance.total}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="title">{transaction.title}</td>
                  <td
                    className={
                      transaction.type === 'income' ? 'income' : 'outcome'
                    }
                  >
                    {transaction.type === 'income'
                      ? transaction.formattedValue
                      : `- ${transaction.formattedValue}`}
                  </td>
                  <td>{transaction.category.title}</td>
                  <td>{transaction.formattedDate}</td>
                  {/* <button
                    type="button"
                    onClick={() => handleDeleteTransaction(transaction.id)}
                  >
                    X
                  </button> */}
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
