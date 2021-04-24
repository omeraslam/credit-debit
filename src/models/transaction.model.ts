import {belongsTo, Entity, model, property} from '@loopback/repository';
import {TransactionType} from '../enum/enum';
import {Account} from './account.model';

@model()
export class Transaction extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: Object.values(TransactionType),
    },
  })
  type: string;

  @property({
    type: 'number',
    required: true,
  })
  amount: number;

  @property({
    type: 'date',
    default: () => new Date().toISOString(),
  })
  transactionTime?: string;

  @property({
    type: 'string',
  })
  uuid?: string;

  @belongsTo(() => Account)
  accountId: number;

  constructor(data?: Partial<Transaction>) {
    super(data);
  }
}

export interface TransactionRelations {
  // describe navigational properties here
}

export type TransactionWithRelations = Transaction & TransactionRelations;
