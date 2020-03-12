import { LogEntry } from 'winston'

export enum StepEnum {
  GET_TWEET,
  DOWNLOAD_IMAGE,
  REPLY_TWEET
}

export interface IFile {
  name: string,
  format: string
}

export interface ILog extends LogEntry {
  id?: string
}

export interface ExtendedError extends Error {
  step: StepEnum
}