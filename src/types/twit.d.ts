import { IncomingMessage } from 'http';
import { TLSSocket } from 'tls';

export interface Get<T> {
  data: T;
  err?: Error;
  resp: IncomingMessage;
}
