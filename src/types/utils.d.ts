import { LogEntry } from 'winston'

export interface IFile {
  name: string,
  format: string
}

export interface ILog extends LogEntry {
  id?: string
}

interface ExtendedError extends Error {
  id?: string
}

export interface CustomObject {
  [key: string]: number | string
}

export interface Configuration {
  [key: string]: number
}