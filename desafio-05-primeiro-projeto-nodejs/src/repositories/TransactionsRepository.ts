import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const incomeBalance = this.transactions.reduce(
      (acumulator, transaction) => {
        if (transaction.type === 'income') {
          return acumulator + transaction.value;
        }
        return acumulator;
      },
      0,
    );

    const outcomeBalance = this.transactions.reduce(
      (acumulator, transaction) => {
        if (transaction.type === 'outcome') {
          return acumulator + transaction.value;
        }
        return acumulator;
      },
      0,
    );

    const totalBalance = incomeBalance - outcomeBalance;

    const balance = {
      income: incomeBalance,
      outcome: outcomeBalance,
      total: totalBalance,
    };

    return balance;
  }

  public create({ title, value, type }: Omit<Transaction, 'id'>): Transaction {
    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
