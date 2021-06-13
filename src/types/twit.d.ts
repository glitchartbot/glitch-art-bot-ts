import { IncomingMessage } from 'http';
import { TLSSocket } from 'tls';

export interface Response<T> {
  data: T;
  err?: Error;
  resp: IncomingMessage;
}
