import { IncomingMessage } from "http";
import { TLSSocket } from "tls";

export interface TwitGet<T> {
  data: T,
  err?: Error,
  resp: IncomingMessage
}