import { LogEntry } from 'winston'

export interface IFile {
  name: string,
  format: string
}

export interface ILog extends LogEntry {
  id?: string
}