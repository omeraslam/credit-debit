import {bind, /* inject, */ BindingScope} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {Account} from '../models/account.model';
import {AccountRepository} from '../repositories/account.repository';

@bind({scope: BindingScope.TRANSIENT})
export class AccountService {
  constructor(
    @repository(AccountRepository)
    private accountRepository: AccountRepository,
  ) {}

  /** this eventually would be coming from the auth token; i.e. like JWTToken,
   * and accountId would not be the only infoemation coming to validate the account,
   *  but it will also be including email as well. */
  async verifyAccount(accountId: number): Promise<Account> {
    return this.accountRepository.verifyAccount(accountId);
  }

  async signup(account: Account) {
    const existingAccount = await this.accountRepository.findAccountById(
      account.id,
    );
    if (existingAccount) return existingAccount;
    return this.accountRepository.create(account);
  }

  async login(account: Account) {
    const existingAccount = await this.accountRepository.findAccountByEmail(
      account.email,
    );
    if (!existingAccount) throw new HttpErrors.NotFound();
    return existingAccount;
  }
}
