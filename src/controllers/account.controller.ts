import {service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param, post, requestBody} from '@loopback/rest';
import {omit} from 'lodash/fp';
import {Account} from '../models';
import {AccountRepository} from '../repositories';
import {AccountService} from '../services/account.service';

export class AccountController {
  constructor(
    @repository(AccountRepository)
    public accountRepository: AccountRepository,
    @service(AccountService)
    private accountServcie: AccountService,
  ) {}

  @post('/login', {
    responses: {
      '200': {
        description: 'Account model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Account, {
              exclude: ['locked'],
            }),
          },
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Account, {
            title: 'NewAccount',
            exclude: ['id', 'createdAt', 'updatedAt', 'locked'],
          }),
        },
      },
    })
    account: Omit<Account, 'id'>,
  ): Promise<Account> {
    return <Account>(
      omit(['locked'], await this.accountServcie.signup(<Account>account))
    );
  }

  @get('/accounts/{id}/balance', {
    responses: {
      '200': {
        description: 'Account model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Account, {
              exclude: ['email', 'createdAt', 'updatedAt', 'locked'],
            }),
          },
        },
      },
    },
  })
  async balance(@param.path.number('id') accountId: number): Promise<Account> {
    const account = await this.accountServcie.verifyAccount(accountId);
    return <Account>{
      id: account.id,
      balance: account.balance,
    };
  }
}
