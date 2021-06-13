import { LogEntry } from 'winston';

export interface File {
  name: string;
  extension: string;
}

export interface Log extends LogEntry {
  id?: string;
}

interface ExtendedError extends Error {
  id?: string;
}

export interface Configuration {
  [key: string]: number;
}
