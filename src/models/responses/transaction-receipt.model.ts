import {model, property} from '@loopback/repository';

@model()
export class TransactionReceipt {
  @property({
    type: 'number',
  })
  accountId: number;

  @property({
    type: 'string',
  })
  transactionId: string;

  @property({
    type: 'date',
  })
  transactionTime: string;

  @property({
    type: 'string',
  })
  transactionType: string;

  @property({
    type: 'number',
  })
  amount: number;

  @property({
    type: 'number',
  })
  totalBalance: number;
}
