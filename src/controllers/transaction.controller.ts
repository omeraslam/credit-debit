import {service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param, post, requestBody} from '@loopback/rest';
import {Transaction} from '../models';
import {TransactionReceipt} from '../models/responses/transaction-receipt.model';
import {TransactionRepository} from '../repositories';
import {AccountRepository} from '../repositories/account.repository';
import {AccountService} from '../services/account.service';
import {TransactionService} from '../services/transaction.service';

export class TransactionController {
  constructor(
    @repository(TransactionRepository)
    public transactionRepository: TransactionRepository,
    @repository(AccountRepository)
    public accountRepository: AccountRepository,
    @service(AccountService)
    private accountService: AccountService,
    @service(TransactionService)
    private transactionService: TransactionService,
  ) {}

  @post('/transactions', {
    responses: {
      '200': {
        description: 'Transaction model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(TransactionReceipt)},
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Transaction, {
            exclude: ['id', 'transactionTime', 'uuid'],
          }),
        },
      },
    })
    transaction: Omit<Transaction, 'id'>,
  ): Promise<TransactionReceipt> {
    /** transaction request object would not be having accountId ideally.
     *  it would be coming from the jwt token,
     * included it in transactin because of the limited scope of this test job */
    const account = await this.accountService.verifyAccount(
      transaction.accountId,
    );

    // /** below 2 staements are only to test the locked mechanism,
    // whereas locking logic iss in the service method */

    // await this.accountRepository.updateAccount(account.id, AccountState.locked);
    // setImmediate(() => {}, 150000);

    return this.transactionService.create(account, transaction);
  }

  @get('/transactions', {
    responses: {
      '200': {
        description: 'Array of Transaction model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Transaction),
            },
          },
        },
      },
    },
  })
  async find(
    /** this accountId would be coming from the jwt token, included it as
     * param is because of the limited scope of this test job */
    @param.query.number('accountId') accountId: number,
  ): Promise<Transaction[]> {
    const account = await this.accountService.verifyAccount(accountId);
    return this.transactionService.list(account);
  }

  @get('/transactions/{uuid}', {
    responses: {
      '200': {
        description: 'Transaction model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Transaction),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('uuid') transactioId: string,
    /** this accountId would be coming from the jwt token, included it as
     * param is because of the limited scope of this test job */
    @param.query.number('accountId') accountId: number,
  ): Promise<Transaction> {
    const account = await this.accountService.verifyAccount(accountId);
    return this.transactionService.findById(account, transactioId);
  }
}
