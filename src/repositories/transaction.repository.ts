import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import * as uuid from 'uuid';
import {MemoryDataSource} from '../datasources';
import {Account, Transaction, TransactionRelations} from '../models';
import {AccountRepository} from './account.repository';

export class TransactionRepository extends DefaultCrudRepository<
  Transaction,
  typeof Transaction.prototype.id,
  TransactionRelations
> {
  public readonly account: BelongsToAccessor<
    Account,
    typeof Transaction.prototype.id
  >;

  constructor(
    @inject('datasources.memory') dataSource: MemoryDataSource,
    @repository.getter('AccountRepository')
    protected accountRepositoryGetter: Getter<AccountRepository>,
  ) {
    super(Transaction, dataSource);
    this.account = this.createBelongsToAccessorFor(
      'account',
      accountRepositoryGetter,
    );
    this.registerInclusionResolver('account', this.account.inclusionResolver);
  }

  async findTransactionByUuid(
    accountId: number,
    transactionId: string,
  ): Promise<Transaction> {
    const transaction = await this.findOne({
      where: {
        uuid: transactionId,
        accountId: accountId,
      },
    });

    if (!transaction) throw new HttpErrors.NotFound();
    return transaction;
  }

  async listTransactions(accountId: number): Promise<Transaction[]> {
    const transactions = await this.find({
      where: {
        accountId: accountId,
      },
      order: ['transactionTime DESC'],
    });

    return transactions;
  }

  async createTransaction(transaction: Transaction): Promise<Transaction> {
    transaction.transactionTime = new Date().toISOString();
    transaction.uuid = uuid.v1();
    return this.create(transaction);
  }
}
