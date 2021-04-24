import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {MemoryDataSource} from '../datasources';
import {AccountState} from '../enum/enum';
import {Account, AccountRelations} from '../models';

export class AccountRepository extends DefaultCrudRepository<
  Account,
  typeof Account.prototype.id,
  AccountRelations
> {
  constructor(@inject('datasources.memory') dataSource: MemoryDataSource) {
    super(Account, dataSource);
  }

  /** checking if current account is a valid account,
   * will also be including the email in the conditions eventually,
   *  when there would be a proper auth system included,  */
  async verifyAccount(accountId: number): Promise<Account> {
    const account = await this.findOne({
      where: {
        id: accountId,
      },
    });
    if (!account) throw new HttpErrors.Forbidden();
    return account;
  }

  async findAccountById(accountId?: number): Promise<Account | null> {
    return this.findOne({
      where: {
        id: accountId,
      },
    });
  }

  async findAccountByEmail(
    email?: string,
    password?: string,
  ): Promise<Account | null> {
    return this.findOne({
      where: {
        email: email,
      },
    });
  }

  /** lock or unlock the transaction get operations */
  async updateAccount(accountId: number, lock: number, balance?: number) {
    await this.updateById(accountId, {
      id: accountId,
      locked: lock,
      balance: balance,
      updatedAt: new Date().toISOString(),
    });
  }

  /** lock or unlock the transaction get operations */
  async updateBalance(accountId: number, balance: number) {
    await this.updateById(accountId, {
      id: accountId,
      balance: balance,
    });
  }

  /** if some commit operation is going on */
  async verifyNotLocked(accountId: number): Promise<void> {
    const account = await this.findOne({
      where: {
        id: accountId,
        locked: AccountState.unlocked,
      },
    });

    if (!account)
      throw new HttpErrors.UnprocessableEntity(
        'Some commit operation is going on. Please try again',
      );
  }

  /** if some commit operation is going on */
  async verifyDebit(accountId: number, amount: number) {
    const account = await this.findOne({
      where: {
        id: accountId,
      },
    });

    if (!account) throw new HttpErrors.Forbidden();
    this.sufficentBalance(account.balance!, amount);
  }

  private sufficentBalance(accountBalance: number, debitAmount: number) {
    if (accountBalance - debitAmount < 0)
      throw new HttpErrors.PaymentRequired('Balance is not sufficent');
  }
}
