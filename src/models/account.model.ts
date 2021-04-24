import {Entity, model, property} from '@loopback/repository';
import {AccountState} from '../enum/enum';

@model()
export class Account extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'number',
    default: 0,
    required: false,
  })
  balance: number;

  /** Will be locked untill a commit operation is going on. */
  @property({
    type: 'number',
    default: AccountState.unlocked,
  })
  locked?: number;

  @property({
    type: 'date',
    default: () => new Date().toISOString(),
  })
  createdAt?: string;

  @property({
    type: 'date',
    default: () => new Date().toISOString(),
  })
  updatedAt?: string;

  constructor(data?: Partial<Account>) {
    super(data);
  }
}

export interface AccountRelations {
  // describe navigational properties here
}

export type AccountWithRelations = Account & AccountRelations;
