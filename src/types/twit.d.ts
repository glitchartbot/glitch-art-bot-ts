import { IncomingMessage } from 'http';

export interface Response<T> {
  data: T;
  err?: Error;
  resp: IncomingMessage;
}
