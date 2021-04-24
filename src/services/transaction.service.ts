import {bind, BindingScope} from '@loopback/core';
import {repository} from '@loopback/repository';
import {AccountState, TransactionType} from '../enum/enum';
import {Account, Transaction} from '../models';
import {TransactionReceipt} from '../models/responses/transaction-receipt.model';
import {AccountRepository} from '../repositories/account.repository';
import {TransactionRepository} from '../repositories/transaction.repository';

@bind({scope: BindingScope.TRANSIENT})
export class TransactionService {
  constructor(
    @repository(AccountRepository)
    private accountRepository: AccountRepository,
    @repository(TransactionRepository)
    private transactionRepository: TransactionRepository,
  ) { }

  async create(
    account: Account,
    transaction: Transaction,
  ): Promise<TransactionReceipt> {
    if (transaction.type === TransactionType.debit)
      await this.accountRepository.verifyDebit(account.id, transaction.amount);

    await this.accountRepository.verifyNotLocked(account.id);
    await this.accountRepository.updateAccount(account.id, AccountState.locked);
    const newTransaction = await this.transactionRepository.createTransaction(
      transaction,
    );

    account.balance = await this.updateTotalBalance(account, newTransaction);

    return {
      accountId: account.id,
      transactionId: newTransaction.uuid!,
      transactionTime: newTransaction.transactionTime!,
      transactionType: newTransaction.type,
      totalBalance: account.balance,
      amount: newTransaction.amount,
    };
  }

  async list(account: Account): Promise<Transaction[]> {
    await this.accountRepository.verifyNotLocked(account.id);
    return this.transactionRepository.listTransactions(account.id);
  }

  async findById(
    account: Account,
    transactionId: string,
  ): Promise<Transaction> {
    return this.transactionRepository.findTransactionByUuid(
      account.id,
      transactionId,
    );
  }

  async updateTotalBalance(
    account: Account,
    transaction: Transaction,
  ): Promise<number> {
    if (transaction.type === TransactionType.debit)
      account.balance = account.balance - transaction.amount;
    else account.balance = account.balance + transaction.amount;

    await this.accountRepository.updateAccount(
      account.id,
      AccountState.unlocked,
      account.balance,
    );

    return account.balance;
  }
}
